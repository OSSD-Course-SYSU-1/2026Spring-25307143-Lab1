import type { OrderProduct } from './OrderManager';
// 转售订单状态类型
export type ResaleStatus = 'draft' | 'published' | 'sold' | 'cancelled';
// 转售订单接口
export interface ResaleOrder {
    resaleId: string; // 转售订单ID
    originalOrderId: string; // 原订单ID
    product: OrderProduct; // 商品信息
    originalPrice: number; // 原价格
    resalePrice: number; // 转售价格
    description: string; // 转售描述
    createTime: string; // 创建时间
    updateTime: string; // 更新时间
    status: ResaleStatus; // 状态
    sellerId: string; // 卖家ID（用户ID）
    sellerName: string; // 卖家名称
    viewCount: number; // 浏览次数
}
// 转售订单管理类
export class ResaleManager {
    private static instance: ResaleManager;
    private resaleOrders: ResaleOrder[] = [];
    private constructor() { }
    // 获取单例实例
    static getInstance(): ResaleManager {
        if (!ResaleManager.instance) {
            ResaleManager.instance = new ResaleManager();
        }
        return ResaleManager.instance;
    }
    // 创建转售订单（草稿）
    createResaleOrder(originalOrderId: string, product: OrderProduct, resalePrice: number, description: string, sellerId: string, sellerName: string): ResaleOrder {
        const now = new Date().toLocaleString('zh-CN');
        const resaleOrder: ResaleOrder = {
            resaleId: this.generateResaleId(),
            originalOrderId,
            product,
            originalPrice: product.price,
            resalePrice,
            description,
            createTime: now,
            updateTime: now,
            status: 'draft',
            sellerId,
            sellerName,
            viewCount: 0
        };
        this.resaleOrders.unshift(resaleOrder);
        return resaleOrder;
    }
    // 发布转售订单
    publishResaleOrder(resaleId: string): boolean {
        const order = this.resaleOrders.find(o => o.resaleId === resaleId);
        if (order) {
            order.status = 'published';
            order.updateTime = new Date().toLocaleString('zh-CN');
            return true;
        }
        return false;
    }
    // 更新转售订单状态
    updateResaleOrderStatus(resaleId: string, status: ResaleStatus): boolean {
        const order = this.resaleOrders.find(o => o.resaleId === resaleId);
        if (order) {
            order.status = status;
            order.updateTime = new Date().toLocaleString('zh-CN');
            return true;
        }
        return false;
    }
    // 更新转售订单价格
    updateResaleOrderPrice(resaleId: string, resalePrice: number): boolean {
        const order = this.resaleOrders.find(o => o.resaleId === resaleId);
        if (order) {
            order.resalePrice = resalePrice;
            order.updateTime = new Date().toLocaleString('zh-CN');
            return true;
        }
        return false;
    }
    // 更新转售订单描述
    updateResaleOrderDescription(resaleId: string, description: string): boolean {
        const order = this.resaleOrders.find(o => o.resaleId === resaleId);
        if (order) {
            order.description = description;
            order.updateTime = new Date().toLocaleString('zh-CN');
            return true;
        }
        return false;
    }
    // 删除转售订单
    deleteResaleOrder(resaleId: string): void {
        this.resaleOrders = this.resaleOrders.filter(o => o.resaleId !== resaleId);
    }
    // 获取所有转售订单
    getAllResaleOrders(): ResaleOrder[] {
        return this.resaleOrders;
    }
    // 获取已发布的转售订单（市集可见）
    getPublishedResaleOrders(): ResaleOrder[] {
        return this.resaleOrders.filter(o => o.status === 'published');
    }
    // 获取用户的转售订单（我的市集）
    getUserResaleOrders(sellerId: string): ResaleOrder[] {
        return this.resaleOrders.filter(o => o.sellerId === sellerId);
    }
    // 根据ID获取转售订单
    getResaleOrderById(resaleId: string): ResaleOrder | undefined {
        return this.resaleOrders.find(o => o.resaleId === resaleId);
    }
    // 增加浏览次数
    incrementViewCount(resaleId: string): void {
        const order = this.resaleOrders.find(o => o.resaleId === resaleId);
        if (order) {
            order.viewCount++;
        }
    }
    // 标记为已售出
    markAsSold(resaleId: string): void {
        const order = this.resaleOrders.find(o => o.resaleId === resaleId);
        if (order) {
            order.status = 'sold';
            order.updateTime = new Date().toLocaleString('zh-CN');
        }
    }
    // 生成转售订单ID
    private generateResaleId(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `RES${timestamp}${random}`;
    }
}
