# 出門點點名 (Check Me Out) 📱

> 專為解決「出門前遺忘重要物品」的焦慮而設計的極簡、單一情境生產力工具

## 📋 專案簡介

「出門點點名」是一個基於 React Native 開發的跨平台移動應用，透過定時、無干擾的清單提醒，將上班前的準備工作儀式化，幫助用戶養成習慣。

### 核心特色

- ✅ **極簡設計**：乾淨舒適的界面，專注於核心功能
- 📝 **清單管理**：自訂、編輯、拖拽排序清單項目
- 🔔 **定時提醒**：每日定時推播通知
- 💾 **本地存儲**：數據安全存儲在設備本地
- 🎨 **現代技術棧**：React Native + TypeScript + NativeWind

## 🛠 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| React Native | 0.73.x | 跨平台移動應用框架 |
| TypeScript | 5.3+ | 類型安全的 JavaScript |
| NativeWind | 2.0+ | Tailwind CSS for React Native |
| Zustand | 4.4+ | 輕量級狀態管理 |
| AsyncStorage | 1.21+ | 本地數據持久化 |
| React Navigation | 6.x | 頁面導航 |
| React Native Push Notification | 8.1+ | 本地推播通知 |

## 📦 安裝與運行

### 前置需求

- Node.js >= 18
- npm 或 yarn
- iOS: Xcode 14+ 和 CocoaPods
- Android: Android Studio 和 JDK 11+

### 安裝依賴

```bash
# 安裝 npm 依賴
npm install

# iOS 需要額外安裝 CocoaPods 依賴
cd ios && pod install && cd ..
```

### 運行應用

```bash
# 啟動 Metro bundler
npm start

# 運行 iOS 模擬器
npm run ios

# 運行 Android 模擬器
npm run android
```

### 開發工具

```bash
# 代碼檢查
npm run lint

# 格式化代碼
npx prettier --write .

# TypeScript 類型檢查
npx tsc --noEmit
```

## 📁 專案結構

```
check-me-out/
├── src/
│   ├── components/          # 可復用 UI 組件
│   │   ├── Button.tsx
│   │   ├── ChecklistItemCard.tsx
│   │   ├── Header.tsx
│   │   └── AddItemInput.tsx
│   ├── screens/            # 頁面組件
│   │   ├── HomeScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── store/              # Zustand 狀態管理
│   │   └── useAppStore.ts
│   ├── utils/              # 工具函數
│   │   ├── storage.ts      # AsyncStorage 封裝
│   │   ├── notification.ts # 通知管理
│   │   ├── permission.ts   # 權限管理
│   │   └── helpers.ts      # 通用輔助函數
│   ├── types/              # TypeScript 類型定義
│   │   └── index.ts
│   └── constants/          # 常量配置
│       ├── colors.ts       # 顏色配置
│       └── config.ts       # 應用配置
├── App.tsx                 # 應用主入口
├── index.js               # React Native 入口
└── package.json           # 依賴管理
```

## 🎨 設計規範

### 配色方案

| 顏色 | HEX | 用途 |
|------|-----|------|
| 主色 (Primary) | `#0ABAB5` | 導航欄、主要按鈕、勾選框 |
| 背景色 (Background) | `#F4F4F4` | 頁面主要背景 |
| 文字色 (Text) | `#333333` | 主要文字內容 |
| 成功色 (Success) | `#5CB85C` | 勾選成功、進度條 |
| 警告色 (Warning) | `#FF6347` | 刪除、重置等破壞性操作 |

### UI 設計原則

- 極簡舒適的界面風格
- 乾淨、線條簡單、大量留白
- 圓角按鈕、簡潔的卡片式清單項目
- 快速、無縫的勾選體驗

## 🚀 核心功能

### MVP 版本 (v1.0.0)

#### 1. 清單管理
- ✅ 新增、編輯、刪除清單項目
- ✅ 拖拽排序功能
- ✅ 單一清單支持（免費版）

#### 2. 核心交互
- ✅ 一鍵勾選/取消勾選
- ✅ 狀態持久化保存
- ✅ 一鍵重置所有項目

#### 3. 推播通知
- ✅ 自訂每日提醒時間
- ✅ 本地推播通知
- ✅ 通知開關設置

#### 4. 權限系統（預留）
- ✅ 免費版 / 付費版權限架構
- ⏳ 付費解鎖功能（待實現）
- ⏳ 雲端同步功能（待實現）

## 💰 商業模式

### 免費版
- ✅ 單一清單
- ✅ 基礎定時提醒
- ✅ 本地數據存儲

### 付費版（預留）
- 🔒 無限數量清單
- 🔒 雲端同步與備份
- 🔒 更多主題配色
- 🔒 進階統計功能

**定價**：約 NT$ 60 一次性購買 或 NT$ 50/月訂閱

## 📱 平台支持

- ✅ iOS 13.0+
- ✅ Android 6.0+ (API Level 23+)

## 🔧 疑難排解

### 常見問題

1. **通知無法正常工作**
   - iOS: 檢查設置中的通知權限
   - Android: 確認已創建通知頻道

2. **拖拽功能異常**
   - 確保已正確安裝 `react-native-gesture-handler`
   - iOS 需要重新執行 `pod install`

3. **NativeWind 樣式不生效**
   - 確認 `babel.config.js` 中包含 `nativewind/babel`
   - 清除緩存: `npm start -- --reset-cache`

## 📄 開發計劃

### 近期計劃
- [ ] 付費系統對接 (IAP)
- [ ] 多清單支持
- [ ] 雲端同步功能
- [ ] 深色模式
- [ ] 主題自訂

### 長期計劃
- [ ] 統計與分析功能
- [ ] 小部件 (Widget) 支持
- [ ] 多語言支持
- [ ] Apple Watch / Wear OS 支持

## 📝 許可證

本項目為私有專案，版權所有。

## 🤝 貢獻

目前不接受外部貢獻。

---

**Made with ❤️ by 資深前端工程師**

