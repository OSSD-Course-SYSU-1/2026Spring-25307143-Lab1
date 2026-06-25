if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface OrderListPage_Params {
    orders?: OrderRecord[];
    filteredOrders?: OrderRecord[];
    isLoading?: boolean;
    currentTab?: string;
    currentUserId?: string;
    checkTimer?: number;
    tabs?: TabItem[];
}
import router from "@ohos:router";
import { OrderManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/OrderManager";
import type { OrderRecord, OrderStatus } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/OrderManager";
import { AccountManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/AccountManager";
// 标签项接口
interface TabItem {
    key: string;
    name: string;
}
class OrderListPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__orders = new ObservedPropertyObjectPU([], this, "orders");
        this.__filteredOrders = new ObservedPropertyObjectPU([], this, "filteredOrders");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__currentTab = new ObservedPropertySimplePU('all', this, "currentTab");
        this.__currentUserId = new ObservedPropertySimplePU('', this, "currentUserId");
        this.checkTimer = -1;
        this.tabs = [
            { key: 'all', name: '全部' },
            { key: 'pending', name: '待付款' },
            { key: 'paid', name: '待发货' },
            { key: 'shipped', name: '待收货' },
            { key: 'completed', name: '已完成' },
            { key: 'cancelled', name: '已取消' }
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: OrderListPage_Params) {
        if (params.orders !== undefined) {
            this.orders = params.orders;
        }
        if (params.filteredOrders !== undefined) {
            this.filteredOrders = params.filteredOrders;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.currentTab !== undefined) {
            this.currentTab = params.currentTab;
        }
        if (params.currentUserId !== undefined) {
            this.currentUserId = params.currentUserId;
        }
        if (params.checkTimer !== undefined) {
            this.checkTimer = params.checkTimer;
        }
        if (params.tabs !== undefined) {
            this.tabs = params.tabs;
        }
    }
    updateStateVars(params: OrderListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__orders.purgeDependencyOnElmtId(rmElmtId);
        this.__filteredOrders.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTab.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUserId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__orders.aboutToBeDeleted();
        this.__filteredOrders.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__currentTab.aboutToBeDeleted();
        this.__currentUserId.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __orders: ObservedPropertyObjectPU<OrderRecord[]>;
    get orders() {
        return this.__orders.get();
    }
    set orders(newValue: OrderRecord[]) {
        this.__orders.set(newValue);
    }
    private __filteredOrders: ObservedPropertyObjectPU<OrderRecord[]>;
    get filteredOrders() {
        return this.__filteredOrders.get();
    }
    set filteredOrders(newValue: OrderRecord[]) {
        this.__filteredOrders.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __currentTab: ObservedPropertySimplePU<string>;
    get currentTab() {
        return this.__currentTab.get();
    }
    set currentTab(newValue: string) {
        this.__currentTab.set(newValue);
    }
    private __currentUserId: ObservedPropertySimplePU<string>;
    get currentUserId() {
        return this.__currentUserId.get();
    }
    set currentUserId(newValue: string) {
        this.__currentUserId.set(newValue);
    }
    private checkTimer: number; // 定时检查超时订单
    // 订单状态标签
    private tabs: TabItem[];
    aboutToAppear() {
        this.currentUserId = AccountManager.getInstance().getCurrentUserId();
        const params = router.getParams() as Record<string, string>;
        if (params && params['orderType']) {
            this.currentTab = params['orderType'];
        }
        this.loadOrders();
        // 启动定时检查超时订单（每30秒检查一次）
        this.startExpireCheck();
    }
    aboutToDisappear() {
        // 清除定时器
        if (this.checkTimer !== -1) {
            clearInterval(this.checkTimer);
            this.checkTimer = -1;
        }
    }
    // 启动超时检查
    startExpireCheck() {
        this.checkTimer = setInterval(() => {
            const expiredOrders = OrderManager.getInstance().checkAndCancelExpiredOrders();
            if (expiredOrders.length > 0) {
                // 有订单超时被取消，刷新列表
                this.loadOrders();
            }
        }, 30000); // 每30秒检查一次
    }
    onPageShow() {
        this.currentUserId = AccountManager.getInstance().getCurrentUserId();
        this.loadOrders();
    }
    // 加载订单
    loadOrders() {
        // 先检查超时订单
        OrderManager.getInstance().checkAndCancelExpiredOrders();
        this.orders = OrderManager.getInstance().getUserOrders(this.currentUserId);
        this.filterOrders();
        this.isLoading = false;
    }
    // 筛选订单
    filterOrders() {
        if (this.currentTab === 'all') {
            this.filteredOrders = this.orders;
        }
        else {
            this.filteredOrders = this.orders.filter(order => order.status === this.currentTab);
        }
    }
    // 切换标签
    switchTab(key: string) {
        this.currentTab = key;
        this.filterOrders();
    }
    // 获取状态文本
    getStatusText(status: OrderStatus): string {
        switch (status) {
            case 'pending':
                return '待付款';
            case 'paid':
                return '待发货';
            case 'shipped':
                return '待收货';
            case 'completed':
                return '已完成';
            case 'cancelled':
                return '已取消';
            default:
                return '未知';
        }
    }
    // 获取状态颜色
    getStatusColor(status: OrderStatus): string {
        switch (status) {
            case 'pending':
                return '#FF9800';
            case 'paid':
                return '#2196F3';
            case 'shipped':
                return '#4CAF50';
            case 'completed':
                return '#999999';
            case 'cancelled':
                return '#F44336';
            default:
                return '#999999';
        }
    }
    // 格式化剩余时间
    formatRemainingTime(expireTime: number): string {
        const now = Date.now();
        const remaining = expireTime - now;
        if (remaining <= 0) {
            return '已超时';
        }
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        if (minutes > 0) {
            return `${minutes}分${seconds}秒`;
        }
        else {
            return `${seconds}秒`;
        }
    }
    // 查看订单详情
    viewOrderDetail(order: OrderRecord) {
        router.pushUrl({
            url: 'pages/OrderDetailPage',
            params: {
                orderId: order.orderId
            }
        });
    }
    // 取消订单
    cancelOrder(order: OrderRecord) {
        AlertDialog.show({
            title: '确认取消',
            message: '确定要取消这个订单吗？',
            primaryButton: {
                value: '取消',
                action: () => { }
            },
            secondaryButton: {
                value: '确定',
                action: () => {
                    OrderManager.getInstance().updateOrderStatus(order.orderId, 'cancelled');
                    this.loadOrders();
                }
            }
        });
    }
    // 确认收货
    confirmReceive(order: OrderRecord) {
        AlertDialog.show({
            title: '确认收货',
            message: '确定已收到商品吗？',
            primaryButton: {
                value: '取消',
                action: () => { }
            },
            secondaryButton: {
                value: '确定',
                action: () => {
                    OrderManager.getInstance().updateOrderStatus(order.orderId, 'completed');
                    this.loadOrders();
                }
            }
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.height(56);
            // 标题栏
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777246, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.onClick(() => {
                router.back();
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的订单');
            Text.fontSize(18);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.width(24);
        }, Blank);
        Blank.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标签栏
            Scroll.create();
            // 标签栏
            Scroll.width('100%');
            // 标签栏
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 标签栏
            Scroll.scrollBar(BarState.Off);
            // 标签栏
            Scroll.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    Column.onClick(() => {
                        this.switchTab(tab.key);
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab.name);
                    Text.fontSize(14);
                    Text.fontColor(this.currentTab === tab.key ? { "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                    Text.fontWeight(this.currentTab === tab.key ? FontWeight.Bold : FontWeight.Normal);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.currentTab === tab.key) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Divider.create();
                                Divider.width(20);
                                Divider.height(2);
                                Divider.color({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                                Divider.margin({ top: 4 });
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
            };
            this.forEachUpdateFunction(elmtId, this.tabs, forEachItemGenFunction, (tab: TabItem) => tab.key, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 标签栏
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 订单列表
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
                        LoadingProgress.width(48);
                        LoadingProgress.height(48);
                        LoadingProgress.color({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Text.margin({ top: 16 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else if (this.filteredOrders.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 空状态
                        Column.create();
                        // 空状态
                        Column.width('100%');
                        // 空状态
                        Column.layoutWeight(1);
                        // 空状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📦');
                        Text.fontSize(60);
                        Text.opacity(0.5);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无订单');
                        Text.fontSize(16);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Text.margin({ top: 16 });
                    }, Text);
                    Text.pop();
                    // 空状态
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.width('100%');
                        Scroll.layoutWeight(1);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, top: 8, bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const order = _item;
                            this.OrderItem.bind(this)(order);
                        };
                        this.forEachUpdateFunction(elmtId, this.filteredOrders, forEachItemGenFunction, (order: OrderRecord) => order.orderId, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    Scroll.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    OrderItem(order: OrderRecord, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Column.borderRadius(12);
            Column.margin({ bottom: 12 });
            Column.onClick(() => {
                this.viewOrderDetail(order);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 订单头部
            Row.create();
            // 订单头部
            Row.width('100%');
            // 订单头部
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`订单号: ${order.orderId}`);
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 如果是待付款订单，显示倒计时
            if (order.status === 'pending' && order.expireTime) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.formatRemainingTime(order.expireTime));
                        Text.fontSize(12);
                        Text.fontColor('#FF9800');
                        Text.margin({ right: 12 });
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getStatusText(order.status));
            Text.fontSize(14);
            Text.fontColor(this.getStatusColor(order.status));
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 订单头部
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品列表
            Row.create();
            // 商品列表
            Row.width('100%');
            // 商品列表
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(order.product.imageUrl || { "id": 16777261, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Image.width(80);
            Image.height(80);
            Image.borderRadius(8);
            Image.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(order.product.name);
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${order.product.price}`);
            Text.fontSize(14);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`x${order.product.quantity}`);
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        // 商品列表
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 订单底部
            Row.create();
            // 订单底部
            Row.width('100%');
            // 订单底部
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`下单时间: ${order.createTime}`);
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`合计: ¥${order.totalPrice.toFixed(2)}`);
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 订单底部
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮
            Row.create();
            // 操作按钮
            Row.width('100%');
            // 操作按钮
            Row.margin({ top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (order.status === 'pending') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消订单');
                        Button.height(32);
                        Button.fontSize(12);
                        Button.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Button.backgroundColor(Color.Transparent);
                        Button.border({ width: 1, color: { "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" }, radius: 16 });
                        Button.margin({ right: 8 });
                        Button.onClick(() => {
                            this.cancelOrder(order);
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('去付款');
                        Button.height(32);
                        Button.fontSize(12);
                        Button.fontColor(Color.White);
                        Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Button.borderRadius(16);
                        Button.onClick(() => {
                            this.viewOrderDetail(order);
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else if (order.status === 'shipped') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确认收货');
                        Button.height(32);
                        Button.fontSize(12);
                        Button.fontColor(Color.White);
                        Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Button.borderRadius(16);
                        Button.onClick(() => {
                            this.confirmReceive(order);
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('查看详情');
                        Button.height(32);
                        Button.fontSize(12);
                        Button.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Button.backgroundColor(Color.Transparent);
                        Button.border({ width: 1, color: { "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" }, radius: 16 });
                        Button.onClick(() => {
                            this.viewOrderDetail(order);
                        });
                    }, Button);
                    Button.pop();
                });
            }
        }, If);
        If.pop();
        // 操作按钮
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "OrderListPage";
    }
}
registerNamedRoute(() => new OrderListPage(undefined, {}), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/OrderListPage", pageFullPath: "entry/src/main/ets/pages/OrderListPage", integratedHsp: "false", moduleType: "followWithHap" });
