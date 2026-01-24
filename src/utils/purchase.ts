/**
 * 內購管理工具
 * 處理 Apple In-App Purchase
 * 注意：需要先安裝 expo-in-app-purchases: npx expo install expo-in-app-purchases
 */

import {Platform, Alert} from 'react-native';
import {UserPermission} from '@/types';
import {useAppStore} from '@/store/useAppStore';
import {FEATURE_FLAGS} from '@constants/config';

// 產品 ID（需要在 App Store Connect 中配置）
export const PRODUCT_IDS = {
  PREMIUM_LIFETIME: 'com.checkreadydiandianming.premium', // 一次性購買
  PREMIUM_MONTHLY: 'com.checkreadydiandianming.premium_monthly', // 月度訂閱
  PREMIUM_YEARLY: 'com.checkreadydiandianming.premium_yearly', // 年度訂閱
} as const;

// 動態導入 expo-in-app-purchases（如果未安裝則為 null）
let InAppPurchases: any = null;
let isIAPAvailable = false;
let hasTriedLoad = false;

/**
 * 嘗試加載 expo-in-app-purchases 模塊
 * 只在需要時才加載，避免模塊不存在時報錯
 */
const tryLoadIAPModule = (): boolean => {
  if (hasTriedLoad) {
    return isIAPAvailable;
  }

  hasTriedLoad = true;

  // 如果功能未啟用，直接返回 false
  if (!FEATURE_FLAGS.ENABLE_IAP) {
    return false;
  }

  // 只在 iOS 平台嘗試加載
  if (Platform.OS !== 'ios') {
    return false;
  }

  try {
    // 使用動態 require，只在真正需要時才加載
    InAppPurchases = require('expo-in-app-purchases');
    isIAPAvailable = true;
    return true;
  } catch (error) {
    console.warn('expo-in-app-purchases not installed or not available:', error);
    isIAPAvailable = false;
    InAppPurchases = null;
    return false;
  }
};

/**
 * 初始化內購服務
 */
export const initializePurchases = async (): Promise<boolean> => {
  if (!FEATURE_FLAGS.ENABLE_IAP) {
    return false;
  }

  // 嘗試加載模塊
  if (!tryLoadIAPModule() || !InAppPurchases) {
    console.warn('In-App Purchases not available');
    return false;
  }

  try {
    // 檢查是否支持內購
    const isAvailable = await InAppPurchases.isAvailableAsync();
    if (!isAvailable) {
      console.warn('In-App Purchases not available on this device');
      return false;
    }

    // 連接到 App Store
    await InAppPurchases.connectAsync();
    return true;
  } catch (error) {
    console.error('Failed to initialize purchases:', error);
    return false;
  }
};

/**
 * 獲取可用產品信息
 */
export const getAvailableProducts = async () => {
  if (!FEATURE_FLAGS.ENABLE_IAP || !tryLoadIAPModule() || !InAppPurchases) {
    return [];
  }

  try {
    const products = await InAppPurchases.getProductsAsync([
      PRODUCT_IDS.PREMIUM_LIFETIME,
      PRODUCT_IDS.PREMIUM_MONTHLY,
      PRODUCT_IDS.PREMIUM_YEARLY,
    ]);

    return products.results || [];
  } catch (error) {
    console.error('Failed to get products:', error);
    return [];
  }
};

/**
 * 購買產品
 */
export const purchaseProduct = async (
  productId: string,
  onSuccess?: () => void,
  onError?: (error: string) => void,
): Promise<boolean> => {
  if (!FEATURE_FLAGS.ENABLE_IAP) {
    // 審核階段：顯示「即將推出」
    Alert.alert(
      '功能即將推出',
      '付費版功能正在準備中，敬請期待！',
    );
    onError?.('IAP not enabled');
    return false;
  }

  if (!tryLoadIAPModule() || !InAppPurchases) {
    Alert.alert(
      '功能不可用',
      '內購功能暫時不可用，請稍後再試。',
    );
    onError?.('IAP not available');
    return false;
  }

  try {
    // 發起購買
    await InAppPurchases.purchaseItemAsync(productId);

    // 監聽購買結果
    InAppPurchases.setPurchaseListener(({response, errorCode}: any) => {
      if (errorCode) {
        if (errorCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
          onError?.('用戶取消了購買');
        } else {
          onError?.(`購買失敗: ${errorCode}`);
        }
        return;
      }

      if (response) {
        // 驗證購買收據
        verifyPurchase(response, onSuccess, onError);
      }
    });

    return true;
  } catch (error: any) {
    console.error('Purchase failed:', error);
    onError?.(error.message || '購買失敗');
    return false;
  }
};

/**
 * 驗證購買收據
 */
const verifyPurchase = async (
  purchase: any,
  onSuccess?: () => void,
  onError?: (error: string) => void,
) => {
  try {
    // 驗證收據（這裡可以發送到你的服務器進行驗證）
    // 對於簡單應用，可以直接信任本地收據
    const isValid = await validateReceiptLocally(purchase);

    if (isValid) {
      // 更新用戶權限為付費版
      const store = useAppStore.getState();
      store.updateUserPermission(UserPermission.PREMIUM);

      // 完成交易
      if (InAppPurchases) {
        await InAppPurchases.finishTransactionAsync(purchase, true);
      }
      onSuccess?.();
    } else {
      onError?.('購買驗證失敗');
    }
  } catch (error: any) {
    console.error('Receipt verification failed:', error);
    onError?.(error.message || '驗證失敗');
  }
};

/**
 * 本地驗證收據（簡單版本）
 * 生產環境建議發送到服務器驗證
 */
const validateReceiptLocally = async (purchase: any): Promise<boolean> => {
  // 簡單驗證：檢查產品 ID 是否匹配
  const validProductIds = Object.values(PRODUCT_IDS);
  return validProductIds.includes(purchase.productId);
};

/**
 * 恢復購買（用於用戶在新設備上恢復已購買的內容）
 */
export const restorePurchases = async (
  onSuccess?: () => void,
  onError?: (error: string) => void,
): Promise<boolean> => {
  if (!FEATURE_FLAGS.ENABLE_IAP) {
    Alert.alert(
      '功能即將推出',
      '恢復購買功能正在準備中，敬請期待！',
    );
    onError?.('IAP not enabled');
    return false;
  }

  if (!tryLoadIAPModule() || !InAppPurchases) {
    Alert.alert(
      '功能不可用',
      '恢復購買功能暫時不可用，請稍後再試。',
    );
    onError?.('IAP not available');
    return false;
  }

  try {
    const history = await InAppPurchases.getPurchaseHistoryAsync();

    if (history.results && history.results.length > 0) {
      // 檢查是否有有效的付費版購買
      const validProductIds = Object.values(PRODUCT_IDS);
      const hasPremium = history.results.some((purchase: any) =>
        validProductIds.includes(purchase.productId),
      );

      if (hasPremium) {
        const store = useAppStore.getState();
        store.updateUserPermission(UserPermission.PREMIUM);
        onSuccess?.();
        return true;
      }
    }

    onError?.('未找到已購買的內容');
    return false;
  } catch (error: any) {
    console.error('Restore purchases failed:', error);
    onError?.(error.message || '恢復購買失敗');
    return false;
  }
};

/**
 * 斷開內購服務連接
 */
export const disconnectPurchases = async () => {
  if (!tryLoadIAPModule() || !InAppPurchases) {
    return;
  }

  try {
    await InAppPurchases.disconnectAsync();
  } catch (error) {
    console.error('Failed to disconnect purchases:', error);
  }
};

/**
 * 處理升級點擊（統一入口）
 */
export const handleUpgradeClick = (
  onUpgrade?: () => void,
  onError?: (error: string) => void,
) => {
  if (!FEATURE_FLAGS.ENABLE_IAP) {
    // 審核階段：顯示「即將推出」
    Alert.alert(
      '功能即將推出',
      '付費版功能正在準備中，敬請期待！',
    );
    return;
  }

  // 如果 IAP 已啟用，顯示購買選項
  if (onUpgrade) {
    onUpgrade();
  }
};

