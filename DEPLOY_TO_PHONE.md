# 📱 部署到手機測試指南

## 🚀 最簡單的方式：使用 EAS Build（推薦）

### 前置準備

1. **註冊 Expo 帳號**（免費）
   - 前往 https://expo.dev/signup
   - 或使用 GitHub/Google 帳號登入

2. **安裝 EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

### 步驟一：登入 Expo

```bash
eas login
```

### 步驟二：配置 EAS

```bash
eas build:configure
```

這會自動創建 `eas.json` 配置文件。

### 步驟三：構建開發版本

#### Android（推薦先試這個，比較快）

```bash
eas build --profile development --platform android
```

#### iOS（需要 Apple Developer 帳號）

```bash
eas build --profile development --platform ios
```

**構建時間：** 約 10-20 分鐘（首次會比較久）

### 步驟四：下載並安裝

構建完成後，EAS 會提供下載連結：

- **Android**: 直接下載 `.apk` 檔案，傳到手機安裝
- **iOS**: 使用 TestFlight 或直接下載 `.ipa`（需要開發者帳號）

### 步驟五：連接開發服務器

1. 在電腦上啟動開發服務器：
   ```bash
   npm start
   ```

2. 在手機上打開剛安裝的 App，它會自動連接到同一 Wi-Fi 的開發服務器

3. 如果無法連接，可以手動輸入電腦的 IP 地址

---

## 🔧 方式二：本地構建（更快，但需要環境）

### Android 本地構建

#### 前置需求
- Android Studio
- Android SDK
- 手機開啟「開發者選項」和「USB 調試」

#### 步驟

```bash
# 1. 生成原生項目
npx expo prebuild

# 2. 連接手機（USB 或 Wi-Fi）
# 確認手機已連接：adb devices

# 3. 構建並安裝到手機
cd android
./gradlew installDebug

# 或使用 Expo CLI
npx expo run:android
```

### iOS 本地構建（需要 macOS）

#### 前置需求
- macOS
- Xcode
- Apple Developer 帳號（免費帳號也可以）

#### 步驟

```bash
# 1. 生成原生項目
npx expo prebuild

# 2. 打開 Xcode 項目
open ios/*.xcworkspace

# 3. 在 Xcode 中：
#    - 選擇你的手機作為目標設備
#    - 點擊運行按鈕（▶️）
#    - 首次運行需要在手機上信任開發者證書

# 或使用 Expo CLI
npx expo run:ios
```

---

## 📋 快速檢查清單

在部署前確認：

- [ ] 手機和電腦在同一 Wi-Fi 網路
- [ ] 手機已開啟開發者模式
- [ ] 已安裝必要的開發工具（Android Studio / Xcode）
- [ ] `app.json` 配置正確
- [ ] 所有依賴已安裝：`npm install`

---

## 🎯 推薦流程（第一次部署）

### Android（最簡單）

1. **使用 EAS Build**（雲端構建，無需本地環境）
   ```bash
   eas login
   eas build:configure
   eas build --profile development --platform android
   ```

2. **下載 APK 並安裝到手機**

3. **啟動開發服務器**
   ```bash
   npm start
   ```

4. **在手機上打開 App，自動連接**

### iOS（需要 macOS）

1. **使用本地構建**（更快）
   ```bash
   npx expo run:ios
   ```

2. **或使用 EAS Build**
   ```bash
   eas build --profile development --platform ios
   ```

---

## ⚙️ 配置文件

### eas.json（自動生成，但可以自定義）

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

---

## 🐛 常見問題

### 1. 構建失敗

**解決方法：**
- 檢查 `app.json` 配置
- 查看 EAS 構建日誌
- 確認所有依賴版本兼容

### 2. 手機無法連接開發服務器

**解決方法：**
```bash
# 使用 tunnel 模式（需要 Expo 帳號）
npm start -- --tunnel

# 或手動輸入 IP
# 在手機 App 中，點擊「Enter URL manually」
# 輸入：http://[你的電腦IP]:8081
```

### 3. Android 安裝失敗

**解決方法：**
- 確認手機已開啟「允許安裝未知來源應用」
- 檢查 APK 是否完整下載

### 4. iOS 構建需要證書

**解決方法：**
- 使用免費 Apple Developer 帳號
- 在 Xcode 中自動管理證書
- 或使用 EAS Build（自動處理證書）

---

## 📱 測試建議

部署到手機後，測試以下功能：

- [ ] 應用正常啟動
- [ ] 所有頁面可以正常導航
- [ ] 通知功能正常
- [ ] 數據持久化（關閉 App 後數據還在）
- [ ] 分類和清單功能正常
- [ ] 付費/免費版權限切換正常
- [ ] 時間選擇器正常
- [ ] 拖拽排序功能正常

---

## 🚀 下一步：構建正式版本

測試完成後，可以構建正式版本：

```bash
# Android
eas build --profile production --platform android

# iOS
eas build --profile production --platform ios
```

正式版本可以：
- 分發給測試用戶
- 提交到 App Store / Play Store

---

## 💡 提示

1. **首次構建會比較慢**（需要下載依賴和工具）
2. **開發版本可以熱重載**（修改代碼後自動更新）
3. **使用 EAS Build 不需要本地環境**（Android Studio / Xcode）
4. **免費 Expo 帳號有構建配額限制**，但足夠測試使用

---

## 📚 參考資源

- [EAS Build 文檔](https://docs.expo.dev/build/introduction/)
- [Development Build 指南](https://docs.expo.dev/development/introduction/)
- [Expo 官方文檔](https://docs.expo.dev/)

