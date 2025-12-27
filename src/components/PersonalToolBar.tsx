/**
 * 個人工具欄組件
 * 包含翻頁時鐘和時鐘格式切換功能
 */

import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {FlipClock} from './FlipClock';
import {useAppStore} from '@store/useAppStore';
import {COLORS} from '@constants/colors';

export const PersonalToolBar: React.FC = () => {
  const clockFormat = useAppStore(state => state.settings.clockFormat);
  const updateClockFormat = useAppStore(state => state.updateClockFormat);

  const toggleClockFormat = () => {
    const newFormat = clockFormat === '24h' ? '12h' : '24h';
    updateClockFormat(newFormat);
  };

  return (
    <View
      className="bg-white px-4 py-2 flex-row items-center justify-between border-b border-gray-200"
      style={styles.container}>
      {/* 左側：翻頁時鐘 */}
      <View className="flex-1">
        <FlipClock format={clockFormat} />
      </View>

      {/* 右側：時鐘格式切換按鈕 */}
      <TouchableOpacity
        onPress={toggleClockFormat}
        className="flex-row items-center px-3 py-1.5 rounded-md bg-[#FFD8BE]"
        activeOpacity={0.7}>
        <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.blue[500]} />
        <Text className="text-blue-500 ml-1 text-xs font-semibold">
          {clockFormat === '24h' ? '24H' : '12H'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // 只保留 shadow 屬性，因為 NativeWind 在 React Native 中對 shadow 的支持有限
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});
