/**
 * 全局應用狀態管理
 * 使用 Zustand 管理應用狀態並同步到 AsyncStorage
 */

import {create} from 'zustand';
import type {
  AppState,
  Checklist,
  ChecklistItem,
  ChecklistGroup,
  AppSettings,
  SupportedLanguage,
} from '@/types';
import {UserPermission} from '@/types';
import {STORAGE_KEYS, DEFAULT_NOTIFICATION, DEFAULT_CHECKLIST_NAME} from '@constants/config';
import {saveData, getData} from '@utils/storage';
import {generateId} from '@utils/helpers';
import {scheduleDailyNotification} from '@utils/notification';
import i18n from '@locales/index';
import {checkAndResetIfNeeded} from '@utils/reset';

interface AppStore extends AppState {
  // 初始化
  initialize: () => Promise<void>;

  // 清單操作
  createChecklist: (name: string, groupId?: string | null) => void;
  deleteChecklist: (checklistId: string) => void;
  updateChecklistName: (checklistId: string, name: string) => void;
  setActiveChecklist: (checklistId: string) => void;
  updateChecklistGroup: (checklistId: string, groupId: string | null) => void;

  // 分組操作
  createGroup: (name: string) => void;
  deleteGroup: (groupId: string) => void;
  updateGroupName: (groupId: string, name: string) => void;
  setActiveGroup: (groupId: string | null) => void;

  // 清單項目操作
  addItem: (checklistId: string, title: string, icon?: string) => void;
  deleteItem: (checklistId: string, itemId: string) => void;
  updateItem: (checklistId: string, itemId: string, title: string) => void;
  toggleItemCheck: (checklistId: string, itemId: string) => void;
  resetAllItems: (checklistId: string) => void;
  resetAllChecklists: () => void; // 重置所有清單
  resetAllItemsInGroup: (groupId: string | null) => void; // 重置指定分組下所有清單的項目
  reorderItems: (checklistId: string, newItems: ChecklistItem[]) => void;

  // 設置操作
  updateNotificationSettings: (enabled: boolean, time?: string) => void;
  updateResetTime: (time: string | null) => void;
  updateUserPermission: (permission: UserPermission) => void;
  updateLanguage: (language: SupportedLanguage) => void;
  updateClockFormat: (format: '12h' | '24h') => void;

  // 重置操作
  resetToDefaults: () => Promise<void>; // 恢復預設值

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
        title: '皮包',
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
    groupId: null,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * 創建默認設置
 */
const createDefaultSettings = (): AppSettings => ({
  notification: {...DEFAULT_NOTIFICATION},
  userPermission: UserPermission.FREE, // 默認為免費版，但目前全開啟
  theme: 'light',
  language: 'zh-TW', // 默認繁體中文
  clockFormat: '24h', // 默認24小時制
  resetTime: null, // 默認不設置重置時間
});

/**
 * Zustand Store
 */
export const useAppStore = create<AppStore>((set, get) => ({
  // 初始狀態
  checklists: [],
  groups: [],
  activeChecklistId: null,
  activeGroupId: null,
  settings: createDefaultSettings(),
  isLoading: true,

  // 初始化：從存儲加載數據
  initialize: async () => {
    try {
      const storedChecklists = await getData<Checklist[]>(STORAGE_KEYS.CHECKLISTS);
      const storedGroups = await getData<ChecklistGroup[]>(STORAGE_KEYS.GROUPS);
      const storedSettings = await getData<AppSettings>(STORAGE_KEYS.SETTINGS);
      const storedActiveId = await getData<string>(STORAGE_KEYS.ACTIVE_CHECKLIST);
      const storedActiveGroupId = await getData<string | null>(STORAGE_KEYS.ACTIVE_GROUP);

      let checklists = storedChecklists || [];
      let groups = storedGroups || [];

      // 遷移舊數據：如果清單沒有 groupId，設置為 null
      checklists = checklists.map(c => ({
        ...c,
        groupId: c.groupId ?? null,
      }));

      // 如果沒有分組，創建默認的 "上班" 分組
      let defaultGroupId: string | null = null;
      if (groups.length === 0) {
        const defaultGroup: ChecklistGroup = {
          id: generateId(),
          name: '上班',
          order: 0,
          createdAt: Date.now(),
        };
        groups = [defaultGroup];
        defaultGroupId = defaultGroup.id;
      } else {
        // 如果已有分組，找到 "上班" 分組，如果沒有則創建
        const workGroup = groups.find(g => g.name === '上班');
        if (workGroup) {
          defaultGroupId = workGroup.id;
        } else {
          const newWorkGroup: ChecklistGroup = {
            id: generateId(),
            name: '上班',
            order: groups.length,
            createdAt: Date.now(),
          };
          groups = [...groups, newWorkGroup];
          defaultGroupId = newWorkGroup.id;
        }
      }

      // 如果沒有清單，創建默認清單並分配到 "上班" 分組
      if (checklists.length === 0) {
        const defaultChecklist = createDefaultChecklist();
        // 將默認清單分配到 "上班" 分組
        defaultChecklist.groupId = defaultGroupId;
        console.log('defaultChecklist', defaultChecklist);
        checklists = [defaultChecklist];
      } else {
        // 檢查是否有清單屬於 "上班" 分組，如果沒有則創建一個
        const workGroupChecklists = checklists.filter(c => c.groupId === defaultGroupId);
        if (workGroupChecklists.length === 0) {
          // 如果 "上班" 分組下沒有清單，創建一個默認清單
          const defaultChecklist = createDefaultChecklist();
          defaultChecklist.groupId = defaultGroupId;
          checklists = [...checklists, defaultChecklist];
        } else {
          // 檢查 "上班" 分組下的清單是否有 items，如果沒有則添加默認 items
          checklists = checklists.map(c => {
            if (c.groupId === defaultGroupId && (!c.items || c.items.length === 0)) {
              const defaultChecklist = createDefaultChecklist();
              return {
                ...c,
                items: defaultChecklist.items,
                updatedAt: Date.now(),
              };
            }
            return c;
          });
        }
      }

      const settings = storedSettings || createDefaultSettings();
      // 遷移舊設置：如果沒有 resetTime，設置為 null
      if (settings.resetTime === undefined) {
        settings.resetTime = null;
      }

      // 確保活動分組是 "上班" 分組（如果存在）
      const workGroup = groups.find(g => g.name === '上班');
      const defaultActiveGroupId = workGroup?.id || groups[0]?.id || null;

      // 如果沒有設置活動分組，或活動分組不存在，默認選擇 "上班" 分組
      let activeGroupId = storedActiveGroupId;
      if (!activeGroupId || !groups.find(g => g.id === activeGroupId)) {
        activeGroupId = defaultActiveGroupId;
      }

      // 確保活動清單屬於當前選中的分組
      let activeId = storedActiveId;
      if (activeId) {
        const activeChecklist = checklists.find(c => c.id === activeId);
        if (!activeChecklist || activeChecklist.groupId !== activeGroupId) {
          // 如果活動清單不存在或不屬於當前分組，選擇該分組下的第一個清單
          const groupChecklists = checklists.filter(c => c.groupId === activeGroupId);
          activeId = groupChecklists[0]?.id || null;
        }
      } else {
        // 如果沒有設置活動清單，選擇當前分組下的第一個清單
        const groupChecklists = checklists.filter(c => c.groupId === activeGroupId);
        activeId = groupChecklists[0]?.id || null;
      }

      // 設置語言
      if (settings.language) {
        await i18n.changeLanguage(settings.language);
      }

      set({
        checklists,
        groups,
        settings,
        activeChecklistId: activeId,
        activeGroupId,
        isLoading: false,
      });

      // 保存更新後的數據到存儲
      await get().saveToStorage();

      // 設置通知
      await scheduleDailyNotification(settings.notification);

      // 檢查並執行重置（如果需要）
      await checkAndResetIfNeeded(settings.resetTime, get().resetAllChecklists);
    } catch (error) {
      console.error('Error initializing app:', error);
      // 使用默認值
      const defaultGroup: ChecklistGroup = {
        id: generateId(),
        name: '上班',
        order: 0,
        createdAt: Date.now(),
      };
      const defaultChecklist = createDefaultChecklist();
      defaultChecklist.groupId = defaultGroup.id;
      set({
        checklists: [defaultChecklist],
        groups: [defaultGroup],
        activeChecklistId: defaultChecklist.id,
        activeGroupId: defaultGroup.id,
        settings: createDefaultSettings(),
        isLoading: false,
      });
    }
  },

  // 創建新清單
  createChecklist: (name, groupId = null) => {
    const newChecklist: Checklist = {
      id: generateId(),
      name,
      items: [],
      groupId,
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
        checklist.id === checklistId ? {...checklist, name, updatedAt: Date.now()} : checklist,
      ),
    }));

    get().saveToStorage();
  },

  // 設置活動清單
  setActiveChecklist: checklistId => {
    set({activeChecklistId: checklistId});
    saveData(STORAGE_KEYS.ACTIVE_CHECKLIST, checklistId);
  },

  // 更新清單分組
  updateChecklistGroup: (checklistId, groupId) => {
    set(state => ({
      checklists: state.checklists.map(c =>
        c.id === checklistId ? {...c, groupId, updatedAt: Date.now()} : c,
      ),
    }));

    get().saveToStorage();
  },

  // 創建分組
  createGroup: name => {
    const newGroup: ChecklistGroup = {
      id: generateId(),
      name,
      order: get().groups.length,
      createdAt: Date.now(),
    };

    set(state => ({
      groups: [...state.groups, newGroup],
    }));

    get().saveToStorage();
  },

  // 刪除分組
  deleteGroup: groupId => {
    const state = get();
    const newGroups = state.groups.filter(g => g.id !== groupId);

    // 將該分組下的清單移到未分組
    const updatedChecklists = state.checklists.map(c =>
      c.groupId === groupId ? {...c, groupId: null, updatedAt: Date.now()} : c,
    );

    set({
      groups: newGroups,
      checklists: updatedChecklists,
      // 如果刪除的是當前活動分組，切換到 null（顯示所有）
      activeGroupId: state.activeGroupId === groupId ? null : state.activeGroupId,
    });

    get().saveToStorage();
  },

  // 更新分組名稱
  updateGroupName: (groupId, name) => {
    set(state => ({
      groups: state.groups.map(g => (g.id === groupId ? {...g, name} : g)),
    }));

    get().saveToStorage();
  },

  // 設置活動分組
  setActiveGroup: groupId => {
    set({activeGroupId: groupId});
    saveData(STORAGE_KEYS.ACTIVE_GROUP, groupId);
  },

  // 添加清單項目
  addItem: (checklistId, title, icon) => {
    const state = get();
    const checklist = state.checklists.find(c => c.id === checklistId);
    if (!checklist) return;

    const newItem: ChecklistItem = {
      id: generateId(),
      title,
      icon: icon || 'star', // 如果沒有選擇 icon，則使用星星作為預設
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
              items: c.items.map(item => (item.id === itemId ? {...item, title} : item)),
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

  // 重置所有清單的所有項目
  resetAllChecklists: () => {
    set(state => ({
      checklists: state.checklists.map(c => ({
        ...c,
        items: c.items.map(item => ({...item, checked: false})),
        updatedAt: Date.now(),
      })),
    }));

    get().saveToStorage();
  },

  // 清除指定分組下所有清單的項目（刪除所有 items）
  resetAllItemsInGroup: (groupId: string | null) => {
    set(state => ({
      checklists: state.checklists.map(c => {
        if (c.groupId === groupId) {
          return {
            ...c,
            items: [], // 刪除所有 items
            updatedAt: Date.now(),
          };
        }
        return c;
      }),
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

  // 更新時鐘格式設置
  updateClockFormat: format => {
    set(state => ({
      settings: {
        ...state.settings,
        clockFormat: format,
      },
    }));

    get().saveToStorage();
  },

  // 更新重置時間設置
  updateResetTime: time => {
    set(state => ({
      settings: {
        ...state.settings,
        resetTime: time,
      },
    }));

    get().saveToStorage();
  },

  // 恢復預設值
  resetToDefaults: async () => {
    const now = Date.now();

    // 創建默認的 "上班" 分組
    const defaultGroup: ChecklistGroup = {
      id: generateId(),
      name: '上班',
      order: 0,
      createdAt: now,
    };

    // 創建默認清單並分配到 "上班" 分組
    const defaultChecklist = createDefaultChecklist();
    defaultChecklist.groupId = defaultGroup.id;

    // 創建默認設置（重置時間為 AM 06:00）
    const defaultSettings: AppSettings = {
      ...createDefaultSettings(),
      resetTime: '06:00', // 設置重置時間為 AM 06:00
    };

    // 更新狀態
    set({
      checklists: [defaultChecklist],
      groups: [defaultGroup],
      activeChecklistId: defaultChecklist.id,
      activeGroupId: defaultGroup.id,
      settings: defaultSettings,
    });

    // 保存到存儲
    await get().saveToStorage();

    // 設置通知
    await scheduleDailyNotification(defaultSettings.notification);

    // 設置語言
    await i18n.changeLanguage(defaultSettings.language);
  },

  // 保存到存儲
  saveToStorage: async () => {
    const state = get();
    try {
      await Promise.all([
        saveData(STORAGE_KEYS.CHECKLISTS, state.checklists),
        saveData(STORAGE_KEYS.GROUPS, state.groups),
        saveData(STORAGE_KEYS.SETTINGS, state.settings),
        saveData(STORAGE_KEYS.ACTIVE_CHECKLIST, state.activeChecklistId),
        saveData(STORAGE_KEYS.ACTIVE_GROUP, state.activeGroupId),
      ]);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },
}));
