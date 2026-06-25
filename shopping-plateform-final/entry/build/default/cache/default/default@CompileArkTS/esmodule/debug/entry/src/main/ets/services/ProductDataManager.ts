import { ProductGenerator } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/services/ProductGenerator";
import type { ProductInfo } from '../models/ProductModel';
/**
 * 商品数据管理类
 * 用于管理商品数据的获取、缓存和转换
 * 现在使用DeepSeek AI生成虚构的商品数据
 */
export class ProductDataManager {
    private productGenerator: ProductGenerator = new ProductGenerator();
    /**
     * 获取购物平台商品（淘宝）
     * @param category 商品分类
     * @param forceRefresh 是否强制刷新
     * @returns 商品列表
     */
    async getShoppingProducts(category: string, forceRefresh: boolean): Promise<ProductInfo[]> {
        try {
            console.info('Getting shopping products for category:', category);
            // 如果需要强制刷新，先清空缓存
            if (forceRefresh) {
                this.productGenerator.clearCache();
            }
            // 使用AI生成商品数据
            const products = await this.productGenerator.generateProducts(category, 'shopping', 5 // 每个分类生成5个商品
            );
            return products;
        }
        catch (error) {
            console.error('Get shopping products failed:', error);
            return [];
        }
    }
    /**
     * 获取市集商品（闲鱼）
     * @param category 商品分类
     * @param forceRefresh 是否强制刷新
     * @returns 商品列表
     */
    async getMarketProducts(category: string, forceRefresh: boolean): Promise<ProductInfo[]> {
        try {
            console.info('Getting market products for category:', category);
            // 如果需要强制刷新，先清空缓存
            if (forceRefresh) {
                this.productGenerator.clearCache();
            }
            // 使用AI生成商品数据
            const products = await this.productGenerator.generateProducts(category, 'market', 5 // 每个分类生成5个商品
            );
            return products;
        }
        catch (error) {
            console.error('Get market products failed:', error);
            return [];
        }
    }
    /**
     * 搜索商品
     * @param keyword 搜索关键词
     * @param platform 平台类型
     * @param category 分类（可选）
     * @returns 商品列表
     */
    async searchProducts(keyword: string, platform: string, category: string): Promise<ProductInfo[]> {
        try {
            console.info('Searching products:', keyword, 'platform:', platform);
            // 使用AI搜索商品
            const products = await this.productGenerator.searchProducts(keyword, platform, 20 // 搜索返回20个商品
            );
            return products;
        }
        catch (error) {
            console.error('Search products failed:', error);
            return [];
        }
    }
    /**
     * 清空缓存
     */
    clearCache(): void {
        this.productGenerator.clearCache();
    }
    /**
     * 测试DeepSeek API连接
     * @returns 是否连接成功
     */
    async testConnection(): Promise<boolean> {
        return await this.productGenerator.testConnection();
    }
}
