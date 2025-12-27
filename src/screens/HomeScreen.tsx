/**
 * 主頁面 - 清單管理
 */

import React, {useEffect, useState} from 'react';
import {View, Text, Alert, SafeAreaView, ScrollView, FlatList} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useAppStore} from '@store/useAppStore';
import {Header, ChecklistItemCard, AddItemInput, Button, PersonalToolBar} from '@components/index';
import {COLORS} from '@constants/colors';
import type {ChecklistItem} from '@/types';

// 动态导入 DraggableFlatList，如果失败则使用普通 FlatList
let DraggableFlatList: any = null;
let ScaleDecorator: any = null;
let isDraggableAvailable = false;

try {
  const draggableModule = require('react-native-draggable-flatlist');
  DraggableFlatList = draggableModule.default;
  ScaleDecorator = draggableModule.ScaleDecorator;
  isDraggableAvailable = true;
} catch (error) {
  // 如果无法加载，使用普通 FlatList
  console.warn('DraggableFlatList not available, using regular FlatList');
  isDraggableAvailable = false;
}

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

  // 渲染列表项
  const renderItem = (params: any) => {
    if (!activeChecklistId) return null;

    const {item, drag, isActive} = params;
    const itemContent = (
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
    );

    // 如果支持拖拽，使用 ScaleDecorator
    if (isDraggableAvailable && ScaleDecorator) {
      return <ScaleDecorator>{itemContent}</ScaleDecorator>;
    }

    return itemContent;
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
        <PersonalToolBar />
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

        {/* Personal ToolBar */}
        <PersonalToolBar />

        {/* 進度條 */}
        <View className="bg-white px-4 py-3 mb-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-textPrimary font-semibold">{t('home.progress')}</Text>
            <Text className="text-primary font-bold text-lg">{progress}%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full bg-lavender rounded-full" style={{width: `${progress}%`}} />
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
          ) : isDraggableAvailable && DraggableFlatList ? (
            <DraggableFlatList
              data={activeChecklist.items}
              renderItem={renderItem}
              keyExtractor={(item: ChecklistItem) => item.id}
              onDragEnd={({data}: {data: ChecklistItem[]}) => handleReorder(data)}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={activeChecklist.items}
              renderItem={({item}: {item: ChecklistItem}) =>
                renderItem({item, drag: undefined, isActive: false})
              }
              keyExtractor={(item: ChecklistItem) => item.id}
              showsVerticalScrollIndicator={false}
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
