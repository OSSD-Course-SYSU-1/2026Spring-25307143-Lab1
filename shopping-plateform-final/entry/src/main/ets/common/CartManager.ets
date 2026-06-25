/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */

// 购物车商品接口
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  shopName: string;
  selected: boolean;
}

// 购物车模式类型
export type CartMode = 'shopping' | 'market';

// 购物车管理类
export class CartManager {
  private static instance: CartManager;
  // 分别存储两种模式的购物车数据
  private shoppingCartItems: CartItem[] = [];
  private marketCartItems: CartItem[] = [];

  private constructor() {}

  // 获取单例实例
  static getInstance(): CartManager {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager();
    }
    return CartManager.instance;
  }

  /**
   * 从持久化存储恢复购物车数据（由 CartService 调用）
   */
  setCartItemsFromStorage(mode: CartMode, items: CartItem[]): void {
    if (mode === 'shopping') {
      this.shoppingCartItems = items;
    } else {
      this.marketCartItems = items;
    }
  }

  // 根据模式获取对应的购物车数据
  private getCartItemsByMode(mode: CartMode): CartItem[] {
    return mode === 'shopping' ? this.shoppingCartItems : this.marketCartItems;
  }

  // 根据模式设置对应的购物车数据
  private setCartItemsByMode(mode: CartMode, items: CartItem[]): void {
    if (mode === 'shopping') {
      this.shoppingCartItems = items;
    } else {
      this.marketCartItems = items;
    }
  }

  // 添加商品到购物车
  addToCart(product: CartItem, mode: CartMode): void {
    const cartItems = this.getCartItemsByMode(mode);
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += product.quantity;
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: product.quantity,
        shopName: product.shopName,
        selected: true
      };
      cartItems.push(newItem);
    }
    this.setCartItemsByMode(mode, cartItems);
  }

  // 从购物车移除商品
  removeFromCart(productId: string, mode: CartMode): void {
    const cartItems = this.getCartItemsByMode(mode);
    const newItems = cartItems.filter(item => item.id !== productId);
    this.setCartItemsByMode(mode, newItems);
  }

  // 更新商品数量
  updateQuantity(productId: string, quantity: number, mode: CartMode): void {
    const cartItems = this.getCartItemsByMode(mode);
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId, mode);
      }
    }
    this.setCartItemsByMode(mode, cartItems);
  }

  // 更新商品选中状态
  updateSelected(productId: string, selected: boolean, mode: CartMode): void {
    const cartItems = this.getCartItemsByMode(mode);
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      item.selected = selected;
    }
    this.setCartItemsByMode(mode, cartItems);
  }

  // 全选/取消全选
  selectAll(selected: boolean, mode: CartMode): void {
    const cartItems = this.getCartItemsByMode(mode);
    cartItems.forEach(item => {
      item.selected = selected;
    });
    this.setCartItemsByMode(mode, cartItems);
  }

  // 获取购物车商品列表
  getCartItems(mode: CartMode): CartItem[] {
    return this.getCartItemsByMode(mode);
  }

  // 获取购物车商品数量
  getCartCount(mode: CartMode): number {
    const cartItems = this.getCartItemsByMode(mode);
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // 获取选中商品列表
  getSelectedItems(mode: CartMode): CartItem[] {
    const cartItems = this.getCartItemsByMode(mode);
    return cartItems.filter(item => item.selected);
  }

  // 计算选中商品总价
  getSelectedTotalPrice(mode: CartMode): number {
    const cartItems = this.getCartItemsByMode(mode);
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }

  // 清空购物车
  clearCart(mode: CartMode): void {
    this.setCartItemsByMode(mode, []);
  }

  // 清空已选中的商品
  clearSelectedItems(mode: CartMode): void {
    const cartItems = this.getCartItemsByMode(mode);
    const newItems = cartItems.filter(item => !item.selected);
    this.setCartItemsByMode(mode, newItems);
  }
}
