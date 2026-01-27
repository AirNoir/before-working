/**
 * 本地推播通知工具
 * 處理定時提醒功能
 * 使用 Expo Notifications API
 */

import * as Notifications from 'expo-notifications';
import {Platform} from 'react-native';
import {NOTIFICATION_CHANNEL} from '@constants/config';
import type {NotificationSettings} from '@types/index';

/**
 * 配置通知行為
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * 初始化通知系統
 */
export const initializeNotifications = async (): Promise<void> => {
  // 請求通知權限
  await requestNotificationPermission();

  // Android 需要創建通知頻道
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL.id, {
      name: NOTIFICATION_CHANNEL.name,
      description: NOTIFICATION_CHANNEL.description,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0ABAB5',
      sound: 'default',
    });
  }
};

/**
 * 請求通知權限
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * 調度每日通知
 */
export const scheduleDailyNotification = async (
  settings: NotificationSettings,
): Promise<void> => {
  if (!settings.enabled) {
    await cancelAllNotifications();
    return;
  }

  // 解析時間 "HH:mm"
  const [hours, minutes] = settings.time.split(':').map(Number);

  // 取消所有現有通知
  await cancelAllNotifications();

  // 使用每日觸發器（每天在指定時間觸發）
  await Notifications.scheduleNotificationAsync({
    content: {
      title: settings.title,
      body: settings.body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === 'android' && { channelId: NOTIFICATION_CHANNEL.id }),
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
      channelId: Platform.OS === 'android' ? NOTIFICATION_CHANNEL.id : undefined,
    },
  });

};

/**
 * 取消所有通知
 */
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * 檢查通知權限狀態
 */
export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    const {status} = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permission:', error);
    return false;
  }
};

/**
 * 立即發送測試通知
 */
export const sendTestNotification = async (title: string, body: string): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === 'android' && { channelId: NOTIFICATION_CHANNEL.id }),
    },
    trigger: { seconds: 1 }, // 1秒後發送（立即發送效果）
  });
};

