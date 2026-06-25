/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */

import { MessageRecord, MessageType } from '../models/MessageModel';
import { StorageService } from './StorageService';

const STORAGE_KEY_MESSAGES = 'messages_data';

/**
 * 消息数据服务
 */
export class MessageService {
  private static instance: MessageService;
  private storageService: StorageService;
  private messages: MessageRecord[] = [];
  private initialized: boolean = false;

  private constructor() {
    this.storageService = StorageService.getInstance();
  }

  static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  /**
   * 从持久化存储加载消息数据
   */
  async loadMessagesFromStorage(): Promise<void> {
    if (this.initialized) {
      return;
    }
    try {
      const data = await this.storageService.loadObject<MessageRecord[]>(STORAGE_KEY_MESSAGES, null);
      if (data && data.length > 0) {
        this.messages = data;
      } else {
        // 首次使用，初始化示例消息
        this.initSampleMessages();
      }
      this.initialized = true;
    } catch (error) {
      console.error('MessageService.loadMessagesFromStorage error: ' + JSON.stringify(error));
      if (!this.initialized) {
        this.initSampleMessages();
        this.initialized = true;
      }
    }
  }

  /**
   * 初始化示例消息
   */
  private initSampleMessages(): void {
    const now = new Date();
    const today = now.toLocaleString('zh-CN');
    const yesterday = new Date(now.getTime() - 86400000).toLocaleString('zh-CN');
    const twoDaysAgo = new Date(now.getTime() - 2 * 86400000).toLocaleString('zh-CN');

    this.messages = [
      {
        id: 'msg_001',
        type: 'system',
        title: '欢迎使用购物平台',
        content: '感谢您使用本购物平台！您可以浏览海量商品，享受便捷的购物体验。如有任何问题，请查看帮助中心。',
        createTime: today,
        isRead: false
      },
      {
        id: 'msg_002',
        type: 'order',
        title: '订单已支付成功',
        content: '您的订单 ORD002 已支付成功，商家正在为您准备发货。预计3-5个工作日送达。',
        createTime: yesterday,
        relatedOrderId: 'ORD002',
        isRead: false
      },
      {
        id: 'msg_003',
        type: 'activity',
        title: '618大促活动预告',
        content: '年中大促即将开启！多款商品限时特惠，满300减50，更有惊喜折扣等你来抢！',
        createTime: twoDaysAgo,
        isRead: true
      },
      {
        id: 'msg_004',
        type: 'order',
        title: '订单已发货',
        content: '您的订单 ORD001 已由顺丰快递发出，快递单号：SF1234567890，请注意查收。',
        createTime: twoDaysAgo,
        relatedOrderId: 'ORD001',
        isRead: true
      },
      {
        id: 'msg_005',
        type: 'system',
        title: '账号安全提醒',
        content: '检测到您的账号在新设备上登录，如非本人操作，请及时修改密码。',
        createTime: twoDaysAgo,
        isRead: true
      }
    ];
  }

  /**
   * 保存消息数据到持久化存储
   */
  private async saveMessagesToStorage(): Promise<void> {
    try {
      await this.storageService.saveObject(STORAGE_KEY_MESSAGES, this.messages);
    } catch (error) {
      console.error('MessageService.saveMessagesToStorage error: ' + JSON.stringify(error));
    }
  }

  /**
   * 获取所有消息
   */
  getAllMessages(): MessageRecord[] {
    return [...this.messages];
  }

  /**
   * 按类型获取消息
   */
  getMessagesByType(type: MessageType): MessageRecord[] {
    return this.messages.filter(m => m.type === type);
  }

  /**
   * 获取未读消息数量
   */
  getUnreadCount(): number {
    return this.messages.filter(m => !m.isRead).length;
  }

  /**
   * 获取指定类型的未读消息数量
   */
  getUnreadCountByType(type: MessageType): number {
    return this.messages.filter(m => m.type === type && !m.isRead).length;
  }

  /**
   * 标记消息为已读
   */
  async markAsRead(messageId: string): Promise<void> {
    const msg = this.messages.find(m => m.id === messageId);
    if (msg && !msg.isRead) {
      msg.isRead = true;
      await this.saveMessagesToStorage();
    }
  }

  /**
   * 标记所有消息为已读
   */
  async markAllAsRead(): Promise<void> {
    let changed = false;
    this.messages.forEach(m => {
      if (!m.isRead) {
        m.isRead = true;
        changed = true;
      }
    });
    if (changed) {
      await this.saveMessagesToStorage();
    }
  }

  /**
   * 添加新消息
   */
  async addMessage(message: MessageRecord): Promise<void> {
    this.messages.unshift(message);
    await this.saveMessagesToStorage();
  }

  /**
   * 添加订单相关消息（自动创建订单通知）
   */
  async addOrderMessage(title: string, content: string, orderId: string): Promise<void> {
    const message: MessageRecord = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: 'order',
      title: title,
      content: content,
      createTime: new Date().toLocaleString('zh-CN'),
      isRead: false,
      relatedOrderId: orderId
    };
    await this.addMessage(message);
  }

  /**
   * 删除消息
   */
  async deleteMessage(messageId: string): Promise<void> {
    this.messages = this.messages.filter(m => m.id !== messageId);
    await this.saveMessagesToStorage();
  }

  /**
   * 清空所有消息
   */
  async clearAllMessages(): Promise<void> {
    this.messages = [];
    await this.saveMessagesToStorage();
  }
}
