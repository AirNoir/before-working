# Expo 手機運行指南

## 📱 運行方式

### 方式一：Expo Go（僅限純 JS 項目）

**適用場景：** 開發測試，且不使用原生模塊

**步驟：**
1. 手機安裝 Expo Go App
   - iOS: App Store 搜尋 "Expo Go"
   - Android: Google Play 搜尋 "Expo Go"

2. 確保手機和電腦在同一 Wi-Fi 網路

3. 啟動開發服務器：
   ```bash
   npm start
   # 或
   expo start
   ```

4. 掃描終端機顯示的 QR Code
   - iOS: 使用相機 App 掃描
   - Android: 使用 Expo Go App 內建的掃描功能

**限制：**
- ❌ 不支援原生模組（如 `react-native-worklets-core`）
- ❌ 不支援自訂原生程式碼
- ✅ 適合快速測試純 JavaScript 功能

---

### 方式二：Development Build（推薦用於你的專案）

**適用場景：** 包含原生模組的專案（如你的專案使用了 `react-native-worklets-core`）

**步驟：**

#### 1. 安裝 EAS CLI
```bash
npm install -g eas-cli
```

#### 2. 登入 Expo 帳號
```bash
eas login
```

#### 3. 設定 EAS（首次使用）
```bash
eas build:configure
```

這會建立 `eas.json` 設定檔

#### 4. 建立開發版本（Development Build）
```bash
# iOS (需要 macOS)
eas build --profile development --platform ios

# Android
eas build --profile development --platform android

# 或同時建置兩個平台
eas build --profile development --platform all
```

#### 5. 下載並安裝到手機
- EAS 會產生下載連結
- iOS: 使用 TestFlight 或直接下載 `.ipa` 檔案
- Android: 直接下載 `.apk` 檔案並安裝

#### 6. 啟動開發伺服器
```bash
npm start
# 或
expo start --dev-client
```

#### 7. 連線手機
- 開發版本會自動連線同一 Wi-Fi 的開發伺服器
- 或手動輸入電腦 IP 位址

---

### 方式三：本地構建（進階）

#### Android（需要 Android Studio）

```bash
# 預建置原生專案
npx expo prebuild

# 建置 APK
cd android
./gradlew assembleDebug

# 安裝到已連線的手機
./gradlew installDebug
```

#### iOS（需要 macOS + Xcode）

```bash
# 預建置原生專案
npx expo prebuild

# 開啟 Xcode 專案
open ios/*.xcworkspace

# 在 Xcode 中選擇裝置並執行
```

---

## 🔧 設定檔規範

### app.json 重要設定

```json
{
  "expo": {
    "name": "應用程式名稱",
    "slug": "應用程式識別碼",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.app",  // iOS 唯一識別碼
      "buildNumber": "1"                          // 建置編號
    },
    "android": {
      "package": "com.yourcompany.app",           // Android 套件名稱
      "versionCode": 1                            // 版本代碼
    }
  }
}
```

### eas.json 設定範例

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 📋 規範與最佳實踐

### 1. 版本管理規範

- **version (app.json)**: 用戶可見的版本號（如 "1.0.0"）
- **iOS buildNumber**: 每次上架 App Store 需遞增
- **Android versionCode**: 每次上架 Play Store 需遞增（必須大於前一個）

### 2. Bundle Identifier 規範

- **iOS**: `com.[公司名稱].[應用程式名稱]` (如 `com.checkmeout.app`)
- **Android**: `com.[公司名稱].[應用程式名稱]` (與 iOS 保持一致為佳)
- **規則**: 
  - 只能包含英文字母、數字、連字號和點
  - 必須是唯一的（整個 App Store/Play Store 唯一）
  - 一經發布不能更改

### 3. 權限宣告

在 `app.json` 中正確宣告所需權限：

```json
{
  "android": {
    "permissions": [
      "RECEIVE_BOOT_COMPLETED",
      "VIBRATE",
      "NOTIFICATIONS",
      "SCHEDULE_EXACT_ALARM"
    ]
  },
  "ios": {
    "infoPlist": {
      "NSUserNotificationsUsageDescription": "需要通知權限來提醒您出門檢查清單"
    }
  }
}
```

### 4. 環境變數管理

使用 `expo-constants` 或 `@expo/config-plugins` 管理不同環境變數：

```typescript
import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000',
  },
  staging: {
    apiUrl: 'https://staging.api.com',
  },
  prod: {
    apiUrl: 'https://api.com',
  },
};

const getEnvVars = () => {
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel || 'dev';
  return ENV[releaseChannel] || ENV.dev;
};
```

### 5. 測試檢查清單

在真實裝置測試前，確保：

- [ ] 所有原生模組正常運作
- [ ] 權限請求流程正確
- [ ] 通知功能正常
- [ ] 深色模式適配（如有）
- [ ] 不同螢幕尺寸適配
- [ ] 網路斷線處理
- [ ] 背景執行行為（通知等）

---

## 🚀 正式環境部署

### 使用 EAS Build + Submit

```bash
# 1. 建置正式版本
eas build --profile production --platform ios
eas build --profile production --platform android

# 2. 提交到 App Store / Play Store
eas submit --platform ios
eas submit --platform android
```

### 本機建置正式版本

#### Android
```bash
npx expo prebuild
cd android
./gradlew bundleRelease  # AAB 格式（Play Store）
# 或
./gradlew assembleRelease  # APK 格式
```

#### iOS
```bash
npx expo prebuild
# 在 Xcode 中 Archive 並上傳
```

---

## ⚠️ 常見問題

### 1. "Unable to resolve module"
- 清除快取：`expo start -c`
- 重新安裝相依套件：`rm -rf node_modules && npm install`

### 2. 原生模組在 Expo Go 無法使用
- 使用 Development Build（方式二）
- 或使用本機建置（方式三）

### 3. 建置失敗
- 檢查 `eas.json` 設定
- 查看 EAS 建置日誌
- 確認原生模組相容性

### 4. 手機無法連線開發伺服器
- 確認同一 Wi-Fi 網路
- 檢查防火牆設定
- 使用 `expo start --tunnel` (需要 Expo 帳號)

---

## 📚 參考資源

- [Expo 官方文件](https://docs.expo.dev/)
- [EAS Build 文件](https://docs.expo.dev/build/introduction/)
- [Development Build 指南](https://docs.expo.dev/development/introduction/)
- [React Native 最佳實務](https://reactnative.dev/docs/performance)

