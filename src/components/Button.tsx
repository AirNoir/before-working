/**
 * 通用按鈕組件
 */

import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, StyleSheet} from 'react-native';
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
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  className = '',
}) => {
  const getButtonStyle = () => {
    const baseStyle = 'px-6 py-3 rounded-lg flex-row items-center justify-center';
    
    switch (variant) {
      case 'primary':
        return `${baseStyle} bg-primary`;
      case 'warning':
        return `${baseStyle} bg-warning`;
      case 'success':
        return `${baseStyle} bg-success`;
      case 'outline':
        return `${baseStyle} bg-transparent border-2 border-primary`;
      default:
        return `${baseStyle} bg-primary`;
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
          {icon && <>{icon}</>}
          <Text className={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

