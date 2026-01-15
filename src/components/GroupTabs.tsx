/**
 * 分組標籤頁組件
 * 顯示分組選項，支持切換分組和創建新分組
 */

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useTranslation} from 'react-i18next';
import {COLORS} from '@constants/colors';
import type {ChecklistGroup} from '@/types';

interface GroupTabsProps {
  groups: ChecklistGroup[];
  activeGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
  onCreateGroup: (name: string) => void;
}

export const GroupTabs: React.FC<GroupTabsProps> = ({
  groups,
  activeGroupId,
  onSelectGroup,
  onCreateGroup,
}) => {
  const {t} = useTranslation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = () => {
    if (newGroupName.trim() === '') {
      Alert.alert('錯誤', t('group.emptyName'));
      return;
    }
    onCreateGroup(newGroupName.trim());
    setNewGroupName('');
    setShowCreateDialog(false);
  };

  return (
    <View className="bg-white border-b border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 各個分組 */}
        {groups.map(group => (
          <TouchableOpacity
            key={group.id}
            onPress={() => onSelectGroup(group.id)}
            className={`px-4 py-2 mx-1 rounded-lg flex-row items-center ${
              activeGroupId === group.id ? 'bg-primary' : 'bg-gray-100'
            }`}
            style={styles.tab}>
            <Text
              className={`text-sm font-semibold ${
                activeGroupId === group.id ? 'text-gray-600' : 'text-textPrimary'
              }`}>
              {group.name}
            </Text>
          </TouchableOpacity>
        ))}

        {/* 新增分類按鈕 */}
        <TouchableOpacity
          onPress={() => setShowCreateDialog(true)}
          className="px-4 py-2 mx-1 rounded-lg bg-gray-400 flex-row items-center"
          style={styles.tab}>
          <MaterialCommunityIcons name="plus" size={16} color={COLORS.primary} />
          <Text className="text-sm font-semibold text-white ml-1">{t('group.createGroup')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 創建分組對話框 */}
      {showCreateDialog && (
        <View className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 shadow-lg">
          <Text className="text-textPrimary font-bold text-lg mb-3">{t('group.createGroup')}</Text>

          <View className="mb-3">
            <Text className="text-textPrimary text-sm mb-2">{t('group.groupName')}</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 text-textPrimary"
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder={t('group.groupName')}
              autoFocus
            />
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => {
                setShowCreateDialog(false);
                setNewGroupName('');
              }}
              className="flex-1 bg-gray-200 rounded-lg py-2 items-center">
              <Text className="text-gray-400 font-semibold">{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCreateGroup}
              className="flex-1 bg-primary rounded-lg py-2 items-center">
              <Text className="text-gray-600 font-semibold">{t('common.add')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tab: {
    minHeight: 36,
  },
});
