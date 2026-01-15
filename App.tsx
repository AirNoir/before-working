/**
 * 應用主入口
 */

import React, {useEffect} from 'react';
import {StatusBar, AppState} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppStore} from './src/store/useAppStore';
import {HomeScreen, SettingsScreen} from './src/screens';
import {initializeNotifications} from './src/utils/notification';
import {checkAndResetIfNeeded} from './src/utils/reset';
import {COLORS} from './src/constants/colors';

// NativeWind 配置
import './global.css';

// i18n 配置
import './src/locales';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const initialize = useAppStore(state => state.initialize);
  const isLoading = useAppStore(state => state.isLoading);
  const settings = useAppStore(state => state.settings);
  const resetAllChecklists = useAppStore(state => state.resetAllChecklists);

  useEffect(() => {
    // 初始化應用
    const initApp = async () => {
      // 初始化通知系統
      await initializeNotifications();

      // 初始化應用狀態
      await initialize();
    };

    initApp();
  }, [initialize]);

  // 監聽應用狀態變化，當應用從後台恢復時檢查重置時間
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // 應用進入前台時檢查重置時間
        checkAndResetIfNeeded(settings.resetTime, resetAllChecklists).catch(err =>
          console.error('Error checking reset time on app state change:', err),
        );
      }
    });

    return () => {
      subscription.remove();
    };
  }, [settings.resetTime, resetAllChecklists]);

  if (isLoading) {
    // 可以在這裡添加啟動畫面
    return null;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
