/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */

/**
 * 统一商品数据模型
 * 整合所有页面中的商品相关接口定义
 */

// 商品基本数据接口
export interface ProductItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sales: number;
  shopName: string;
  description: string;
  shippingAddress: string;
  stock: number;
  category: string;
}

// 商品分类类型
export type CategoryType = 'comprehensive' | 'baby' | 'sports' | 'beauty' | 'outdoor' | 'digital';

// 分类配置
export interface CategoryConfig {
  id: CategoryType;
  name: string;
}

// 分类列表
export const CATEGORIES: CategoryConfig[] = [
  { id: 'comprehensive', name: '综合' },
  { id: 'baby', name: '母婴' },
  { id: 'sports', name: '运动' },
  { id: 'beauty', name: '美妆' },
  { id: 'outdoor', name: '户外' },
  { id: 'digital', name: '数码' }
];

// 分类名称映射
export const CATEGORY_NAMES: Record<string, string> = {
  'comprehensive': '综合',
  'baby': '母婴',
  'sports': '运动',
  'beauty': '美妆',
  'outdoor': '户外',
  'digital': '数码'
};

// 获取分类名称
export function getCategoryName(category: CategoryType | string): string {
  return CATEGORY_NAMES[category] || '综合';
}

// 应用模式类型
export type AppMode = 'shopping' | 'market';

// 淘宝真实商品数据
export const TAOBAO_PRODUCTS: ProductItem[] = [
  {
    id: 'product_1',
    name: '树莓派人形机器人AI视觉大模型TonyPi仿生双足具身智能Python编程',
    price: 3699,
    imageUrl: 'https://img.alicdn.com/imgextra/i1/2201505950941/O1CN01b9Yn2f1Ip1lBcepD3_!!2201505950941.png_760x760q30.jpg_.webp',
    sales: 128,
    shopName: '幻尔旗舰店',
    description: '树莓派人形机器人TonyPi是一款具备AI视觉大模型能力的仿生双足机器人，支持Python编程，适合STEM教育和人工智能学习。具备自主导航、语音交互、视觉识别等功能，是学习机器人和AI技术的理想平台。',
    shippingAddress: '广东省深圳市',
    stock: 50,
    category: '数码'
  },
  {
    id: 'product_2',
    name: '【618立即抢购】毛戈平鱼子酱面膜涂抹熬夜救星舒缓修护抗皱紧致',
    price: 299,
    imageUrl: 'https://img.alicdn.com/imgextra/i2/839895996/O1CN01cqDCSd1uADugGJQZV_!!839895996.jpg_760x760q30.jpg_.webp',
    sales: 5623,
    shopName: 'MAOGEPING毛戈平官方旗舰店',
    description: '毛戈平鱼子酱面膜，富含深海鱼子酱精华，能够深层滋养肌肤，舒缓修护，抗皱紧致。适合熬夜肌肤使用，快速恢复肌肤弹性与光泽，让肌肤重现年轻状态。',
    shippingAddress: '上海市',
    stock: 200,
    category: '美妆'
  },
  {
    id: 'product_3',
    name: '苏泊尔电烤箱家用大容量蒸烤炸一体多功能智能调控长效预约烘焙箱',
    price: 599,
    imageUrl: 'https://img.alicdn.com/imgextra/i3/2219155702334/O1CN01nMjc3X1T71RStDyKK_!!2219155702334.jpg_760x760q30.jpg_.webp',
    sales: 892,
    shopName: '苏泊尔智能阳台旗舰店',
    description: '苏泊尔电烤箱，大容量设计，支持蒸、烤、炸多种烹饪方式。智能温控系统，长效预约功能，让烹饪更轻松。适合家庭使用，满足各种烘焙需求。',
    shippingAddress: '浙江省杭州市',
    stock: 150,
    category: '综合'
  },
  {
    id: 'product_4',
    name: '灵动创想初音未来马尾甩甩毛绒玩偶周边挂件fufu公仔娃娃生日礼物',
    price: 89,
    imageUrl: 'https://img.alicdn.com/imgextra/i1/2201505950941/O1CN01b9Yn2f1Ip1lBcepD3_!!2201505950941.png_760x760q30.jpg_.webp',
    sales: 3456,
    shopName: '灵动创想旗舰店',
    description: '初音未来官方授权毛绒玩偶，采用优质毛绒材质，手感柔软舒适。可爱的马尾甩甩造型，适合作为挂件或摆件，是初音未来粉丝的必备收藏品。',
    shippingAddress: '北京市',
    stock: 300,
    category: '综合'
  }
];
