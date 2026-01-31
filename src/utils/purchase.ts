/**
 * 內購管理工具 - RevenueCat 版本
 * 使用 RevenueCat SDK 處理跨平台內購
 */

import {Platform, Alert} from 'react-native';
import {UserPermission} from '@/types';
import {useAppStore} from '@/store/useAppStore';
import {
  FEATURE_FLAGS,
  REVENUECAT_API_KEY,
  REVENUECAT_ENTITLEMENT_ID,
} from '@constants/config';

// 產品 ID（需要在 App Store Connect 和 RevenueCat 中配置）
export const PRODUCT_IDS = {
  PREMIUM_LIFETIME: 'com.tyrese.diandianming.premium', // 一次性購買
} as const;

// 動態導入 react-native-purchases
let Purchases: typeof import('react-native-purchases').default | null = null;
let isRevenueCatAvailable = false;
let hasTriedLoad = false;
let isConfigured = false;

/**
 * 嘗試加載 RevenueCat 模塊
 */
const tryLoadRevenueCatModule = (): boolean => {
  if (hasTriedLoad) {
    return isRevenueCatAvailable;
  }

  hasTriedLoad = true;

  if (!FEATURE_FLAGS.ENABLE_IAP) {
    return false;
  }

  try {
    const purchasesModule = require('react-native-purchases');
    Purchases = purchasesModule.default;
    isRevenueCatAvailable = true;
    return true;
  } catch (error) {
    console.warn('react-native-purchases not installed or not available:', error);
    isRevenueCatAvailable = false;
    Purchases = null;
    return false;
  }
};

/**
 * 初始化 RevenueCat
 */
export const initializePurchases = async (): Promise<boolean> => {
  if (!FEATURE_FLAGS.ENABLE_IAP) {
    return false;
  }

  if (!tryLoadRevenueCatModule() || !Purchases) {
    console.warn('RevenueCat not available');
    return false;
  }

  if (isConfigured) {
    return true;
  }

  try {
    const apiKey =
      Platform.OS === 'ios'
        ? REVENUECAT_API_KEY.IOS
        : REVENUECAT_API_KEY.ANDROID;

    if (apiKey === 'YOUR_IOS_API_KEY' || apiKey === 'YOUR_ANDROID_API_KEY') {
      console.warn('RevenueCat API key not configured');
      return false;
    }

    await Purchases.configure({apiKey});
    isConfigured = true;

    // 檢查現有的訂閱狀態
    await checkSubscriptionStatus();

    return true;
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    return false;
  }
};

/**
 * 檢查訂閱狀態並更新用戶權限
 */
export const checkSubscriptionStatus = async (): Promise<boolean> => {
  if (!FEATURE_FLAGS.ENABLE_IAP || !Purchases) {
    return false;
  }

  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const isPremium =
      customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID] !== undefined;

    if (isPremium) {
      const store = useAppStore.getState();
      if (store.settings.userPermission !== UserPermission.PREMIUM) {
        store.updateUserPermission(UserPermission.PREMIUM);
      }
    }

    return isPremium;
  } catch (error) {
    console.error('Failed to check subscription status:', error);
    return false;
  }
};

/**
 * 獲取可用產品信息
 */
export const getAvailableProducts = async () => {
  if (!FEATURE_FLAGS.ENABLE_IAP || !tryLoadRevenueCatModule() || !Purchases) {
    return [];
  }

  try {
    const offerings = await Purchases.getOfferings();

    if (offerings.current && offerings.current.availablePackages.length > 0) {
      return offerings.current.availablePackages.map(pkg => ({
        productId: pkg.product.identifier,
        title: pkg.product.title,
        description: pkg.product.description,
        price: pkg.product.priceString,
        priceValue: pkg.product.price,
        currencyCode: pkg.product.currencyCode,
        package: pkg,
      }));
    }

    return [];
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
    Alert.alert('功能即將推出', '付費版功能正在準備中，敬請期待！');
    onError?.('IAP not enabled');
    return false;
  }

  if (!tryLoadRevenueCatModule() || !Purchases) {
    Alert.alert('功能不可用', '內購功能暫時不可用，請稍後再試。');
    onError?.('IAP not available');
    return false;
  }

  try {
    // 取得 offerings
    const offerings = await Purchases.getOfferings();

    if (!offerings.current) {
      Alert.alert('無法取得產品', '請稍後再試。');
      onError?.('No offerings available');
      return false;
    }

    // 找到對應的 package
    const targetPackage = offerings.current.availablePackages.find(
      pkg => pkg.product.identifier === productId,
    );

    if (!targetPackage) {
      Alert.alert('產品不存在', '找不到指定的產品。');
      onError?.('Product not found');
      return false;
    }

    // 執行購買
    const {customerInfo} = await Purchases.purchasePackage(targetPackage);

    // 檢查是否獲得 premium entitlement
    const isPremium =
      customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID] !== undefined;

    if (isPremium) {
      const store = useAppStore.getState();
      store.updateUserPermission(UserPermission.PREMIUM);
      onSuccess?.();
      return true;
    } else {
      onError?.('購買完成但未獲得權限');
      return false;
    }
  } catch (error: any) {
    console.error('Purchase failed:', error);

    // 處理用戶取消
    if (error.userCancelled) {
      onError?.('用戶取消了購買');
    } else {
      onError?.(error.message || '購買失敗');
    }
    return false;
  }
};

/**
 * 恢復購買
 */
export const restorePurchases = async (
  onSuccess?: () => void,
  onError?: (error: string) => void,
): Promise<boolean> => {
  if (!FEATURE_FLAGS.ENABLE_IAP) {
    Alert.alert('功能即將推出', '恢復購買功能正在準備中，敬請期待！');
    onError?.('IAP not enabled');
    return false;
  }

  if (!tryLoadRevenueCatModule() || !Purchases) {
    Alert.alert('功能不可用', '恢復購買功能暫時不可用，請稍後再試。');
    onError?.('IAP not available');
    return false;
  }

  try {
    const customerInfo = await Purchases.restorePurchases();

    const isPremium =
      customerInfo.entitlements.active[REVENUECAT_ENTITLEMENT_ID] !== undefined;

    if (isPremium) {
      const store = useAppStore.getState();
      store.updateUserPermission(UserPermission.PREMIUM);
      onSuccess?.();
      return true;
    } else {
      onError?.('未找到已購買的內容');
      return false;
    }
  } catch (error: any) {
    console.error('Restore purchases failed:', error);
    onError?.(error.message || '恢復購買失敗');
    return false;
  }
};

/**
 * 斷開內購服務連接（RevenueCat 不需要手動斷開）
 */
export const disconnectPurchases = async () => {
  // RevenueCat SDK 會自動處理連接，不需要手動斷開
};

/**
 * 處理升級點擊（統一入口）
 */
export const handleUpgradeClick = (
  onUpgrade?: () => void,
  onError?: (error: string) => void,
) => {
  if (!FEATURE_FLAGS.ENABLE_IAP) {
    Alert.alert('功能即將推出', '付費版功能正在準備中，敬請期待！');
    return;
  }

  if (onUpgrade) {
    onUpgrade();
  }
};

/**
 * 設置用戶 ID（用於關聯購買記錄）
 */
export const setUserId = async (userId: string): Promise<void> => {
  if (!FEATURE_FLAGS.ENABLE_IAP || !Purchases) {
    return;
  }

  try {
    await Purchases.logIn(userId);
  } catch (error) {
    console.error('Failed to set user ID:', error);
  }
};

/**
 * 登出用戶（清除購買關聯）
 */
export const logOutUser = async (): Promise<void> => {
  if (!FEATURE_FLAGS.ENABLE_IAP || !Purchases) {
    return;
  }

  try {
    await Purchases.logOut();
  } catch (error) {
    console.error('Failed to log out user:', error);
  }
};
