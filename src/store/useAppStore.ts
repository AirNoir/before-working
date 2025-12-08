/**
 * 全局應用狀態管理
 * 使用 Zustand 管理應用狀態並同步到 AsyncStorage
 */

import {create} from 'zustand';
import type {
  AppState,
  Checklist,
  ChecklistItem,
  AppSettings,
  UserPermission,
  SupportedLanguage,
} from '@types/index';
import {
  STORAGE_KEYS,
  DEFAULT_NOTIFICATION,
  DEFAULT_CHECKLIST_NAME,
} from '@constants/config';
import {saveData, getData} from '@utils/storage';
import {generateId} from '@utils/helpers';
import {scheduleDailyNotification} from '@utils/notification';
import i18n from '@locales/index';

interface AppStore extends AppState {
  // 初始化
  initialize: () => Promise<void>;
  
  // 清單操作
  createChecklist: (name: string) => void;
  deleteChecklist: (checklistId: string) => void;
  updateChecklistName: (checklistId: string, name: string) => void;
  setActiveChecklist: (checklistId: string) => void;
  
  // 清單項目操作
  addItem: (checklistId: string, title: string, icon?: string) => void;
  deleteItem: (checklistId: string, itemId: string) => void;
  updateItem: (checklistId: string, itemId: string, title: string) => void;
  toggleItemCheck: (checklistId: string, itemId: string) => void;
  resetAllItems: (checklistId: string) => void;
  reorderItems: (checklistId: string, newItems: ChecklistItem[]) => void;
  
  // 設置操作
  updateNotificationSettings: (enabled: boolean, time?: string) => void;
  updateUserPermission: (permission: UserPermission) => void;
  updateLanguage: (language: SupportedLanguage) => void;
  
  // 持久化
  saveToStorage: () => Promise<void>;
}

/**
 * 創建默認清單
 */
const createDefaultChecklist = (): Checklist => {
  const now = Date.now();
  return {
    id: generateId(),
    name: DEFAULT_CHECKLIST_NAME,
    items: [
      {
        id: generateId(),
        title: '錢包',
        icon: 'wallet',
        checked: false,
        order: 0,
        createdAt: now,
      },
      {
        id: generateId(),
        title: '鑰匙',
        icon: 'key',
        checked: false,
        order: 1,
        createdAt: now,
      },
      {
        id: generateId(),
        title: '員工證',
        icon: 'badge-account',
        checked: false,
        order: 2,
        createdAt: now,
      },
      {
        id: generateId(),
        title: '手機',
        icon: 'cellphone',
        checked: false,
        order: 3,
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * 創建默認設置
 */
const createDefaultSettings = (): AppSettings => ({
  notification: {...DEFAULT_NOTIFICATION},
  userPermission: 'free', // 默認為免費版，但目前全開啟
  theme: 'light',
  language: 'zh-TW', // 默認繁體中文
});

/**
 * Zustand Store
 */
export const useAppStore = create<AppStore>((set, get) => ({
  // 初始狀態
  checklists: [],
  activeChecklistId: null,
  settings: createDefaultSettings(),
  isLoading: true,

  // 初始化：從存儲加載數據
  initialize: async () => {
    try {
      const storedChecklists = await getData<Checklist[]>(STORAGE_KEYS.CHECKLISTS);
      const storedSettings = await getData<AppSettings>(STORAGE_KEYS.SETTINGS);
      const storedActiveId = await getData<string>(STORAGE_KEYS.ACTIVE_CHECKLIST);

      let checklists = storedChecklists || [];
      
      // 如果沒有清單，創建默認清單
      if (checklists.length === 0) {
        const defaultChecklist = createDefaultChecklist();
        checklists = [defaultChecklist];
      }

      const settings = storedSettings || createDefaultSettings();
      const activeId = storedActiveId || checklists[0]?.id || null;

      // 設置語言
      if (settings.language) {
        await i18n.changeLanguage(settings.language);
      }

      set({
        checklists,
        settings,
        activeChecklistId: activeId,
        isLoading: false,
      });

      // 設置通知
      await scheduleDailyNotification(settings.notification);
    } catch (error) {
      console.error('Error initializing app:', error);
      // 使用默認值
      const defaultChecklist = createDefaultChecklist();
      set({
        checklists: [defaultChecklist],
        activeChecklistId: defaultChecklist.id,
        settings: createDefaultSettings(),
        isLoading: false,
      });
    }
  },

  // 創建新清單
  createChecklist: name => {
    const newChecklist: Checklist = {
      id: generateId(),
      name,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set(state => ({
      checklists: [...state.checklists, newChecklist],
      activeChecklistId: newChecklist.id,
    }));

    get().saveToStorage();
  },

  // 刪除清單
  deleteChecklist: checklistId => {
    const state = get();
    const newChecklists = state.checklists.filter(c => c.id !== checklistId);
    
    // 如果刪除的是當前活動清單，切換到第一個清單
    const newActiveId =
      state.activeChecklistId === checklistId
        ? newChecklists[0]?.id || null
        : state.activeChecklistId;

    set({
      checklists: newChecklists,
      activeChecklistId: newActiveId,
    });

    get().saveToStorage();
  },

  // 更新清單名稱
  updateChecklistName: (checklistId, name) => {
    set(state => ({
      checklists: state.checklists.map(checklist =>
        checklist.id === checklistId
          ? {...checklist, name, updatedAt: Date.now()}
          : checklist,
      ),
    }));

    get().saveToStorage();
  },

  // 設置活動清單
  setActiveChecklist: checklistId => {
    set({activeChecklistId: checklistId});
    saveData(STORAGE_KEYS.ACTIVE_CHECKLIST, checklistId);
  },

  // 添加清單項目
  addItem: (checklistId, title, icon) => {
    const state = get();
    const checklist = state.checklists.find(c => c.id === checklistId);
    if (!checklist) return;

    const newItem: ChecklistItem = {
      id: generateId(),
      title,
      icon,
      checked: false,
      order: checklist.items.length,
      createdAt: Date.now(),
    };

    set(state => ({
      checklists: state.checklists.map(c =>
        c.id === checklistId
          ? {
              ...c,
              items: [...c.items, newItem],
              updatedAt: Date.now(),
            }
          : c,
      ),
    }));

    get().saveToStorage();
  },

  // 刪除清單項目
  deleteItem: (checklistId, itemId) => {
    set(state => ({
      checklists: state.checklists.map(c =>
        c.id === checklistId
          ? {
              ...c,
              items: c.items.filter(item => item.id !== itemId),
              updatedAt: Date.now(),
            }
          : c,
      ),
    }));

    get().saveToStorage();
  },

  // 更新清單項目
  updateItem: (checklistId, itemId, title) => {
    set(state => ({
      checklists: state.checklists.map(c =>
        c.id === checklistId
          ? {
              ...c,
              items: c.items.map(item =>
                item.id === itemId ? {...item, title} : item,
              ),
              updatedAt: Date.now(),
            }
          : c,
      ),
    }));

    get().saveToStorage();
  },

  // 切換項目勾選狀態
  toggleItemCheck: (checklistId, itemId) => {
    set(state => ({
      checklists: state.checklists.map(c =>
        c.id === checklistId
          ? {
              ...c,
              items: c.items.map(item =>
                item.id === itemId ? {...item, checked: !item.checked} : item,
              ),
              updatedAt: Date.now(),
            }
          : c,
      ),
    }));

    get().saveToStorage();
  },

  // 重置所有項目
  resetAllItems: checklistId => {
    set(state => ({
      checklists: state.checklists.map(c =>
        c.id === checklistId
          ? {
              ...c,
              items: c.items.map(item => ({...item, checked: false})),
              updatedAt: Date.now(),
            }
          : c,
      ),
    }));

    get().saveToStorage();
  },

  // 重新排序項目
  reorderItems: (checklistId, newItems) => {
    set(state => ({
      checklists: state.checklists.map(c =>
        c.id === checklistId
          ? {
              ...c,
              items: newItems.map((item, index) => ({...item, order: index})),
              updatedAt: Date.now(),
            }
          : c,
      ),
    }));

    get().saveToStorage();
  },

  // 更新通知設置
  updateNotificationSettings: (enabled, time) => {
    set(state => {
      const newSettings = {
        ...state.settings,
        notification: {
          ...state.settings.notification,
          enabled,
          ...(time && {time}),
        },
      };

      // 更新通知調度（異步執行，不阻塞狀態更新）
      scheduleDailyNotification(newSettings.notification).catch(err =>
        console.error('Error scheduling notification:', err),
      );

      return {settings: newSettings};
    });

    get().saveToStorage();
  },

  // 更新用戶權限
  updateUserPermission: permission => {
    set(state => ({
      settings: {
        ...state.settings,
        userPermission: permission,
      },
    }));

    get().saveToStorage();
  },

  // 更新語言設置
  updateLanguage: async language => {
    // 更新 i18n 語言
    await i18n.changeLanguage(language);

    set(state => ({
      settings: {
        ...state.settings,
        language,
      },
    }));

    get().saveToStorage();
  },

  // 保存到存儲
  saveToStorage: async () => {
    const state = get();
    try {
      await Promise.all([
        saveData(STORAGE_KEYS.CHECKLISTS, state.checklists),
        saveData(STORAGE_KEYS.SETTINGS, state.settings),
        saveData(STORAGE_KEYS.ACTIVE_CHECKLIST, state.activeChecklistId),
      ]);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },
}));

