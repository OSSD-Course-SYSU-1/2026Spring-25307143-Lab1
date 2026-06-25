/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */

// 订单状态类型
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';

// 订单商品信息接口
export interface OrderProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  shopName: string;
}

// 收货地址接口
export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
}

// 订单记录接口
export interface OrderRecord {
  orderId: string;
  userId: string;        // 添加用户ID字段
  product: OrderProduct;
  totalPrice: number;
  address: ShippingAddress;  // 收货地址
  paymentMethod: string;
  createTime: string;
  payTime: string;
  completeTime?: string;  // 完成时间（可选）
  expireTime?: number;    // 订单过期时间戳（毫秒），待付款订单30分钟后过期
  status: OrderStatus;
}

// 订单记录管理类
export class OrderManager {
  private static instance: OrderManager;
  private orders: OrderRecord[] = [];

  private constructor() {
    // 初始化示例订单数据
    this.initSampleOrders();
  }

  // 获取单例实例
  static getInstance(): OrderManager {
    if (!OrderManager.instance) {
      OrderManager.instance = new OrderManager();
    }
    return OrderManager.instance;
  }

  /**
   * 从持久化存储恢复订单数据（由 OrderService 调用）
   */
  setOrdersFromStorage(orders: OrderRecord[]): void {
    this.orders = orders;
  }

  // 初始化示例订单数据
  private initSampleOrders() {
    // 用户1（原神牛逼）的订单
    const user1Orders: OrderRecord[] = [
      {
        orderId: 'ORD001',
        userId: 'user001',
        product: {
          id: 'prod001',
          name: '原神限定周边 - 钟离手办',
          price: 299,
          imageUrl: 'https://img2.baidu.com/it/u=3092765660,555765568&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          quantity: 1,
          shopName: '原神官方旗舰店'
        },
        totalPrice: 299,
        address: {
          name: '原神牛逼',
          phone: '13800138001',
          address: '北京市海淀区原神大道123号'
        },
        paymentMethod: '华为支付',
        createTime: '2025-01-15 10:30:00',
        payTime: '2025-01-15 10:32:00',
        completeTime: '2025-01-18 15:00:00',
        status: 'completed'
      },
      {
        orderId: 'ORD002',
        userId: 'user001',
        product: {
          id: 'prod002',
          name: '原神限定周边 - 派蒙抱枕',
          price: 89,
          imageUrl: 'https://img2.baidu.com/it/u=3092765660,555765568&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          quantity: 2,
          shopName: '原神官方旗舰店'
        },
        totalPrice: 178,
        address: {
          name: '原神牛逼',
          phone: '13800138001',
          address: '北京市海淀区原神大道123号'
        },
        paymentMethod: '华为支付',
        createTime: '2025-01-20 14:20:00',
        payTime: '2025-01-20 14:22:00',
        status: 'shipped'
      },
      {
        orderId: 'ORD003',
        userId: 'user001',
        product: {
          id: 'prod003',
          name: '原神限定周边 - 雷电将军海报',
          price: 29,
          imageUrl: 'https://img2.baidu.com/it/u=3092765660,555765568&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          quantity: 3,
          shopName: '原神官方旗舰店'
        },
        totalPrice: 87,
        address: {
          name: '原神牛逼',
          phone: '13800138001',
          address: '北京市海淀区原神大道123号'
        },
        paymentMethod: '华为支付',
        createTime: '2025-01-25 09:15:00',
        payTime: '',
        status: 'pending'
      }
    ];

    // 用户2（鸣潮牛逼）的订单
    const user2Orders: OrderRecord[] = [
      {
        orderId: 'ORD004',
        userId: 'user002',
        product: {
          id: 'prod004',
          name: '鸣潮限定周边 - 漪兰手办',
          price: 359,
          imageUrl: 'https://img1.baidu.com/it/u=1819327567,2469389036&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          quantity: 1,
          shopName: '鸣潮官方旗舰店'
        },
        totalPrice: 359,
        address: {
          name: '鸣潮牛逼',
          phone: '13800138002',
          address: '上海市浦东新区鸣潮路456号'
        },
        paymentMethod: '华为支付',
        createTime: '2025-01-16 11:30:00',
        payTime: '2025-01-16 11:32:00',
        completeTime: '2025-01-19 16:00:00',
        status: 'completed'
      },
      {
        orderId: 'ORD005',
        userId: 'user002',
        product: {
          id: 'prod005',
          name: '鸣潮限定周边 - 漪兰徽章套装',
          price: 68,
          imageUrl: 'https://img1.baidu.com/it/u=1819327567,2469389036&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          quantity: 1,
          shopName: '鸣潮官方旗舰店'
        },
        totalPrice: 68,
        address: {
          name: '鸣潮牛逼',
          phone: '13800138002',
          address: '上海市浦东新区鸣潮路456号'
        },
        paymentMethod: '华为支付',
        createTime: '2025-01-21 16:45:00',
        payTime: '2025-01-21 16:47:00',
        status: 'paid'
      },
      {
        orderId: 'ORD006',
        userId: 'user002',
        product: {
          id: 'prod006',
          name: '鸣潮限定周边 - 共鸣者立牌',
          price: 128,
          imageUrl: 'https://img1.baidu.com/it/u=1819327567,2469389036&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
          quantity: 2,
          shopName: '鸣潮官方旗舰店'
        },
        totalPrice: 256,
        address: {
          name: '鸣潮牛逼',
          phone: '13800138002',
          address: '上海市浦东新区鸣潮路456号'
        },
        paymentMethod: '华为支付',
        createTime: '2025-01-26 08:30:00',
        payTime: '2025-01-26 08:32:00',
        status: 'shipped'
      }
    ];

    // 合并所有订单
    this.orders = [...user1Orders, ...user2Orders];
  }

  // 添加订单记录
  addOrder(order: OrderRecord): void {
    this.orders.unshift(order); // 新订单添加到最前面
  }

  // 获取所有订单
  getAllOrders(): OrderRecord[] {
    return this.orders;
  }

  // 获取用户的订单（按用户ID筛选）
  getUserOrders(userId: string): OrderRecord[] {
    return this.orders.filter(order => order.userId === userId);
  }

  // 根据订单ID获取订单
  getOrderById(orderId: string): OrderRecord | undefined {
    return this.orders.find(order => order.orderId === orderId);
  }

  // 获取已完成的订单（可用于转售）
  getCompletedOrders(userId: string): OrderRecord[] {
    return this.orders.filter(
      order => order.userId === userId && 
      (order.status === 'completed' || order.status === 'paid')
    );
  }

  // 更新订单状态
  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const order = this.orders.find(order => order.orderId === orderId);
    if (order) {
      order.status = status;
    }
  }

  // 删除订单
  deleteOrder(orderId: string): void {
    this.orders = this.orders.filter(order => order.orderId !== orderId);
  }

  // 生成订单ID
  generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${timestamp}${random}`;
  }

  // 订单超时时间（30分钟，单位毫秒）
  private readonly ORDER_EXPIRE_TIME = 30 * 60 * 1000;

  // 创建待付款订单（带过期时间）
  createPendingOrder(order: OrderRecord): void {
    // 设置过期时间为30分钟后
    order.expireTime = Date.now() + this.ORDER_EXPIRE_TIME;
    order.status = 'pending';
    this.orders.unshift(order);
  }

  // 检查并取消超时订单
  checkAndCancelExpiredOrders(): string[] {
    const now = Date.now();
    const expiredOrderIds: string[] = [];
    
    for (let i = 0; i < this.orders.length; i++) {
      const order = this.orders[i];
      // 只检查待付款订单
      if (order.status === 'pending' && order.expireTime) {
        if (now >= order.expireTime) {
          // 订单已超时，自动取消
          order.status = 'cancelled';
          expiredOrderIds.push(order.orderId);
        }
      }
    }
    
    return expiredOrderIds;
  }

  // 获取订单剩余时间（秒）
  getOrderRemainingTime(orderId: string): number {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order || order.status !== 'pending' || !order.expireTime) {
      return 0;
    }
    
    const remaining = order.expireTime - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }

  // 获取用户待付款订单数量
  getPendingOrderCount(userId: string): number {
    // 先检查超时订单
    this.checkAndCancelExpiredOrders();
    
    return this.orders.filter(
      order => order.userId === userId && order.status === 'pending'
    ).length;
  }

  // 支付订单（更新状态并清除过期时间）
  payOrder(orderId: string): boolean {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order || order.status !== 'pending') {
      return false;
    }
    
    // 检查是否已超时
    if (order.expireTime && Date.now() >= order.expireTime) {
      order.status = 'cancelled';
      return false;
    }
    
    // 支付成功
    order.status = 'paid';
    order.payTime = new Date().toLocaleString('zh-CN');
    order.expireTime = undefined; // 清除过期时间
    return true;
  }
}
