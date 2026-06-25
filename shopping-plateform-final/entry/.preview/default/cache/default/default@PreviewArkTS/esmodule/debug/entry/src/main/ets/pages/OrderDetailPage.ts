if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface OrderDetailPage_Params {
    order?: OrderRecord | null;
    isLoading?: boolean;
    orderId?: string;
    remainingTime?: number;
    timer?: number;
}
import router from "@ohos:router";
import { OrderManager } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/OrderManager";
import type { OrderRecord, OrderStatus } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/OrderManager";
class OrderDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__order = new ObservedPropertyObjectPU(null, this, "order");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__orderId = new ObservedPropertySimplePU('', this, "orderId");
        this.__remainingTime = new ObservedPropertySimplePU(0, this, "remainingTime");
        this.timer = -1;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: OrderDetailPage_Params) {
        if (params.order !== undefined) {
            this.order = params.order;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.orderId !== undefined) {
            this.orderId = params.orderId;
        }
        if (params.remainingTime !== undefined) {
            this.remainingTime = params.remainingTime;
        }
        if (params.timer !== undefined) {
            this.timer = params.timer;
        }
    }
    updateStateVars(params: OrderDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__order.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__orderId.purgeDependencyOnElmtId(rmElmtId);
        this.__remainingTime.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__order.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__orderId.aboutToBeDeleted();
        this.__remainingTime.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __order: ObservedPropertyObjectPU<OrderRecord | null>;
    get order() {
        return this.__order.get();
    }
    set order(newValue: OrderRecord | null) {
        this.__order.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __orderId: ObservedPropertySimplePU<string>;
    get orderId() {
        return this.__orderId.get();
    }
    set orderId(newValue: string) {
        this.__orderId.set(newValue);
    }
    private __remainingTime: ObservedPropertySimplePU<number>; // 剩余时间（秒）
    get remainingTime() {
        return this.__remainingTime.get();
    }
    set remainingTime(newValue: number) {
        this.__remainingTime.set(newValue);
    }
    private timer: number; // 定时器ID
    aboutToAppear() {
        // 获取路由传递的参数
        const params = router.getParams() as Record<string, Object>;
        if (params && params['orderId']) {
            this.orderId = params['orderId'] as string;
            this.loadOrder();
        }
        else {
            this.isLoading = false;
        }
    }
    aboutToDisappear() {
        // 清除定时器
        if (this.timer !== -1) {
            clearInterval(this.timer);
            this.timer = -1;
        }
    }
    // 启动倒计时
    startCountdown() {
        // 清除旧定时器
        if (this.timer !== -1) {
            clearInterval(this.timer);
        }
        // 获取剩余时间
        this.remainingTime = OrderManager.getInstance().getOrderRemainingTime(this.orderId);
        // 如果有待付款订单，启动定时器
        if (this.remainingTime > 0) {
            this.timer = setInterval(() => {
                this.remainingTime = OrderManager.getInstance().getOrderRemainingTime(this.orderId);
                // 如果时间到了，刷新订单状态
                if (this.remainingTime <= 0) {
                    clearInterval(this.timer);
                    this.timer = -1;
                    this.loadOrder();
                }
            }, 1000);
        }
    }
    // 格式化剩余时间
    formatRemainingTime(): string {
        if (this.remainingTime <= 0) {
            return '已超时';
        }
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    // 加载订单数据
    loadOrder() {
        const orderData = OrderManager.getInstance().getOrderById(this.orderId);
        this.order = orderData !== undefined ? orderData : null;
        this.isLoading = false;
        // 如果是待付款订单，启动倒计时
        if (this.order && this.order.status === 'pending') {
            this.startCountdown();
        }
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
    // 取消订单
    cancelOrder() {
        if (!this.order)
            return;
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
                    OrderManager.getInstance().updateOrderStatus(this.order!.orderId, 'cancelled');
                    this.loadOrder();
                }
            }
        });
    }
    // 立即付款
    payNow() {
        if (!this.order)
            return;
        AlertDialog.show({
            title: '支付确认',
            message: `确定支付 ¥${this.order.totalPrice.toFixed(2)} 吗？`,
            primaryButton: {
                value: '取消',
                action: () => { }
            },
            secondaryButton: {
                value: '确定支付',
                action: () => {
                    const success = OrderManager.getInstance().payOrder(this.order!.orderId);
                    if (success) {
                        this.loadOrder();
                    }
                    else {
                        AlertDialog.show({
                            title: '支付失败',
                            message: '订单已超时或状态异常',
                            primaryButton: {
                                value: '确定',
                                action: () => {
                                    this.loadOrder();
                                }
                            }
                        });
                    }
                }
            }
        });
    }
    // 确认收货
    confirmReceive() {
        if (!this.order)
            return;
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
                    OrderManager.getInstance().updateOrderStatus(this.order!.orderId, 'completed');
                    this.loadOrder();
                }
            }
        });
    }
    // 申请转售
    applyResale() {
        if (!this.order)
            return;
        router.pushUrl({
            url: 'pages/ResaleEditPage',
            params: {
                productData: {
                    id: this.order.product.id,
                    name: this.order.product.name,
                    price: this.order.product.price,
                    imageUrl: this.order.product.imageUrl,
                    shopName: this.order.product.shopName,
                    description: ''
                },
                quantity: this.order.product.quantity,
                orderId: this.order.orderId
            }
        });
    }
    // 再次购买
    buyAgain() {
        if (!this.order)
            return;
        router.pushUrl({
            url: 'pages/ProductDetailPage',
            params: {
                productId: this.order.product.id
            }
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(230:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(232:7)", "entry");
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.height(56);
            // 标题栏
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777296, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(233:9)", "entry");
            Image.width(24);
            Image.height(24);
            Image.onClick(() => {
                router.back();
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('订单详情');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(240:9)", "entry");
            Text.fontSize(18);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(247:9)", "entry");
            Blank.width(48);
        }, Blank);
        Blank.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 加载中
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(255:9)", "entry");
                        // 加载中
                        Column.width('100%');
                        // 加载中
                        Column.height('100%');
                        // 加载中
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(256:11)", "entry");
                        LoadingProgress.width(48);
                        LoadingProgress.height(48);
                        LoadingProgress.color({ "id": 125829135, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(261:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.margin({ top: 16 });
                    }, Text);
                    Text.pop();
                    // 加载中
                    Column.pop();
                });
            }
            else if (this.order) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 订单详情内容
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(271:9)", "entry");
                        // 订单详情内容
                        Scroll.layoutWeight(1);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(272:11)", "entry");
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, top: 16, bottom: 80 });
                    }, Column);
                    // 订单状态卡片
                    this.OrderStatusCard.bind(this)();
                    // 收货地址
                    this.AddressCard.bind(this)();
                    // 商品信息
                    this.ProductCard.bind(this)();
                    // 订单信息
                    this.OrderInfoCard.bind(this)();
                    Column.pop();
                    // 订单详情内容
                    Scroll.pop();
                    // 底部操作按钮
                    this.BottomActions.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 订单不存在
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(294:9)", "entry");
                        // 订单不存在
                        Column.width('100%');
                        // 订单不存在
                        Column.height('100%');
                        // 订单不存在
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('订单不存在');
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(295:11)", "entry");
                        Text.fontSize(16);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    // 订单不存在
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    OrderStatusCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(311:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Column.borderRadius(12);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(312:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 状态图标
            if (this.order?.status === 'completed') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✓');
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(315:11)", "entry");
                        Text.fontSize(30);
                        Text.fontColor('#4CAF50');
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.order?.status === 'cancelled') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✕');
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(319:11)", "entry");
                        Text.fontSize(30);
                        Text.fontColor('#F44336');
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(323:11)", "entry");
                        LoadingProgress.width(30);
                        LoadingProgress.height(30);
                        LoadingProgress.color(this.getStatusColor(this.order?.status || 'pending'));
                    }, LoadingProgress);
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(329:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
            Column.margin({ left: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getStatusText(this.order?.status || 'pending'));
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(330:11)", "entry");
            Text.fontSize(18);
            Text.fontColor(this.getStatusColor(this.order?.status || 'pending'));
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.order?.status === 'pending') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(336:13)", "entry");
                        Row.margin({ top: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请在 ');
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(337:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.formatRemainingTime());
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(341:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#FF9800');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(' 内完成付款');
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(346:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else if (this.order?.status === 'paid') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('商家正在准备发货');
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(352:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.order?.status === 'shipped') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('商品正在配送中');
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(357:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.order?.status === 'completed') {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('感谢您的购买');
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(362:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else if (this.order?.status === 'cancelled') {
                this.ifElseBranchUpdateFunction(4, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('订单已取消');
                        Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(367:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(5, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Row.pop();
        Column.pop();
    }
    AddressCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(388:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Column.borderRadius(12);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(389:7)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125830173, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(390:9)", "entry");
            Image.width(20);
            Image.height(20);
            Image.fillColor({ "id": 125829135, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收货地址');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(395:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(404:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(405:9)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.order?.address.name || '收货人');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(406:11)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.order?.address.phone || '手机号');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(411:11)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.margin({ left: 16 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.order?.address.address || '详细地址');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(418:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        Column.pop();
        Column.pop();
    }
    ProductCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(435:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Column.borderRadius(12);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(436:7)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('商品信息');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(437:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(445:7)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.order?.product.imageUrl || { "id": 16777295, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(446:9)", "entry");
            Image.width(80);
            Image.height(80);
            Image.borderRadius(8);
            Image.objectFit(ImageFit.Cover);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(452:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.order?.product.name || '商品名称');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(453:11)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.order?.product.shopName || '店铺名称');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(460:11)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(465:11)", "entry");
            Row.width('100%');
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${(this.order?.product.price || 0).toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(466:13)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(471:13)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`x${this.order?.product.quantity || 1}`);
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(473:13)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        Row.pop();
        Column.pop();
    }
    OrderInfoCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(495:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('订单信息');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(496:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.InfoRow.bind(this)('订单编号', this.order?.orderId || '');
        this.InfoRow.bind(this)('创建时间', this.order?.createTime || '');
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.order?.payTime) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.InfoRow.bind(this)('付款时间', this.order.payTime);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.order?.completeTime) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.InfoRow.bind(this)('完成时间', this.order.completeTime);
                });
            }
            // 价格明细
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 价格明细
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(514:7)", "entry");
            // 价格明细
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(515:9)", "entry");
            Row.width('100%');
            Row.margin({ top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('商品总价');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(516:11)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(520:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${(this.order?.totalPrice || 0).toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(522:11)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(529:9)", "entry");
            Row.width('100%');
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('运费');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(530:11)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(534:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('免运费');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(536:11)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(543:9)", "entry");
            Row.width('100%');
            Row.margin({ top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('实付款');
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(544:11)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(549:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${(this.order?.totalPrice || 0).toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(551:11)", "entry");
            Text.fontSize(18);
            Text.fontColor({ "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        // 价格明细
        Column.pop();
        Column.pop();
    }
    InfoRow(label: string, value: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(569:5)", "entry");
            Row.width('100%');
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(570:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(574:7)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(576:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
    }
    BottomActions(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(586:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.order?.status === 'pending') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 待付款状态
                        Button.createWithLabel('取消订单');
                        Button.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(589:9)", "entry");
                        // 待付款状态
                        Button.fontSize(14);
                        // 待付款状态
                        Button.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 待付款状态
                        Button.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 待付款状态
                        Button.borderRadius(20);
                        // 待付款状态
                        Button.height(40);
                        // 待付款状态
                        Button.onClick(() => {
                            this.cancelOrder();
                        });
                    }, Button);
                    // 待付款状态
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('立即付款');
                        Button.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(599:9)", "entry");
                        Button.fontSize(14);
                        Button.fontColor(Color.White);
                        Button.backgroundColor({ "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Button.borderRadius(20);
                        Button.height(40);
                        Button.layoutWeight(1);
                        Button.margin({ left: 12 });
                        Button.onClick(() => {
                            this.payNow();
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else if (this.order?.status === 'paid') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 待发货状态
                        Button.createWithLabel('取消订单');
                        Button.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(612:9)", "entry");
                        // 待发货状态
                        Button.fontSize(14);
                        // 待发货状态
                        Button.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 待发货状态
                        Button.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 待发货状态
                        Button.borderRadius(20);
                        // 待发货状态
                        Button.height(40);
                        // 待发货状态
                        Button.onClick(() => {
                            this.cancelOrder();
                        });
                    }, Button);
                    // 待发货状态
                    Button.pop();
                });
            }
            else if (this.order?.status === 'shipped') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 待收货状态
                        Button.createWithLabel('确认收货');
                        Button.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(623:9)", "entry");
                        // 待收货状态
                        Button.fontSize(14);
                        // 待收货状态
                        Button.fontColor(Color.White);
                        // 待收货状态
                        Button.backgroundColor({ "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 待收货状态
                        Button.borderRadius(20);
                        // 待收货状态
                        Button.height(40);
                        // 待收货状态
                        Button.layoutWeight(1);
                        // 待收货状态
                        Button.onClick(() => {
                            this.confirmReceive();
                        });
                    }, Button);
                    // 待收货状态
                    Button.pop();
                });
            }
            else if (this.order?.status === 'completed') {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 已完成状态
                        Button.createWithLabel('申请转售');
                        Button.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(635:9)", "entry");
                        // 已完成状态
                        Button.fontSize(14);
                        // 已完成状态
                        Button.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 已完成状态
                        Button.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 已完成状态
                        Button.borderRadius(20);
                        // 已完成状态
                        Button.height(40);
                        // 已完成状态
                        Button.onClick(() => {
                            this.applyResale();
                        });
                    }, Button);
                    // 已完成状态
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('再次购买');
                        Button.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(645:9)", "entry");
                        Button.fontSize(14);
                        Button.fontColor(Color.White);
                        Button.backgroundColor({ "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Button.borderRadius(20);
                        Button.height(40);
                        Button.layoutWeight(1);
                        Button.margin({ left: 12 });
                        Button.onClick(() => {
                            this.buyAgain();
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else if (this.order?.status === 'cancelled') {
                this.ifElseBranchUpdateFunction(4, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 已取消状态
                        Button.createWithLabel('再次购买');
                        Button.debugLine("entry/src/main/ets/pages/OrderDetailPage.ets(658:9)", "entry");
                        // 已取消状态
                        Button.fontSize(14);
                        // 已取消状态
                        Button.fontColor(Color.White);
                        // 已取消状态
                        Button.backgroundColor({ "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 已取消状态
                        Button.borderRadius(20);
                        // 已取消状态
                        Button.height(40);
                        // 已取消状态
                        Button.layoutWeight(1);
                        // 已取消状态
                        Button.onClick(() => {
                            this.buyAgain();
                        });
                    }, Button);
                    // 已取消状态
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(5, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "OrderDetailPage";
    }
}
registerNamedRoute(() => new OrderDetailPage(undefined, {}), "", { bundleName: "com.atomicservice.account_atomicservice_sample", moduleName: "entry", pagePath: "pages/OrderDetailPage", pageFullPath: "entry/src/main/ets/pages/OrderDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
