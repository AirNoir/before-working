# 快速啟動指南 ⚡️

最快速的方式讓「出門點點名」App 跑起來！

## 🚀 5 分鐘快速啟動

### 1. 安裝依賴 (首次運行)

```bash
# 安裝所有依賴
npm install

# iOS 用戶需要額外執行
cd ios && pod install && cd ..
```

### 2. 啟動應用

#### iOS (macOS only)

```bash
# 方式一：使用 npm 腳本（推薦）
npm run ios

# 方式二：指定設備
npm run ios -- --simulator="iPhone 15 Pro"
```

#### Android

```bash
# 確保已啟動 Android 模擬器或連接真機
npm run android
```

## 🎯 開發常用命令

```bash
# 啟動 Metro bundler
npm start

# 清除緩存啟動
npm start -- --reset-cache

# 代碼檢查
npm run lint

# TypeScript 類型檢查
npx tsc --noEmit
```

## 🔍 測試功能

### 測試通知功能

1. 打開應用
2. 點擊右下角「⚙️ 設置」
3. 開啟「每日提醒」開關
4. 設置提醒時間
5. 點擊「發送測試通知」

### 測試清單功能

1. 在主頁面添加新項目
2. 點擊項目左側勾選框進行勾選
3. 長按項目左側 ☰ 圖示進行拖拽排序
4. 點擊項目文字進行編輯
5. 點擊右上角 ↻ 按鈕重置所有項目

## ⚠️ 遇到問題？

### Metro Bundler 無法啟動

```bash
# 終止所有 Node 進程
killall node

# 清除 watchman
watchman watch-del-all

# 重新啟動
npm start -- --reset-cache
```

### iOS 運行失敗

```bash
# 清除 Pod 並重新安裝
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..

# 重新運行
npm run ios
```

### Android 運行失敗

```bash
# 清除 Gradle 緩存
cd android
./gradlew clean
cd ..

# 重新運行
npm run android
```

### 樣式不顯示

```bash
# 清除所有緩存
rm -rf node_modules
npm install
npm start -- --reset-cache
```

## 📱 平台特定注意事項

### iOS
- 需要 macOS 系統
- 首次運行可能需要 10-15 分鐘編譯
- 真機測試需要 Apple Developer 帳號

### Android
- 首次運行需要下載 Gradle 依賴
- 確保 ANDROID_HOME 環境變量已設置
- 推薦使用 Android Studio 的模擬器

## 📚 更多資訊

- 完整文檔：[README.md](./README.md)
- 詳細設置：[SETUP.md](./SETUP.md)
- 專案結構：查看 `src/` 目錄

---

**開始享受你的「出門點點名」之旅吧！** 🎉

