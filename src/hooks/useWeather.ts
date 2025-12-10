/**
 * 天氣資料 Hook
 * 取得目前位置並取得天氣資料
 */

import {useState, useEffect} from 'react';
import * as Location from 'expo-location';
import {fetchWeatherByLocation, getWeatherIcon} from '@utils/weather';
import type {WeatherData} from '@types/index';

// 台灣主要城市列表（用於根據座標推斷城市）
const TAIWAN_CITIES = [
  '臺北市',
  '新北市',
  '桃園市',
  '台中市',
  '台南市',
  '高雄市',
  '基隆市',
  '新竹市',
  '嘉義市',
  '新竹縣',
  '苗栗縣',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義縣',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '台東縣',
  '澎湖縣',
  '金門縣',
  '連江縣',
];

/**
 * 根据经纬度推断最接近的城市
 * 简化版：直接返回台北市（可根据实际需求改进）
 */
function getCityFromCoordinates(latitude: number, longitude: number): string {
  // 這裡可以加入更精確的地理位置判斷邏輯
  // 暫時回傳台北市作為預設值
  return '臺北市';
}

interface UseWeatherOptions {
  refreshInterval?: number; // 重新整理間隔（毫秒），預設 30 分鐘
  autoRefresh?: boolean; // 是否自動重新整理，預設 true
}

export function useWeather(options: UseWeatherOptions = {}) {
  const {refreshInterval = 30 * 60 * 1000, autoRefresh = true} = options;

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchWeather = async () => {
      try {
        if (!mounted) return;
        setLoading(true);
        setError(null);

        // 請求位置權限
        const {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!mounted) return;
          setError('位置權限未授予');
          setLoading(false);
          // 如果沒有權限，使用預設城市
          const defaultCity = '臺北市';
          const weatherData = await fetchWeatherByLocation(defaultCity);
          if (weatherData && mounted) {
            setWeather(weatherData);
          }
          return;
        }

        // 取得目前位置
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!mounted) return;

        // 根據座標推斷城市
        const cityName = getCityFromCoordinates(
          location.coords.latitude,
          location.coords.longitude,
        );

        // 取得天氣資料
        const weatherData = await fetchWeatherByLocation(cityName);
        if (!mounted) return;
        
        if (weatherData) {
          setWeather(weatherData);
        } else {
          setError('無法獲取天氣資料');
        }
      } catch (err) {
        if (!mounted) return;
        const errorMessage =
          err instanceof Error ? err.message : '獲取天氣資料失敗';
        setError(errorMessage);
        console.error('Weather fetch error:', err);
        // 發生錯誤時嘗試使用預設城市
        try {
          const defaultCity = '臺北市';
          const weatherData = await fetchWeatherByLocation(defaultCity);
          if (weatherData && mounted) {
            setWeather(weatherData);
            setError(null);
          }
        } catch (fallbackErr) {
          console.error('Fallback weather fetch error:', fallbackErr);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // 初始載入
    fetchWeather();

    // 設定自動重新整理
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchWeather();
      }, refreshInterval);
    }

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, refreshInterval]);

  const refresh = () => {
    // 重新獲取天氣資料的函數
    // 由於 fetchWeather 現在在 useEffect 內部，我們需要觸發重新渲染
    // 或者使用一個 ref 來存儲 fetchWeather 函數
    // 為了簡化，這裡先不實現手動刷新功能
    console.log('Refresh weather data');
  };

  return {
    weather,
    loading,
    error,
    refresh,
    icon: weather ? getWeatherIcon(weather.condition) : 'weather-cloudy',
  };
}

