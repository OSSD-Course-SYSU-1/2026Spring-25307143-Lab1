if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MessagePage_Params {
    mainBoxPadding?: number;
    messages?: MessageRecord[];
    currentTab?: 'all' | MessageType;
    isLoading?: boolean;
    messageService?: MessageService;
}
import router from "@ohos:router";
import { getMessageTypeName } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/models/MessageModel";
import type { MessageRecord, MessageType } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/models/MessageModel";
import { MessageService } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/services/MessageService";
export class MessagePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__mainBoxPadding = new SynchedPropertySimpleOneWayPU(params.mainBoxPadding, this, "mainBoxPadding");
        this.__messages = new ObservedPropertyObjectPU([], this, "messages");
        this.__currentTab = new ObservedPropertySimplePU('all', this, "currentTab");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.messageService = MessageService.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MessagePage_Params) {
        if (params.mainBoxPadding === undefined) {
            this.__mainBoxPadding.set(0);
        }
        if (params.messages !== undefined) {
            this.messages = params.messages;
        }
        if (params.currentTab !== undefined) {
            this.currentTab = params.currentTab;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.messageService !== undefined) {
            this.messageService = params.messageService;
        }
    }
    updateStateVars(params: MessagePage_Params) {
        this.__mainBoxPadding.reset(params.mainBoxPadding);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__mainBoxPadding.purgeDependencyOnElmtId(rmElmtId);
        this.__messages.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTab.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__mainBoxPadding.aboutToBeDeleted();
        this.__messages.aboutToBeDeleted();
        this.__currentTab.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __mainBoxPadding: SynchedPropertySimpleOneWayPU<number>;
    get mainBoxPadding() {
        return this.__mainBoxPadding.get();
    }
    set mainBoxPadding(newValue: number) {
        this.__mainBoxPadding.set(newValue);
    }
    private __messages: ObservedPropertyObjectPU<MessageRecord[]>;
    get messages() {
        return this.__messages.get();
    }
    set messages(newValue: MessageRecord[]) {
        this.__messages.set(newValue);
    }
    private __currentTab: ObservedPropertySimplePU<'all' | MessageType>;
    get currentTab() {
        return this.__currentTab.get();
    }
    set currentTab(newValue: 'all' | MessageType) {
        this.__currentTab.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private messageService: MessageService;
    aboutToAppear() {
        this.loadMessages();
    }
    onPageShow() {
        this.loadMessages();
    }
    loadMessages() {
        this.isLoading = true;
        this.messages = this.messageService.getAllMessages();
        this.isLoading = false;
    }
    // 获取筛选后的消息
    getFilteredMessages(): MessageRecord[] {
        if (this.currentTab === 'all') {
            return this.messages;
        }
        return this.messages.filter(m => m.type === this.currentTab);
    }
    // 获取未读数量
    getUnreadCount(type?: 'all' | MessageType): number {
        if (type === 'all' || !type) {
            return this.messageService.getUnreadCount();
        }
        return this.messageService.getUnreadCountByType(type);
    }
    // 点击消息
    onMessageClick(message: MessageRecord) {
        // 标记为已读
        this.messageService.markAsRead(message.id);
        // 如果是订单消息且有相关订单ID，跳转到订单详情
        if (message.type === 'order' && message.relatedOrderId) {
            router.pushUrl({
                url: 'pages/OrderDetailPage',
                params: {
                    orderId: message.relatedOrderId
                }
            });
        }
        // 刷新消息列表
        this.loadMessages();
    }
    // 标记全部已读
    markAllRead() {
        this.messageService.markAllAsRead();
        this.loadMessages();
    }
    // 获取消息图标
    getMessageIcon(type: MessageType): string {
        switch (type) {
            case 'system':
                return '⚙️';
            case 'order':
                return '📦';
            case 'activity':
                return '🎉';
        }
    }
    // 格式化时间显示（今天/昨天/更早）
    formatTime(timeStr: string): string {
        try {
            const msgDate = new Date(timeStr);
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const yesterdayStart = new Date(todayStart.getTime() - 86400000);
            if (msgDate >= todayStart) {
                return `今天 ${msgDate.getHours().toString().padStart(2, '0')}:${msgDate.getMinutes().toString().padStart(2, '0')}`;
            }
            else if (msgDate >= yesterdayStart) {
                return `昨天 ${msgDate.getHours().toString().padStart(2, '0')}:${msgDate.getMinutes().toString().padStart(2, '0')}`;
            }
            else {
                return timeStr;
            }
        }
        catch (e) {
            return timeStr;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 消息标题
            Row.create();
            // 消息标题
            Row.width('100%');
            // 消息标题
            Row.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, top: 20, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('消息中心');
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getUnreadCount('all') > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('全部已读');
                        Text.fontSize(13);
                        Text.fontColor('#FF5722');
                        Text.onClick(() => {
                            this.markAllRead();
                        });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 消息标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分类标签
            Scroll.create();
            // 分类标签
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 分类标签
            Scroll.scrollBar(BarState.Off);
            // 分类标签
            Scroll.width('100%');
            // 分类标签
            Scroll.margin({ bottom: 8 });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
        }, Row);
        // 全部
        this.TabItem.bind(this)('全部', 'all', this.getUnreadCount('all'));
        // 各分类
        this.TabItem.bind(this)('系统通知', 'system', this.getUnreadCount('system'));
        this.TabItem.bind(this)('订单通知', 'order', this.getUnreadCount('order'));
        this.TabItem.bind(this)('活动通知', 'activity', this.getUnreadCount('activity'));
        Row.pop();
        // 分类标签
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 消息列表
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(40);
                        LoadingProgress.height(40);
                        LoadingProgress.color('#FF5722');
                    }, LoadingProgress);
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.layoutWeight(1);
                        Scroll.scrollBar(BarState.Off);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.getFilteredMessages().length === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 空状态
                                    Column.create();
                                    // 空状态
                                    Column.width('100%');
                                    // 空状态
                                    Column.height(200);
                                    // 空状态
                                    Column.justifyContent(FlexAlign.Center);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('💬');
                                    Text.fontSize(60);
                                    Text.opacity(0.4);
                                    Text.margin({ bottom: 16 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('暂无消息');
                                    Text.fontSize(16);
                                    Text.fontColor('#999999');
                                }, Text);
                                Text.pop();
                                // 空状态
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = _item => {
                                        const message = _item;
                                        this.MessageItem.bind(this)(message);
                                    };
                                    this.forEachUpdateFunction(elmtId, this.getFilteredMessages(), forEachItemGenFunction, (message: MessageRecord) => message.id, false, false);
                                }, ForEach);
                                ForEach.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                    Scroll.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    TabItem(label: string, tab: 'all' | MessageType, unreadCount: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ right: 20, top: 6, bottom: 6 });
            Column.onClick(() => {
                this.currentTab = tab;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(14);
            Text.fontColor(this.currentTab === tab ? '#FF5722' : '#666666');
            Text.fontWeight(this.currentTab === tab ? FontWeight.Bold : FontWeight.Normal);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (unreadCount > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${unreadCount}`);
                        Text.fontSize(10);
                        Text.fontColor(Color.White);
                        Text.backgroundColor('#FF5722');
                        Text.borderRadius(8);
                        Text.padding({ left: 5, right: 5, top: 2, bottom: 2 });
                        Text.margin({ left: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentTab === tab) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.width(20);
                        Divider.height(2);
                        Divider.color('#FF5722');
                        Divider.margin({ top: 6 });
                    }, Divider);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    MessageItem(message: MessageRecord, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(14);
            Row.backgroundColor(message.isRead ? '#FAFAFA' : Color.White);
            Row.borderRadius(10);
            Row.margin({ bottom: 10 });
            Row.onClick(() => {
                this.onMessageClick(message);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 消息图标
            Text.create(this.getMessageIcon(message.type));
            // 消息图标
            Text.fontSize(28);
            // 消息图标
            Text.margin({ right: 12 });
        }, Text);
        // 消息图标
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 消息内容
            Column.create();
            // 消息内容
            Column.alignItems(HorizontalAlign.Start);
            // 消息内容
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(message.title);
            Text.fontSize(15);
            Text.fontColor('#333333');
            Text.fontWeight(message.isRead ? FontWeight.Normal : FontWeight.Bold);
            Text.layoutWeight(1);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.formatTime(message.createTime));
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(message.content);
            Text.fontSize(13);
            Text.fontColor('#666666');
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 消息类型标签
            Text.create(getMessageTypeName(message.type));
            // 消息类型标签
            Text.fontSize(11);
            // 消息类型标签
            Text.fontColor('#FF5722');
            // 消息类型标签
            Text.margin({ top: 6 });
        }, Text);
        // 消息类型标签
        Text.pop();
        // 消息内容
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
