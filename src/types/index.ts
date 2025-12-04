/**
 * 清单项目类型
 */
export interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
  order: number;
  createdAt: number;
}

/**
 * 清单类型
 */
export interface Checklist {
  id: string;
  name: string;
  items: ChecklistItem[];
  createdAt: number;
  updatedAt: number;
}

/**
 * 通知设置类型
 */
export interface NotificationSettings {
  enabled: boolean;
  time: string; // 格式: "HH:mm" 例如 "08:00"
  title: string;
  body: string;
}

/**
 * 用户权限类型（为未来付费功能预留）
 */
export enum UserPermission {
  FREE = 'free',           // 免费版：单一清单
  PREMIUM = 'premium',     // 付费版：无限清单、云端同步
}

/**
 * 应用设置类型
 */
export interface AppSettings {
  notification: NotificationSettings;
  userPermission: UserPermission;
  theme: 'light' | 'dark'; // 预留深色模式
}

/**
 * 应用状态类型
 */
export interface AppState {
  checklists: Checklist[];
  activeChecklistId: string | null;
  settings: AppSettings;
  isLoading: boolean;
}

