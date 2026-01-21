/**
 * English Language Pack
 */

export default {
  // Common
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    save: 'Save',
    edit: 'Edit',
    reset: 'Reset',
    settings: 'Settings',
    close: 'Close',
    back: 'Back',
    add: 'Add',
    done: 'Done',
  },

  // App Name
  app: {
    name: 'Check Me Out',
    englishName: 'Check Me Out',
    description: 'Designed to solve the anxiety of forgetting important items before going out',
  },

  // Home Screen
  home: {
    title: 'Check Me Out',
    emptyList: 'No items yet',
    emptyListHint: 'Tap the input above to add items',
    addItemPlaceholder: 'Add new item...',
    progress: 'Progress',
    resetConfirm: 'Confirm Reset',
    resetMessage: 'Are you sure you want to reset all items to unchecked?',
    noChecklist: 'No checklist available. Please create one first.',
  },

  // Settings Screen
  settings: {
    title: 'Settings',
    notification: {
      title: 'Notification Settings',
      dailyReminder: 'Daily Reminder',
      reminderTime: 'Reminder Time',
      testNotification: 'Send Test Notification',
      testNotificationSent: 'Sent',
      testNotificationMessage: 'Test notification sent',
      permissionDenied: 'Permission Denied',
      permissionDeniedMessage: 'Please enable notification permission in system settings',
    },
    account: {
      title: 'Account Permission',
      currentPermission: 'Current Permission',
      free: 'Free',
      premium: 'Premium',
      upgradeMessage: 'Upgrade to Premium to unlock:',
      upgradeFeatures: {
        unlimited: '• Unlimited Checklists',
        importTemplate: '• Import Template',
        cloudSync: '• Cloud Sync & Backup',
        more: '• More features coming soon...',
      },
      upgradeButton: 'Upgrade to Premium',
      comingSoon: 'Coming Soon',
      comingSoonMessage: 'Premium features coming soon, stay tuned!',
    },
    about: {
      title: 'About App',
      appName: 'App Name',
      version: 'Version',
      description: 'Description',
    },
    language: {
      title: 'Language Settings',
      currentLanguage: 'Current Language',
      selectLanguage: 'Select Language',
      zhTW: '繁體中文',
      zhCN: '简体中文',
      en: 'English',
    },
  },

  // Checklist Item
  item: {
    deleteConfirm: 'Confirm Delete',
    deleteMessage: 'Are you sure you want to delete "{{title}}"?',
    emptyTitle: 'Item name cannot be empty',
  },

  // Notification
  notification: {
    defaultTitle: 'Ready to go out?',
    defaultBody: 'Please check your checklist.',
  },

  // Default Items
  defaultItems: {
    wallet: 'Wallet',
    keys: 'Keys',
    badge: 'Badge',
    phone: 'Phone',
  },

  // Icon Picker
  iconPicker: {
    title: 'Select Icon',
  },
};

