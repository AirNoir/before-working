/**
 * 清單項目卡片組件
 * 可勾選、編輯、刪除的清單項目
 */

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput, Alert, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useTranslation} from 'react-i18next';
import {COLORS} from '@constants/colors';

interface ChecklistItemCardProps {
  id: string;
  title: string;
  icon?: string; // MDI 图标名称
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (newTitle: string) => void;
  drag?: () => void; // 拖拽句柄
  isActive?: boolean; // 是否正在拖拽
}

export const ChecklistItemCard: React.FC<ChecklistItemCardProps> = ({
  title,
  icon,
  checked,
  onToggle,
  onDelete,
  onUpdate,
  drag,
  isActive = false,
}) => {
  const {t} = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(title);

  const handleSave = () => {
    if (editText.trim() === '') {
      Alert.alert('錯誤', t('item.emptyTitle'));
      setEditText(title);
      return;
    }
    onUpdate(editText.trim());
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(t('item.deleteConfirm'), t('item.deleteMessage', {title}), [
      {text: t('common.cancel'), style: 'cancel'},
      {text: t('common.delete'), style: 'destructive', onPress: onDelete},
    ]);
  };

  return (
    <View
      className={`bg-white rounded-lg p-4 mb-3 flex-row items-center shadow-sm ${
        isActive ? 'opacity-70' : ''
      }`}
      style={styles.card}>
      {/* 拖拽句柄 */}
      <TouchableOpacity onLongPress={drag} className="mr-3 py-2">
        <MaterialCommunityIcons name="drag" size={20} color={COLORS.gray[400]} />
      </TouchableOpacity>

      {/* 勾選框 */}
      <TouchableOpacity onPress={onToggle} className="mr-3">
        <View
          className={`w-6 h-6 rounded border-2 items-center justify-center ${
            checked ? 'bg-success border-success' : 'border-gray-300'
          }`}>
          {checked && <Text className="text-white text-sm font-bold">✓</Text>}
        </View>
      </TouchableOpacity>

      {/* 圖示 */}
      {
        <View className="mr-3">
          <MaterialCommunityIcons
            name={(icon as any) || 'star'}
            size={24}
            color={checked ? COLORS.gray[400] : COLORS.primary}
          />
        </View>
      }

      {/* 內容區域 */}
      <View className="flex-1">
        {isEditing ? (
          <TextInput
            className="text-xl text-textPrimary border-b border-primary pb-1"
            value={editText}
            onChangeText={setEditText}
            onBlur={handleSave}
            onSubmitEditing={handleSave}
            autoFocus
            selectTextOnFocus
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text
              className={`text-lg ${checked ? 'text-gray-400 line-through' : 'text-textPrimary'}`}>
              {title}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 刪除按鈕 */}
      <TouchableOpacity onPress={handleDelete} className="ml-3 p-2">
        <MaterialCommunityIcons name="close" size={20} color={COLORS.warning} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: COLORS.gray[500],
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});
