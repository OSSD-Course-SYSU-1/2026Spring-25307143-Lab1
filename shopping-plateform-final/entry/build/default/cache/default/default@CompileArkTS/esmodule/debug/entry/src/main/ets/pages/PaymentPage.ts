if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PaymentPage_Params {
    productData?: ProductDetail | null;
    quantity?: number;
    address?: Address | null;
    paymentMethod?: string;
    isLoading?: boolean;
    isPaying?: boolean;
    paymentStatus?: 'pending' | 'success' | 'failed';
}
import router from "@ohos:router";
import { OrderManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/OrderManager";
import type { OrderRecord } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/OrderManager";
import { AccountManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/AccountManager";
// 商品详情数据接口
interface ProductDetail {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    sales: number;
    shopName: string;
    description: string;
    shippingAddress: string;
    stock: number;
    category: string;
}
// 收货地址接口
interface Address {
    id: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
}
class PaymentPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__productData = new ObservedPropertyObjectPU(null, this, "productData");
        this.__quantity = new ObservedPropertySimplePU(1, this, "quantity");
        this.__address = new ObservedPropertyObjectPU(null, this, "address");
        this.__paymentMethod = new ObservedPropertySimplePU('wechat', this, "paymentMethod");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__isPaying = new ObservedPropertySimplePU(false, this, "isPaying");
        this.__paymentStatus = new ObservedPropertySimplePU('pending', this, "paymentStatus");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PaymentPage_Params) {
        if (params.productData !== undefined) {
            this.productData = params.productData;
        }
        if (params.quantity !== undefined) {
            this.quantity = params.quantity;
        }
        if (params.address !== undefined) {
            this.address = params.address;
        }
        if (params.paymentMethod !== undefined) {
            this.paymentMethod = params.paymentMethod;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.isPaying !== undefined) {
            this.isPaying = params.isPaying;
        }
        if (params.paymentStatus !== undefined) {
            this.paymentStatus = params.paymentStatus;
        }
    }
    updateStateVars(params: PaymentPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__productData.purgeDependencyOnElmtId(rmElmtId);
        this.__quantity.purgeDependencyOnElmtId(rmElmtId);
        this.__address.purgeDependencyOnElmtId(rmElmtId);
        this.__paymentMethod.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__isPaying.purgeDependencyOnElmtId(rmElmtId);
        this.__paymentStatus.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__productData.aboutToBeDeleted();
        this.__quantity.aboutToBeDeleted();
        this.__address.aboutToBeDeleted();
        this.__paymentMethod.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__isPaying.aboutToBeDeleted();
        this.__paymentStatus.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __productData: ObservedPropertyObjectPU<ProductDetail | null>;
    get productData() {
        return this.__productData.get();
    }
    set productData(newValue: ProductDetail | null) {
        this.__productData.set(newValue);
    }
    private __quantity: ObservedPropertySimplePU<number>;
    get quantity() {
        return this.__quantity.get();
    }
    set quantity(newValue: number) {
        this.__quantity.set(newValue);
    }
    private __address: ObservedPropertyObjectPU<Address | null>;
    get address() {
        return this.__address.get();
    }
    set address(newValue: Address | null) {
        this.__address.set(newValue);
    }
    private __paymentMethod: ObservedPropertySimplePU<string>;
    get paymentMethod() {
        return this.__paymentMethod.get();
    }
    set paymentMethod(newValue: string) {
        this.__paymentMethod.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __isPaying: ObservedPropertySimplePU<boolean>;
    get isPaying() {
        return this.__isPaying.get();
    }
    set isPaying(newValue: boolean) {
        this.__isPaying.set(newValue);
    }
    private __paymentStatus: ObservedPropertySimplePU<'pending' | 'success' | 'failed'>;
    get paymentStatus() {
        return this.__paymentStatus.get();
    }
    set paymentStatus(newValue: 'pending' | 'success' | 'failed') {
        this.__paymentStatus.set(newValue);
    }
    aboutToAppear() {
        // 获取路由传递的参数
        const params = router.getParams() as Record<string, Object>;
        if (params && params['productData']) {
            this.productData = params['productData'] as ProductDetail;
        }
        if (params && params['quantity']) {
            this.quantity = params['quantity'] as number;
        }
        if (params && params['address']) {
            this.address = params['address'] as Address;
        }
        if (params && params['paymentMethod']) {
            this.paymentMethod = params['paymentMethod'] as string;
        }
        this.isLoading = false;
    }
    // 获取支付方式名称
    getPaymentMethodName(): string {
        switch (this.paymentMethod) {
            case 'wechat':
                return '微信支付';
            case 'alipay':
                return '支付宝';
            case 'huawei':
                return '华为钱包';
            default:
                return '未知支付方式';
        }
    }
    // 模拟支付过程
    simulatePayment() {
        this.isPaying = true;
        this.paymentStatus = 'pending';
        // 模拟支付延迟
        setTimeout(() => {
            // 模拟支付成功（90%成功率）
            const isSuccess = Math.random() > 0.1;
            this.paymentStatus = isSuccess ? 'success' : 'failed';
            this.isPaying = false;
            if (isSuccess) {
                // 支付成功，跳转到订单详情页
                setTimeout(() => {
                    this.goToOrderDetail();
                }, 1500);
            }
        }, 2000);
    }
    // 跳转到订单详情页
    goToOrderDetail() {
        if (!this.productData || !this.address) {
            return;
        }
        const now = new Date();
        const orderCreateTime = now.toLocaleString();
        const orderId = OrderManager.getInstance().generateOrderId();
        // 创建待付款订单记录并保存到OrderManager
        const order: OrderRecord = {
            orderId: orderId,
            userId: AccountManager.getInstance().getCurrentUserId(),
            product: {
                id: this.productData.id,
                name: this.productData.name,
                price: this.productData.price,
                imageUrl: this.productData.imageUrl,
                quantity: this.quantity,
                shopName: this.productData.shopName
            },
            totalPrice: this.productData.price * this.quantity,
            address: {
                name: this.address.name,
                phone: this.address.phone,
                address: this.address.address
            },
            paymentMethod: this.getPaymentMethodName(),
            createTime: orderCreateTime,
            payTime: '',
            status: 'pending'
        };
        // 保存待付款订单到OrderManager（带过期时间）
        OrderManager.getInstance().createPendingOrder(order);
        // 跳转到订单详情页，用户可以在那里付款
        router.replaceUrl({
            url: 'pages/OrderDetailPage',
            params: {
                orderId: orderId
            }
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.height(56);
            // 顶部导航栏
            Row.backgroundColor('#FF5722');
            // 顶部导航栏
            Row.padding({ left: 8, right: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(40);
            Button.height(40);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                router.back();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.fontSize(20);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        Row.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getPaymentMethodName());
            Text.fontSize(18);
            Text.fontColor(Color.White);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(40);
            Row.height(40);
        }, Row);
        Row.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
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
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 支付金额
                        Column.create();
                        // 支付金额
                        Column.width('100%');
                        // 支付金额
                        Column.padding(30);
                        // 支付金额
                        Column.margin({ top: 50 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('支付金额');
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.productData) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`¥${(this.productData.price * this.quantity).toFixed(2)}`);
                                    Text.fontSize(36);
                                    Text.fontColor('#FF5722');
                                    Text.fontWeight(FontWeight.Bold);
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
                    // 支付金额
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 支付状态
                        if (this.paymentStatus === 'pending' && !this.isPaying) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 待支付状态
                                    Column.create();
                                    // 待支付状态
                                    Column.width('100%');
                                    // 待支付状态
                                    Column.padding(20);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('请确认支付');
                                    Text.fontSize(16);
                                    Text.fontColor('#333333');
                                    Text.margin({ bottom: 20 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithLabel('确认支付');
                                    Button.fontSize(16);
                                    Button.fontColor(Color.White);
                                    Button.backgroundColor('#FF5722');
                                    Button.borderRadius(20);
                                    Button.width(200);
                                    Button.height(44);
                                    Button.onClick(() => {
                                        this.simulatePayment();
                                    });
                                }, Button);
                                Button.pop();
                                // 待支付状态
                                Column.pop();
                            });
                        }
                        else if (this.isPaying) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 支付中状态
                                    Column.create();
                                    // 支付中状态
                                    Column.width('100%');
                                    // 支付中状态
                                    Column.padding(20);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    LoadingProgress.create();
                                    LoadingProgress.width(50);
                                    LoadingProgress.height(50);
                                    LoadingProgress.color('#FF5722');
                                }, LoadingProgress);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('支付中，请稍候...');
                                    Text.fontSize(16);
                                    Text.fontColor('#666666');
                                    Text.margin({ top: 20 });
                                }, Text);
                                Text.pop();
                                // 支付中状态
                                Column.pop();
                            });
                        }
                        else if (this.paymentStatus === 'success') {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 支付成功状态
                                    Column.create();
                                    // 支付成功状态
                                    Column.width('100%');
                                    // 支付成功状态
                                    Column.padding(20);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('✓');
                                    Text.fontSize(60);
                                    Text.fontColor('#4CAF50');
                                    Text.margin({ bottom: 20 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('支付成功');
                                    Text.fontSize(20);
                                    Text.fontColor('#4CAF50');
                                    Text.fontWeight(FontWeight.Bold);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('即将跳转到订单详情...');
                                    Text.fontSize(14);
                                    Text.fontColor('#999999');
                                    Text.margin({ top: 12 });
                                }, Text);
                                Text.pop();
                                // 支付成功状态
                                Column.pop();
                            });
                        }
                        else if (this.paymentStatus === 'failed') {
                            this.ifElseBranchUpdateFunction(3, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 支付失败状态
                                    Column.create();
                                    // 支付失败状态
                                    Column.width('100%');
                                    // 支付失败状态
                                    Column.padding(20);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('✗');
                                    Text.fontSize(60);
                                    Text.fontColor('#F44336');
                                    Text.margin({ bottom: 20 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('支付失败');
                                    Text.fontSize(20);
                                    Text.fontColor('#F44336');
                                    Text.fontWeight(FontWeight.Bold);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithLabel('重新支付');
                                    Button.fontSize(16);
                                    Button.fontColor(Color.White);
                                    Button.backgroundColor('#FF5722');
                                    Button.borderRadius(20);
                                    Button.width(200);
                                    Button.height(44);
                                    Button.margin({ top: 20 });
                                    Button.onClick(() => {
                                        this.simulatePayment();
                                    });
                                }, Button);
                                Button.pop();
                                // 支付失败状态
                                Column.pop();
                            });
                        }
                        // 商品信息摘要
                        else {
                            this.ifElseBranchUpdateFunction(4, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 商品信息摘要
                        if (this.productData) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width('100%');
                                    Column.padding(16);
                                    Column.backgroundColor(Color.White);
                                    Column.borderRadius(8);
                                    Column.margin({ top: 30, left: 16, right: 16 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.productData.imageUrl);
                                    Image.width(60);
                                    Image.height(60);
                                    Image.objectFit(ImageFit.Cover);
                                    Image.borderRadius(8);
                                }, Image);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.layoutWeight(1);
                                    Column.alignItems(HorizontalAlign.Start);
                                    Column.margin({ left: 12 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.productData.name);
                                    Text.fontSize(14);
                                    Text.fontColor('#333333');
                                    Text.maxLines(2);
                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    Text.width('100%');
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`¥${this.productData.price} x${this.quantity}`);
                                    Text.fontSize(14);
                                    Text.fontColor('#FF5722');
                                    Text.margin({ top: 4 });
                                }, Text);
                                Text.pop();
                                Column.pop();
                                Row.pop();
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
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
        return "PaymentPage";
    }
}
registerNamedRoute(() => new PaymentPage(undefined, {}), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/PaymentPage", pageFullPath: "entry/src/main/ets/pages/PaymentPage", integratedHsp: "false", moduleType: "followWithHap" });
