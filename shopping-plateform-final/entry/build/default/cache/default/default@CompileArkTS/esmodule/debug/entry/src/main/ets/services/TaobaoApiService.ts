import http from "@ohos:net.http";
import cryptoFramework from "@ohos:security.cryptoFramework";
import util from "@ohos:util";
import { ApiConfig } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/config/ApiConfig";
import { createDefaultProductInfo } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/models/ProductModel";
import type { TaobaoItemInfo, TaobaoApiResponse, ProductSearchResult, ProductInfo } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/models/ProductModel";
/**
 * 淘宝API服务类
 * 用于调用淘宝开放平台API获取商品数据
 */
export class TaobaoApiService {
    private appKey: string = ApiConfig.TAOBAO.APP_KEY;
    private appSecret: string = ApiConfig.TAOBAO.APP_SECRET;
    private baseUrl: string = ApiConfig.TAOBAO.BASE_URL;
    /**
     * 生成API签名
     * @param params 请求参数
     * @returns 签名字符串
     */
    private async generateSign(params: Map<string, string>): Promise<string> {
        // 1. 参数排序
        const sortedKeys = Array.from(params.keys()).sort();
        // 2. 拼接字符串
        let signStr = this.appSecret;
        sortedKeys.forEach(key => {
            signStr += key + params.get(key);
        });
        signStr += this.appSecret;
        // 3. MD5加密
        return await this.md5(signStr);
    }
    /**
     * MD5加密
     * @param input 输入字符串
     * @returns MD5加密后的字符串（大写）
     */
    private async md5(input: string): Promise<string> {
        try {
            // 创建MD5摘要算法
            const md = cryptoFramework.createMd('MD5');
            // 将字符串转换为Uint8Array
            const encoder = new util.TextEncoder();
            const inputData = encoder.encodeInto(input);
            // 更新摘要数据
            await md.update({ data: inputData });
            // 计算摘要
            const result = await md.digest();
            // 将结果转换为十六进制字符串
            const hexString = Array.from(result.data)
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('');
            return hexString.toUpperCase();
        }
        catch (error) {
            console.error('MD5 encryption failed:', error);
            return '';
        }
    }
    /**
     * 商品搜索
     * @param keyword 搜索关键词
     * @param category 分类ID（可选）
     * @param pageNo 页码（默认1）
     * @param pageSize 每页数量（默认20）
     * @returns 商品搜索结果
     */
    async searchItems(keyword: string, category: string, pageNo: number, pageSize: number): Promise<ProductSearchResult> {
        const params = new Map<string, string>();
        // 设置公共参数
        params.set('method', 'taobao.item.search');
        params.set('app_key', this.appKey);
        params.set('timestamp', new Date().toISOString());
        params.set('format', ApiConfig.TAOBAO.FORMAT);
        params.set('v', ApiConfig.TAOBAO.VERSION);
        params.set('sign_method', ApiConfig.TAOBAO.SIGN_METHOD);
        // 设置业务参数
        params.set('q', keyword);
        params.set('page_no', pageNo.toString());
        params.set('page_size', pageSize.toString());
        if (category) {
            params.set('cid', category);
        }
        try {
            // 生成签名
            const sign = await this.generateSign(params);
            params.set('sign', sign);
            // 发送请求
            const response = await this.sendRequest(params);
            // 解析响应
            return this.parseSearchResult(response, pageNo, pageSize);
        }
        catch (error) {
            console.error('Search items failed:', error);
            return {
                products: [],
                totalCount: 0,
                currentPage: pageNo,
                pageSize: pageSize
            };
        }
    }
    /**
     * 发送HTTP请求
     * @param params 请求参数
     * @returns 响应字符串
     */
    private async sendRequest(params: Map<string, string>): Promise<string> {
        const httpRequest = http.createHttp();
        // 构建URL
        let url = this.baseUrl + '?';
        params.forEach((value, key) => {
            url += `${key}=${encodeURIComponent(value)}&`;
        });
        url = url.slice(0, -1); // 移除最后的&
        try {
            const response = await httpRequest.request(url, {
                method: http.RequestMethod.GET,
                header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                connectTimeout: ApiConfig.TIMEOUT.CONNECT,
                readTimeout: ApiConfig.TIMEOUT.READ
            });
            if (response.responseCode === http.ResponseCode.OK) {
                return response.result as string;
            }
            else {
                throw new Error(`HTTP request failed: ${response.responseCode}`);
            }
        }
        finally {
            httpRequest.destroy();
        }
    }
    /**
     * 解析商品搜索结果
     * @param response API响应字符串
     * @param pageNo 页码
     * @param pageSize 每页数量
     * @returns 商品搜索结果
     */
    private parseSearchResult(response: string, pageNo: number, pageSize: number): ProductSearchResult {
        const result: ProductSearchResult = {
            products: [],
            totalCount: 0,
            currentPage: pageNo,
            pageSize: pageSize
        };
        try {
            const data: TaobaoApiResponse = JSON.parse(response);
            // 检查错误响应
            if (data.error_response) {
                console.error('API error:', data.error_response.msg);
                return result;
            }
            // 解析商品数据
            if (data.item_search_response) {
                const items = data.item_search_response.items;
                result.totalCount = items.total_results;
                items.item.forEach((item: TaobaoItemInfo) => {
                    const product = createDefaultProductInfo();
                    product.id = item.num_iid;
                    product.name = item.title;
                    product.price = parseFloat(item.price);
                    product.imageUrl = item.pic_url;
                    product.sales = item.volume;
                    product.rating = 4.5 + Math.random() * 0.5; // 模拟评分
                    product.category = '';
                    product.platform = 'shopping';
                    product.shopName = item.nick;
                    product.location = item.area;
                    product.goodRate = 95 + Math.random() * 5; // 模拟好评率
                    result.products.push(product);
                });
            }
        }
        catch (error) {
            console.error('Parse search result failed:', error);
        }
        return result;
    }
    /**
     * 获取商品详情
     * @param itemId 商品ID
     * @returns 商品详情
     */
    async getItemDetail(itemId: string): Promise<ProductInfo | null> {
        const params = new Map<string, string>();
        // 设置公共参数
        params.set('method', 'taobao.item.get');
        params.set('app_key', this.appKey);
        params.set('timestamp', new Date().toISOString());
        params.set('format', ApiConfig.TAOBAO.FORMAT);
        params.set('v', ApiConfig.TAOBAO.VERSION);
        params.set('sign_method', ApiConfig.TAOBAO.SIGN_METHOD);
        // 设置业务参数
        params.set('num_iid', itemId);
        params.set('fields', 'num_iid,title,price,pic_url,volume,nick,area,detail_url');
        try {
            // 生成签名
            const sign = await this.generateSign(params);
            params.set('sign', sign);
            // 发送请求
            const response = await this.sendRequest(params);
            // 解析响应（简化处理）
            const data = JSON.parse(response) as Record<string, Object>;
            if (data['item_get_response']) {
                const itemData = data['item_get_response'] as Record<string, Object>;
                if (itemData['item']) {
                    const item = itemData['item'] as TaobaoItemInfo;
                    const product = createDefaultProductInfo();
                    product.id = item.num_iid;
                    product.name = item.title;
                    product.price = parseFloat(item.price);
                    product.imageUrl = item.pic_url;
                    product.sales = item.volume;
                    product.rating = 4.5 + Math.random() * 0.5;
                    product.category = '';
                    product.platform = 'shopping';
                    product.shopName = item.nick;
                    product.location = item.area;
                    return product;
                }
            }
            return null;
        }
        catch (error) {
            console.error('Get item detail failed:', error);
            return null;
        }
    }
}
