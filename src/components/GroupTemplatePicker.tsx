/**
 * 分類套組選擇器組件
 * 顯示可用的分類套組模板，付費用戶可以引入，免費用戶只能查看
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useTranslation} from 'react-i18next';
import {COLORS} from '@constants/colors';
import {GROUP_TEMPLATES} from '@constants/groupTemplates';
import {isPremiumUser} from '@utils/permission';
import type {UserPermission} from '@/types';

interface GroupTemplatePickerProps {
  visible: boolean;
  onClose: () => void;
  onImport: (templateId: string) => void;
  userPermission: UserPermission;
  onShowUpgrade?: () => void;
}

export const GroupTemplatePicker: React.FC<GroupTemplatePickerProps> = ({
  visible,
  onClose,
  onImport,
  userPermission,
  onShowUpgrade,
}) => {
  const {t} = useTranslation();
  const isPremium = isPremiumUser(userPermission);

  const handleImportTemplate = (templateId: string) => {
    if (!isPremium) {
      // 免費用戶需要升級
      Alert.alert(
        t('group.upgradeTitle'),
        t('group.templateUpgradeMessage'),
        [
          {text: t('common.cancel'), style: 'cancel'},
          {
            text: t('group.upgradeButton'),
            onPress: () => {
              onClose();
              onShowUpgrade?.();
            },
          },
        ],
      );
      return;
    }

    try {
      onImport(templateId);
      Alert.alert(t('group.templateImported'), t('group.templateImportedMessage'));
      onClose();
    } catch (error: any) {
      if (error.message === 'PREMIUM_REQUIRED') {
        Alert.alert(
          t('group.upgradeTitle'),
          t('group.templateUpgradeMessage'),
          [
            {text: t('common.cancel'), style: 'cancel'},
            {
              text: t('group.upgradeButton'),
              onPress: () => {
                onClose();
                onShowUpgrade?.();
              },
            },
          ],
        );
      } else {
        Alert.alert(t('common.error'), t('group.templateImportFailed'));
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* 標題欄 */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('group.selectTemplate')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={COLORS.gray[600]} />
            </TouchableOpacity>
          </View>

          {/* 提示信息 */}
          {!isPremium && (
            <View style={styles.premiumBanner}>
              <MaterialCommunityIcons name="lock" size={20} color={COLORS.orange[200]} />
              <Text style={styles.premiumText}>{t('group.templatePremiumOnly')}</Text>
            </View>
          )}

          {/* 套組列表 */}
          <ScrollView style={styles.templateList}>
            {GROUP_TEMPLATES.map(template => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateItem,
                  !isPremium && styles.templateItemDisabled,
                ]}
                onPress={() => handleImportTemplate(template.id)}
                disabled={!isPremium}>
                <View style={styles.templateIconContainer}>
                  <MaterialCommunityIcons
                    name={template.icon as any}
                    size={32}
                    color={isPremium ? COLORS.blue[600] : COLORS.gray[400]}
                  />
                </View>
                <View style={styles.templateInfo}>
                  <Text
                    style={[
                      styles.templateName,
                      !isPremium && styles.templateNameDisabled,
                    ]}>
                    {template.name}
                  </Text>
                  <Text
                    style={[
                      styles.templateDescription,
                      !isPremium && styles.templateDescriptionDisabled,
                    ]}>
                    {template.description}
                  </Text>
                  <Text style={styles.templateItemCount}>
                    {t('group.templateItemsCount', {count: template.items.length})}
                  </Text>
                </View>
                {!isPremium && (
                  <MaterialCommunityIcons
                    name="lock"
                    size={20}
                    color={COLORS.gray[400]}
                    style={styles.lockIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.orange[200] + '20',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    gap: 8,
  },
  premiumText: {
    color: COLORS.orange[200],
    fontSize: 14,
    fontWeight: '600',
  },
  templateList: {
    paddingHorizontal: 16,
  },
  templateItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: COLORS.gray[500],
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  templateItemDisabled: {
    opacity: 0.6,
  },
  templateIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.blue[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  templateNameDisabled: {
    color: COLORS.gray[500],
  },
  templateDescription: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginBottom: 4,
  },
  templateDescriptionDisabled: {
    color: COLORS.gray[400],
  },
  templateItemCount: {
    fontSize: 12,
    color: COLORS.blue[600],
  },
  lockIcon: {
    marginLeft: 8,
  },
});

