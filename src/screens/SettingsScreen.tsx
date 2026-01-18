/**
 * 設置頁面
 */

import React, {useState, useEffect} from 'react';
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
import {useTranslation} from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useAppStore} from '@store/useAppStore';
import {Header, Button} from '@components/index';
import {COLORS} from '@constants/colors';
import {APP_INFO} from '@constants/config';
import {requestNotificationPermission, sendTestNotification} from '@utils/notification';
import {parseTimeString, formatTime, formatTimeForDisplay} from '@utils/helpers';
import {getPermissionDescription, isPremiumUser} from '@utils/permission';
import {supportedLanguages, type SupportedLanguage} from '@locales/index';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {settings, updateNotificationSettings, updateLanguage, updateResetTime, resetToDefaults} =
    useAppStore();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showResetTimePicker, setShowResetTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(parseTimeString(settings.notification.time));
  const [tempResetTime, setTempResetTime] = useState(
    settings.resetTime ? parseTimeString(settings.resetTime) : new Date(),
  );

  // 當設置中的時間或時鐘格式改變時，更新臨時時間狀態
  useEffect(() => {
    setTempTime(parseTimeString(settings.notification.time));
    // 如果時間選擇器是打開的，關閉它以確保顯示正確
    if (showTimePicker) {
      setShowTimePicker(false);
    }
  }, [settings.notification.time, settings.clockFormat]);

  useEffect(() => {
    if (settings.resetTime) {
      setTempResetTime(parseTimeString(settings.resetTime));
    }
    // 如果重置時間選擇器是打開的，關閉它以確保顯示正確
    if (showResetTimePicker) {
      setShowResetTimePicker(false);
    }
  }, [settings.resetTime, settings.clockFormat]);

  const handleToggleNotification = async (value: boolean) => {
    if (value) {
      // 請求通知權限
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          t('settings.notification.permissionDenied'),
          t('settings.notification.permissionDeniedMessage'),
        );
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

  const handleTestNotification = async () => {
    await sendTestNotification(
      t('settings.notification.testNotification'),
      t('settings.notification.testNotificationMessage'),
    );
    Alert.alert(
      t('settings.notification.testNotificationSent'),
      t('settings.notification.testNotificationMessage'),
    );
  };

  const handleLanguageChange = (language: SupportedLanguage) => {
    updateLanguage(language);
  };

  const handleResetTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowResetTimePicker(false);
    }

    if (selectedDate) {
      setTempResetTime(selectedDate);
      if (Platform.OS === 'android') {
        updateResetTime(formatTime(selectedDate));
      }
    }
  };

  const handleResetTimeConfirm = () => {
    setShowResetTimePicker(false);
    updateResetTime(formatTime(tempResetTime));
  };

  const handleDisableResetTime = () => {
    updateResetTime(null);
  };

  const handleResetToDefaults = () => {
    Alert.alert(t('settings.resetToDefaults.confirm'), t('settings.resetToDefaults.message'), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: async () => {
          await resetToDefaults();
          Alert.alert(
            t('settings.resetToDefaults.success'),
            t('settings.resetToDefaults.successMessage'),
          );
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        title={t('settings.title')}
        leftButton={{icon: 'arrow-left', onPress: () => navigation.goBack()}}
      />

      <ScrollView className="flex-1">
        {/* 通知設置區塊 */}
        <View className="bg-white mt-4 mx-4 rounded-lg p-4">
          <Text className="text-textPrimary font-bold text-lg mb-3">
            {t('settings.notification.title')}
          </Text>

          {/* 開啟通知 */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-textPrimary text-base">
              {t('settings.notification.dailyReminder')}
            </Text>
            <Switch
              value={settings.notification.enabled}
              onValueChange={handleToggleNotification}
              trackColor={{false: COLORS.gray[300], true: COLORS.primary}}
              thumbColor={COLORS.blue[600]}
            />
          </View>

          {/* 提醒時間 */}
          {settings.notification.enabled && (
            <>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-textPrimary text-base">
                  {t('settings.notification.reminderTime')}
                </Text>
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                  <Text className="text-blue-600 text-base font-semibold">
                    {formatTimeForDisplay(settings.notification.time, settings.clockFormat)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 時間選擇器 */}
              {showTimePicker && (
                <View>
                  <DateTimePicker
                    value={tempTime}
                    mode="time"
                    is24Hour={settings.clockFormat === '24h'}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleTimeChange}
                  />
                  {Platform.OS === 'ios' && (
                    <Button
                      title={t('common.confirm')}
                      onPress={handleTimeConfirm}
                      className="mt-2 bg-blue-700"
                    />
                  )}
                </View>
              )}

              {/* 測試通知按鈕 */}
              {/* <Button
                title={t('settings.notification.testNotification')}
                variant="outline"
                textClassName="text-red-400"
                className="border-2 border-red-300"
                onPress={handleTestNotification}
              /> */}
            </>
          )}
        </View>

        {/* 重置時間設置區塊 */}
        <View className="bg-white mt-4 mx-4 rounded-lg p-4">
          <Text className="text-textPrimary font-bold text-lg mb-3">
            {t('settings.resetTime.title')}
          </Text>

          <View className="mb-4">
            <Text className="text-textPrimary text-base mb-2">
              {t('settings.resetTime.description')}
            </Text>
          </View>

          {/* 重置時間選擇 */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-textPrimary text-base">{t('settings.resetTime.resetTime')}</Text>
            {settings.resetTime ? (
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => setShowResetTimePicker(true)}>
                  <Text className="text-blue-600 text-base font-semibold mr-3">
                    {formatTimeForDisplay(settings.resetTime, settings.clockFormat)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDisableResetTime}>
                  <Text className="text-warning text-sm">{t('settings.resetTime.disable')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setShowResetTimePicker(true)}>
                <Text className="text-gray-400 text-base">{t('settings.resetTime.notSet')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 重置時間選擇器 */}
          {showResetTimePicker && (
            <View>
              <DateTimePicker
                value={tempResetTime}
                mode="time"
                is24Hour={settings.clockFormat === '24h'}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleResetTimeChange}
              />
              {Platform.OS === 'ios' && (
                <View className="flex-row gap-2 mt-2">
                  <Button
                    title={t('common.confirm')}
                    onPress={handleResetTimeConfirm}
                    className="flex-1 bg-blue-700"
                  />
                  <Button
                    title={t('common.cancel')}
                    variant="outline"
                    onPress={() => setShowResetTimePicker(false)}
                    className="flex-1"
                  />
                </View>
              )}
            </View>
          )}
        </View>

        {/* 語言設置區塊 */}
        <View className="bg-white mt-4 mx-4 rounded-lg p-4">
          <Text className="text-textPrimary font-bold text-lg mb-3">
            {t('settings.language.title')}
          </Text>

          <View className="bg-background rounded-lg p-3 mb-3">
            <Text className="text-textPrimary text-sm mb-1">
              {t('settings.language.currentLanguage')}
            </Text>
            <Text className="text-blue-600 font-semibold text-base">
              {supportedLanguages.find(lang => lang.code === settings.language)?.name ||
                t('settings.language.zhTW')}
            </Text>
          </View>

          <View className="mt-2">
            {supportedLanguages.map(lang => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageChange(lang.code)}
                className={`p-3 mb-2 rounded-lg border-2 ${
                  settings.language === lang.code
                    ? 'border-blue-600 bg-primary/10'
                    : 'border-gray-200 bg-white'
                }`}>
                <Text
                  className={`text-base ${
                    settings.language === lang.code
                      ? 'text-blue-600 font-semibold'
                      : 'text-textPrimary'
                  }`}>
                  {lang.name}
                  {settings.language === lang.code && ' ✓'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 權限信息區塊 */}
        <View className="bg-white mt-4 mx-4 rounded-lg p-4">
          <Text className="text-textPrimary font-bold text-lg mb-3">
            {t('settings.account.title')}
          </Text>

          <View className="bg-background rounded-lg p-3 mb-3">
            <Text className="text-textPrimary text-sm mb-1">
              {t('settings.account.currentPermission')}
            </Text>
            <Text className="text-blue-600 font-semibold text-base">
              {getPermissionDescription(settings.userPermission)}
            </Text>
          </View>

          {!isPremiumUser(settings.userPermission) && (
            <>
              <Text className="text-gray-500 text-sm mb-3">
                {t('settings.account.upgradeMessage')}
                {'\n'}
                {t('settings.account.upgradeFeatures.unlimited')}
                {'\n'}
                {t('settings.account.upgradeFeatures.cloudSync')}
                {'\n'}
                {t('settings.account.upgradeFeatures.more')}
              </Text>
              <Button
                title={t('settings.account.upgradeButton')}
                variant="success"
                onPress={() =>
                  Alert.alert(
                    t('settings.account.comingSoon'),
                    t('settings.account.comingSoonMessage'),
                  )
                }
              />
            </>
          )}
        </View>

        {/* 恢復預設值區塊 */}
        <View className="bg-white mt-4 mx-4 rounded-lg p-4">
          <Text className="text-textPrimary font-bold text-lg mb-3">
            {t('settings.resetToDefaults.title')}
          </Text>

          <View className="mb-4">
            <Text className="text-textPrimary text-base mb-2">
              {t('settings.resetToDefaults.description')}
            </Text>
          </View>

          <Button
            title={t('settings.resetToDefaults.button')}
            variant="outline"
            onPress={handleResetToDefaults}
            className="border-2 border-warning"
            textClassName="text-warning font-semibold"
          />
        </View>

        {/* 關於區塊 */}
        <View className="bg-white mt-4 mx-4 rounded-lg p-4 mb-6">
          <Text className="text-textPrimary font-bold text-lg mb-3">
            {t('settings.about.title')}
          </Text>

          <View className="mb-2">
            <Text className="text-gray-500 text-sm">{t('settings.about.appName')}</Text>
            <Text className="text-textPrimary text-base font-semibold">
              {t('app.name')} ({t('app.englishName')})
            </Text>
          </View>

          <View className="mb-2">
            <Text className="text-gray-500 text-sm">{t('settings.about.version')}</Text>
            <Text className="text-textPrimary text-base">{APP_INFO.version}</Text>
          </View>

          <View>
            <Text className="text-gray-500 text-sm">{t('settings.about.description')}</Text>
            <Text className="text-textPrimary text-base">{t('app.description')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
