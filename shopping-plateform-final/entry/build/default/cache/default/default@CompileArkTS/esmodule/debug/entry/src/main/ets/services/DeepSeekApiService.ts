import http from "@ohos:net.http";
import { DeepSeekConfig } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/config/DeepSeekConfig";
/**
 * DeepSeek API消息接口
 */
interface DeepSeekMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
/**
 * DeepSeek API请求接口
 */
interface DeepSeekRequest {
    model: string;
    messages: DeepSeekMessage[];
    max_tokens: number;
    temperature: number;
    stream: boolean;
}
/**
 * DeepSeek API响应接口
 */
interface DeepSeekResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: DeepSeekChoice[];
    usage: DeepSeekUsage;
}
/**
 * DeepSeek选择项接口
 */
interface DeepSeekChoice {
    index: number;
    message: DeepSeekMessage;
    finish_reason: string;
}
/**
 * DeepSeek使用量接口
 */
interface DeepSeekUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}
/**
 * DeepSeek API服务类
 * 用于调用DeepSeek AI API生成商品数据
 */
export class DeepSeekApiService {
    private apiKey: string = DeepSeekConfig.API.API_KEY;
    private baseUrl: string = DeepSeekConfig.API.BASE_URL;
    private model: string = DeepSeekConfig.API.MODEL;
    /**
     * 调用DeepSeek API生成内容
     * @param systemPrompt 系统提示词
     * @param userPrompt 用户提示词
     * @returns 生成的内容
     */
    async generateContent(systemPrompt: string, userPrompt: string): Promise<string> {
        const messages: DeepSeekMessage[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];
        const requestBody: DeepSeekRequest = {
            model: this.model,
            messages: messages,
            max_tokens: DeepSeekConfig.API.MAX_TOKENS,
            temperature: DeepSeekConfig.API.TEMPERATURE,
            stream: false
        };
        try {
            const response = await this.sendRequest(requestBody);
            return response;
        }
        catch (error) {
            console.error('DeepSeek API call failed:', error);
            throw new Error('DeepSeek API call failed');
        }
    }
    /**
     * 发送HTTP请求到DeepSeek API
     * @param requestBody 请求体
     * @returns 响应内容
     */
    private async sendRequest(requestBody: DeepSeekRequest): Promise<string> {
        const httpRequest = http.createHttp();
        try {
            const response = await httpRequest.request(this.baseUrl, {
                method: http.RequestMethod.POST,
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                extraData: JSON.stringify(requestBody),
                connectTimeout: DeepSeekConfig.TIMEOUT.CONNECT,
                readTimeout: DeepSeekConfig.TIMEOUT.READ
            });
            if (response.responseCode === http.ResponseCode.OK) {
                const result = response.result as string;
                const data: DeepSeekResponse = JSON.parse(result);
                if (data.choices && data.choices.length > 0) {
                    return data.choices[0].message.content;
                }
                else {
                    throw new Error('No content in DeepSeek response');
                }
            }
            else {
                const errorMsg = `DeepSeek API request failed: ${response.responseCode}`;
                console.error(errorMsg);
                console.error('Response:', response.result);
                throw new Error(errorMsg);
            }
        }
        catch (error) {
            console.error('DeepSeek API request error:', error);
            throw new Error('DeepSeek API request error');
        }
        finally {
            httpRequest.destroy();
        }
    }
    /**
     * 测试API连接
     * @returns 是否连接成功
     */
    async testConnection(): Promise<boolean> {
        try {
            const response = await this.generateContent('你是一个助手，请简单回复。', '你好，请回复"连接成功"');
            console.info('DeepSeek API connection test successful:', response);
            return true;
        }
        catch (error) {
            console.error('DeepSeek API connection test failed:', error);
            return false;
        }
    }
    /**
     * 批量生成内容（带重试机制）
     * @param systemPrompt 系统提示词
     * @param userPrompt 用户提示词
     * @param maxRetries 最大重试次数
     * @returns 生成的内容
     */
    async generateContentWithRetry(systemPrompt: string, userPrompt: string, maxRetries: number): Promise<string> {
        let lastError: Error | null = null;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const content = await this.generateContent(systemPrompt, userPrompt);
                return content;
            }
            catch (error) {
                lastError = error as Error;
                console.warn(`DeepSeek API call attempt ${i + 1} failed:`, error);
                // 等待一段时间后重试
                if (i < maxRetries - 1) {
                    await this.delay(1000 * (i + 1)); // 递增延迟
                }
            }
        }
        if (lastError) {
            throw new Error('DeepSeek API call failed after retries');
        }
        return '';
    }
    /**
     * 延迟函数
     * @param ms 毫秒数
     */
    private delay(ms: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }
}
