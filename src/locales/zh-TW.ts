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
    error: '錯誤',
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
    clearAllItems: '清除全部清單',
    clearAllItemsConfirm: '確認清除',
    clearAllItemsMessage: '確定要刪除「{{groupName}}」分類下的所有清單項目嗎？此操作無法復原。',
    currentGroup: '當前分類',
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
    resetTime: {
      title: '自動重置設置',
      description: '設定每天自動清空所有清單的勾選狀態',
      resetTime: '重置時間',
      notSet: '未設置',
      disable: '關閉',
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
    resetToDefaults: {
      title: '恢復預設值',
      description:
        '將應用恢復到初始狀態，包括：一個「上班」分類、預設的四個檢查項目（皮包、鑰匙、員工證、手機），以及重置時間設為 AM 06:00',
      button: '恢復預設值',
      confirm: '確認恢復預設值',
      message: '確定要恢復預設值嗎？此操作將清除所有現有的分類和清單項目，無法復原。',
      success: '已恢復預設值',
      successMessage: '應用已恢復到預設狀態',
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

  // 分組相關
  group: {
    createGroup: '新增分類',
    editGroup: '編輯分類',
    deleteGroup: '刪除分類',
    manageGroups: '管理分類',
    groupName: '分類名稱',
    selectGroup: '選擇分類',
    deleteConfirm: '確認刪除',
    deleteMessage: '確定要刪除「{{name}}」分類嗎？刪除後該分類下的清單將移至未分組。',
    emptyName: '分類名稱不能為空',
    upgradeTitle: '升級到付費版',
    upgradeMessage: '免費版最多只能創建 {{limit}} 個分類。升級到付費版可無限創建分類並使用分類套組。',
    upgradeButton: '前往升級',
    importTemplate: '引入分類套組',
    selectTemplate: '選擇分類套組',
    templatePremiumOnly: '此功能僅限付費版使用',
    templateUpgradeMessage: '引入分類套組功能僅限付費版使用。升級後可快速創建包含預設項目的分類。',
    templateImported: '引入成功',
    templateImportedMessage: '分類套組已成功引入！',
    templateImportFailed: '引入失敗，請稍後再試',
    templateItemsCount: '{{count}} 個項目',
  },
};
