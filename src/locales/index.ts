/**
 * i18n 配置和語言資源
 */

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as Localization from 'expo-localization';
import zhTW from './zh-TW';
import zhCN from './zh-CN';
import en from './en';

// 語言資源
const resources = {
  'zh-TW': {translation: zhTW},
  'zh-CN': {translation: zhCN},
  en: {translation: en},
};

// 獲取系統語言，如果不在支持列表中則使用繁體中文
const getSystemLanguage = (): string => {
  try {
    const systemLocale = Localization.locale;

    // 檢查 systemLocale 是否存在
    if (!systemLocale || typeof systemLocale !== 'string') {
      return 'zh-TW'; // 默認使用繁體中文
    }

    // 檢查是否支持該語言
    if (systemLocale.startsWith('zh-TW') || systemLocale.startsWith('zh-Hant')) {
      return 'zh-TW';
    }
    if (systemLocale.startsWith('zh-CN') || systemLocale.startsWith('zh-Hans')) {
      return 'zh-CN';
    }
    if (systemLocale.startsWith('en')) {
      return 'en';
    }
  } catch (error) {
    console.warn('Error getting system language:', error);
  }

  // 默認使用繁體中文
  return 'zh-TW';
};

// 初始化 i18n
i18n.use(initReactI18next).init({
  resources,
  lng: getSystemLanguage(), // 默認語言
  fallbackLng: 'zh-TW', // 回退語言（繁體中文）
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false, // React 已經處理了轉義
  },
});

export default i18n;

// 導出支持的語言列表
export const supportedLanguages = [
  {code: 'zh-TW', name: '繁體中文'},
  {code: 'zh-CN', name: '简体中文'},
  {code: 'en', name: 'English'},
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number]['code'];
