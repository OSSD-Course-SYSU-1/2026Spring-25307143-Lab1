/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */

import { ProductItem, CategoryType, CATEGORY_NAMES, TAOBAO_PRODUCTS } from '../models/ProductModel';
import { ResaleManager } from '../common/ResaleManager';

/**
 * 商品数据服务
 * 整合淘宝商品数据和市集二手商品数据，提供按分类/关键词筛选方法
 */
export class ProductService {
  private static instance: ProductService;

  private constructor() {}

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * 获取购物模式商品列表
   */
  getShoppingProducts(category?: CategoryType | string): ProductItem[] {
    let products = [...TAOBAO_PRODUCTS];

    if (category && category !== 'comprehensive') {
      const catName = CATEGORY_NAMES[category] || '';
      products = products.filter(p => catName ? p.category === catName : true);
    }

    return products;
  }

  /**
   * 获取市集模式商品列表（来自 ResaleManager 的已发布转售订单）
   */
  getMarketProducts(category?: CategoryType | string): ProductItem[] {
    const publishedResales = ResaleManager.getInstance().getPublishedResaleOrders();
    
    let products: ProductItem[] = publishedResales.map((resale, index) => ({
      id: resale.resaleId,
      name: resale.product.name,
      price: resale.resalePrice,
      imageUrl: resale.product.imageUrl,
      sales: resale.viewCount,
      shopName: resale.sellerName,
      description: resale.description,
      shippingAddress: '全国包邮',
      stock: resale.product.quantity,
      category: '综合'
    } as ProductItem));

    if (category && category !== 'comprehensive') {
      const catName = CATEGORY_NAMES[category] || '';
      products = products.filter(p => catName ? p.category === catName : true);
    }

    return products;
  }

  /**
   * 根据模式获取商品列表
   */
  getProducts(mode: 'shopping' | 'market', category?: CategoryType | string): ProductItem[] {
    return mode === 'shopping'
      ? this.getShoppingProducts(category)
      : this.getMarketProducts(category);
  }

  /**
   * 根据关键词搜索商品
   */
  searchProducts(keyword: string, mode: 'shopping' | 'market', category?: CategoryType | string): ProductItem[] {
    const products = this.getProducts(mode, category);
    if (!keyword.trim()) {
      return products;
    }

    const kw = keyword.trim().toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      p.description.toLowerCase().includes(kw) ||
      p.shopName.toLowerCase().includes(kw)
    );
  }

  /**
   * 根据ID获取商品
   */
  getProductById(productId: string): ProductItem | undefined {
    // 先从淘宝数据查找
    const taobaoProduct = TAOBAO_PRODUCTS.find(p => p.id === productId);
    if (taobaoProduct) {
      return taobaoProduct;
    }
    // 再从市集数据查找
    const publishedResales = ResaleManager.getInstance().getPublishedResaleOrders();
    const resale = publishedResales.find(r => r.resaleId === productId);
    if (resale) {
      return {
        id: resale.resaleId,
        name: resale.product.name,
        price: resale.resalePrice,
        imageUrl: resale.product.imageUrl,
        sales: resale.viewCount,
        shopName: resale.sellerName,
        description: resale.description,
        shippingAddress: '全国包邮',
        stock: resale.product.quantity,
        category: '综合'
      };
    }
    return undefined;
  }
}
