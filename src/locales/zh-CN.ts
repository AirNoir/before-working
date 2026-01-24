/**
 * 简体中文语言包
 */

export default {
  // 通用
  common: {
    confirm: '确认',
    cancel: '取消',
    delete: '删除',
    save: '保存',
    edit: '编辑',
    reset: '重置',
    settings: '设置',
    close: '关闭',
    back: '返回',
    add: '新增',
    done: '完成',
  },

  // 应用名称
  app: {
    name: '出门点点名',
    englishName: 'Check Me Out',
    description: '专为解决「出门前遗忘重要物品」的焦虑而设计',
  },

  // 首页
  home: {
    title: '出门点点名',
    emptyList: '目前没有任何项目',
    emptyListHint: '点击上方输入框添加项目',
    addItemPlaceholder: '添加新项目...',
    progress: '完成进度',
    resetConfirm: '确认重置',
    resetMessage: '确定要重置所有项目为未勾选状态吗？',
    noChecklist: '没有可用的清单，请先创建一个清单',
  },

  // 设置页面
  settings: {
    title: '设置',
    notification: {
      title: '通知设置',
      dailyReminder: '每日提醒',
      reminderTime: '提醒时间',
      testNotification: '发送测试通知',
      testNotificationSent: '已发送',
      testNotificationMessage: '已发送测试通知',
      permissionDenied: '权限被拒绝',
      permissionDeniedMessage: '请在系统设置中开启通知权限',
    },
    account: {
      title: '账号权限',
      currentPermission: '当前权限',
      free: '免费版',
      premium: '付费版',
      upgradeMessage: '升级到付费版以解锁：',
      upgradeFeatures: {
        unlimited: '• 无限数量清单',
        importTemplate: '• 引入分类套组',
        cloudSync: '• 云端同步与备份',
        more: '• 更多功能即将推出...',
      },
      upgradeButton: '升级到付费版',
      comingSoon: '即将推出',
      comingSoonMessage: '付费功能即将上线，敬请期待！',
      purchaseTitle: '选择购买方式',
      purchaseLifetime: '一次性购买 (NT$ 60)',
      purchaseMonthly: '月度订阅 (NT$ 50/月)',
      purchaseYearly: '年度订阅',
      purchaseSuccess: '购买成功',
      purchaseSuccessMessage: '您已成功升级到付费版！',
      purchaseFailed: '购买失败',
      purchaseCanceled: '购买已取消',
      restorePurchases: '恢复购买',
      restoreSuccess: '恢复成功',
      restoreSuccessMessage: '已恢复您的购买内容！',
      restoreFailed: '恢复失败',
      restoreNotFound: '未找到已购买的内容',
    },
    about: {
      title: '关于应用',
      appName: '应用名称',
      version: '版本',
      description: '简介',
    },
    language: {
      title: '语言设置',
      currentLanguage: '当前语言',
      selectLanguage: '选择语言',
      zhTW: '繁体中文',
      zhCN: '简体中文',
      en: 'English',
    },
  },

  // 清单项目
  item: {
    deleteConfirm: '确认删除',
    deleteMessage: '确定要删除「{{title}}」吗？',
    emptyTitle: '项目名称不能为空',
  },

  // 通知
  notification: {
    defaultTitle: '准备出门了吗？',
    defaultBody: '请点开检查您的上班清单。',
  },

  // 默认清单项目
  defaultItems: {
    wallet: '钱包',
    keys: '钥匙',
    badge: '员工证',
    phone: '手机',
  },

  // 圖示選擇器
  iconPicker: {
    title: '选择图标',
  },
};

