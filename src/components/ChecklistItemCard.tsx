/**
 * 清單項目卡片組件
 * 可勾選、編輯、刪除的清單項目
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import {COLORS} from '@constants/colors';

interface ChecklistItemCardProps {
  id: string;
  title: string;
  checked: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (newTitle: string) => void;
  drag?: () => void; // 拖拽句柄
  isActive?: boolean; // 是否正在拖拽
}

export const ChecklistItemCard: React.FC<ChecklistItemCardProps> = ({
  title,
  checked,
  onToggle,
  onDelete,
  onUpdate,
  drag,
  isActive = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(title);

  const handleSave = () => {
    if (editText.trim() === '') {
      Alert.alert('錯誤', '項目名稱不能為空');
      setEditText(title);
      return;
    }
    onUpdate(editText.trim());
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('確認刪除', `確定要刪除「${title}」嗎？`, [
      {text: '取消', style: 'cancel'},
      {text: '刪除', style: 'destructive', onPress: onDelete},
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
        <Text className="text-gray-400 text-lg">☰</Text>
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

      {/* 內容區域 */}
      <View className="flex-1">
        {isEditing ? (
          <TextInput
            className="text-base text-textPrimary border-b border-primary pb-1"
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
              className={`text-base ${
                checked ? 'text-gray-400 line-through' : 'text-textPrimary'
              }`}>
              {title}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 刪除按鈕 */}
      <TouchableOpacity onPress={handleDelete} className="ml-3 p-2">
        <Text className="text-warning text-lg">✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

