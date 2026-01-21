# ⚡ 快速部署指南（5 分鐘上手）

## 🎯 最簡單的方法：EAS Build

### 1️⃣ 安裝 EAS CLI（只需一次）

```bash
npm install -g eas-cli
```

### 2️⃣ 登入 Expo

```bash
eas login
```
（如果沒有帳號，會提示你註冊，免費的）

### 3️⃣ 配置項目

```bash
eas build:configure
```

### 4️⃣ 構建 Android 版本（推薦先試這個）

```bash
eas build --profile development --platform android
```

⏱️ **等待 10-20 分鐘**，構建完成後會給你下載連結

### 5️⃣ 安裝到手機

- 下載 `.apk` 檔案
- 傳到手機並安裝
- 首次安裝需要在手機設定中允許「安裝未知來源應用」

### 6️⃣ 啟動開發服務器

```bash
npm start
```

### 7️⃣ 在手機上打開 App

- 打開剛安裝的 App
- 它會自動連接到同一 Wi-Fi 的開發服務器
- 如果無法連接，在 App 中手動輸入電腦的 IP 地址

---

## ✅ 完成！

現在你可以在手機上測試 App 了！

修改代碼後，App 會自動重新載入（熱重載）。

---

## 🔄 如果修改了原生代碼

如果添加了新的原生模組，需要重新構建：

```bash
eas build --profile development --platform android
```

---

## 📱 iOS 版本

如果需要 iOS 版本：

```bash
eas build --profile development --platform ios
```

（需要 Apple Developer 帳號，免費帳號也可以）

---

## 💡 小技巧

- **使用 tunnel 模式**（如果 Wi-Fi 連接有問題）：
  ```bash
  npm start -- --tunnel
  ```

- **查看構建狀態**：
  ```bash
  eas build:list
  ```

- **取消構建**：
  在 Expo 網站上取消，或等待完成後不下載

