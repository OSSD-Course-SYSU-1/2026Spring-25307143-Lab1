/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
/**
 * DeepSeek API配置接口
 */
interface DeepSeekApiConfig {
    API_KEY: string;
    BASE_URL: string;
    MODEL: string;
    MAX_TOKENS: number;
    TEMPERATURE: number;
}
/**
 * 超时配置接口
 */
interface TimeoutConfig {
    CONNECT: number;
    READ: number;
}
/**
 * 提示词配置接口
 */
interface PromptsConfig {
    PRODUCT_GENERATION: string;
    PRODUCT_SEARCH: string;
}
/**
 * DeepSeek API配置类
 * 用于管理DeepSeek AI API的配置信息
 */
export class DeepSeekConfig {
    // DeepSeek API配置
    static readonly API: DeepSeekApiConfig = {
        API_KEY: 'YOUR_DEEPSEEK_API_KEY',
        BASE_URL: 'https://api.deepseek.com/v1/chat/completions',
        MODEL: 'deepseek-chat',
        MAX_TOKENS: 2000,
        TEMPERATURE: 0.7
    };
    // 请求超时配置
    static readonly TIMEOUT: TimeoutConfig = {
        CONNECT: 30000,
        READ: 60000 // 读取超时（毫秒）
    };
    // 商品生成提示词模板
    static readonly PROMPTS: PromptsConfig = {
        PRODUCT_GENERATION: `你是一个电商平台的商品数据生成器。请根据给定的分类生成虚构但真实的商品信息。

要求：
1. 商品名称要符合该分类的特点，听起来真实可信
2. 价格要合理，符合市场行情
3. 店铺名称要真实可信
4. 销量和评分要合理
5. 商品描述要简洁有力

请严格按照以下JSON格式返回，不要添加任何其他文字：
{
  "products": [
    {
      "id": "唯一ID",
      "name": "商品名称",
      "price": 价格数字,
      "originalPrice": 原价数字（可选，用于显示折扣）,
      "imageUrl": "图片URL（使用https://via.placeholder.com/200x200?text=商品名）",
      "sales": 销量数字,
      "rating": 评分数字（4.0-5.0之间）,
      "shopName": "店铺名称",
      "location": "发货地",
      "description": "商品描述",
      "goodRate": 好评率（90-100之间）,
      "coupon": "优惠券信息（可选）"
    }
  ]
}`,
        PRODUCT_SEARCH: `你是一个电商平台的商品搜索助手。请根据搜索关键词生成相关的虚构商品信息。

要求：
1. 商品要与搜索关键词高度相关
2. 商品名称要包含搜索关键词
3. 价格要合理，符合市场行情
4. 店铺名称要真实可信
5. 销量和评分要合理

请严格按照以下JSON格式返回，不要添加任何其他文字：
{
  "products": [
    {
      "id": "唯一ID",
      "name": "商品名称",
      "price": 价格数字,
      "originalPrice": 原价数字（可选）,
      "imageUrl": "图片URL",
      "sales": 销量数字,
      "rating": 评分数字（4.0-5.0之间）,
      "shopName": "店铺名称",
      "location": "发货地",
      "description": "商品描述",
      "goodRate": 好评率（90-100之间）
    }
  ]
}`
    };
    // 分类关键词映射
    static getCategoryKeyword(category: string): string {
        const categoryMap: Record<string, string> = {
            'comprehensive': '综合热门商品',
            'baby': '母婴用品 婴儿奶粉 纸尿裤 婴儿服装 玩具',
            'sports': '运动户外 运动鞋 运动服装 健身器材 瑜伽用品',
            'beauty': '美妆护肤 化妆品 护肤品 面膜 口红',
            'outdoor': '户外装备 登山包 帐篷 户外服装 野营用品',
            'digital': '数码电子 手机 电脑 数码相机 耳机'
        };
        return categoryMap[category] || category;
    }
}
