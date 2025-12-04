# 專案設置指南 🚀

本文檔提供詳細的專案初始化和開發環境設置說明。

## 📋 目錄

1. [環境準備](#環境準備)
2. [專案初始化](#專案初始化)
3. [iOS 設置](#ios-設置)
4. [Android 設置](#android-設置)
5. [開發流程](#開發流程)
6. [常見問題](#常見問題)

## 🔧 環境準備

### 1. 安裝 Node.js

確保安裝 Node.js 18 或更高版本：

```bash
# 檢查 Node.js 版本
node --version

# 推薦使用 nvm 管理 Node.js 版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. 安裝 Watchman (推薦)

```bash
# macOS
brew install watchman
```

### 3. 安裝 Xcode (iOS 開發)

1. 從 App Store 安裝 Xcode 14+
2. 安裝 Xcode Command Line Tools：

```bash
xcode-select --install
```

3. 安裝 CocoaPods：

```bash
sudo gem install cocoapods
```

### 4. 安裝 Android Studio (Android 開發)

1. 下載並安裝 [Android Studio](https://developer.android.com/studio)
2. 安裝 Android SDK (API Level 31+)
3. 配置環境變量：

```bash
# 添加到 ~/.zshrc 或 ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 📦 專案初始化

### 1. 安裝依賴

```bash
# 進入專案目錄
cd before-working

# 安裝 npm 依賴
npm install

# 安裝 iOS 依賴 (僅 macOS)
cd ios
pod install
cd ..
```

### 2. 驗證安裝

```bash
# 檢查 React Native 環境
npx react-native doctor

# 檢查 TypeScript
npx tsc --version
```

## 📱 iOS 設置

### 1. 配置通知權限

在 `ios/CheckMeOut/Info.plist` 中添加（如需要）：

```xml
<key>UIBackgroundModes</key>
<array>
  <string>remote-notification</string>
</array>
```

### 2. 運行 iOS 應用

```bash
# 啟動 Metro bundler
npm start

# 在新終端運行 iOS
npm run ios

# 或指定設備
npm run ios -- --simulator="iPhone 15 Pro"
```

### 3. 真機測試

1. 在 Xcode 中打開 `ios/CheckMeOut.xcworkspace`
2. 選擇你的開發者帳號
3. 選擇目標設備
4. 點擊 Run

## 🤖 Android 設置

### 1. 配置通知權限

`android/app/src/main/AndroidManifest.xml` 已包含必要權限：

```xml
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
```

### 2. 運行 Android 應用

```bash
# 啟動 Android 模擬器
# 或連接 Android 設備並開啟 USB 調試

# 啟動 Metro bundler
npm start

# 在新終端運行 Android
npm run android
```

### 3. 真機測試

1. 在設備上開啟「開發者選項」和「USB 調試」
2. 連接設備到電腦
3. 運行 `npm run android`

## 🛠 開發流程

### 1. 啟動開發服務器

```bash
npm start
```

### 2. 重新加載應用

- iOS 模擬器: `Cmd + R`
- Android 模擬器: `R + R` (雙擊 R)
- 或搖動設備打開開發菜單

### 3. 開啟調試工具

```bash
# 開啟 React Native Debugger
# 在開發菜單中選擇 "Debug"

# 或使用 Chrome DevTools
# 在開發菜單中選擇 "Debug with Chrome"
```

### 4. 代碼格式化

```bash
# 格式化所有文件
npx prettier --write .

# 運行 ESLint
npm run lint

# 修復 ESLint 錯誤
npm run lint -- --fix
```

### 5. TypeScript 檢查

```bash
# 類型檢查
npx tsc --noEmit
```

## 🎨 NativeWind 開發

### 使用 Tailwind 類名

```tsx
// 在組件中使用 className
<View className="bg-primary p-4 rounded-lg">
  <Text className="text-white font-bold">Hello</Text>
</View>
```

### 自訂主題

修改 `tailwind.config.js` 中的 `theme.extend`：

```js
theme: {
  extend: {
    colors: {
      primary: '#0ABAB5',
      // ...更多顏色
    },
  },
}
```

## 🔔 通知測試

### iOS 通知測試

1. 在設置頁面開啟通知
2. 設置提醒時間
3. 點擊「發送測試通知」按鈕
4. 或等待指定時間接收通知

### Android 通知測試

同 iOS 流程，但 Android 不需要額外權限請求。

## 📊 狀態管理

使用 Zustand 進行狀態管理：

```tsx
import {useAppStore} from '@store/useAppStore';

const MyComponent = () => {
  const checklists = useAppStore(state => state.checklists);
  const addItem = useAppStore(state => state.addItem);
  
  // 使用狀態和操作
};
```

## 🐛 常見問題

### Metro Bundler 錯誤

```bash
# 清除緩存
npm start -- --reset-cache

# 清除 watchman
watchman watch-del-all

# 清除臨時文件
rm -rf $TMPDIR/react-*
```

### iOS Pod 安裝錯誤

```bash
# 清除 Pod 緩存
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod setup
pod install
cd ..
```

### Android Gradle 錯誤

```bash
# 清除 Gradle 緩存
cd android
./gradlew clean
cd ..

# 清除 Android build 文件
rm -rf android/app/build
```

### NativeWind 樣式不生效

1. 確認 `babel.config.js` 包含 `nativewind/babel`
2. 清除緩存並重啟：

```bash
npm start -- --reset-cache
```

### 通知不工作

**iOS:**
- 檢查設置 > 通知 > CheckMeOut 是否允許通知
- 真機測試（模擬器可能不支持某些通知功能）

**Android:**
- 檢查應用通知權限
- 檢查通知頻道是否正確創建

## 🚀 構建發布版本

### iOS

```bash
# 在 Xcode 中
# 1. Product > Scheme > Edit Scheme
# 2. 設置 Build Configuration 為 Release
# 3. Product > Archive
```

### Android

```bash
cd android
./gradlew assembleRelease

# APK 位於:
# android/app/build/outputs/apk/release/app-release.apk
```

## 📝 下一步

- 閱讀 [README.md](./README.md) 了解專案概況
- 查看 [src/](./src/) 目錄了解代碼結構
- 開始開發新功能！

---

有問題？檢查 [README.md](./README.md) 的疑難排解部分或搜索相關文檔。

