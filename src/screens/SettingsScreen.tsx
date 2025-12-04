/**
 * 設置頁面
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useAppStore} from '@store/useAppStore';
import {Header, Button} from '@components/index';
import {COLORS} from '@constants/colors';
import {APP_INFO} from '@constants/config';
import {
  requestNotificationPermission,
  sendTestNotification,
} from '@utils/notification';
import {parseTimeString, formatTime} from '@utils/helpers';
import {getPermissionDescription, isPremiumUser} from '@utils/permission';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const {settings, updateNotificationSettings} = useAppStore();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(
    parseTimeString(settings.notification.time),
  );

  const handleToggleNotification = async (value: boolean) => {
    if (value) {
      // 請求通知權限
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert('權限被拒絕', '請在系統設置中開啟通知權限');
        return;
      }
    }
    updateNotificationSettings(value);
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }

    if (selectedDate) {
      setTempTime(selectedDate);
      if (Platform.OS === 'android') {
        updateNotificationSettings(settings.notification.enabled, formatTime(selectedDate));
      }
    }
  };

  const handleTimeConfirm = () => {
    setShowTimePicker(false);
    updateNotificationSettings(settings.notification.enabled, formatTime(tempTime));
  };

  const handleTestNotification = () => {
    sendTestNotification('測試通知', '這是一個測試通知，確認通知功能正常運作');
    Alert.alert('已發送', '已發送測試通知');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title="設置"
        leftButton={{icon: '←', onPress: () => navigation.goBack()}}
      />

      <ScrollView className="flex-1">
        {/* 通知設置區塊 */}
        <View className="bg-white mt-4 mx-4 rounded-lg p-4">
          <Text className="text-textPrimary font-bold text-lg mb-3">通知設置</Text>

          {/* 開啟通知 */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-textPrimary text-base">每日提醒</Text>
            <Switch
              value={settings.notification.enabled}
              onValueChange={handleToggleNotification}
              trackColor={{false: COLORS.gray[300], true: COLORS.primary}}
              thumbColor={COLORS.backgroundAlt}
            />
          </View>

          {/* 提醒時間 */}
          {settings.notification.enabled && (
            <>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-textPrimary text-base">提醒時間</Text>
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                  <Text className="text-primary text-base font-semibold">
                    {settings.notification.time}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 時間選擇器 */}
              {showTimePicker && (
                <View>
                  <DateTimePicker
                    value={tempTime}
                    mode="time"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleTimeChange}
                  />
                  {Platform.OS === 'ios' && (
                    <Button
                      title="確認"
                      onPress={handleTimeConfirm}
                      className="mt-2"
                    />
                  )}
                </View>
              )}

              {/* 測試通知按鈕 */}
              <Button
                title="發送測試通知"
                variant="outline"
                onPress={handleTestNotification}
              />
            </>
          )}
        </View>

        {/* 權限信息區塊 */}
        <View className="bg-white mt-4 mx-4 rounded-lg p-4">
          <Text className="text-textPrimary font-bold text-lg mb-3">帳號權限</Text>

          <View className="bg-background rounded-lg p-3 mb-3">
            <Text className="text-textPrimary text-sm mb-1">當前權限</Text>
            <Text className="text-primary font-semibold text-base">
              {getPermissionDescription(settings.userPermission)}
            </Text>
          </View>

          {!isPremiumUser(settings.userPermission) && (
            <>
              <Text className="text-gray-500 text-sm mb-3">
                升級到付費版以解鎖：{'\n'}
                • 無限數量清單{'\n'}
                • 雲端同步與備份{'\n'}
                • 更多功能即將推出...
              </Text>
              <Button
                title="升級到付費版"
                variant="success"
                onPress={() =>
                  Alert.alert('即將推出', '付費功能即將上線，敬請期待！')
                }
              />
            </>
          )}
        </View>

        {/* 關於區塊 */}
        <View className="bg-white mt-4 mx-4 rounded-lg p-4 mb-6">
          <Text className="text-textPrimary font-bold text-lg mb-3">關於應用</Text>

          <View className="mb-2">
            <Text className="text-gray-500 text-sm">應用名稱</Text>
            <Text className="text-textPrimary text-base font-semibold">
              {APP_INFO.name} ({APP_INFO.englishName})
            </Text>
          </View>

          <View className="mb-2">
            <Text className="text-gray-500 text-sm">版本</Text>
            <Text className="text-textPrimary text-base">{APP_INFO.version}</Text>
          </View>

          <View>
            <Text className="text-gray-500 text-sm">簡介</Text>
            <Text className="text-textPrimary text-base">
              {APP_INFO.description}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

