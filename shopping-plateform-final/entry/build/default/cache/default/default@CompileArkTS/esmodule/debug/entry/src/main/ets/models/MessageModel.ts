/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
/**
 * 消息数据模型
 */
// 消息类型
export type MessageType = 'system' | 'order' | 'activity';
// 消息记录接口
export interface MessageRecord {
    id: string;
    type: MessageType;
    title: string;
    content: string;
    relatedOrderId?: string;
    createTime: string;
    isRead: boolean;
}
// 获取消息类型名称
export function getMessageTypeName(type: MessageType): string {
    switch (type) {
        case 'system':
            return '系统通知';
        case 'order':
            return '订单通知';
        case 'activity':
            return '活动通知';
    }
}
