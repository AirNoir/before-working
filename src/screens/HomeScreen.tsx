/**
 * 主頁面 - 清單管理
 */

import React, {useEffect, useState, useRef} from 'react';
import {View, Text, Alert, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import DraggableFlatList, {ScaleDecorator} from 'react-native-draggable-flatlist';
import {useAppStore} from '@store/useAppStore';
import {
  Header,
  ChecklistItemCard,
  AddItemInput,
  Button,
  PersonalToolBar,
  GroupTabs,
} from '@components/index';
import {COLORS} from '@constants/colors';
import {DEFAULT_CHECKLIST_NAME} from '@constants/config';
import {STORAGE_KEYS} from '@constants/config';
import {saveData, getData} from '@utils/storage';
import type {ChecklistItem, Checklist} from '@/types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {
    checklists,
    groups,
    activeChecklistId,
    activeGroupId,
    settings,
    addItem,
    deleteItem,
    updateItem,
    toggleItemCheck,
    resetAllItems,
    resetAllItemsInGroup,
    resetAllChecklists,
    reorderItems,
    setActiveChecklist,
    setActiveGroup,
    createGroup,
    createChecklist,
    updateGroupName,
    deleteGroup,
    importGroupTemplate,
  } = useAppStore();

  // 每分鐘整點檢測重置時間（17:01:00, 17:02:00...）
  useEffect(() => {
    if (!settings.resetTime) return;

    let initialTimeoutId: NodeJS.Timeout | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    const checkAndReset = async () => {
      const [targetHours, targetMinutes] = settings.resetTime!.split(':').map(Number);
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // 檢查是否剛好是重置時間
      if (currentHours === targetHours && currentMinutes === targetMinutes) {
        // 檢查今天是否已重置
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const lastResetDate = await getData<string>(STORAGE_KEYS.LAST_RESET_DATE);

        if (lastResetDate !== today) {
          resetAllChecklists();
          await saveData(STORAGE_KEYS.LAST_RESET_DATE, today);
        }
      }
    };

    // 計算到下一個整分鐘的毫秒數
    const now = new Date();
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    // 先等到下一個整分鐘
    initialTimeoutId = setTimeout(() => {
      // 立即檢查一次
      checkAndReset();

      // 然後每 60 秒（整分鐘）檢查一次
      intervalId = setInterval(checkAndReset, 60000);
    }, msUntilNextMinute);

    return () => {
      if (initialTimeoutId) clearTimeout(initialTimeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [settings.resetTime, resetAllChecklists]);

  // 根據選中的分組過濾清單
  const filteredChecklists = React.useMemo(() => {
    if (activeGroupId === null) {
      // 如果沒有選中分組，返回空數組（不應該發生，因為默認會選中第一個分組）
      return [];
    }
    // 顯示指定分組
    return checklists.filter(c => c.groupId === activeGroupId);
  }, [checklists, activeGroupId]);

  // 獲取當前活動清單
  const activeChecklist =
    filteredChecklists.find(c => c.id === activeChecklistId) || filteredChecklists[0];

  const handleReset = () => {
    if (!activeChecklist?.id) return;

    Alert.alert(t('home.resetConfirm'), t('home.resetMessage'), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('common.reset'),
        style: 'destructive',
        onPress: () => resetAllItems(activeChecklist.id),
      },
    ]);
  };

  const handleClearAllItemsInGroup = () => {
    if (!activeGroupId) return;

    const activeGroup = groups.find(g => g.id === activeGroupId);
    const groupName = activeGroup?.name || t('home.currentGroup');

    Alert.alert(t('home.clearAllItemsConfirm'), t('home.clearAllItemsMessage', {groupName}), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: () => resetAllItemsInGroup(activeGroupId),
      },
    ]);
  };

  const handleAddItem = (title: string, icon?: string) => {
    // 如果當前分組下沒有清單，先創建一個
    if (!activeChecklist?.id) {
      if (activeGroupId) {
        // 創建新清單
        createChecklist(DEFAULT_CHECKLIST_NAME, activeGroupId);
        // 創建後，activeChecklistId 會自動更新，但需要在下一個渲染週期才能獲取
        // 使用 requestAnimationFrame 確保狀態已更新
        requestAnimationFrame(() => {
          const state = useAppStore.getState();
          const newChecklist = state.checklists.find(
            c => c.groupId === activeGroupId && c.id === state.activeChecklistId,
          );
          if (newChecklist) {
            addItem(newChecklist.id, title, icon);
          }
        });
        return;
      }
      return;
    }
    addItem(activeChecklist.id, title, icon);
  };

  const handleCreateGroup = (name: string) => {
    createGroup(name);
  };

  const handleSelectGroup = (groupId: string | null) => {
    if (groupId === null) return; // 不允許選擇 null

    setActiveGroup(groupId);

    // 切換分組時，選擇該分組下的第一個清單
    const newFiltered = checklists.filter(c => c.groupId === groupId);

    if (newFiltered.length > 0) {
      setActiveChecklist(newFiltered[0].id);
    } else {
      // 如果該分組下沒有清單，自動創建一個新的清單
      createChecklist(DEFAULT_CHECKLIST_NAME, groupId);
    }
  };

  const handleReorder = (data: ChecklistItem[]) => {
    if (!activeChecklist?.id) return;
    reorderItems(activeChecklist.id, data);
  };

  // 渲染列表项
  const renderItem = (params: any) => {
    if (!activeChecklist?.id) return null;

    const {item, drag, isActive} = params;
    const itemContent = (
      <ChecklistItemCard
        id={item.id}
        title={item.title}
        icon={item.icon}
        checked={item.checked}
        onToggle={() => toggleItemCheck(activeChecklist.id, item.id)}
        onDelete={() => deleteItem(activeChecklist.id, item.id)}
        onUpdate={newTitle => updateItem(activeChecklist.id, item.id, newTitle)}
        drag={drag}
        isActive={isActive}
      />
    );

    // 使用 ScaleDecorator 包裝以支持拖拽動畫
    return <ScaleDecorator>{itemContent}</ScaleDecorator>;
  };

  // 渲染清單選擇器
  const renderChecklistSelector = () => {
    if (filteredChecklists.length <= 1) return null;

    return (
      <View className="bg-white px-4 py-2 border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredChecklists.map(checklist => (
            <TouchableOpacity
              key={checklist.id}
              onPress={() => setActiveChecklist(checklist.id)}
              className={`px-4 py-2 mx-1 rounded-lg ${
                activeChecklistId === checklist.id ? 'bg-primary' : 'bg-gray-100'
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  activeChecklistId === checklist.id ? 'text-white' : 'text-textPrimary'
                }`}>
                {checklist.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // 計算進度
  const progress = activeChecklist
    ? activeChecklist.items.length > 0
      ? Math.round(
          (activeChecklist.items.filter(i => i.checked).length / activeChecklist.items.length) *
            100,
        )
      : 0
    : 0;

  // 如果没有任何清单，显示空状态
  if (checklists.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header
          title={t('app.name')}
          rightButton={{icon: 'cog', onPress: () => navigation.navigate('Settings')}}
        />
        <PersonalToolBar />
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-textPrimary text-lg text-center">{t('home.noChecklist')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        {/* Header */}
        <Header
          title={activeChecklist?.name || t('app.name')}
          rightButton={{
            icon: 'refresh',
            onPress: handleReset,
          }}
        />

        {/* Personal ToolBar */}
        <PersonalToolBar />

        {/* 分組標籤 */}
        <GroupTabs
          groups={groups}
          activeGroupId={activeGroupId}
          onSelectGroup={handleSelectGroup}
          onCreateGroup={handleCreateGroup}
          onUpdateGroup={updateGroupName}
          onDeleteGroup={deleteGroup}
          userPermission={settings.userPermission}
          onShowUpgrade={() => navigation.navigate('Settings')}
          onImportTemplate={importGroupTemplate}
        />

        {/* 清單選擇器（如果有多個清單） */}
        {renderChecklistSelector()}

        {/* 進度條 */}
        <View className="bg-white px-4 py-3 mb-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-textPrimary font-semibold">{t('home.progress')}</Text>
            <View className="flex-row items-center">
              <Text className="text-blue-800 font-bold text-lg">{progress}%</Text>
              {progress === 100 && (
                <MaterialCommunityIcons
                  name="trophy"
                  size={24}
                  color={COLORS.orange[200]}
                  style={{marginLeft: 8}}
                />
              )}
            </View>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full bg-lavender rounded-full" style={{width: `${progress}%`}} />
          </View>
        </View>

        {/* 清單內容 */}
        <View className="flex-1 px-4 box-shadow-md">
          {/* 添加項目輸入框 */}
          <AddItemInput onAdd={handleAddItem} placeholder={t('home.addItemPlaceholder')} />

          {/* 拖拽清單 */}
          {!activeChecklist || activeChecklist.items.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-400 text-base text-center">
                {t('home.emptyList')}
                {'\n'}
                {t('home.emptyListHint')}
              </Text>
            </View>
          ) : (
            <DraggableFlatList
              data={activeChecklist.items}
              renderItem={renderItem}
              keyExtractor={(item: ChecklistItem) => item.id}
              onDragEnd={({data}: {data: ChecklistItem[]}) => handleReorder(data)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 80}}
              ListFooterComponent={
                <View className="py-4">
                  <Button
                    title={t('home.clearAllItems')}
                    variant="outline"
                    onPress={handleClearAllItemsInGroup}
                    className="border-2 border-warning"
                    textClassName="text-warning font-semibold"
                  />
                </View>
              }
            />
          )}
        </View>

        {/* 底部設置按鈕 */}
        <View className="p-4 bg-primary border-t-[2px] border-gray-300">
          <Button
            title={t('common.settings')}
            variant="outline"
            className="bg-transparent border-2 border-gray-400"
            textClassName="text-gray-600 font-semibold text-base"
            icon={<MaterialCommunityIcons name="cog" size={20} color={COLORS.gray[600]} />}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
