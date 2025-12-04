/* eslint-disable no-undef */
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-push-notification
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  createChannel: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  checkPermissions: jest.fn(),
  requestPermissions: jest.fn(),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    State: {},
    gestureHandlerRootHOC: jest.fn(),
  };
});

