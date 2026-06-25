import { DeepSeekApiService } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/services/DeepSeekApiService";
import { DeepSeekConfig } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/config/DeepSeekConfig";
import { createDefaultProductInfo } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/models/ProductModel";
import type { ProductInfo } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/models/ProductModel";
/**
 * AI生成的商品数据接口
 */
interface AIGeneratedProduct {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    imageUrl: string;
    sales: number;
    rating: number;
    shopName: string;
    location: string;
    description: string;
    goodRate: number;
    coupon: string;
}
/**
 * AI生成的商品列表接口
 */
interface AIGeneratedProductList {
    products: AIGeneratedProduct[];
}
/**
 * 商品数据生成器
 * 使用DeepSeek AI生成虚构的淘宝商品数据
 */
export class ProductGenerator {
    private deepSeekApi: DeepSeekApiService = new DeepSeekApiService();
    // 商品数据缓存
    private productCache: Map<string, ProductInfo[]> = new Map();
    // 缓存过期时间（毫秒）
    private cacheExpireTime: number = 30 * 60 * 1000; // 30分钟
    // 缓存时间戳
    private cacheTimestamp: Map<string, number> = new Map();
    /**
     * 生成指定分类的商品数据
     * @param category 商品分类
     * @param platform 平台类型（shopping/market）
     * @param count 商品数量
     * @returns 商品列表
     */
    async generateProducts(category: string, platform: string, count: number): Promise<ProductInfo[]> {
        const cacheKey = `${platform}_${category}`;
        // 检查缓存
        if (this.isCacheValid(cacheKey)) {
            const cachedProducts = this.productCache.get(cacheKey);
            if (cachedProducts) {
                console.info('Using cached products for:', cacheKey);
                return cachedProducts;
            }
        }
        try {
            // 获取分类关键词
            const categoryKeyword = DeepSeekConfig.getCategoryKeyword(category);
            // 构建用户提示词
            const userPrompt = this.buildUserPrompt(categoryKeyword, platform, count);
            // 调用DeepSeek API生成商品数据
            console.info('Generating products for:', category, 'platform:', platform);
            const response = await this.deepSeekApi.generateContentWithRetry(DeepSeekConfig.PROMPTS.PRODUCT_GENERATION, userPrompt, 3 // 最多重试3次
            );
            // 解析AI生成的数据
            const products = this.parseAIResponse(response, category, platform);
            // 更新缓存
            this.updateCache(cacheKey, products);
            return products;
        }
        catch (error) {
            console.error('Generate products failed:', error);
            // 降级处理：返回模拟数据
            return this.generateMockProducts(category, platform, count);
        }
    }
    /**
     * 搜索商品
     * @param keyword 搜索关键词
     * @param platform 平台类型
     * @param count 商品数量
     * @returns 商品列表
     */
    async searchProducts(keyword: string, platform: string, count: number): Promise<ProductInfo[]> {
        try {
            // 构建用户提示词
            const userPrompt = `请生成${count}个与"${keyword}"相关的${platform === 'market' ? '二手' : ''}商品。
${platform === 'market' ? '注意：这些是闲鱼二手商品，价格应该比新品便宜20%-50%。' : ''}
请确保商品名称包含"${keyword}"或相关词汇。`;
            // 调用DeepSeek API生成商品数据
            console.info('Searching products for:', keyword);
            const response = await this.deepSeekApi.generateContentWithRetry(DeepSeekConfig.PROMPTS.PRODUCT_SEARCH, userPrompt, 3);
            // 解析AI生成的数据
            return this.parseAIResponse(response, '', platform);
        }
        catch (error) {
            console.error('Search products failed:', error);
            return this.generateMockProducts('', platform, count);
        }
    }
    /**
     * 构建用户提示词
     * @param categoryKeyword 分类关键词
     * @param platform 平台类型
     * @param count 商品数量
     * @returns 用户提示词
     */
    private buildUserPrompt(categoryKeyword: string, platform: string, count: number): string {
        let prompt = `请生成${count}个${categoryKeyword}分类的商品信息。`;
        if (platform === 'market') {
            prompt += `\n注意：这些是闲鱼二手商品，请遵循以下规则：
1. 商品名称要体现二手特征（如"二手"、"闲置"、"转卖"等）
2. 价格应该是原价的50%-80%
3. 店铺名称应该是个人卖家（如"个人闲置"、"某某转卖"等）
4. 销量相对较低（10-500之间）
5. 商品描述要说明使用情况和成色`;
        }
        else {
            prompt += `\n注意：这些是淘宝新商品，请遵循以下规则：
1. 商品名称要专业、吸引人
2. 价格要合理，符合市场行情
3. 店铺名称要是正规商家
4. 销量可以较高（100-10000之间）
5. 可以添加优惠券信息`;
        }
        return prompt;
    }
    /**
     * 解析AI响应数据
     * @param response AI响应字符串
     * @param category 商品分类
     * @param platform 平台类型
     * @returns 商品列表
     */
    private parseAIResponse(response: string, category: string, platform: string): ProductInfo[] {
        try {
            // 清理响应字符串（移除可能的markdown代码块标记）
            let cleanResponse = response.trim();
            if (cleanResponse.startsWith('```json')) {
                cleanResponse = cleanResponse.slice(7);
            }
            if (cleanResponse.startsWith('```')) {
                cleanResponse = cleanResponse.slice(3);
            }
            if (cleanResponse.endsWith('```')) {
                cleanResponse = cleanResponse.slice(0, -3);
            }
            cleanResponse = cleanResponse.trim();
            // 解析JSON
            const data: AIGeneratedProductList = JSON.parse(cleanResponse);
            // 转换为ProductInfo格式
            const products: ProductInfo[] = [];
            data.products.forEach((item: AIGeneratedProduct) => {
                const product = createDefaultProductInfo();
                product.id = item.id || this.generateId();
                product.name = item.name;
                product.price = item.price;
                product.originalPrice = item.originalPrice || 0;
                product.imageUrl = item.imageUrl || `https://via.placeholder.com/200x200?text=${encodeURIComponent(item.name)}`;
                product.sales = item.sales;
                product.rating = item.rating;
                product.category = category;
                product.platform = platform;
                product.shopName = item.shopName;
                product.location = item.location;
                product.description = item.description;
                product.goodRate = item.goodRate;
                product.coupon = item.coupon || '';
                product.isSecondHand = platform === 'market';
                products.push(product);
            });
            return products;
        }
        catch (error) {
            console.error('Parse AI response failed:', error);
            console.error('Response content:', response);
            return [];
        }
    }
    /**
     * 生成唯一ID
     * @returns 唯一ID字符串
     */
    private generateId(): string {
        return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * 生成模拟商品数据（降级处理）
     * @param category 商品分类
     * @param platform 平台类型
     * @param count 商品数量
     * @returns 模拟商品列表
     */
    private generateMockProducts(category: string, platform: string, count: number): ProductInfo[] {
        const products: ProductInfo[] = [];
        const categoryName = DeepSeekConfig.getCategoryKeyword(category);
        for (let i = 1; i <= count; i++) {
            const product = createDefaultProductInfo();
            if (platform === 'market') {
                // 闲鱼二手商品
                const price = 30 + Math.random() * 150;
                product.id = `mock_market_${category}_${Date.now()}_${i}`;
                product.name = `二手${categoryName}商品${i} - 个人闲置转让`;
                product.price = price;
                product.originalPrice = price * (1.3 + Math.random() * 0.5);
                product.imageUrl = `https://via.placeholder.com/200x200?text=二手商品${i}`;
                product.sales = Math.floor(10 + Math.random() * 490);
                product.rating = 4.0 + Math.random() * 0.8;
                product.shopName = '个人卖家';
                product.location = '本地';
                product.description = '成色良好，使用时间短，价格实惠';
                product.goodRate = 90 + Math.random() * 8;
                product.isSecondHand = true;
            }
            else {
                // 淘宝新商品
                product.id = `mock_shopping_${category}_${Date.now()}_${i}`;
                product.name = `${categoryName}热销商品${i} - 品质保证`;
                product.price = 50 + Math.random() * 300;
                product.originalPrice = product.price * (1.1 + Math.random() * 0.3);
                product.imageUrl = `https://via.placeholder.com/200x200?text=商品${i}`;
                product.sales = Math.floor(100 + Math.random() * 9900);
                product.rating = 4.5 + Math.random() * 0.5;
                product.shopName = '官方旗舰店';
                product.location = '浙江杭州';
                product.description = '正品保障，全国联保，七天无理由退换';
                product.goodRate = 95 + Math.random() * 5;
                product.coupon = '满100减10';
            }
            product.category = category;
            product.platform = platform;
            products.push(product);
        }
        return products;
    }
    /**
     * 检查缓存是否有效
     * @param cacheKey 缓存键
     * @returns 是否有效
     */
    private isCacheValid(cacheKey: string): boolean {
        const timestamp = this.cacheTimestamp.get(cacheKey);
        if (!timestamp) {
            return false;
        }
        const now = Date.now();
        return (now - timestamp) < this.cacheExpireTime;
    }
    /**
     * 更新缓存
     * @param cacheKey 缓存键
     * @param products 商品列表
     */
    private updateCache(cacheKey: string, products: ProductInfo[]): void {
        this.productCache.set(cacheKey, products);
        this.cacheTimestamp.set(cacheKey, Date.now());
    }
    /**
     * 清空缓存
     */
    clearCache(): void {
        this.productCache.clear();
        this.cacheTimestamp.clear();
    }
    /**
     * 测试DeepSeek API连接
     * @returns 是否连接成功
     */
    async testConnection(): Promise<boolean> {
        return await this.deepSeekApi.testConnection();
    }
}
