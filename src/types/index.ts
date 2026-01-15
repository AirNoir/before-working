/**
 * 清單項目類型
 */
export interface ChecklistItem {
  id: string;
  title: string;
  icon?: string; // MDI 圖示名稱，例如 'wallet', 'key', 'badge-account'
  checked: boolean;
  order: number;
  createdAt: number;
}

/**
 * 清單分組類型
 */
export interface ChecklistGroup {
  id: string;
  name: string;
  icon?: string; // MDI 圖示名稱
  order: number;
  createdAt: number;
}

/**
 * 清單類型
 */
export interface Checklist {
  id: string;
  name: string;
  items: ChecklistItem[];
  groupId: string | null; // 所屬分組 ID，null 表示未分組
  createdAt: number;
  updatedAt: number;
}

/**
 * 通知設定類型
 */
export interface NotificationSettings {
  enabled: boolean;
  time: string; // 格式: "HH:mm" 例如 "08:00"
  title: string;
  body: string;
}

/**
 * 使用者權限類型（為未來付費功能預留）
 */
export enum UserPermission {
  FREE = 'free', // 免費版：單一清單
  PREMIUM = 'premium', // 付費版：無限清單、雲端同步
}

/**
 * 支援的語言類型
 */
export type SupportedLanguage = 'zh-TW' | 'zh-CN' | 'en';

/**
 * 應用程式設定類型
 */
export interface AppSettings {
  notification: NotificationSettings;
  userPermission: UserPermission;
  theme: 'light' | 'dark'; // 預留深色模式
  language: SupportedLanguage; // 語言設定
  clockFormat: '12h' | '24h'; // 時鐘格式：12 小時制或 24 小時制
  resetTime: string | null; // 每日重置時間，格式: "HH:mm" 例如 "06:30"，null 表示未設置
}

/**
 * 應用程式狀態類型
 */
export interface AppState {
  checklists: Checklist[];
  groups: ChecklistGroup[]; // 清單分組
  activeChecklistId: string | null;
  activeGroupId: string | null; // 當前選中的分組 ID，null 表示顯示所有
  settings: AppSettings;
  isLoading: boolean;
}

/**
 * 天氣狀況類型
 */
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'partly-cloudy' | 'unknown';

/**
 * 天氣資料介面
 */
export interface WeatherData {
  minTemperature?: number; // 最低溫度（攝氏度）
  maxTemperature?: number; // 最高溫度（攝氏度）
  condition: WeatherCondition; // 天氣狀況
  conditionText: string; // 天氣狀況描述（如「晴天」、「陰天」）
  locationName?: string; // 位置名稱
  lastUpdated: number; // 最後更新時間戳記
}
