/**
 * 應用程式配色方案
 * 依據規格書定義的五種顏色
 */

export const COLORS = {
  // 基底主色 (Primary) - 天空藍/青色
  primary: '#D6EAF8',

  // 中性背景色 (Neutral BG)
  background: '#F4F4F4',
  backgroundAlt: '#2C3E50',

  // 文字顏色 (Text)
  textPrimary: '#333333',
  textDark: '#000000',

  // 輔助色/成功色 (Success) - 柔和綠
  success: '#5CB85C',

  // 輔助色/動作色 (Accent) - 柔和橘紅
  warning: '#FF6347',

  // 其他常用色
  gray: {
    100: '#F7F7F7',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
  },

  blue: {
    100: '#eef2ff',
    200: '#e0e7ff',
    300: '#c7d2fe',
    400: '#a5b4fc',
    500: '#818cf8',
    600: '#6366f1',
    700: '#4f46e5',
    800: '#4338ca',
    900: '#3730a3',
  },
  orange: {
    200: '#FFA500',
  },
} as const;

export type ColorScheme = typeof COLORS;
