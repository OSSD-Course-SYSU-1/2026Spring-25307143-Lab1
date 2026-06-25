/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */

/**
 * 收藏夹数据模型
 */

// 收藏记录接口
export interface FavoriteRecord {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  shopName: string;
  description: string;
  addedTime: string;
}
