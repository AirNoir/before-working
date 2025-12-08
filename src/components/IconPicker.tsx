/**
 * 圖示選擇器組件
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {COLORS} from '@constants/colors';
import {useTranslation} from 'react-i18next';

// 常用圖示列表
const COMMON_ICONS = [
  'wallet',
  'key',
  'badge-account',
  'cellphone',
  'car',
  'home',
  'briefcase',
  'sunglasses',
  'umbrella',
  'water-bottle',
  'laptop',
  'headphones',
  'watch',
  'book',
  'pencil',
  'folder',
  'file',
  'image',
  'music',
  'heart',
  'star',
  'bell',
  'lock',
  'shield',
  'gift',
  'coffee',
  'food',
  'bottle-wine',
  'pill',
  'stethoscope',
  'dumbbell',
  'bike',
  'run',
  'dog',
  'cat',
  'flower',
  'tree',
  'sun',
  'moon',
  'cloud',
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('iconPicker.title', {defaultValue: '選擇圖示'})}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.iconGrid}>
              {COMMON_ICONS.map(icon => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => handleSelect(icon)}
                  style={[
                    styles.iconItem,
                    selectedIcon === icon && styles.iconItemSelected,
                  ]}>
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
    color: COLORS.textPrimary,
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

