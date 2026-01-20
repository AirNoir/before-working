/**
 * 分類套組模板
 * 包含預設的分類和對應的檢查項目
 */

import type {ChecklistGroup, Checklist} from '@/types';

export interface GroupTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  items: Array<{
    title: string;
    icon: string;
  }>;
}

/**
 * 分類套組模板列表
 */
export const GROUP_TEMPLATES: GroupTemplate[] = [
  {
    id: 'fitness',
    name: '健身',
    icon: 'dumbbell',
    description: '運動健身前的檢查清單',
    items: [
      {title: '運動服', icon: 'tshirt-crew'},
      {title: '運動鞋', icon: 'shoe-sneaker'},
      {title: '水壺', icon: 'water'},
      {title: '毛巾', icon: 'towel'},
      {title: '運動包', icon: 'bag'},
      {title: '耳機', icon: 'headphones'},
      {title: '手機', icon: 'cellphone'},
      {title: '鑰匙', icon: 'key'},
    ],
  },
  {
    id: 'travel',
    name: '旅遊',
    icon: 'airplane',
    description: '出門旅遊前的檢查清單',
    items: [
      {title: '護照/證件', icon: 'card-account-details'},
      {title: '機票/車票', icon: 'ticket'},
      {title: '錢包', icon: 'wallet'},
      {title: '充電器', icon: 'power-plug'},
      {title: '行動電源', icon: 'battery-charging'},
      {title: '相機', icon: 'camera'},
      {title: '換洗衣物', icon: 'hanger'},
      {title: '盥洗用品', icon: 'shower'},
      {title: '藥品', icon: 'pill'},
      {title: '地圖/導航', icon: 'map'},
    ],
  },
  {
    id: 'parenting',
    name: '育兒',
    icon: 'baby-face-outline',
    description: '帶孩子出門前的檢查清單',
    items: [
      {title: '尿布', icon: 'baby-buggy'},
      {title: '濕紙巾', icon: 'tissue'},
      {title: '奶瓶', icon: 'cup'},
      {title: '奶粉', icon: 'food'},
      {title: '換洗衣物', icon: 'hanger'},
      {title: '玩具', icon: 'toy-brick'},
      {title: '推車', icon: 'car'},
      {title: '水壺', icon: 'water'},
      {title: '小毯子', icon: 'blanket'},
      {title: '零食', icon: 'cookie'},
    ],
  },
  {
    id: 'school',
    name: '上課',
    icon: 'school',
    description: '上學上課前的檢查清單',
    items: [
      {title: '書包', icon: 'bag'},
      {title: '課本', icon: 'book-open-variant'},
      {title: '筆記本', icon: 'notebook'},
      {title: '筆', icon: 'pencil'},
      {title: '學生證', icon: 'card-account-details'},
      {title: '午餐盒', icon: 'food'},
      {title: '水壺', icon: 'water'},
      {title: '手機', icon: 'cellphone'},
    ],
  },
  {
    id: 'tutoring',
    name: '補習',
    icon: 'book-education',
    description: '補習班前的檢查清單',
    items: [
      {title: '書包', icon: 'bag'},
      {title: '教材', icon: 'book-open-variant'},
      {title: '作業', icon: 'file-document'},
      {title: '筆記本', icon: 'notebook'},
      {title: '筆', icon: 'pencil'},
      {title: '計算機', icon: 'calculator'},
      {title: '水壺', icon: 'water'},
      {title: '錢包', icon: 'wallet'},
    ],
  },
  {
    id: 'basketball',
    name: '打球',
    icon: 'basketball',
    description: '運動打球前的檢查清單',
    items: [
      {title: '球衣', icon: 'tshirt-crew'},
      {title: '球鞋', icon: 'shoe-sneaker'},
      {title: '籃球', icon: 'basketball'},
      {title: '水壺', icon: 'water'},
      {title: '毛巾', icon: 'towel'},
      {title: '運動包', icon: 'bag'},
      {title: '手機', icon: 'cellphone'},
      {title: '鑰匙', icon: 'key'},
    ],
  },
  {
    id: 'hiking',
    name: '登山',
    icon: 'hiking',
    description: '登山健行前的檢查清單',
    items: [
      {title: '登山包', icon: 'bag'},
      {title: '登山鞋', icon: 'shoe-hiking'},
      {title: '水壺', icon: 'water'},
      {title: '食物', icon: 'food'},
      {title: '雨衣', icon: 'weather-rainy'},
      {title: '手電筒', icon: 'flashlight'},
      {title: '地圖', icon: 'map'},
      {title: '急救包', icon: 'medical-bag'},
      {title: '手機', icon: 'cellphone'},
      {title: '行動電源', icon: 'battery-charging'},
    ],
  },
  {
    id: 'doctor',
    name: '看醫生',
    icon: 'doctor',
    description: '就醫前的檢查清單',
    items: [
      {title: '健保卡', icon: 'card-account-details'},
      {title: '身份證', icon: 'card-account'},
      {title: '錢包', icon: 'wallet'},
      {title: '手機', icon: 'cellphone'},
      {title: '病歷本', icon: 'file-document'},
      {title: '藥袋', icon: 'pill'},
      {title: '口罩', icon: 'face-mask'},
    ],
  },
  {
    id: 'date',
    name: '約會',
    icon: 'heart',
    description: '約會前的檢查清單',
    items: [
      {title: '錢包', icon: 'wallet'},
      {title: '手機', icon: 'cellphone'},
      {title: '鑰匙', icon: 'key'},
      {title: '禮物', icon: 'gift'},
      {title: '雨傘', icon: 'umbrella'},
      {title: '充電器', icon: 'power-plug'},
    ],
  },
  {
    id: 'movie',
    name: '看電影',
    icon: 'movie',
    description: '看電影前的檢查清單',
    items: [
      {title: '電影票', icon: 'ticket'},
      {title: '錢包', icon: 'wallet'},
      {title: '手機', icon: 'cellphone'},
      {title: '鑰匙', icon: 'key'},
      {title: '眼鏡', icon: 'glasses'},
    ],
  },
  {
    id: 'concert',
    name: '看演唱會',
    icon: 'music',
    description: '演唱會前的檢查清單',
    items: [
      {title: '演唱會門票', icon: 'ticket'},
      {title: '錢包', icon: 'wallet'},
      {title: '手機', icon: 'cellphone'},
      {title: '充電器', icon: 'power-plug'},
      {title: '行動電源', icon: 'battery-charging'},
      {title: '相機', icon: 'camera'},
      {title: '耳塞', icon: 'ear-hearing'},
    ],
  },
  {
    id: 'shopping',
    name: '購物',
    icon: 'shopping',
    description: '購物前的檢查清單',
    items: [
      {title: '錢包', icon: 'wallet'},
      {title: '信用卡', icon: 'credit-card'},
      {title: '購物袋', icon: 'bag'},
      {title: '手機', icon: 'cellphone'},
      {title: '購物清單', icon: 'file-document'},
      {title: '鑰匙', icon: 'key'},
    ],
  },
  {
    id: 'workout',
    name: '運動',
    icon: 'run',
    description: '一般運動前的檢查清單',
    items: [
      {title: '運動服', icon: 'tshirt-crew'},
      {title: '運動鞋', icon: 'shoe-sneaker'},
      {title: '水壺', icon: 'water'},
      {title: '毛巾', icon: 'towel'},
      {title: '運動包', icon: 'bag'},
      {title: '手機', icon: 'cellphone'},
    ],
  },
  {
    id: 'swimming',
    name: '游泳',
    icon: 'swim',
    description: '游泳前的檢查清單',
    items: [
      {title: '泳衣', icon: 'tshirt-crew'},
      {title: '泳帽', icon: 'hat-fedora'},
      {title: '泳鏡', icon: 'glasses'},
      {title: '毛巾', icon: 'towel'},
      {title: '拖鞋', icon: 'shoe-sneaker'},
      {title: '盥洗用品', icon: 'shower'},
      {title: '換洗衣物', icon: 'hanger'},
      {title: '防水袋', icon: 'bag'},
    ],
  },
  {
    id: 'camping',
    name: '露營',
    icon: 'tent',
    description: '露營前的檢查清單',
    items: [
      {title: '帳篷', icon: 'tent'},
      {title: '睡袋', icon: 'blanket'},
      {title: '露營燈', icon: 'lightbulb'},
      {title: '食物', icon: 'food'},
      {title: '水', icon: 'water'},
      {title: '炊具', icon: 'pot'},
      {title: '手電筒', icon: 'flashlight'},
      {title: '急救包', icon: 'medical-bag'},
      {title: '手機', icon: 'cellphone'},
      {title: '行動電源', icon: 'battery-charging'},
    ],
  },
  {
    id: 'beach',
    name: '海邊',
    icon: 'beach',
    description: '海邊遊玩前的檢查清單',
    items: [
      {title: '泳衣', icon: 'tshirt-crew'},
      {title: '毛巾', icon: 'towel'},
      {title: '防曬乳', icon: 'lotion'},
      {title: '太陽眼鏡', icon: 'glasses'},
      {title: '遮陽帽', icon: 'hat-fedora'},
      {title: '拖鞋', icon: 'shoe-sneaker'},
      {title: '水', icon: 'water'},
      {title: '手機', icon: 'cellphone'},
      {title: '防水袋', icon: 'bag'},
    ],
  },
  {
    id: 'picnic',
    name: '野餐',
    icon: 'food',
    description: '野餐前的檢查清單',
    items: [
      {title: '野餐墊', icon: 'blanket'},
      {title: '食物', icon: 'food'},
      {title: '飲料', icon: 'cup'},
      {title: '餐具', icon: 'silverware'},
      {title: '垃圾袋', icon: 'bag'},
      {title: '濕紙巾', icon: 'tissue'},
      {title: '手機', icon: 'cellphone'},
      {title: '相機', icon: 'camera'},
    ],
  },
  {
    id: 'library',
    name: '圖書館',
    icon: 'library',
    description: '圖書館前的檢查清單',
    items: [
      {title: '借書證', icon: 'card-account-details'},
      {title: '書包', icon: 'bag'},
      {title: '筆記本', icon: 'notebook'},
      {title: '筆', icon: 'pencil'},
      {title: '水壺', icon: 'water'},
      {title: '手機', icon: 'cellphone'},
      {title: '耳機', icon: 'headphones'},
    ],
  },
  {
    id: 'gym',
    name: '健身房',
    icon: 'dumbbell',
    description: '健身房前的檢查清單',
    items: [
      {title: '運動服', icon: 'tshirt-crew'},
      {title: '運動鞋', icon: 'shoe-sneaker'},
      {title: '水壺', icon: 'water'},
      {title: '毛巾', icon: 'towel'},
      {title: '會員卡', icon: 'card-account-details'},
      {title: '手機', icon: 'cellphone'},
      {title: '耳機', icon: 'headphones'},
      {title: '鑰匙', icon: 'key'},
    ],
  },
  {
    id: 'interview',
    name: '面試',
    icon: 'briefcase',
    description: '面試前的檢查清單',
    items: [
      {title: '履歷表', icon: 'file-document'},
      {title: '證件', icon: 'card-account-details'},
      {title: '作品集', icon: 'folder'},
      {title: '筆', icon: 'pencil'},
      {title: '筆記本', icon: 'notebook'},
      {title: '手機', icon: 'cellphone'},
      {title: '錢包', icon: 'wallet'},
      {title: '鑰匙', icon: 'key'},
    ],
  },
  {
    id: 'meeting',
    name: '開會',
    icon: 'account-group',
    description: '開會前的檢查清單',
    items: [
      {title: '筆記本', icon: 'notebook'},
      {title: '筆', icon: 'pencil'},
      {title: '資料', icon: 'file-document'},
      {title: '筆電', icon: 'laptop'},
      {title: '充電器', icon: 'power-plug'},
      {title: '手機', icon: 'cellphone'},
      {title: '名片', icon: 'card-account-details'},
    ],
  },
  {
    id: 'party',
    name: '派對',
    icon: 'party-popper',
    description: '派對前的檢查清單',
    items: [
      {title: '禮物', icon: 'gift'},
      {title: '錢包', icon: 'wallet'},
      {title: '手機', icon: 'cellphone'},
      {title: '鑰匙', icon: 'key'},
      {title: '相機', icon: 'camera'},
      {title: '充電器', icon: 'power-plug'},
    ],
  },
  {
    id: 'wedding',
    name: '婚禮',
    icon: 'ring',
    description: '參加婚禮前的檢查清單',
    items: [
      {title: '禮金', icon: 'wallet'},
      {title: '禮服', icon: 'tshirt-crew'},
      {title: '禮物', icon: 'gift'},
      {title: '手機', icon: 'cellphone'},
      {title: '相機', icon: 'camera'},
      {title: '充電器', icon: 'power-plug'},
    ],
  },
  {
    id: 'business',
    name: '出差',
    icon: 'briefcase',
    description: '出差前的檢查清單',
    items: [
      {title: '護照/證件', icon: 'card-account-details'},
      {title: '機票', icon: 'ticket'},
      {title: '筆電', icon: 'laptop'},
      {title: '充電器', icon: 'power-plug'},
      {title: '換洗衣物', icon: 'hanger'},
      {title: '盥洗用品', icon: 'shower'},
      {title: '錢包', icon: 'wallet'},
      {title: '手機', icon: 'cellphone'},
    ],
  },
  {
    id: 'hospital',
    name: '探病',
    icon: 'hospital',
    description: '探病前的檢查清單',
    items: [
      {title: '探病禮物', icon: 'gift'},
      {title: '口罩', icon: 'face-mask'},
      {title: '錢包', icon: 'wallet'},
      {title: '手機', icon: 'cellphone'},
      {title: '鑰匙', icon: 'key'},
    ],
  },
  {
    id: 'museum',
    name: '看展覽',
    icon: 'palette',
    description: '看展覽前的檢查清單',
    items: [
      {title: '門票', icon: 'ticket'},
      {title: '錢包', icon: 'wallet'},
      {title: '手機', icon: 'cellphone'},
      {title: '相機', icon: 'camera'},
      {title: '充電器', icon: 'power-plug'},
      {title: '鑰匙', icon: 'key'},
    ],
  },
  {
    id: 'karaoke',
    name: 'KTV',
    icon: 'microphone',
    description: 'KTV前的檢查清單',
    items: [
      {title: '錢包', icon: 'wallet'},
      {title: '手機', icon: 'cellphone'},
      {title: '充電器', icon: 'power-plug'},
      {title: '鑰匙', icon: 'key'},
    ],
  },
  {
    id: 'fishing',
    name: '釣魚',
    icon: 'fish',
    description: '釣魚前的檢查清單',
    items: [
      {title: '釣竿', icon: 'fishing'},
      {title: '釣具', icon: 'toolbox'},
      {title: '魚餌', icon: 'food'},
      {title: '水', icon: 'water'},
      {title: '食物', icon: 'food'},
      {title: '帽子', icon: 'hat-fedora'},
      {title: '太陽眼鏡', icon: 'glasses'},
      {title: '手機', icon: 'cellphone'},
    ],
  },
  {
    id: 'cycling',
    name: '騎車',
    icon: 'bike',
    description: '騎車前的檢查清單',
    items: [
      {title: '安全帽', icon: 'hat-fedora'},
      {title: '水壺', icon: 'water'},
      {title: '手機', icon: 'cellphone'},
      {title: '鑰匙', icon: 'key'},
      {title: '錢包', icon: 'wallet'},
      {title: '修車工具', icon: 'toolbox'},
    ],
  },
  {
    id: 'yoga',
    name: '瑜伽',
    icon: 'yoga',
    description: '瑜伽前的檢查清單',
    items: [
      {title: '瑜伽墊', icon: 'blanket'},
      {title: '運動服', icon: 'tshirt-crew'},
      {title: '水壺', icon: 'water'},
      {title: '毛巾', icon: 'towel'},
      {title: '手機', icon: 'cellphone'},
      {title: '鑰匙', icon: 'key'},
    ],
  },
];

/**
 * 根據模板ID獲取模板
 */
export const getTemplateById = (id: string): GroupTemplate | undefined => {
  return GROUP_TEMPLATES.find(template => template.id === id);
};

/**
 * 將模板轉換為分組和清單項目
 */
export const convertTemplateToGroup = (
  template: GroupTemplate,
  generateId: () => string,
): {group: ChecklistGroup; checklist: Checklist} => {
  const now = Date.now();
  const group: ChecklistGroup = {
    id: generateId(),
    name: template.name,
    icon: template.icon,
    order: 0,
    createdAt: now,
  };

  const checklist: Checklist = {
    id: generateId(),
    name: template.name,
    items: template.items.map((item, index) => ({
      id: generateId(),
      title: item.title,
      icon: item.icon,
      checked: false,
      order: index,
      createdAt: now,
    })),
    groupId: group.id,
    createdAt: now,
    updatedAt: now,
  };

  return {group, checklist};
};

