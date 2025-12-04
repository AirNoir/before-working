/**
 * 應用標題欄組件
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '@constants/colors';

interface HeaderProps {
  title: string;
  leftButton?: {
    icon: string;
    onPress: () => void;
  };
  rightButton?: {
    icon: string;
    onPress: () => void;
  };
}

export const Header: React.FC<HeaderProps> = ({title, leftButton, rightButton}) => {
  return (
    <View className="bg-primary px-4 py-4 flex-row items-center justify-between" style={styles.header}>
      {/* 左側按鈕 */}
      <View className="w-10">
        {leftButton && (
          <TouchableOpacity onPress={leftButton.onPress} className="p-2">
            <Text className="text-white text-xl">{leftButton.icon}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 標題 */}
      <Text className="text-white text-xl font-bold">{title}</Text>

      {/* 右側按鈕 */}
      <View className="w-10">
        {rightButton && (
          <TouchableOpacity onPress={rightButton.onPress} className="p-2">
            <Text className="text-white text-xl">{rightButton.icon}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
});

