/**
 * 翻頁時鐘組件
 * 顯示當前時間，支持 12/24 小時制，格式為 HH:mm:ss
 * 翻頁卡片背景永遠是黑色，文字永遠是白色
 * 實現簡單穩定的翻頁動畫效果
 */

import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

interface FlipClockProps {
  format: '12h' | '24h';
  className?: string;
}

interface FlipDigitProps {
  digit: string;
  prevDigit: string;
}

// 單個數字翻頁組件
const FlipDigit: React.FC<FlipDigitProps> = ({digit, prevDigit}) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [displayDigit, setDisplayDigit] = useState(prevDigit);
  const [bottomDisplayDigit, setBottomDisplayDigit] = useState(prevDigit);

  useEffect(() => {
    if (digit !== prevDigit) {
      // 開始翻頁動畫
      Animated.sequence([
        // 上半部分向下翻轉（縮小）
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // 重置動畫值
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 動畫完成後更新數字
        setDisplayDigit(digit);
      });

      // 延遲 0.1 秒後更新下半部分的數字
      const bottomUpdateTimer = setTimeout(() => {
        setBottomDisplayDigit(digit);
      }, 300);

      return () => {
        clearTimeout(bottomUpdateTimer);
      };
    }
  }, [digit, prevDigit]);

  // 上半部分的縮放動畫（模擬向下翻頁）
  // transform origin 在底部，向下翻轉時從底部縮小
  const topScale = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  // 下半部分的縮放動畫（模擬向上翻頁）
  const topOpacity = flipAnim.interpolate({
    inputRange: [0, 0.9, 1],
    outputRange: [1, 1, 1],
  });

  // 下半部分的動畫：靜態時顯示，動畫時也有翻頁效果
  const bottomScale = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1], // 始終保持完整大小
  });

  const bottomOpacity = flipAnim.interpolate({
    inputRange: [0, 0.9, 1],
    outputRange: [1, 0, 0], // 始終完全顯示
  });

  return (
    <View style={styles.flipCardContainer}>
      {/* 上半部分 - 顯示當前數字 */}
      <View style={styles.flipCardTop}>
        <Animated.View
          style={[
            styles.flipCardFace,
            styles.flipCardFaceTop,
            {
              transform: [{scaleY: topScale}],
              opacity: topOpacity,
            },
          ]}>
          <Text style={[styles.flipText, styles.flipTextWhite]}>{displayDigit}</Text>
        </Animated.View>
      </View>

      {/* 中間分隔線 */}
      <View style={styles.divider} />

      {/* 下半部分 - 顯示當前數字（延遲 0.1 秒更新） */}
      <View style={styles.flipCardBottom}>
        <Animated.View
          style={[
            styles.flipCardFace,
            styles.flipCardFaceBottom,
            {
              transform: [{scaleY: bottomScale}],
              opacity: bottomOpacity,
            },
          ]}>
          <Text style={[styles.flipText, styles.flipTextWhite]}>{bottomDisplayDigit}</Text>
        </Animated.View>
      </View>
    </View>
  );
};

export const FlipClock: React.FC<FlipClockProps> = ({format, className = ''}) => {
  const [time, setTime] = useState(new Date());
  const [prevTime, setPrevTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevTime(time);
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  // 格式化時間
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (format === '12h') {
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        period,
      };
    }

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      period: null,
    };
  };

  const current = formatTime(time);
  const previous = formatTime(prevTime);

  return (
    <View className={`flex-row items-center ${className}`} style={styles.container}>
      {/* 12小時制的 AM/PM */}
        {format === '12h' && current.period && (
        <View style={styles.periodContainer}>
          <Text style={styles.periodText}>{current.period}</Text>
        </View>
      )}
      {/* 小時 */}
      <FlipDigit digit={current.hours[0]} prevDigit={previous.hours[0]} />
      <FlipDigit digit={current.hours[1]} prevDigit={previous.hours[1]} />

      {/* 分隔符 */}
      <Text style={styles.separator}>:</Text>

      {/* 分鐘 */}
      <FlipDigit digit={current.minutes[0]} prevDigit={previous.minutes[0]} />
      <FlipDigit digit={current.minutes[1]} prevDigit={previous.minutes[1]} />

      {/* 分隔符 */}
      <Text style={styles.separator}>:</Text>

      {/* 秒數 */}
      <FlipDigit digit={current.seconds[0]} prevDigit={previous.seconds[0]} />
      <FlipDigit digit={current.seconds[1]} prevDigit={previous.seconds[1]} />

    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flipCardContainer: {
    width: 32,
    height: 40,
    borderRadius: 8,
    marginHorizontal: 2,
    backgroundColor: '#000000', // 永遠黑色背景
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  flipCardTop: {
    height: '50%',
    overflow: 'hidden',
    position: 'relative',
  },
  flipCardBottom: {
    height: '50%',
    overflow: 'hidden',
    position: 'relative',
  },
  flipCardFace: {
    height: 40, // 完整卡片高度
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    position: 'absolute',
  },
  flipCardFaceTop: {
    top: 0, // 上半部分：從頂部開始，顯示數字的上半部分
  },
  flipCardFaceBottom: {
    top: -20, // 向上偏移20px，讓卡片的下半部分（20-40px）顯示在下半部分容器中
  },
  flipCardFaceAnimated: {
    // 動畫層疊在靜態層之上
    zIndex: 1,
  },
  flipText: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'monospace',
    letterSpacing: 0,
    textAlign: 'center',
    color: '#FFFFFF', // 永遠白色文字
  },
  flipTextWhite: {
    color: '#FFFFFF', // 確保文字是白色
  },
  divider: {
    height: 1,
    width: '100%',
    position: 'absolute',
    top: '50%',
    backgroundColor: '#111',
    zIndex: 10,
  },
  separator: {
    fontSize: 22,
    fontWeight: '700',
    marginHorizontal: 3,
    fontFamily: 'monospace',
    color: '#000',
  },
  periodContainer: {
    marginRight: 8,
    justifyContent: 'center',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
    color: '#222',
  },
});
