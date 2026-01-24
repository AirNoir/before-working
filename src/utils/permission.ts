/**
 * 權限管理工具
 * 處理免費版與付費版的權限控制（預留未來擴展）
 */

import {UserPermission} from '@/types';
import {PERMISSION_LIMITS} from '@constants/config';
import i18n from '@locales/index';

/**
 * 檢查用戶是否可以創建新清單
 */
export const canCreateChecklist = (
  currentCount: number,
  userPermission: UserPermission,
): boolean => {
  if (userPermission === UserPermission.PREMIUM) {
    return true; // 付費用戶無限制
  }

  // 免費用戶限制
  return currentCount < PERMISSION_LIMITS.FREE_CHECKLIST_COUNT;
};

/**
 * 獲取用戶可創建的清單數量限制
 */
export const getChecklistLimit = (userPermission: UserPermission): number => {
  if (userPermission === UserPermission.PREMIUM) {
    return PERMISSION_LIMITS.PREMIUM_CHECKLIST_COUNT; // -1 表示無限
  }
  return PERMISSION_LIMITS.FREE_CHECKLIST_COUNT;
};

/**
 * 檢查用戶是否可以創建新分類
 */
export const canCreateGroup = (
  currentCount: number,
  userPermission: UserPermission,
): boolean => {
  if (userPermission === UserPermission.PREMIUM) {
    return true; // 付費用戶無限制
  }

  // 免費用戶限制
  return currentCount < PERMISSION_LIMITS.FREE_GROUP_COUNT;
};

/**
 * 獲取用戶可創建的分類數量限制
 */
export const getGroupLimit = (userPermission: UserPermission): number => {
  if (userPermission === UserPermission.PREMIUM) {
    return PERMISSION_LIMITS.PREMIUM_GROUP_COUNT; // -1 表示無限
  }
  return PERMISSION_LIMITS.FREE_GROUP_COUNT;
};

/**
 * 檢查用戶是否為付費用戶
 */
export const isPremiumUser = (userPermission: UserPermission): boolean => {
  return userPermission === UserPermission.PREMIUM;
};

/**
 * 獲取權限描述文字
 */
export const getPermissionDescription = (userPermission: UserPermission): string => {
  const t = i18n.t;
  switch (userPermission) {
    case UserPermission.FREE:
      return t('settings.account.free');
    case UserPermission.PREMIUM:
      return t('settings.account.premium');
    default:
      return '未知權限';
  }
};

/**
 * 檢查是否可以使用雲端同步功能（預留）
 */
export const canUseCloudSync = (userPermission: UserPermission): boolean => {
  return userPermission === UserPermission.PREMIUM;
};

/**
 * 升級到付費版
 * @param productType 產品類型：'lifetime' | 'monthly' | 'yearly'
 * @returns 成功返回 true，失敗返回 false
 */
export const upgradeToPremium = async (
  productType: 'lifetime' | 'monthly' | 'yearly' = 'lifetime',
): Promise<boolean> => {
  const {purchaseProduct, PRODUCT_IDS} = await import('./purchase');
  
  const productId =
    productType === 'lifetime'
      ? PRODUCT_IDS.PREMIUM_LIFETIME
      : productType === 'monthly'
        ? PRODUCT_IDS.PREMIUM_MONTHLY
        : PRODUCT_IDS.PREMIUM_YEARLY;

  return new Promise((resolve, reject) => {
    purchaseProduct(
      productId,
      () => {
        resolve(true);
      },
      (error) => {
        reject(new Error(error));
      },
    );
  });
};

/**
 * 獲取升級提示訊息
 */
export const getUpgradeMessage = (): string => {
  return '升級到付費版以解鎖無限清單和雲端同步功能！\n約 NT$ 60 或 NT$ 50/月';
};

