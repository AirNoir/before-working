/**
 * 分組標籤頁組件
 * 顯示分組選項，支持切換分組和創建新分組
 */

import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useTranslation} from 'react-i18next';
import {COLORS} from '@constants/colors';
import {canCreateGroup, getGroupLimit, isPremiumUser} from '@utils/permission';
import {GroupTemplatePicker} from './GroupTemplatePicker';
import type {ChecklistGroup, UserPermission} from '@/types';

interface GroupTabsProps {
  groups: ChecklistGroup[];
  activeGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
  onCreateGroup: (name: string) => void;
  onUpdateGroup?: (groupId: string, name: string) => void;
  onDeleteGroup?: (groupId: string) => void; // 刪除分類
  userPermission: UserPermission;
  onShowUpgrade?: () => void; // 顯示升級提示
  onImportTemplate?: (templateId: string) => void; // 引入分類套組
}

export const GroupTabs: React.FC<GroupTabsProps> = ({
  groups,
  activeGroupId,
  onSelectGroup,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  userPermission,
  onShowUpgrade,
  onImportTemplate,
}) => {
  const {t} = useTranslation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState('');

  const handleCreateGroup = () => {
    if (newGroupName.trim() === '') {
      Alert.alert('錯誤', t('group.emptyName'));
      return;
    }

    // 檢查權限
    if (!canCreateGroup(groups.length, userPermission)) {
      // 顯示升級提示
      Alert.alert(
        t('group.upgradeTitle'),
        t('group.upgradeMessage', {
          limit: getGroupLimit(userPermission),
        }),
        [
          {text: t('common.cancel'), style: 'cancel'},
          {
            text: t('group.upgradeButton'),
            onPress: () => {
              if (onShowUpgrade) {
                onShowUpgrade();
              }
            },
          },
        ],
      );
      return;
    }

    try {
      onCreateGroup(newGroupName.trim());
      setNewGroupName('');
      setShowCreateDialog(false);
    } catch (error: any) {
      if (error.message === 'GROUP_LIMIT_REACHED') {
        Alert.alert(
          t('group.upgradeTitle'),
          t('group.upgradeMessage', {
            limit: getGroupLimit(userPermission),
          }),
          [
            {text: t('common.cancel'), style: 'cancel'},
            {
              text: t('group.upgradeButton'),
              onPress: () => {
                if (onShowUpgrade) {
                  onShowUpgrade();
                }
              },
            },
          ],
        );
      }
    }
  };

  const handleStartEdit = (group: ChecklistGroup) => {
    if (!onUpdateGroup) return;
    setEditingGroupId(group.id);
    setEditGroupName(group.name);
  };

  const handleSaveEdit = () => {
    if (!editingGroupId || !onUpdateGroup) return;
    if (editGroupName.trim() === '') {
      Alert.alert('錯誤', t('group.emptyName'));
      return;
    }
    onUpdateGroup(editingGroupId, editGroupName.trim());
    setEditingGroupId(null);
    setEditGroupName('');
  };

  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditGroupName('');
  };

  const handleDeleteGroup = (group: ChecklistGroup) => {
    if (!onDeleteGroup) return;

    Alert.alert(t('group.deleteConfirm'), t('group.deleteMessage', {name: group.name}), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: () => {
          onDeleteGroup(group.id);
          // 如果刪除的是正在編輯的分組，取消編輯狀態
          if (editingGroupId === group.id) {
            setEditingGroupId(null);
            setEditGroupName('');
          }
        },
      },
    ]);
  };

  const handleOpenManageDialog = () => {
    setShowManageDialog(true);
    setEditingGroupId(null);
    setEditGroupName('');
  };

  const handleCloseManageDialog = () => {
    setShowManageDialog(false);
    setEditingGroupId(null);
    setEditGroupName('');
  };

  return (
    <View className="bg-white border-b border-gray-200">
      <View className="flex-row items-center">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          className="flex-1">
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

        {/* 管理按鈕 */}
        {onUpdateGroup && (
          <TouchableOpacity
            onPress={handleOpenManageDialog}
            className="px-3 py-2 mr-2"
            activeOpacity={0.7}>
            <MaterialCommunityIcons name="dots-vertical" size={20} color={COLORS.gray[600]} />
          </TouchableOpacity>
        )}
      </View>

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

      {/* 管理分類對話框 */}
      {showManageDialog && (
        <View className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 p-4 z-10 shadow-lg max-h-96">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-textPrimary font-bold text-lg">{t('group.manageGroups')}</Text>
            <TouchableOpacity onPress={handleCloseManageDialog}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.gray[600]} />
            </TouchableOpacity>
          </View>

          {/* 分類列表 */}
          <ScrollView className="max-h-64 mb-4">
            {groups.map(group => (
              <View key={group.id} className="mb-3">
                {editingGroupId === group.id ? (
                  // 編輯模式
                  <View className="flex-row items-center gap-2">
                    <TextInput
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-textPrimary"
                      value={editGroupName}
                      onChangeText={setEditGroupName}
                      placeholder={t('group.groupName')}
                      autoFocus
                    />
                    <TouchableOpacity
                      onPress={handleSaveEdit}
                      className="px-3 py-2 bg-primary rounded-lg">
                      <MaterialCommunityIcons name="check" size={20} color={COLORS.gray[600]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCancelEdit}
                      className="px-3 py-2 bg-gray-200 rounded-lg">
                      <MaterialCommunityIcons name="close" size={20} color={COLORS.gray[600]} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  // 顯示模式
                  <View className="flex-row items-center justify-between bg-gray-50 rounded-lg p-3">
                    <Text className="text-textPrimary font-semibold flex-1">{group.name}</Text>
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity onPress={() => handleStartEdit(group)} className="ml-2">
                        <MaterialCommunityIcons name="pencil" size={18} color={COLORS.blue[600]} />
                      </TouchableOpacity>
                      {onDeleteGroup && (
                        <TouchableOpacity onPress={() => handleDeleteGroup(group)} className="ml-2">
                          <MaterialCommunityIcons name="delete" size={18} color={COLORS.warning} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* 新增分類按鈕 */}
          <TouchableOpacity
            onPress={() => {
              handleCloseManageDialog();
              setShowCreateDialog(true);
            }}
            className="bg-primary rounded-lg py-3 flex-row items-center justify-center mb-2">
            <MaterialCommunityIcons name="plus" size={20} color={COLORS.gray[600]} />
            <Text className="text-gray-600 font-semibold ml-2">{t('group.createGroup')}</Text>
          </TouchableOpacity>

          {/* 引入分類套組按鈕 */}
          {onImportTemplate && (
            <TouchableOpacity
              onPress={() => {
                handleCloseManageDialog();
                setShowTemplatePicker(true);
              }}
              className="bg-blue-600 rounded-lg py-3 flex-row items-center justify-center">
              <MaterialCommunityIcons name="package-variant" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">{t('group.importTemplate')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 分類套組選擇器 */}
      {onImportTemplate && (
        <GroupTemplatePicker
          visible={showTemplatePicker}
          onClose={() => setShowTemplatePicker(false)}
          onImport={onImportTemplate}
          userPermission={userPermission}
          onShowUpgrade={onShowUpgrade}
        />
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
