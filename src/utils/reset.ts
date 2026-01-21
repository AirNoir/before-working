/**
 * 定时重置工具
 * 检查是否到了重置时间，如果是则自动重置所有清单的 checked 状态
 */

import {getData, saveData} from '@utils/storage';
import {STORAGE_KEYS} from '@constants/config';

/**
 * 获取今天的日期字符串 (YYYY-MM-DD)
 */
const getTodayDateString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/**
 * 检查时间是否已经过了重置时间
 * @param resetTime 重置时间，格式 "HH:mm"，例如 "06:30"
 * @returns 如果当前时间已经过了重置时间，返回 true
 */
const isResetTimePassed = (resetTime: string): boolean => {
  if (!resetTime) return false;

  const [hours, minutes] = resetTime.split(':').map(Number);
  const now = new Date();
  const resetDate = new Date();
  resetDate.setHours(hours, minutes, 0, 0);

  // 如果当前时间已经过了今天的重置时间，返回 true
  return now >= resetDate;
};

/**
 * 检查并执行重置（如果需要）
 * @param resetTime 重置时间，格式 "HH:mm" 或 null
 * @param resetCallback 重置回调函数
 */
export const checkAndResetIfNeeded = async (
  resetTime: string | null,
  resetCallback: () => void,
): Promise<void> => {
  if (!resetTime) {
    return; // 没有设置重置时间，不执行
  }

  try {
    const lastResetDate = await getData<string>(STORAGE_KEYS.LAST_RESET_DATE);
    const today = getTodayDateString();

    // 如果今天已经重置过，不重复重置
    if (lastResetDate === today) {
      return;
    }

    // 检查是否已经过了重置时间
    if (isResetTimePassed(resetTime)) {
      // 执行重置
      resetCallback();

      // 更新最后重置日期
      await saveData(STORAGE_KEYS.LAST_RESET_DATE, today);
    }
  } catch (error) {
    console.error('Error checking reset time:', error);
  }
};

/**
 * 手动触发重置检查（用于应用启动时或定时检查）
 */
export const triggerResetCheck = async (
  resetTime: string | null,
  resetCallback: () => void,
): Promise<void> => {
  await checkAndResetIfNeeded(resetTime, resetCallback);
};

