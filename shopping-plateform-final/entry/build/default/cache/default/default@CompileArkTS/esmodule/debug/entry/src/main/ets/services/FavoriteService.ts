import type { FavoriteRecord } from '../models/FavoriteModel';
import { StorageService } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/services/StorageService";
const STORAGE_KEY_FAVORITES = 'favorites_data';
/**
 * 收藏夹数据服务
 */
export class FavoriteService {
    private static instance: FavoriteService;
    private storageService: StorageService;
    private favorites: FavoriteRecord[] = [];
    private constructor() {
        this.storageService = StorageService.getInstance();
    }
    static getInstance(): FavoriteService {
        if (!FavoriteService.instance) {
            FavoriteService.instance = new FavoriteService();
        }
        return FavoriteService.instance;
    }
    /**
     * 从持久化存储加载收藏数据
     */
    async loadFavoritesFromStorage(): Promise<void> {
        try {
            const data = await this.storageService.loadObject<FavoriteRecord[]>(STORAGE_KEY_FAVORITES, []);
            if (data) {
                this.favorites = data;
            }
        }
        catch (error) {
            console.error('FavoriteService.loadFavoritesFromStorage error: ' + JSON.stringify(error));
        }
    }
    /**
     * 保存收藏数据到持久化存储
     */
    private async saveFavoritesToStorage(): Promise<void> {
        try {
            await this.storageService.saveObject(STORAGE_KEY_FAVORITES, this.favorites);
        }
        catch (error) {
            console.error('FavoriteService.saveFavoritesToStorage error: ' + JSON.stringify(error));
        }
    }
    /**
     * 添加收藏
     */
    async addFavorite(record: FavoriteRecord): Promise<void> {
        // 检查是否已收藏
        const exists = this.favorites.some(f => f.productId === record.productId);
        if (!exists) {
            this.favorites.unshift(record);
            await this.saveFavoritesToStorage();
        }
    }
    /**
     * 移除收藏
     */
    async removeFavorite(productId: string): Promise<void> {
        this.favorites = this.favorites.filter(f => f.productId !== productId);
        await this.saveFavoritesToStorage();
    }
    /**
     * 检查是否已收藏
     */
    isFavorite(productId: string): boolean {
        return this.favorites.some(f => f.productId === productId);
    }
    /**
     * 获取所有收藏
     */
    getAllFavorites(): FavoriteRecord[] {
        return [...this.favorites];
    }
    /**
     * 获取收藏数量
     */
    getFavoriteCount(): number {
        return this.favorites.length;
    }
    /**
     * 切换收藏状态（如果已收藏则取消，否则添加）
     */
    async toggleFavorite(record: FavoriteRecord): Promise<boolean> {
        const exists = this.favorites.some(f => f.productId === record.productId);
        if (exists) {
            await this.removeFavorite(record.productId);
            return false; // 已取消收藏
        }
        else {
            await this.addFavorite(record);
            return true; // 已添加收藏
        }
    }
}
