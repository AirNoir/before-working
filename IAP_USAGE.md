# 内购功能使用说明

## ✅ 已实现的功能

### 1. 功能开关配置

在 `src/constants/config.ts` 中：

```typescript
export const FEATURE_FLAGS = {
  // 是否啟用內購功能（審核時設為 false，審核通過後改為 true）
  ENABLE_IAP: false,
  
  // 是否顯示付費功能入口（審核時設為 true，讓審核員看到）
  SHOW_PREMIUM_FEATURES: true,
} as const;
```

### 2. 产品 ID 配置

在 `src/utils/purchase.ts` 中：

```typescript
export const PRODUCT_IDS = {
  PREMIUM_LIFETIME: 'com.checkreadydiandianming.premium',
  PREMIUM_MONTHLY: 'com.checkreadydiandianming.premium_monthly',
  PREMIUM_YEARLY: 'com.checkreadydiandianming.premium_yearly',
} as const;
```

**重要**：这些产品 ID 必须与 App Store Connect 中配置的完全一致。

## 📋 使用步骤

### 第一步：安装依赖（审核通过后）

当 `FEATURE_FLAGS.ENABLE_IAP` 设为 `true` 时，需要安装内购库：

```bash
npx expo install expo-in-app-purchases
```

### 第二步：在 App Store Connect 中配置

1. 登录 [App Store Connect](https://appstoreconnect.apple.com)
2. 进入你的 App → **「功能」** → **「应用内购买项目」**
3. 创建三个产品：
   - **产品 ID**: `com.checkreadydiandianming.premium`（非消耗性产品）
   - **产品 ID**: `com.checkreadydiandianming.premium_monthly`（自动续订订阅）
   - **产品 ID**: `com.checkreadydiandianming.premium_yearly`（自动续订订阅）

### 第三步：提交审核

**当前状态（审核阶段）：**
- `ENABLE_IAP: false` - 内购功能未启用
- `SHOW_PREMIUM_FEATURES: true` - 显示付费功能入口
- 点击「升级到付费版」会显示「功能即将推出」

**审核通过后：**
1. 将 `ENABLE_IAP` 改为 `true`
2. 安装 `expo-in-app-purchases`
3. 提交内购产品审核
4. 提交 App 小版本更新

## 🎯 功能说明

### 购买流程

1. 用户在设置页面点击「升级到付费版」
2. 显示购买选项对话框：
   - 一次性购买 (NT$ 60)
   - 月度订阅 (NT$ 50/月)
3. 用户选择后触发购买流程
4. 购买成功后自动更新用户权限为付费版

### 恢复购买

1. 用户在设置页面点击「恢复购买」
2. 系统检查购买历史
3. 如果找到有效的付费版购买，自动恢复权限

## ⚠️ 注意事项

### 1. 产品 ID 必须匹配

- App Store Connect 中的产品 ID 必须与代码中的 `PRODUCT_IDS` 完全一致
- 产品 ID 格式：`com.yourcompany.appname.productname`

### 2. 收据验证

当前实现使用本地验证（简单版本）。生产环境建议：
- 将收据发送到服务器验证
- 使用 Apple 的收据验证 API

### 3. 测试

- 使用沙盒测试账户进行测试
- 在 App Store Connect 中创建测试用户
- 在设备设置中登录沙盒账户

### 4. 审核要求

- 必须在 App 描述中清楚说明免费版和付费版的区别
- 必须在 UI 中明确标示哪些功能需要付费
- 必须提供「恢复购买」功能
- 不能强制用户购买才能使用核心功能

## 🔧 故障排除

### 问题：购买按钮点击无反应

**原因**：`ENABLE_IAP` 为 `false` 或未安装 `expo-in-app-purchases`

**解决**：
1. 检查 `FEATURE_FLAGS.ENABLE_IAP` 是否为 `true`
2. 确认已安装 `expo-in-app-purchases`
3. 确认设备支持内购（iOS 设备）

### 问题：购买失败

**可能原因**：
1. 产品 ID 不匹配
2. 产品未在 App Store Connect 中创建
3. 产品状态不是「准备提交」或「已批准」
4. 使用非沙盒账户测试

**解决**：
1. 检查产品 ID 是否匹配
2. 确认产品已在 App Store Connect 中创建
3. 使用沙盒测试账户测试

### 问题：恢复购买失败

**可能原因**：
1. 用户确实没有购买记录
2. 产品 ID 不匹配
3. 网络问题

**解决**：
1. 确认用户确实有购买记录
2. 检查产品 ID 配置
3. 检查网络连接

## 📝 代码结构

```
src/
├── constants/
│   └── config.ts          # 功能开关配置
├── utils/
│   ├── purchase.ts        # 内购工具函数
│   └── permission.ts      # 权限管理（已更新）
├── screens/
│   └── SettingsScreen.tsx # 设置页面（已添加购买功能）
└── locales/
    ├── zh-TW.ts           # 繁体中文翻译（已更新）
    ├── zh-CN.ts           # 简体中文翻译（已更新）
    └── en.ts              # 英文翻译（已更新）
```

## 🚀 下一步

1. **当前阶段（审核）**：
   - 保持 `ENABLE_IAP: false`
   - 提交 App 审核
   - 在 App Store Connect 中创建内购产品（但先不提交）

2. **审核通过后**：
   - 安装 `expo-in-app-purchases`
   - 将 `ENABLE_IAP` 改为 `true`
   - 测试购买流程
   - 提交内购产品审核
   - 提交 App 更新

3. **生产环境**：
   - 实现服务器端收据验证
   - 添加订阅状态监听
   - 添加订阅管理功能

