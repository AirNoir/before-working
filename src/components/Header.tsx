/**
 * 應用標題欄組件
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {COLORS} from '@constants/colors';
import {useWeather} from '@hooks/useWeather';

interface HeaderProps {
  title: string;
  leftButton?: {
    icon: string; // MDI 图标名称
    onPress: () => void;
  };
  rightButton?: {
    icon: string; // MDI 图标名称
    onPress: () => void;
  };
}

export const Header: React.FC<HeaderProps> = ({title, leftButton, rightButton}) => {
  const {weather, loading, icon} = useWeather();

  return (
    <View className="bg-primary px-4 py-4 flex-row justify-between items-center" style={styles.header}>
      {/* 左側區域：按鈕 + 天氣 */}
      <View className="flex-row items-center" style={styles.leftSection}>
        {/* 左側按鈕 */}
        {leftButton && (
          <TouchableOpacity onPress={leftButton.onPress} className="p-2">
            <MaterialCommunityIcons
              name={leftButton.icon as any}
              size={24}
              color={COLORS.backgroundAlt}
            />
          </TouchableOpacity>
        )}

        {/* 天氣資訊 */}
        <View className="flex-row items-center ml-2">
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.backgroundAlt} />
          ) : weather ? (
            <>
              <MaterialCommunityIcons
                name={icon as any}
                size={28}
                color={COLORS.backgroundAlt}
              />
              <Text className="text-white text-xl font-semibold ml-1.5">
                {weather.temperature}°C
              </Text>
            </>
          ) : null}
        </View>
      </View>

      {/* 標題（居中） */}
      <View className="flex-1 items-center" style={styles.centerSection}>
        <Text className="text-white text-xl font-bold" numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* 右側按鈕 */}
      <View className="flex-row items-center" style={styles.rightSection}>
        {rightButton && (
          <TouchableOpacity onPress={rightButton.onPress} className="p-2">
            <MaterialCommunityIcons
              name={rightButton.icon as any}
              size={24}
              color={COLORS.backgroundAlt}
            />
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
  leftSection: {
    minWidth: 100,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
  },
  rightSection: {
    minWidth: 50,
    justifyContent: 'flex-end',
  },
});

