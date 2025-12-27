# 為什麼 React Native 使用 Babel/Metro 而不是 Vite？🤔

## 簡短答案

**React Native 不能使用 Vite**，因為：

1. **不同的運行環境**：React Native 運行在原生平台（iOS/Android），不是瀏覽器
2. **專用的打包工具**：React Native 使用 **Metro Bundler**，這是專門為移動應用設計的
3. **原生模組支持**：需要處理原生代碼、圖片資源、字體等移動端特有的資源
4. **架構完全不同**：Vite 是為 Web 開發設計的，無法處理 React Native 的特殊需求

## 詳細解釋

### 1. 打包工具對比

| 特性 | Vite | Metro Bundler |
|------|------|---------------|
| **主要用途** | Web 應用（React、Vue 等） | React Native 移動應用 |
| **運行環境** | 瀏覽器 | iOS/Android 原生環境 |
| **輸出格式** | ES 模組、HTML、CSS | JavaScript Bundle + 原生代碼 |
| **熱更新** | HMR (Hot Module Replacement) | Fast Refresh |
| **資源處理** | Web 資源（圖片、CSS） | 原生資源（圖片、字體、原生模組） |
| **轉譯工具** | esbuild (開發) / Rollup (生產) | Babel + Metro |

### 2. React Native 的構建流程

```
源代碼 (TypeScript/JSX)
    ↓
Babel 轉譯 (babel-preset-expo)
    ↓
Metro Bundler 打包
    ↓
JavaScript Bundle
    ↓
原生應用 (iOS/Android)
```

### 3. 為什麼需要 Babel？

Babel 在 React Native 中的作用：

1. **JSX 轉譯**：將 JSX 語法轉換為 JavaScript
2. **TypeScript 支持**：配合 TypeScript 編譯器
3. **ES6+ 語法轉換**：將現代 JavaScript 轉換為兼容的版本
4. **插件系統**：
   - `nativewind/babel` - 處理 Tailwind CSS
   - `react-native-reanimated/plugin` - 動畫優化
   - `babel-preset-expo` - Expo 專用預設

### 4. 為什麼需要 Metro？

Metro 是 React Native 專用的打包工具，因為它：

1. **原生模組支持**：能夠處理 `.native.js`、`.ios.js`、`.android.js` 等平台特定文件
2. **資源處理**：自動處理圖片、字體、音頻等原生資源
3. **Fast Refresh**：提供比 Web HMR 更適合移動端的熱更新
4. **增量打包**：只重新打包變更的文件，提高開發效率
5. **原生代碼集成**：與 Xcode、Android Studio 無縫集成

### 5. Vite 為什麼不適用？

Vite 設計用於 Web 開發，無法處理：

❌ **原生模組**：無法處理 iOS/Android 原生代碼
❌ **原生資源**：無法處理移動端特有的資源格式
❌ **原生 API**：無法訪問設備功能（相機、GPS 等）
❌ **原生構建**：無法生成 `.ipa`、`.apk` 等原生應用包

### 6. 技術棧對比

#### Web 開發（使用 Vite）
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 輸出到瀏覽器
})
```

#### React Native 開發（使用 Metro + Babel）
```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['nativewind/babel'],
}
// Metro 配置由 Expo 自動處理
```

### 7. 實際例子

#### Vite 項目結構
```
web-app/
├── index.html          ← Web 入口
├── src/
│   └── main.tsx        ← 瀏覽器運行
└── vite.config.js      ← Vite 配置
```

#### React Native 項目結構
```
react-native-app/
├── App.tsx             ← 原生應用入口
├── index.js            ← Metro 入口
├── babel.config.js     ← Babel 配置
└── app.json            ← Expo 配置
```

### 8. 性能考量

| 項目 | Vite (Web) | Metro (React Native) |
|------|------------|---------------------|
| **冷啟動** | 極快（ESM） | 中等（需要轉譯） |
| **熱更新** | 極快（HMR） | 快（Fast Refresh） |
| **生產構建** | 快（Rollup） | 中等（原生構建較慢） |
| **適用場景** | Web 應用 | 移動應用 |

### 9. 總結

- ✅ **React Native 必須使用 Metro + Babel**
- ❌ **不能使用 Vite**（架構不兼容）
- 🎯 **Metro 是專為移動端設計的打包工具**
- 🔧 **Babel 負責代碼轉譯和插件處理**

### 10. 相關資源

- [Metro Bundler 官方文檔](https://metrobundler.dev/)
- [Babel 官方文檔](https://babeljs.io/)
- [Expo 文檔](https://docs.expo.dev/)
- [React Native 架構說明](https://reactnative.dev/docs/architecture-overview)

---

**結論**：React Native 和 Web 開發是完全不同的生態系統，需要使用專門的工具鏈。Metro + Babel 是 React Native 的標準配置，就像 Vite 是現代 Web 開發的標準配置一樣。


