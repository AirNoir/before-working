/**
 * 添加清單項目輸入組件
 */

import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text, Alert} from 'react-native';
import {COLORS} from '@constants/colors';

interface AddItemInputProps {
  onAdd: (title: string) => void;
  placeholder?: string;
}

export const AddItemInput: React.FC<AddItemInputProps> = ({
  onAdd,
  placeholder = '添加新項目...',
}) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim() === '') {
      Alert.alert('提示', '請輸入項目名稱');
      return;
    }
    onAdd(text.trim());
    setText('');
  };

  return (
    <View className="bg-white rounded-lg p-3 flex-row items-center shadow-sm mb-4">
      <TextInput
        className="flex-1 text-base text-textPrimary mr-3"
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray[400]}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
      <TouchableOpacity
        onPress={handleAdd}
        className="bg-primary rounded-lg px-4 py-2"
        disabled={text.trim() === ''}>
        <Text className="text-white font-semibold">添加</Text>
      </TouchableOpacity>
    </View>
  );
};

