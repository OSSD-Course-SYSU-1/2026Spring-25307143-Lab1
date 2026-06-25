/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */

/**
 * 集中定义所有路由参数接口
 */

import { ProductItem } from './ProductModel';

// 商品详情页路由参数
export interface ProductDetailParams {
  productData: ProductItem;
  mode?: 'shopping' | 'market';
}

// 创建订单页路由参数
export interface CreateOrderParams {
  productData: ProductItem;
  quantity: number;
}

// 支付页路由参数
export interface PaymentParams {
  productData: ProductItem;
  quantity: number;
  address?: {
    id: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
  };
  paymentMethod: string;
}

// 订单列表页路由参数
export interface OrderListParams {
  orderType: string;
}

// 订单详情页路由参数
export interface OrderDetailParams {
  orderId: string;
}

// 分类商品页路由参数
export interface CategoryProductParams {
  category: string;
  currentMode: 'shopping' | 'market';
}

// 搜索结果页路由参数
export interface SearchResultParams {
  keyword: string;
  category: string;
  currentMode: 'shopping' | 'market';
}

// 转售编辑页路由参数
export interface ResaleEditParams {
  resaleId?: string;
  productData: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    shopName: string;
    description: string;
  };
  quantity: number;
  orderId: string;
  resalePrice?: number;
  description?: string;
}

// 我的市集页路由参数
export interface MyMarketParams {
  marketType: string;
}
