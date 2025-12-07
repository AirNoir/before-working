/**
 * 應用主入口
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppStore} from './src/store/useAppStore';
import {HomeScreen, SettingsScreen} from './src/screens';
import {initializeNotifications} from './src/utils/notification';
import {COLORS} from './src/constants/colors';

// NativeWind 配置
import './global.css';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const initialize = useAppStore(state => state.initialize);
  const isLoading = useAppStore(state => state.isLoading);

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

  if (isLoading) {
    // 可以在這裡添加啟動畫面
    return null;
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
      />
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

