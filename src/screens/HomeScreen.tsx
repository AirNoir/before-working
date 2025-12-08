/**
 * 主頁面 - 清單管理
 */

import React, {useEffect} from 'react';
import {View, Text, Alert, SafeAreaView, ScrollView} from 'react-native';
import DraggableFlatList, {RenderItemParams, ScaleDecorator} from 'react-native-draggable-flatlist';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {useAppStore} from '@store/useAppStore';
import {Header, ChecklistItemCard, AddItemInput, Button} from '@components/index';
import type {ChecklistItem} from '@types/index';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {
    checklists,
    activeChecklistId,
    addItem,
    deleteItem,
    updateItem,
    toggleItemCheck,
    resetAllItems,
    reorderItems,
  } = useAppStore();

  // 獲取當前活動清單
  const activeChecklist = checklists.find(c => c.id === activeChecklistId);

  const handleReset = () => {
    if (!activeChecklistId) return;

    Alert.alert(t('home.resetConfirm'), t('home.resetMessage'), [
      {text: t('common.cancel'), style: 'cancel'},
      {
        text: t('common.reset'),
        style: 'destructive',
        onPress: () => resetAllItems(activeChecklistId),
      },
    ]);
  };

  const handleAddItem = (title: string, icon?: string) => {
    if (!activeChecklistId) return;
    addItem(activeChecklistId, title, icon);
  };

  const handleReorder = (data: ChecklistItem[]) => {
    if (!activeChecklistId) return;
    reorderItems(activeChecklistId, data);
  };

  const renderItem = ({item, drag, isActive}: RenderItemParams<ChecklistItem>) => {
    if (!activeChecklistId) return null;

    return (
      <ScaleDecorator>
        <ChecklistItemCard
          id={item.id}
          title={item.title}
          icon={item.icon}
          checked={item.checked}
          onToggle={() => toggleItemCheck(activeChecklistId, item.id)}
          onDelete={() => deleteItem(activeChecklistId, item.id)}
          onUpdate={newTitle => updateItem(activeChecklistId, item.id, newTitle)}
          drag={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
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

  if (!activeChecklist) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header
          title={t('app.name')}
          rightButton={{icon: 'cog', onPress: () => navigation.navigate('Settings')}}
        />
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-textPrimary text-lg text-center">{t('home.noChecklist')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView className="flex-1 bg-background">
        {/* Header */}
        <Header
          title={activeChecklist.name}
          rightButton={{
            icon: 'refresh',
            onPress: handleReset,
          }}
        />

        {/* 進度條 */}
        <View className="bg-white px-4 py-3 mb-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-textPrimary font-semibold">{t('home.progress')}</Text>
            <Text className="text-primary font-bold text-lg">{progress}%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full bg-success rounded-full" style={{width: `${progress}%`}} />
          </View>
        </View>

        {/* 清單內容 */}
        <View className="flex-1 px-4">
          {/* 添加項目輸入框 */}
          <AddItemInput onAdd={handleAddItem} placeholder={t('home.addItemPlaceholder')} />

          {/* 拖拽清單 */}
          {activeChecklist.items.length === 0 ? (
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
              keyExtractor={item => item.id}
              onDragEnd={({data}) => handleReorder(data)}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* 底部設置按鈕 */}
        <View className="p-4 bg-white border-t border-gray-200">
          <Button
            title={t('common.settings')}
            variant="outline"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};
