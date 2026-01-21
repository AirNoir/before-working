/**
 * 圖示選擇器組件
 */

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {COLORS} from '@constants/colors';
import {useTranslation} from 'react-i18next';

// 常用圖示列表
const COMMON_ICONS = [
  // 日常用品
  'wallet',
  'key',
  'cellphone',
  'watch',
  'glasses',
  'sunglasses',
  'umbrella',
  'cup-water',
  'water',
  'bag-personal',
  'laptop',
  'headphones',
  'earbuds',
  'lotion',
  'baby-bottle',
  
  // 交通工具
  'car',
  'bike',
  'airplane',
  'train',
  'bus',
  'scooter',
  
  // 建築/地點
  'home',
  'school',
  'hospital-building',
  'store',
  'library',
  'briefcase',
  'bank',
  'map',
  
  // 文件/文具
  'book',
  'book-open-variant',
  'notebook',
  'pencil',
  'pen',
  'folder',
  'file',
  'file-document',
  'file-image',
  'calculator',
  
  // 電子產品
  'camera',
  'power-plug',
  'battery-charging',
  'flashlight',
  'radio',
  'television',
  
  // 娛樂
  'music',
  'movie',
  'gamepad-variant',
  'ticket',
  'cards-playing-outline',
  'puzzle',
  
  // 情感/符號
  'heart',
  'star',
  'bell',
  'gift',
  'trophy',
  'medal',
  'flag',
  
  // 安全/權限
  'lock',
  'shield',
  'shield-check',
  'key-variant',
  'account-badge',
  'card-account-details',
  'card-account-mail',
  'credit-card',
  'identifier',
  
  // 食品飲料
  'coffee',
  'cup',
  'food-apple',
  'cookie',
  'cake',
  'bottle-wine',
  'beer',
  'silverware-fork-knife',
  'pot-steam',
  'bread-slice',
  
  // 醫療/健康
  'pill',
  'stethoscope',
  'medical-bag',
  'hospital-box',
  'bandage',
  'heart-pulse',
  'face-mask',
  
  // 運動健身
  'dumbbell',
  'run-fast',
  'swim',
  'basketball',
  'soccer',
  'football',
  'baseball',
  'tennis',
  'yoga',
  'hiking',
  'surfing',
  
  // 寵物/動物
  'dog',
  'cat',
  'rabbit-variant',
  'bird',
  'fish',
  'turtle',
  
  // 植物/自然
  'flower',
  'flower-outline',
  'tree',
  'leaf',
  'grass',
  'sprout',
  
  // 天氣
  'weather-sunny',
  'weather-night',
  'weather-cloudy',
  'weather-rainy',
  'weather-snowy',
  'weather-partly-cloudy',
  'weather-lightning',
  'weather-windy',
  
  // 季節/時間
  'snowflake',
  'fire',
  'lightbulb',
  'lightbulb-outline',
  'candle',
  
  // 服裝/配件
  'tshirt-crew',
  'shoe-sneaker',
  'shoe-formal',
  'hat-fedora',
  'tie',
  'hanger',
  'bag-suitcase',
  
  // 清潔/個人用品
  'shower',
  'rug',
  'toothbrush-paste',
  'hair-dryer',
  'bottle-tonic-plus',
  'spray-bottle',
  
  // 工具/設備
  'toolbox',
  'wrench',
  'hammer',
  'screwdriver',
  'cog',
  
  // 通訊/社交
  'email',
  'message',
  'account',
  'account-group',
  'account-multiple',
  
  // 其他常用
  'calendar',
  'clock',
  'clock-outline',
  'alarm',
  'timer',
  'compass',
  'binoculars',
  'tent',
  'beach',
  'palette',
  'microphone',
  'party-popper',
  'ring',
  'car-key',

  // 我要來檢查icon是否正確顯示的區塊
] as const;

interface IconPickerProps {
  visible: boolean;
  selectedIcon?: string;
  onSelect: (icon: string) => void;
  onClose: () => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  visible,
  selectedIcon,
  onSelect,
  onClose,
}) => {
  const {t} = useTranslation();

  const handleSelect = (icon: string) => {
    onSelect(icon);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('iconPicker.title', {defaultValue: '選擇圖示'})}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.gray[100]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.iconGrid}>
              {COMMON_ICONS.map(icon => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => handleSelect(icon)}
                  style={[styles.iconItem, selectedIcon === icon && styles.iconItemSelected]}>
                  <MaterialCommunityIcons
                    name={icon as any}
                    size={32}
                    color={selectedIcon === icon ? COLORS.primary : COLORS.textPrimary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.backgroundAlt,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray[100],
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: 400,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconItem: {
    width: '18%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  iconItemSelected: {
    backgroundColor: COLORS.primary + '20',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});
