/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */

import { OrderManager, OrderRecord, OrderStatus } from '../common/OrderManager';
import { StorageService } from './StorageService';

const STORAGE_KEY_ORDERS = 'orders_data';

/**
 * 订单数据服务
 * 包装 OrderManager，增加持久化存储/读取逻辑
 */
export class OrderService {
  private static instance: OrderService;
  private storageService: StorageService;

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * 从持久化存储加载订单数据
   */
  async loadOrdersFromStorage(): Promise<void> {
    try {
      const orders = await this.storageService.loadObject<OrderRecord[]>(STORAGE_KEY_ORDERS, null);
      if (orders && orders.length > 0) {
        OrderManager.getInstance().setOrdersFromStorage(orders);
      }
    } catch (error) {
      console.error('OrderService.loadOrdersFromStorage error: ' + JSON.stringify(error));
    }
  }

  /**
   * 保存订单数据到持久化存储
   */
  async saveOrdersToStorage(): Promise<void> {
    try {
      const orders = OrderManager.getInstance().getAllOrders();
      await this.storageService.saveObject(STORAGE_KEY_ORDERS, orders);
    } catch (error) {
      console.error('OrderService.saveOrdersToStorage error: ' + JSON.stringify(error));
    }
  }

  /**
   * 添加订单（带持久化）
   */
  async addOrder(order: OrderRecord): Promise<void> {
    OrderManager.getInstance().addOrder(order);
    await this.saveOrdersToStorage();
  }

  /**
   * 创建待付款订单（带持久化）
   */
  async createPendingOrder(order: OrderRecord): Promise<void> {
    OrderManager.getInstance().createPendingOrder(order);
    await this.saveOrdersToStorage();
  }

  /**
   * 更新订单状态（带持久化）
   */
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    OrderManager.getInstance().updateOrderStatus(orderId, status);
    await this.saveOrdersToStorage();
  }

  /**
   * 删除订单（带持久化）
   */
  async deleteOrder(orderId: string): Promise<void> {
    OrderManager.getInstance().deleteOrder(orderId);
    await this.saveOrdersToStorage();
  }

  /**
   * 检查并取消超时订单（带持久化）
   */
  async checkAndCancelExpiredOrders(): Promise<string[]> {
    const expiredIds = OrderManager.getInstance().checkAndCancelExpiredOrders();
    if (expiredIds.length > 0) {
      await this.saveOrdersToStorage();
    }
    return expiredIds;
  }
}
