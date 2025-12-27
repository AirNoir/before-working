/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // 專案配色方案
        primary: '#D6EAF8', // 天空藍/青色 - 主色
        background: '#F2EFE9', // 中性背景色
        backgroundAlt: '#DDD', // 替代背景色（純白）
        textPrimary: '#333333', // 文字主色
        textDark: '#000000', // 深色文字
        success: '#5CB85C', // 成功色（柔和綠）
        warning: '#FF6347', // 警告/動作色（柔和橘紅）
        lavender: '#D6BCFA',
        navy: '#2C3E50',
      },
    },
  },
  plugins: [],
};
