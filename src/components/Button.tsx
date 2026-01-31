/**
 * 通用按鈕組件
 */

import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, View} from 'react-native';
import {COLORS} from '@constants/colors';

type ButtonVariant = 'primary' | 'warning' | 'success' | 'outline';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  textClassName?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  className = '',
  textClassName,
}) => {
  // NativeWind 在處理動態 className（含函式/插值）時，某些情況可能不保證同類型 utility
  // 的覆蓋順序（例如 bg-*）。為了讓外部傳入的 bg-* 一定生效，若 className 有指定背景色，
  // 就不在 variant 預設樣式裡再塞一個 bg-*。
  const hasCustomBgClass = /\bbg-[^\s]+\b/.test(className);

  const getButtonStyle = () => {
    const baseStyle = 'px-6 py-3 rounded-lg flex-row items-center justify-center';

    switch (variant) {
      case 'primary':
        return `${baseStyle} ${hasCustomBgClass ? '' : 'bg-primary'}`.trim();
      case 'warning':
        return `${baseStyle} ${hasCustomBgClass ? '' : 'bg-warning'}`.trim();
      case 'success':
        return `${baseStyle} ${hasCustomBgClass ? '' : 'bg-success'}`.trim();
      case 'outline':
        return `${baseStyle} ${hasCustomBgClass ? '' : 'bg-transparent'} border-2 border-primary`.trim();
      default:
        return `${baseStyle} ${hasCustomBgClass ? '' : 'bg-primary'}`.trim();
    }
  };

  const getTextStyle = () => {
    if (variant === 'outline') {
      return 'text-primary font-semibold text-base';
    }
    return 'text-white font-semibold text-base';
  };

  return (
    <TouchableOpacity
      className={`${getButtonStyle()} ${disabled || loading ? 'opacity-50' : ''} ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : '#FFFFFF'} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={textClassName || getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
