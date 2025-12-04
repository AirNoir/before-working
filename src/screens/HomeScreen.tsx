/**
 * 主頁面 - 清單管理
 */

import React, {useEffect} from 'react';
import {View, Text, Alert, SafeAreaView, ScrollView} from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useAppStore} from '@store/useAppStore';
import {Header, ChecklistItemCard, AddItemInput, Button} from '@components/index';
import type {ChecklistItem} from '@types/index';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
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

    Alert.alert('確認重置', '確定要重置所有項目為未勾選狀態嗎？', [
      {text: '取消', style: 'cancel'},
      {
        text: '重置',
        style: 'destructive',
        onPress: () => resetAllItems(activeChecklistId),
      },
    ]);
  };

  const handleAddItem = (title: string) => {
    if (!activeChecklistId) return;
    addItem(activeChecklistId, title);
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
          (activeChecklist.items.filter(i => i.checked).length /
            activeChecklist.items.length) *
            100,
        )
      : 0
    : 0;

  if (!activeChecklist) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Header
          title="出門點點名"
          rightButton={{icon: '⚙️', onPress: () => navigation.navigate('Settings')}}
        />
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-textPrimary text-lg text-center">
            沒有可用的清單，請先創建一個清單
          </Text>
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
            icon: '↻',
            onPress: handleReset,
          }}
        />

        {/* 進度條 */}
        <View className="bg-white px-4 py-3 mb-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-textPrimary font-semibold">完成進度</Text>
            <Text className="text-primary font-bold text-lg">{progress}%</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-success rounded-full"
              style={{width: `${progress}%`}}
            />
          </View>
        </View>

        {/* 清單內容 */}
        <View className="flex-1 px-4">
          {/* 添加項目輸入框 */}
          <AddItemInput onAdd={handleAddItem} placeholder="添加新項目..." />

          {/* 拖拽清單 */}
          {activeChecklist.items.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-400 text-base text-center">
                目前沒有任何項目{'\n'}點擊上方輸入框添加項目
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
            title="⚙️  設置"
            variant="outline"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

