/**
 * 本地推播通知工具
 * 處理定時提醒功能
 */

import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';
import {NOTIFICATION_CHANNEL} from '@constants/config';
import type {NotificationSettings} from '@types/index';

/**
 * 初始化通知系統
 */
export const initializeNotifications = (): void => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });

  // Android 需要創建通知頻道
  if (Platform.OS === 'android') {
    PushNotification.createChannel(
      {
        channelId: NOTIFICATION_CHANNEL.id,
        channelName: NOTIFICATION_CHANNEL.name,
        channelDescription: NOTIFICATION_CHANNEL.description,
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`Channel created: ${created}`),
    );
  }
};

/**
 * 請求通知權限
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return new Promise(resolve => {
      PushNotification.checkPermissions(permissions => {
        if (permissions.alert) {
          resolve(true);
        } else {
          PushNotification.requestPermissions().then(result => {
            resolve(result.alert === true);
          });
        }
      });
    });
  }
  return true; // Android 不需要運行時權限
};

/**
 * 調度每日通知
 */
export const scheduleDailyNotification = (settings: NotificationSettings): void => {
  if (!settings.enabled) {
    cancelAllNotifications();
    return;
  }

  // 解析時間 "HH:mm"
  const [hours, minutes] = settings.time.split(':').map(Number);
  
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  // 如果今天的時間已過，則安排到明天
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  // 取消所有現有通知
  cancelAllNotifications();

  // 調度新通知
  PushNotification.localNotificationSchedule({
    channelId: NOTIFICATION_CHANNEL.id,
    title: settings.title,
    message: settings.body,
    date: scheduledTime,
    allowWhileIdle: true,
    repeatType: 'day', // 每天重複
    playSound: true,
    soundName: 'default',
  });

  console.log(`Notification scheduled for ${scheduledTime.toLocaleString()}`);
};

/**
 * 取消所有通知
 */
export const cancelAllNotifications = (): void => {
  PushNotification.cancelAllLocalNotifications();
  console.log('All notifications cancelled');
};

/**
 * 檢查通知權限狀態
 */
export const checkNotificationPermission = (): Promise<boolean> => {
  return new Promise(resolve => {
    PushNotification.checkPermissions(permissions => {
      resolve(permissions.alert === true);
    });
  });
};

/**
 * 立即發送測試通知
 */
export const sendTestNotification = (title: string, body: string): void => {
  PushNotification.localNotification({
    channelId: NOTIFICATION_CHANNEL.id,
    title,
    message: body,
    playSound: true,
    soundName: 'default',
  });
};

