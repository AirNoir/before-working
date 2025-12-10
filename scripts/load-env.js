/**
 * 載入 .env 檔案的輔助腳本
 * 在啟動 Expo 前讀取 .env 檔案並設定環境變數
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const lines = envFile.split('\n');

  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // 跳過註解和空行
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    // 解析 KEY=VALUE 格式
    const equalIndex = trimmedLine.indexOf('=');
    if (equalIndex > 0) {
      const key = trimmedLine.substring(0, equalIndex).trim();
      const value = trimmedLine.substring(equalIndex + 1).trim();
      
      // 移除引號（如果有）
      const cleanValue = value.replace(/^["']|["']$/g, '');
      
      // 只在未設定時設定環境變數
      if (!process.env[key]) {
        process.env[key] = cleanValue;
      }
    }
  });
}

