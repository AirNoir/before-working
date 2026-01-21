# Apple 内购（IAP）实现指南

## 📋 概述

本指南说明如何在 App Store Connect 中配置内购，并在应用中实现 Apple 内购功能，让 Apple Store 识别免费版和付费版。

## 🎯 实现步骤

### 第一步：在 App Store Connect 中配置

#### 1. 设置 App 为免费下载

1. 登录 [App Store Connect](https://appstoreconnect.apple.com)
2. 进入你的 App → **「App 信息」** → **「定价与可用性」**
3. 选择 **「免费」**（Free）
4. 这样 App 本身可以免费下载

#### 2. 创建内购产品（In-App Purchase）

1. 进入 **「功能」** → **「应用内购买项目」**
2. 点击 **「+」** 创建新的内购项目

**产品类型选择：**
- **非消耗性产品（Non-Consumable）**：一次性购买，永久解锁（推荐用于「升级到付费版」）
- **自动续订订阅（Auto-Renewable Subscription）**：每月/每年自动续订（推荐用于「月度/年度订阅」）

**产品信息填写：**
- **产品 ID**：例如 `com.yourapp.premium` 或 `com.yourapp.premium_monthly`
- **参考名称**：例如「付费版升级」或「月度订阅」
- **价格**：设置价格（例如 NT$ 60 或 NT$ 50/月）
- **本地化信息**：
  - 显示名称：例如「付费版升级」
  - 描述：例如「解锁无限清单、云端同步等功能」

#### 3. 提交审核

- 填写完整的元数据
- 上传截图（如果需要）
- 提交审核

### 第二步：在代码中实现 IAP

#### 安装依赖

```bash
# 使用 expo-in-app-purchases（推荐，与 Expo 集成更好）
npx expo install expo-in-app-purchases

# 或者使用 react-native-iap（功能更全面）
npm install react-native-iap
```

#### 实现代码

创建 `src/utils/purchase.ts` 文件：

```typescript
/**
 * 内购管理工具
 * 处理 Apple In-App Purchase
 */

import * as InAppPurchases from 'expo-in-app-purchases';
import {Platform, Alert} from 'react-native';
import {UserPermission} from '@/types';
import {useAppStore} from '@/store/useAppStore';

// 产品 ID（需要在 App Store Connect 中配置）
export const PRODUCT_IDS = {
  PREMIUM_LIFETIME: 'com.checkreadydiandianming.premium', // 一次性购买
  PREMIUM_MONTHLY: 'com.checkreadydiandianming.premium_monthly', // 月度订阅
  PREMIUM_YEARLY: 'com.checkreadydiandianming.premium_yearly', // 年度订阅
} as const;

/**
 * 初始化内购服务
 */
export const initializePurchases = async (): Promise<boolean> => {
  try {
    // 检查是否支持内购
    const isAvailable = await InAppPurchases.isAvailableAsync();
    if (!isAvailable) {
      console.warn('In-App Purchases not available on this device');
      return false;
    }

    // 连接到 App Store
    await InAppPurchases.connectAsync();
    return true;
  } catch (error) {
    console.error('Failed to initialize purchases:', error);
    return false;
  }
};

/**
 * 获取可用产品信息
 */
export const getAvailableProducts = async () => {
  try {
    const products = await InAppPurchases.getProductsAsync([
      PRODUCT_IDS.PREMIUM_LIFETIME,
      PRODUCT_IDS.PREMIUM_MONTHLY,
      PRODUCT_IDS.PREMIUM_YEARLY,
    ]);

    return products.results;
  } catch (error) {
    console.error('Failed to get products:', error);
    return [];
  }
};

/**
 * 购买产品
 */
export const purchaseProduct = async (
  productId: string,
  onSuccess?: () => void,
  onError?: (error: string) => void,
): Promise<boolean> => {
  try {
    // 发起购买
    await InAppPurchases.purchaseItemAsync(productId);

    // 监听购买结果
    InAppPurchases.setPurchaseListener(({response, errorCode}) => {
      if (errorCode) {
        if (errorCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
          onError?.('用户取消了购买');
        } else {
          onError?.(`购买失败: ${errorCode}`);
        }
        return;
      }

      if (response) {
        // 验证购买收据
        verifyPurchase(response, onSuccess, onError);
      }
    });

    return true;
  } catch (error: any) {
    console.error('Purchase failed:', error);
    onError?.(error.message || '购买失败');
    return false;
  }
};

/**
 * 验证购买收据
 */
const verifyPurchase = async (
  purchase: InAppPurchases.InAppPurchase,
  onSuccess?: () => void,
  onError?: (error: string) => void,
) => {
  try {
    // 验证收据（这里可以发送到你的服务器进行验证）
    // 对于简单应用，可以直接信任本地收据
    const isValid = await validateReceiptLocally(purchase);

    if (isValid) {
      // 更新用户权限为付费版
      const store = useAppStore.getState();
      store.updateUserPermission(UserPermission.PREMIUM);

      // 完成交易
      await InAppPurchases.finishTransactionAsync(purchase, true);
      onSuccess?.();
    } else {
      onError?.('购买验证失败');
    }
  } catch (error: any) {
    console.error('Receipt verification failed:', error);
    onError?.(error.message || '验证失败');
  }
};

/**
 * 本地验证收据（简单版本）
 * 生产环境建议发送到服务器验证
 */
const validateReceiptLocally = async (
  purchase: InAppPurchases.InAppPurchase,
): Promise<boolean> => {
  // 简单验证：检查产品 ID 是否匹配
  const validProductIds = Object.values(PRODUCT_IDS);
  return validProductIds.includes(purchase.productId as any);
};

/**
 * 恢复购买（用于用户在新设备上恢复已购买的内容）
 */
export const restorePurchases = async (
  onSuccess?: () => void,
  onError?: (error: string) => void,
): Promise<boolean> => {
  try {
    const history = await InAppPurchases.getPurchaseHistoryAsync();

    if (history.results && history.results.length > 0) {
      // 检查是否有有效的付费版购买
      const hasPremium = history.results.some(
        purchase => Object.values(PRODUCT_IDS).includes(purchase.productId as any),
      );

      if (hasPremium) {
        const store = useAppStore.getState();
        store.updateUserPermission(UserPermission.PREMIUM);
        onSuccess?.();
        return true;
      }
    }

    onError?.('未找到已购买的内容');
    return false;
  } catch (error: any) {
    console.error('Restore purchases failed:', error);
    onError?.(error.message || '恢复购买失败');
    return false;
  }
};

/**
 * 断开内购服务连接
 */
export const disconnectPurchases = async () => {
  try {
    await InAppPurchases.disconnectAsync();
  } catch (error) {
    console.error('Failed to disconnect purchases:', error);
  }
};
```

#### 更新 permission.ts

```typescript
// 在 src/utils/permission.ts 中更新 upgradeToPremium 函数

import {purchaseProduct, PRODUCT_IDS} from './purchase';

export const upgradeToPremium = async (
  productType: 'lifetime' | 'monthly' | 'yearly' = 'lifetime',
): Promise<boolean> => {
  try {
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
  } catch (error: any) {
    console.error('Upgrade failed:', error);
    return false;
  }
};
```

#### 在 App.tsx 中初始化

```typescript
// 在 App.tsx 中添加初始化代码

import {initializePurchases, disconnectPurchases} from '@/utils/purchase';
import {useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // 初始化内购服务
    initializePurchases();

    // 清理函数
    return () => {
      disconnectPurchases();
    };
  }, []);

  // ... 其他代码
}
```

#### 在设置页面添加购买按钮

```typescript
// 在 SettingsScreen.tsx 中添加购买功能

import {upgradeToPremium, restorePurchases} from '@/utils/purchase';
import {getAvailableProducts} from '@/utils/purchase';

const handleUpgrade = async () => {
  try {
    Alert.alert(
      '选择购买方式',
      '请选择您想要的付费版类型',
      [
        {text: '取消', style: 'cancel'},
        {
          text: '一次性购买 (NT$ 60)',
          onPress: async () => {
            try {
              await upgradeToPremium('lifetime');
              Alert.alert('购买成功', '您已成功升级到付费版！');
            } catch (error: any) {
              Alert.alert('购买失败', error.message);
            }
          },
        },
        {
          text: '月度订阅 (NT$ 50/月)',
          onPress: async () => {
            try {
              await upgradeToPremium('monthly');
              Alert.alert('订阅成功', '您已成功订阅付费版！');
            } catch (error: any) {
              Alert.alert('订阅失败', error.message);
            }
          },
        },
      ],
    );
  } catch (error: any) {
    Alert.alert('错误', error.message);
  }
};

const handleRestore = async () => {
  try {
    await restorePurchases(
      () => {
        Alert.alert('恢复成功', '已恢复您的购买内容！');
      },
      (error) => {
        Alert.alert('恢复失败', error);
      },
    );
  } catch (error: any) {
    Alert.alert('错误', error.message);
  }
};
```

## 📝 重要注意事项

### 1. 产品 ID 必须匹配
- App Store Connect 中配置的产品 ID 必须与代码中的 `PRODUCT_IDS` 完全一致
- 产品 ID 格式：`com.yourcompany.appname.productname`

### 2. 收据验证
- **开发阶段**：可以使用本地验证
- **生产环境**：强烈建议将收据发送到你的服务器进行验证
- Apple 提供收据验证 API：`https://buy.itunes.apple.com/verifyReceipt`（生产）或 `https://sandbox.itunes.apple.com/verifyReceipt`（沙盒）

### 3. 测试
- 使用 **沙盒测试账户** 进行测试
- 在 App Store Connect 中创建测试用户
- 在设备设置中登录沙盒账户

### 4. 订阅管理
- 订阅会自动续订
- 用户可以在 App Store 设置中管理订阅
- 需要监听订阅状态变化

### 5. App Store 审核要求
- 必须在 App 描述中清楚说明免费版和付费版的区别
- 必须在 UI 中明确标示哪些功能需要付费
- 不能强制用户购买才能使用核心功能
- 必须提供「恢复购买」功能

## 🔍 检查清单

- [ ] 在 App Store Connect 中创建内购产品
- [ ] 设置产品 ID、价格、描述
- [ ] 安装 `expo-in-app-purchases` 或 `react-native-iap`
- [ ] 实现购买流程
- [ ] 实现收据验证
- [ ] 实现恢复购买功能
- [ ] 在设置页面添加购买按钮
- [ ] 测试沙盒购买流程
- [ ] 更新 App 描述说明免费/付费功能
- [ ] 提交审核

## 📚 参考资源

- [Apple In-App Purchase 文档](https://developer.apple.com/in-app-purchase/)
- [Expo In-App Purchases 文档](https://docs.expo.dev/versions/latest/sdk/in-app-purchases/)
- [App Store Connect 帮助](https://help.apple.com/app-store-connect/)
- [StoreKit 测试指南](https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases_with_sandbox)

