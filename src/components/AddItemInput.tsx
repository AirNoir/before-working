/**
 * 添加清單項目輸入組件
 */

import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text, Alert} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {COLORS} from '@constants/colors';
import {useTranslation} from 'react-i18next';
import {IconPicker} from './IconPicker';

interface AddItemInputProps {
  onAdd: (title: string, icon?: string) => void;
  placeholder?: string;
}

export const AddItemInput: React.FC<AddItemInputProps> = ({
  onAdd,
  placeholder = '新增檢查清單...',
}) => {
  const {t} = useTranslation();
  const [text, setText] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | undefined>();
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleAdd = () => {
    if (text.trim() === '') {
      Alert.alert(t('common.hint', {defaultValue: '提示'}), t('item.emptyTitle'));
      return;
    }
    onAdd(text.trim(), selectedIcon);
    setText('');
    setSelectedIcon(undefined);
  };

  return (
    <>
      <View className="bg-white rounded-lg p-3 flex-row items-center shadow-sm mb-4">
        {/* 圖示選擇按鈕 */}
        <TouchableOpacity
          onPress={() => setShowIconPicker(true)}
          className="mr-3 p-2 rounded-lg"
          style={{
            backgroundColor: selectedIcon ? COLORS.primary + '20' : COLORS.background,
          }}>
          <MaterialCommunityIcons
            name={selectedIcon ? (selectedIcon as any) : 'image-outline'}
            size={24}
            color={selectedIcon ? COLORS.primary : COLORS.gray[400]}
          />
        </TouchableOpacity>

        {/* 輸入框 */}
        <TextInput
          className="flex-1 text-base text-textPrimary mr-3"
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray[400]}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />

        {/* 添加按鈕 */}
        <TouchableOpacity
          onPress={handleAdd}
          className="bg-primary rounded-lg px-4 py-2"
          disabled={text.trim() === ''}>
          <Text className="text-white font-semibold">{t('common.add')}</Text>
        </TouchableOpacity>
      </View>

      {/* 圖示選擇器 */}
      <IconPicker
        visible={showIconPicker}
        selectedIcon={selectedIcon}
        onSelect={setSelectedIcon}
        onClose={() => setShowIconPicker(false)}
      />
    </>
  );
};
