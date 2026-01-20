# Expo 遷移說明

## 遷移完成 ✅

項目已成功從 React Native CLI 遷移到 Expo 平台。

## 主要變更

### 1. 依賴更新
- ✅ 使用 Expo SDK ~51.0.0
- ✅ React Native 升級到 0.74.5
- ✅ 通知系統從 `react-native-push-notification` 遷移到 `expo-notifications`
- ✅ 移除了原生模組依賴（CocoaPods 不再需要）

### 2. 配置文件更新
- ✅ `package.json`: 更新為 Expo 腳本和依賴
- ✅ `app.json`: 轉換為 Expo 配置格式
- ✅ `babel.config.js`: 使用 `babel-preset-expo`
- ✅ `index.js`: 使用 Expo 的 `registerRootComponent`
- ✅ `tsconfig.json`: 更新以適配 Expo
- ✅ 刪除 `metro.config.js` (Expo 自動處理)

### 3. 通知系統重寫
- ✅ 使用 `expo-notifications` API
- ✅ 支持 iOS 和 Android 通知
- ✅ 每日定時通知功能
- ✅ 通知權限管理

## 如何使用

### 安裝依賴
```bash
npm install
```

### 啟動開發伺服器
```bash
npm start
# 或
npx expo start
```

### 運行在模擬器
```bash
# iOS
npm run ios

# Android
npm run android
```

### 使用 Expo Go (快速測試)
1. 在手機上安裝 Expo Go App
2. 運行 `npm start`
3. 掃描 QR Code

## 注意事項

1. **通知功能**: 在 Expo Go 中通知功能可能有限制，建議使用開發構建進行完整測試。

2. **資源文件**: 如果需要自訂圖示和啟動畫面，請在 `assets/` 目錄中添加：
   - `icon.png` (1024x1024)
   - `splash.png` (1284x2778)
   - `adaptive-icon.png` (Android, 1024x1024)

3. **開發構建**: 如果需要完整原生功能，可以使用 EAS Build 創建開發構建：
   ```bash
   npx eas build --profile development --platform ios
   npx eas build --profile development --platform android
   ```

## 下一步

- [ ] 添加應用圖示和啟動畫面
- [ ] 配置 EAS Build (如果需要原生構建)
- [ ] 測試通知功能在實際設備上的表現
- [ ] 準備應用商店發布




