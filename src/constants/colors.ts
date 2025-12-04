/**
 * 應用程式配色方案
 * 依據規格書定義的五種顏色
 */

export const COLORS = {
  // 基底主色 (Primary) - 天空藍/青色
  primary: '#0ABAB5',
  
  // 中性背景色 (Neutral BG)
  background: '#F4F4F4',
  backgroundAlt: '#FFFFFF',
  
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
} as const;

export type ColorScheme = typeof COLORS;

