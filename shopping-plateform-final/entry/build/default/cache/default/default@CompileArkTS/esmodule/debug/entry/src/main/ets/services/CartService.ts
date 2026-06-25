import { CartManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/CartManager";
import type { CartItem, CartMode } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/CartManager";
import { StorageService } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/services/StorageService";
const STORAGE_KEY_SHOPPING_CART = 'cart_shopping';
const STORAGE_KEY_MARKET_CART = 'cart_market';
/**
 * 购物车数据服务
 * 包装 CartManager，增加持久化存储/读取逻辑
 */
export class CartService {
    private static instance: CartService;
    private storageService: StorageService;
    private constructor() {
        this.storageService = StorageService.getInstance();
    }
    static getInstance(): CartService {
        if (!CartService.instance) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }
    /**
     * 从持久化存储加载购物车数据
     */
    async loadCartFromStorage(): Promise<void> {
        try {
            const shoppingItems = await this.storageService.loadObject<CartItem[]>(STORAGE_KEY_SHOPPING_CART, []);
            const marketItems = await this.storageService.loadObject<CartItem[]>(STORAGE_KEY_MARKET_CART, []);
            if (shoppingItems && shoppingItems.length > 0) {
                CartManager.getInstance().setCartItemsFromStorage('shopping', shoppingItems);
            }
            if (marketItems && marketItems.length > 0) {
                CartManager.getInstance().setCartItemsFromStorage('market', marketItems);
            }
        }
        catch (error) {
            console.error('CartService.loadCartFromStorage error: ' + JSON.stringify(error));
        }
    }
    /**
     * 保存购物车数据到持久化存储
     */
    async saveCartToStorage(): Promise<void> {
        try {
            const shoppingItems = CartManager.getInstance().getCartItems('shopping');
            const marketItems = CartManager.getInstance().getCartItems('market');
            await this.storageService.saveObject(STORAGE_KEY_SHOPPING_CART, shoppingItems);
            await this.storageService.saveObject(STORAGE_KEY_MARKET_CART, marketItems);
        }
        catch (error) {
            console.error('CartService.saveCartToStorage error: ' + JSON.stringify(error));
        }
    }
    /**
     * 添加商品到购物车（带持久化）
     */
    async addToCart(product: CartItem, mode: CartMode): Promise<void> {
        CartManager.getInstance().addToCart(product, mode);
        await this.saveCartToStorage();
    }
    /**
     * 从购物车移除商品（带持久化）
     */
    async removeFromCart(productId: string, mode: CartMode): Promise<void> {
        CartManager.getInstance().removeFromCart(productId, mode);
        await this.saveCartToStorage();
    }
    /**
     * 更新商品数量（带持久化）
     */
    async updateQuantity(productId: string, quantity: number, mode: CartMode): Promise<void> {
        CartManager.getInstance().updateQuantity(productId, quantity, mode);
        await this.saveCartToStorage();
    }
    /**
     * 更新商品选中状态（带持久化）
     */
    async updateSelected(productId: string, selected: boolean, mode: CartMode): Promise<void> {
        CartManager.getInstance().updateSelected(productId, selected, mode);
        await this.saveCartToStorage();
    }
    /**
     * 全选/取消全选（带持久化）
     */
    async selectAll(selected: boolean, mode: CartMode): Promise<void> {
        CartManager.getInstance().selectAll(selected, mode);
        await this.saveCartToStorage();
    }
    /**
     * 清空购物车（带持久化）
     */
    async clearCart(mode: CartMode): Promise<void> {
        CartManager.getInstance().clearCart(mode);
        await this.saveCartToStorage();
    }
    /**
     * 清空已选中的商品（带持久化）
     */
    async clearSelectedItems(mode: CartMode): Promise<void> {
        CartManager.getInstance().clearSelectedItems(mode);
        await this.saveCartToStorage();
    }
}
