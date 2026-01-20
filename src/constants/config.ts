/**
 * 應用配置常量
 */

// 本地存儲鍵名
export const STORAGE_KEYS = {
  CHECKLISTS: '@CheckMeOut:checklists',
  SETTINGS: '@CheckMeOut:settings',
  ACTIVE_CHECKLIST: '@CheckMeOut:activeChecklist',
  GROUPS: '@CheckMeOut:groups',
  ACTIVE_GROUP: '@CheckMeOut:activeGroup',
  LAST_RESET_DATE: '@CheckMeOut:lastResetDate', // 上次重置的日期
} as const;

// 默認通知配置
export const DEFAULT_NOTIFICATION = {
  enabled: true,
  time: '08:00',
  title: '準備出門了嗎？',
  body: '請點開檢查您的上班清單。',
} as const;

// 默認清單名稱
export const DEFAULT_CHECKLIST_NAME = '出門點點名';

// 通知頻道配置 (Android)
export const NOTIFICATION_CHANNEL = {
  id: 'check-me-out-channel',
  name: '每日提醒',
  description: '出門前的清單提醒通知',
} as const;

// 權限限制
export const PERMISSION_LIMITS = {
  FREE_CHECKLIST_COUNT: 1, // 免費版清單數量限制
  PREMIUM_CHECKLIST_COUNT: -1, // 付費版無限制（-1 表示無限）
  FREE_GROUP_COUNT: 2, // 免費版分類數量限制
  PREMIUM_GROUP_COUNT: -1, // 付費版無限制（-1 表示無限）
} as const;

// App 信息
export const APP_INFO = {
  name: '出門點點名',
  englishName: 'Check Me Out',
  version: '1.0.0',
  description: '專為解決「出門前遺忘重要物品」的焦慮而設計',
} as const;
