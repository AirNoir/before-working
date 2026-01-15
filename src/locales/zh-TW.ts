/**
 * 繁體中文語言包
 */

export default {
  // 通用
  common: {
    confirm: '確認',
    cancel: '取消',
    delete: '刪除',
    save: '儲存',
    edit: '編輯',
    reset: '重置',
    settings: '設置',
    close: '關閉',
    back: '返回',
    add: '新增',
    done: '完成',
  },

  // 應用名稱
  app: {
    name: '出門點點名',
    englishName: 'Check Me Out',
    description: '專為解決「出門前遺忘重要物品」的焦慮而設計',
  },

  // 首頁
  home: {
    title: '出門點點名',
    emptyList: '目前沒有任何項目',
    emptyListHint: '點擊上方輸入框添加檢查清單',
    addItemPlaceholder: '新增檢查清單...',
    progress: '完成進度',
    resetConfirm: '確認重置',
    resetMessage: '確定要重置所有項目為未勾選狀態嗎？',
    noChecklist: '沒有可用的清單，請先創建一個清單',
  },

  // 設置頁面
  settings: {
    title: '設置',
    notification: {
      title: '通知設置',
      dailyReminder: '每日提醒',
      reminderTime: '提醒時間',
      testNotification: '發送測試通知',
      testNotificationSent: '已發送',
      testNotificationMessage: '已發送測試通知',
      permissionDenied: '權限被拒絕',
      permissionDeniedMessage: '請在系統設置中開啟通知權限',
    },
    account: {
      title: '帳號權限',
      currentPermission: '當前權限',
      free: '免費版',
      premium: '付費版',
      upgradeMessage: '升級到付費版以解鎖：',
      upgradeFeatures: {
        unlimited: '• 無限數量清單',
        cloudSync: '• 雲端同步與備份',
        more: '• 更多功能即將推出...',
      },
      upgradeButton: '升級到付費版',
      comingSoon: '即將推出',
      comingSoonMessage: '付費功能即將上線，敬請期待！',
    },
    about: {
      title: '關於應用',
      appName: '應用名稱',
      version: '版本',
      description: '簡介',
    },
    language: {
      title: '語言設置',
      currentLanguage: '當前語言',
      selectLanguage: '選擇語言',
      zhTW: '繁體中文',
      zhCN: '簡體中文',
      en: 'English',
    },
  },

  // 清單項目
  item: {
    deleteConfirm: '確認刪除',
    deleteMessage: '確定要刪除「{{title}}」嗎？',
    emptyTitle: '項目名稱不能為空',
  },

  // 通知
  notification: {
    defaultTitle: '準備出門了嗎？',
    defaultBody: '請點開檢查您的上班清單。',
  },

  // 默認清單項目
  defaultItems: {
    wallet: '錢包',
    keys: '鑰匙',
    badge: '員工證',
    phone: '手機',
  },

  // 圖示選擇器
  iconPicker: {
    title: '選擇圖示',
  },
};
