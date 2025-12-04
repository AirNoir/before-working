# 專案架構概覽 🏗️

本文檔提供「出門點點名」App 的整體架構說明和代碼導航指南。

## 📊 系統架構圖

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│  ┌──────────────┐              ┌──────────────┐        │
│  │ HomeScreen   │              │ SettingsScreen│        │
│  └──────────────┘              └──────────────┘        │
└────────────────┬──────────────────────┬────────────────┘
                 │                      │
        ┌────────▼──────────────────────▼─────────┐
        │      React Navigation (路由)             │
        └────────┬─────────────────────────────────┘
                 │
        ┌────────▼──────────────────────────────┐
        │     Zustand Store (狀態管理)          │
        │  ┌──────────────────────────────┐    │
        │  │  - checklists                │    │
        │  │  - activeChecklistId         │    │
        │  │  - settings                  │    │
        │  └──────────────────────────────┘    │
        └────────┬─────────────────┬────────────┘
                 │                 │
        ┌────────▼─────┐   ┌───────▼──────────┐
        │ AsyncStorage │   │ Push Notification│
        │ (持久化存儲)  │   │  (本地通知)      │
        └──────────────┘   └──────────────────┘
```

## 🗂 目錄結構詳解

### `/src/components/` - UI 組件層

可復用的 UI 組件，遵循原子設計原則：

- **Button.tsx**: 通用按鈕組件
  - 支持多種樣式變體 (primary, warning, success, outline)
  - 內建 loading 和 disabled 狀態
  
- **ChecklistItemCard.tsx**: 清單項目卡片
  - 勾選框交互
  - 內聯編輯功能
  - 拖拽支持
  - 刪除確認
  
- **Header.tsx**: 頁面頭部組件
  - 左右按鈕插槽
  - 標題居中顯示
  
- **AddItemInput.tsx**: 添加項目輸入框
  - 快速輸入界面
  - 驗證與錯誤提示

### `/src/screens/` - 頁面組件層

應用的主要頁面：

- **HomeScreen.tsx**: 主頁面
  - 清單展示與管理
  - 拖拽排序功能
  - 進度條顯示
  - 一鍵重置功能
  
- **SettingsScreen.tsx**: 設置頁面
  - 通知設置
  - 時間選擇器
  - 權限信息展示
  - 關於應用信息

### `/src/store/` - 狀態管理層

使用 Zustand 進行全局狀態管理：

- **useAppStore.ts**: 主狀態管理器
  ```typescript
  interface AppStore {
    // 狀態
    checklists: Checklist[]
    activeChecklistId: string | null
    settings: AppSettings
    isLoading: boolean
    
    // 清單操作
    createChecklist, deleteChecklist, updateChecklistName
    setActiveChecklist
    
    // 清單項目操作
    addItem, deleteItem, updateItem
    toggleItemCheck, resetAllItems, reorderItems
    
    // 設置操作
    updateNotificationSettings, updateUserPermission
    
    // 持久化
    initialize, saveToStorage
  }
  ```

#### 狀態管理流程

1. **初始化流程**:
   ```
   App 啟動 → initialize() → 從 AsyncStorage 讀取 → 設置初始狀態
   ```

2. **數據更新流程**:
   ```
   用戶操作 → 調用 Store Action → 更新狀態 → saveToStorage()
   ```

3. **通知調度流程**:
   ```
   更新通知設置 → scheduleDailyNotification() → 系統通知
   ```

### `/src/utils/` - 工具函數層

各種輔助工具模組：

- **storage.ts**: AsyncStorage 封裝
  - `saveData<T>`: 保存數據
  - `getData<T>`: 讀取數據
  - `removeData`: 刪除數據
  - 提供類型安全的存儲操作

- **notification.ts**: 通知管理
  - `initializeNotifications`: 初始化通知系統
  - `scheduleDailyNotification`: 調度每日通知
  - `requestNotificationPermission`: 請求權限
  - `sendTestNotification`: 發送測試通知

- **permission.ts**: 權限控制（預留付費功能）
  - `canCreateChecklist`: 檢查是否可創建清單
  - `isPremiumUser`: 檢查是否為付費用戶
  - `upgradeToPremium`: 升級接口（待實現）

- **helpers.ts**: 通用輔助函數
  - `generateId`: 生成唯一 ID
  - `formatTime`: 時間格式化
  - `throttle`, `debounce`: 性能優化函數

### `/src/types/` - 類型定義層

TypeScript 類型定義：

```typescript
// 核心數據類型
ChecklistItem     // 清單項目
Checklist         // 清單
NotificationSettings // 通知設置
UserPermission    // 用戶權限枚舉
AppSettings       // 應用設置
AppState          // 應用狀態
```

### `/src/constants/` - 常量配置層

- **colors.ts**: 配色方案
  - 遵循規格書定義的 5 色系統
  
- **config.ts**: 應用配置
  - 存儲鍵名
  - 默認值
  - 權限限制
  - App 信息

## 🔄 數據流程圖

### 添加清單項目流程

```
用戶輸入項目名稱
    ↓
AddItemInput.onAdd()
    ↓
useAppStore.addItem(checklistId, title)
    ↓
創建新 ChecklistItem 對象
    ↓
更新 store.checklists 狀態
    ↓
saveToStorage() → AsyncStorage
    ↓
UI 自動更新（React 重新渲染）
```

### 勾選項目流程

```
用戶點擊勾選框
    ↓
ChecklistItemCard.onToggle()
    ↓
useAppStore.toggleItemCheck(checklistId, itemId)
    ↓
切換 item.checked 狀態
    ↓
saveToStorage()
    ↓
UI 更新（顯示勾選狀態 + 進度條更新）
```

### 拖拽排序流程

```
用戶長按拖拽項目
    ↓
DraggableFlatList.onDragEnd({data})
    ↓
useAppStore.reorderItems(checklistId, newItems)
    ↓
更新每個 item.order
    ↓
saveToStorage()
    ↓
UI 更新（新順序）
```

### 通知設置流程

```
用戶更改通知設置
    ↓
SettingsScreen.updateNotificationSettings()
    ↓
useAppStore.updateNotificationSettings(enabled, time)
    ↓
更新 settings.notification
    ↓
scheduleDailyNotification(settings.notification)
    ↓
系統調度本地通知
    ↓
saveToStorage()
```

## 🎨 樣式系統

### NativeWind + Tailwind CSS

使用 NativeWind 將 Tailwind CSS 應用於 React Native：

```tsx
// Tailwind 類名直接用於 React Native 組件
<View className="bg-primary p-4 rounded-lg shadow-sm">
  <Text className="text-white font-bold text-lg">
    標題
  </Text>
</View>
```

### 配色方案使用

```tsx
// 方式 1: 使用 Tailwind 類名（推薦）
<View className="bg-primary">

// 方式 2: 使用常量（需要 style prop）
import {COLORS} from '@constants/colors';
<View style={{backgroundColor: COLORS.primary}}>
```

### 主題顏色映射

| Tailwind 類名 | HEX 值 | 用途 |
|--------------|---------|------|
| `bg-primary` | #0ABAB5 | 主色背景 |
| `text-primary` | #0ABAB5 | 主色文字 |
| `bg-success` | #5CB85C | 成功色 |
| `bg-warning` | #FF6347 | 警告色 |
| `bg-background` | #F4F4F4 | 頁面背景 |
| `text-textPrimary` | #333333 | 主要文字 |

## 🔐 權限系統設計

### 當前狀態

- **免費版**: 限制 1 個清單
- **付費版**: 無限清單 + 雲端同步（預留）
- **實現狀態**: 權限全開啟（用戶要求）

### 權限檢查點

```typescript
// 創建清單前檢查
const canCreate = canCreateChecklist(
  checklists.length,
  settings.userPermission
);

if (!canCreate) {
  // 顯示升級提示
  showUpgradePrompt();
}
```

### 未來擴展

權限系統已預留接口，可輕鬆對接：

1. **IAP (In-App Purchase)**: 
   - iOS: StoreKit
   - Android: Google Play Billing

2. **雲端同步**:
   - Firebase Firestore
   - 或自建後端 API

## 📱 通知系統設計

### 通知頻道 (Android)

```javascript
{
  channelId: 'check-me-out-channel',
  channelName: '每日提醒',
  importance: 4,  // 高重要性
  vibrate: true,
  sound: 'default'
}
```

### 通知調度邏輯

```javascript
// 解析用戶設置的時間 (如 "08:00")
const scheduledTime = parseTimeString(settings.notification.time);

// 如果今天的時間已過，調度到明天
if (scheduledTime <= now) {
  scheduledTime.setDate(scheduledTime.getDate() + 1);
}

// 調度重複通知
PushNotification.localNotificationSchedule({
  date: scheduledTime,
  repeatType: 'day',  // 每天重複
  // ...其他配置
});
```

## 🧪 測試策略

### 單元測試

- 使用 Jest + React Native Testing Library
- 測試覆蓋工具函數和 Store actions

### 集成測試

- 測試完整用戶流程
- 通知調度測試
- 數據持久化測試

### E2E 測試（未來）

- Detox 或 Appium
- 真機測試通知功能

## 🚀 性能優化

### 已實現

1. **狀態管理**: Zustand (輕量級，無 Provider 地獄)
2. **列表渲染**: FlatList 虛擬化
3. **持久化**: AsyncStorage 異步操作
4. **拖拽**: react-native-draggable-flatlist (高性能)

### 可優化點（未來）

1. **圖片優化**: react-native-fast-image
2. **大列表**: FlashList
3. **狀態選擇器**: 使用 useShallow 避免重渲染
4. **延遲加載**: React.lazy + Suspense

## 📦 依賴管理

### 核心依賴

- React Native: 跨平台框架
- TypeScript: 類型安全
- Zustand: 狀態管理
- NativeWind: 樣式系統
- AsyncStorage: 本地存儲
- React Navigation: 路由導航

### 功能依賴

- react-native-push-notification: 通知
- react-native-draggable-flatlist: 拖拽
- @react-native-community/datetimepicker: 時間選擇

### 開發依賴

- ESLint: 代碼檢查
- Prettier: 代碼格式化
- Jest: 測試框架

## 🔧 開發最佳實踐

### 代碼組織

1. **單一職責**: 每個文件只負責一個功能
2. **模組化**: 使用 index.ts 統一導出
3. **類型安全**: 所有函數都有明確類型定義
4. **注釋**: 每個文件頭部有用途說明

### 命名規範

- **組件**: PascalCase (Button.tsx)
- **工具函數**: camelCase (generateId)
- **常量**: UPPER_SNAKE_CASE (STORAGE_KEYS)
- **類型**: PascalCase (ChecklistItem)

### Git 提交規範（建議）

```
feat: 新增功能
fix: 修復 bug
docs: 文檔更新
style: 代碼格式調整
refactor: 代碼重構
test: 測試相關
chore: 構建/工具鏈更新
```

## 📚 學習資源

- [React Native 官方文檔](https://reactnative.dev/)
- [Zustand 文檔](https://docs.pmnd.rs/zustand/)
- [NativeWind 文檔](https://www.nativewind.dev/)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)

---

**持續更新中...** 如有疑問，請查閱相關源代碼或文檔。

