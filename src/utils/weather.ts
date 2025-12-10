/**
 * 天氣服務工具
 * 使用台灣中央氣象局（CWA）開放資料 API
 */

import type {WeatherData, WeatherCondition} from '@types/index';

// CWA API 設定
// 注意：使用時需要在 opendata.cwb.gov.tw 申請 API 授權碼
const CWA_API_BASE = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore';

const CWA_API_KEY = process.env.EXPO_PUBLIC_CWA_API_KEY || ''; // 從環境變數讀取 API Key


// 天氣現象代碼到天氣狀況的對應
const WX_CODE_MAP: Record<number, WeatherCondition> = {
  1: 'sunny', // 晴天
  2: 'sunny', // 晴天
  3: 'partly-cloudy', // 多雲
  4: 'cloudy', // 陰天
  5: 'cloudy', // 陰天
  6: 'cloudy', // 陰天
  7: 'rainy', // 雨天
  8: 'rainy', // 雨天
  9: 'rainy', // 雨天
  10: 'rainy', // 雨天
  11: 'rainy', // 雨天
  12: 'rainy', // 雨天
  13: 'rainy', // 雨天
  14: 'rainy', // 雨天
  15: 'rainy', // 雨天
  16: 'rainy', // 雨天
  17: 'rainy', // 雨天
  18: 'rainy', // 雨天
  19: 'rainy', // 雨天
  20: 'rainy', // 雨天
  21: 'rainy', // 雨天
  22: 'rainy', // 雨天
  23: 'rainy', // 雨天
  24: 'rainy', // 雨天
};

/**
 * 根據城市名稱取得天氣資料
 * @param locationName 城市名稱（如「台北市」、「新北市」）
 */
export async function fetchWeatherByLocation(
  locationName: string,
): Promise<WeatherData | null> {
  // 如果沒有 API Key，直接回傳模擬資料（開發測試用）
  if (!CWA_API_KEY || CWA_API_KEY === '') {
    if (__DEV__) {
      console.log('CWA API Key not set, using mock data for:', locationName);
    }
    return getMockWeatherData(locationName);
  }

  const foreCastElement = 'F-C0032-001';
  const currentElement = 'O-A0003-001';

  try {
    const url = `${CWA_API_BASE}/${currentElement}?Authorization=${CWA_API_KEY}&locationName=${locationName}`;
    console.log('url', url);
    console.log('locationName', locationName);
    // 添加超時控制（10秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`CWA API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('data', JSON.stringify(data, null, 2));

    const location = data.records.location[0];

    const weatherElements = location.weatherElement;

    // 取得天氣現象
    const wxElement = weatherElements.find((el: any) => el.elementName === 'Wx');

 
    const wxData = wxElement.time[0].parameter;
    const wxCode = parseInt(wxData?.parameterValue || '1', 10);
    const wxText = wxData?.parameterName || '未知';

    console.log('wxData', wxData);
    console.log('wxCode', wxCode);
    console.log('wxText', wxText);


    // 取得溫度（使用第一時段的資料）
    const tElement = weatherElements.find((el: any) => el.elementName === 'T');
    console.log('tElement', JSON.stringify(weatherElements, null, 2));
    if (!tElement?.time?.[0]?.parameter) {
      throw new Error('Invalid API response: missing temperature data');
    }

    const tData = tElement.time[0].parameter;
    const temperature = parseInt(tData?.parameterName || '25', 10);

    const condition = WX_CODE_MAP[wxCode] || 'unknown';

    return {
      temperature,
      condition,
      conditionText: wxText,
      locationName,
      lastUpdated: Date.now(),
    };
  } catch (error) {
    // 網絡錯誤或其他錯誤時，靜默使用模擬資料
    if (__DEV__) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Weather API request failed (${errorMessage}), using mock data for:`, locationName);
    }
    // 發生錯誤時回傳模擬資料
    return getMockWeatherData(locationName);
  }
}

/**
 * 取得模擬天氣資料（用於開發和測試）
 */
function getMockWeatherData(locationName: string): WeatherData {
  const hour = new Date().getHours();
  let condition: WeatherCondition;
  let conditionText: string;

  // 根據時間模擬不同天氣
  if (hour >= 6 && hour < 18) {
    // 白天：晴天或部分多雲
    condition = hour % 2 === 0 ? 'sunny' : 'partly-cloudy';
    conditionText = condition === 'sunny' ? '晴天' : '多雲時晴';
  } else {
    // 夜間：多雲或陰天
    condition = hour % 2 === 0 ? 'cloudy' : 'partly-cloudy';
    conditionText = condition === 'cloudy' ? '陰天' : '多雲';
  }

  // 模擬溫度（根據時間變化）
  const baseTemp = 25;
  const tempVariation = Math.sin((hour - 6) * (Math.PI / 12)) * 5;
  const temperature = Math.round(baseTemp + tempVariation);

  return {
    temperature,
    condition,
    conditionText,
    locationName,
    lastUpdated: Date.now(),
  };
}

/**
 * 根據天氣狀況回傳對應的 MDI 圖示名稱
 */
export function getWeatherIcon(condition: WeatherCondition): string {
  const iconMap: Record<WeatherCondition, string> = {
    sunny: 'weather-sunny',
    'partly-cloudy': 'weather-partly-cloudy',
    cloudy: 'weather-cloudy',
    rainy: 'weather-rainy',
    unknown: 'weather-cloudy',
  };

  return iconMap[condition] || 'weather-cloudy';
}

