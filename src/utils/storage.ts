/**
 * AsyncStorage 封裝工具
 * 提供類型安全的本地存儲操作
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 保存數據到本地存儲
 */
export const saveData = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    throw error;
  }
};

/**
 * 從本地存儲讀取數據
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
};

/**
 * 從本地存儲刪除數據
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    throw error;
  }
};

/**
 * 清空所有本地存儲數據
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

/**
 * 獲取所有存儲的鍵名
 */
export const getAllKeys = async (): Promise<readonly string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

