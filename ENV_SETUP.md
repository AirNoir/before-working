# 環境變數設定說明

## CWA API Key 設定

此應用程式使用台灣中央氣象局（CWA）開放資料 API 來取得天氣資訊。

### 步驟 1：申請 API Key

1. 前往 [台灣中央氣象局開放資料平台](https://opendata.cwb.gov.tw/)
2. 註冊帳號並登入
3. 在「會員中心」或「API 金鑰管理」取得您的 API 授權碼

### 步驟 2：建立 .env 檔案

在專案根目錄建立 `.env` 檔案（與 `package.json` 同一層級）：

```bash
# 在專案根目錄執行
touch .env
```

### 步驟 3：填入 API Key

在 `.env` 檔案中加入以下內容：

```env
EXPO_PUBLIC_CWA_API_KEY=您的API授權碼
```

**範例：**
```env
EXPO_PUBLIC_CWA_API_KEY=CWA-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 步驟 4：重新啟動開發伺服器

設定完成後，需要重新啟動 Expo 開發伺服器：

```bash
# 停止目前的開發伺服器（Ctrl+C）
# 然後重新啟動
npm start
# 或
yarn start
```

## 重要注意事項

1. **不要將 .env 檔案提交到 Git**
   - `.env` 檔案已在 `.gitignore` 中被忽略
   - 如果還沒有，請確保將 `.env` 加入 `.gitignore`

2. **如果沒有設定 API Key**
   - 應用程式會自動使用模擬天氣資料（僅用於開發測試）
   - 模擬資料會根據時間顯示不同的天氣狀況和溫度

3. **環境變數命名規則**
   - 必須使用 `EXPO_PUBLIC_` 前綴，才能在 Expo 應用程式中使用
   - 這是 Expo 的安全機制，只有公開的環境變數才會被注入到應用程式中

## 驗證設定

設定完成後，您可以：

1. 重新啟動開發伺服器
2. 檢查應用程式是否正常顯示天氣資訊
3. 如果看到真實的天氣資料（而非模擬資料），表示設定成功

## 疑難排解

### 問題：環境變數沒有生效

**解決方案：**
1. 確認 `.env` 檔案在專案根目錄（與 `package.json` 同一層級）
2. 確認變數名稱正確：`EXPO_PUBLIC_CWA_API_KEY`
3. 確認 API Key 沒有多餘的空格或引號
4. 重新啟動開發伺服器

### 問題：API 請求失敗

**解決方案：**
1. 檢查 API Key 是否正確
2. 確認 API Key 是否還有使用次數限制
3. 檢查網路連線
4. 查看終端機的錯誤訊息

