/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
/**
 * API配置接口
 */
interface ApiConfigItem {
    APP_KEY: string;
    APP_SECRET: string;
    BASE_URL: string;
    VERSION: string;
    FORMAT: string;
    SIGN_METHOD: string;
}
/**
 * 超时配置接口
 */
interface TimeoutConfig {
    CONNECT: number;
    READ: number;
}
/**
 * API配置类
 * 用于管理第三方API的配置信息
 */
export class ApiConfig {
    // 淘宝开放平台配置
    static readonly TAOBAO: ApiConfigItem = {
        // 应用Key（需要替换为实际的AppKey）
        APP_KEY: 'YOUR_TAOBAO_APP_KEY',
        // 应用密钥（需要替换为实际的AppSecret）
        APP_SECRET: 'YOUR_TAOBAO_APP_SECRET',
        // API基础URL
        BASE_URL: 'https://eco.taobao.com/router/rest',
        // API版本
        VERSION: '2.0',
        // 响应格式
        FORMAT: 'json',
        // 签名方法
        SIGN_METHOD: 'md5'
    };
    // 闲鱼配置（使用淘宝开放平台）
    static readonly XIANYU: ApiConfigItem = {
        APP_KEY: 'YOUR_XIANYU_APP_KEY',
        APP_SECRET: 'YOUR_XIANYU_APP_SECRET',
        BASE_URL: 'https://eco.taobao.com/router/rest',
        VERSION: '2.0',
        FORMAT: 'json',
        SIGN_METHOD: 'md5'
    };
    // 请求超时配置
    static readonly TIMEOUT: TimeoutConfig = {
        CONNECT: 60000,
        READ: 60000 // 读取超时（毫秒）
    };
    // 商品分类映射
    static getCategoryKeyword(category: string): string {
        const categoryMap: Record<string, string> = {
            'comprehensive': '',
            'baby': '母婴用品',
            'sports': '运动户外',
            'beauty': '美妆护肤',
            'outdoor': '户外装备',
            'digital': '数码电子'
        };
        return categoryMap[category] || category;
    }
    // 淘宝分类ID映射（需要根据实际分类ID配置）
    static getTaobaoCategoryId(category: string): string {
        const categoryIdMap: Record<string, string> = {
            'baby': '35',
            'sports': '16',
            'beauty': '33',
            'outdoor': '16',
            'digital': '14' // 数码电子
        };
        return categoryIdMap[category] || '';
    }
}
