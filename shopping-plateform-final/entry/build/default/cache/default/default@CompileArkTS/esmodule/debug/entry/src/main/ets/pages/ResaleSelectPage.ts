if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ResaleSelectPage_Params {
    orders?: OrderRecord[];
    isLoading?: boolean;
    currentUserId?: string;
}
import router from "@ohos:router";
import { OrderManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/OrderManager";
import type { OrderRecord } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/OrderManager";
import { AccountManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/AccountManager";
class ResaleSelectPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__orders = new ObservedPropertyObjectPU([], this, "orders");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__currentUserId = new ObservedPropertySimplePU('', this, "currentUserId");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ResaleSelectPage_Params) {
        if (params.orders !== undefined) {
            this.orders = params.orders;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.currentUserId !== undefined) {
            this.currentUserId = params.currentUserId;
        }
    }
    updateStateVars(params: ResaleSelectPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__orders.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUserId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__orders.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
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
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __currentUserId: ObservedPropertySimplePU<string>;
    get currentUserId() {
        return this.__currentUserId.get();
    }
    set currentUserId(newValue: string) {
        this.__currentUserId.set(newValue);
    }
    aboutToAppear() {
        // 获取当前登录用户ID
        this.currentUserId = AccountManager.getInstance().getCurrentUserId();
        this.loadOrders();
    }
    // 加载已完成订单
    loadOrders() {
        this.orders = OrderManager.getInstance().getCompletedOrders(this.currentUserId);
        this.isLoading = false;
    }
    // 格式化时间
    formatTime(time: string): string {
        return time.split(' ')[0]; // 只显示日期部分
    }
    // 选择订单进行转售
    selectOrder(order: OrderRecord) {
        router.pushUrl({
            url: 'pages/ResaleEditPage',
            params: {
                productData: {
                    id: order.product.id,
                    name: order.product.name,
                    price: order.product.price,
                    imageUrl: order.product.imageUrl,
                    shopName: order.product.shopName,
                    description: '',
                    shippingAddress: '',
                    stock: 100,
                    category: ''
                },
                quantity: order.product.quantity,
                orderId: order.orderId
            }
        });
    }
    OrderItemBuilder(order: OrderRecord, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor(Color.White);
            Row.borderRadius(8);
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品图片
            Image.create(order.product.imageUrl);
            // 商品图片
            Image.width(80);
            // 商品图片
            Image.height(80);
            // 商品图片
            Image.borderRadius(8);
            // 商品图片
            Image.objectFit(ImageFit.Cover);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品信息
            Column.create();
            // 商品信息
            Column.layoutWeight(1);
            // 商品信息
            Column.alignItems(HorizontalAlign.Start);
            // 商品信息
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(order.product.name);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`店铺: ${order.product.shopName}`);
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${order.product.price}`);
            Text.fontSize(16);
            Text.fontColor('#FF5722');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`x${order.product.quantity}`);
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        // 商品信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 选择按钮
            Button.createWithLabel('转售');
            // 选择按钮
            Button.fontSize(12);
            // 选择按钮
            Button.fontColor(Color.White);
            // 选择按钮
            Button.backgroundColor('#4CAF50');
            // 选择按钮
            Button.borderRadius(15);
            // 选择按钮
            Button.width(60);
            // 选择按钮
            Button.height(30);
            // 选择按钮
            Button.onClick(() => {
                this.selectOrder(order);
            });
        }, Button);
        // 选择按钮
        Button.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
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
            // 标题栏
            Row.backgroundColor(Color.White);
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
            Text.create('选择转售订单');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
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
            If.create();
            // 内容区域
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
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.color('#FF5722');
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.margin({ top: 10 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else if (this.orders.length === 0) {
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
                        Text.create('暂无可转售订单');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                        Text.margin({ top: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('完成购物后即可转售商品');
                        Text.fontSize(12);
                        Text.fontColor('#CCCCCC');
                        Text.margin({ top: 8 });
                    }, Text);
                    Text.pop();
                    // 空状态
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 订单列表
                        Scroll.create();
                        // 订单列表
                        Scroll.width('100%');
                        // 订单列表
                        Scroll.layoutWeight(1);
                        // 订单列表
                        Scroll.scrollBar(BarState.Off);
                        // 订单列表
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择要转售的商品');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.width('100%');
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const order = _item;
                            this.OrderItemBuilder.bind(this)(order);
                        };
                        this.forEachUpdateFunction(elmtId, this.orders, forEachItemGenFunction, (order: OrderRecord) => order.orderId, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    // 订单列表
                    Scroll.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ResaleSelectPage";
    }
}
registerNamedRoute(() => new ResaleSelectPage(undefined, {}), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/ResaleSelectPage", pageFullPath: "entry/src/main/ets/pages/ResaleSelectPage", integratedHsp: "false", moduleType: "followWithHap" });
