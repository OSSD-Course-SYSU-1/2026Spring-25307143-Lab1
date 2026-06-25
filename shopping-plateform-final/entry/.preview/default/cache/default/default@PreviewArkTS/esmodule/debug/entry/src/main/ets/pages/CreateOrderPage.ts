if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CreateOrderPage_Params {
    productData?: ProductDetail | null;
    quantity?: number;
    selectedPayment?: string;
    selectedAddress?: Address | null;
    isLoading?: boolean;
    addresses?: Address[];
}
import router from "@ohos:router";
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
class CreateOrderPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__productData = new ObservedPropertyObjectPU(null, this, "productData");
        this.__quantity = new ObservedPropertySimplePU(1, this, "quantity");
        this.__selectedPayment = new ObservedPropertySimplePU('wechat', this, "selectedPayment");
        this.__selectedAddress = new ObservedPropertyObjectPU(null, this, "selectedAddress");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.addresses = [
            {
                id: '1',
                name: '张三',
                phone: '13800138000',
                address: '广东省深圳市南山区科技园南区',
                isDefault: true
            },
            {
                id: '2',
                name: '李四',
                phone: '13900139000',
                address: '北京市海淀区中关村大街',
                isDefault: false
            }
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CreateOrderPage_Params) {
        if (params.productData !== undefined) {
            this.productData = params.productData;
        }
        if (params.quantity !== undefined) {
            this.quantity = params.quantity;
        }
        if (params.selectedPayment !== undefined) {
            this.selectedPayment = params.selectedPayment;
        }
        if (params.selectedAddress !== undefined) {
            this.selectedAddress = params.selectedAddress;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.addresses !== undefined) {
            this.addresses = params.addresses;
        }
    }
    updateStateVars(params: CreateOrderPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__productData.purgeDependencyOnElmtId(rmElmtId);
        this.__quantity.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedPayment.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedAddress.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__productData.aboutToBeDeleted();
        this.__quantity.aboutToBeDeleted();
        this.__selectedPayment.aboutToBeDeleted();
        this.__selectedAddress.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
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
    private __selectedPayment: ObservedPropertySimplePU<string>; // wechat, alipay, huawei
    get selectedPayment() {
        return this.__selectedPayment.get();
    }
    set selectedPayment(newValue: string) {
        this.__selectedPayment.set(newValue);
    }
    private __selectedAddress: ObservedPropertyObjectPU<Address | null>;
    get selectedAddress() {
        return this.__selectedAddress.get();
    }
    set selectedAddress(newValue: Address | null) {
        this.__selectedAddress.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    // 模拟地址列表
    private addresses: Address[];
    aboutToAppear() {
        // 获取路由传递的参数
        const params = router.getParams() as Record<string, Object>;
        if (params && params['productData']) {
            this.productData = params['productData'] as ProductDetail;
        }
        if (params && params['quantity']) {
            this.quantity = params['quantity'] as number;
        }
        // 设置默认地址
        this.selectedAddress = this.addresses.find(addr => addr.isDefault) || this.addresses[0];
        this.isLoading = false;
    }
    // 构建商品信息卡片
    ProductInfoCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.productData) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(75:7)", "entry");
                        Column.width('100%');
                        Column.backgroundColor(Color.White);
                        Column.borderRadius(8);
                        Column.margin({ bottom: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(76:9)", "entry");
                        Row.width('100%');
                        Row.padding(12);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 商品图片
                        Image.create(this.productData.imageUrl);
                        Image.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(78:11)", "entry");
                        // 商品图片
                        Image.width(80);
                        // 商品图片
                        Image.height(80);
                        // 商品图片
                        Image.objectFit(ImageFit.Cover);
                        // 商品图片
                        Image.borderRadius(8);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 商品信息
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(85:11)", "entry");
                        // 商品信息
                        Column.layoutWeight(1);
                        // 商品信息
                        Column.alignItems(HorizontalAlign.Start);
                        // 商品信息
                        Column.margin({ left: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.productData.name);
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(86:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#333333');
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(93:13)", "entry");
                        Row.width('100%');
                        Row.margin({ top: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`¥${this.productData.price}`);
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(94:15)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#FF5722');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(99:15)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`x${this.quantity}`);
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(101:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    Row.pop();
                    // 商品信息
                    Column.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 分割线
                        Divider.create();
                        Divider.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(116:9)", "entry");
                        // 分割线
                        Divider.color('#E5E5E5');
                    }, Divider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 小计
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(120:9)", "entry");
                        // 小计
                        Row.width('100%');
                        // 小计
                        Row.padding({ left: 12, right: 12, top: 12, bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('小计');
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(121:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(125:11)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`¥${(this.productData.price * this.quantity).toFixed(2)}`);
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(127:11)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#FF5722');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    // 小计
                    Row.pop();
                    Column.pop();
                });
            }
            else // 构建收货地址卡片
             {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    // 构建收货地址卡片
    AddressCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(145:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
            Column.margin({ bottom: 12 });
            Column.onClick(() => {
                // 显示地址选择对话框
                this.showAddressSelector();
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(146:7)", "entry");
            Row.width('100%');
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收货地址');
            Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(147:9)", "entry");
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(152:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择地址 >');
            Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(154:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#FF5722');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(161:7)", "entry");
            Divider.color('#E5E5E5');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedAddress) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(165:9)", "entry");
                        Column.width('100%');
                        Column.alignItems(HorizontalAlign.Start);
                        Column.padding(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(166:11)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedAddress.name);
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(167:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#333333');
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedAddress.phone);
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(172:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.margin({ left: 12 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedAddress.address);
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(178:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.margin({ top: 8 });
                        Text.width('100%');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('请选择收货地址');
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(188:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.padding(12);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    // 显示地址选择对话框
    showAddressSelector() {
        const buttons: AlertDialogButtonOptions[] = [];
        for (let i = 0; i < this.addresses.length; i++) {
            const addr = this.addresses[i];
            buttons.push({
                value: addr.name,
                action: () => {
                    this.selectedAddress = addr;
                }
            });
        }
        AlertDialog.show({
            title: '选择收货地址',
            message: this.addresses.map(addr => `${addr.name} ${addr.phone}\n${addr.address}`).join('\n\n'),
            autoCancel: true,
            alignment: DialogAlignment.Center,
            buttons: buttons
        });
    }
    // 构建支付方式卡片
    PaymentMethodCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(229:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支付方式');
            Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(230:7)", "entry");
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Medium);
            Text.width('100%');
            Text.padding(12);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(237:7)", "entry");
            Divider.color('#E5E5E5');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 微信支付
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(241:7)", "entry");
            // 微信支付
            Row.width('100%');
            // 微信支付
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('微信支付');
            Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(242:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(246:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Radio.create({ value: 'wechat', group: 'paymentGroup' });
            Radio.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(248:9)", "entry");
            Radio.checked(this.selectedPayment === 'wechat');
            Radio.onChange((isChecked: boolean) => {
                if (isChecked) {
                    this.selectedPayment = 'wechat';
                }
            });
        }, Radio);
        // 微信支付
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(259:7)", "entry");
            Divider.color('#E5E5E5');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 支付宝
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(263:7)", "entry");
            // 支付宝
            Row.width('100%');
            // 支付宝
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支付宝');
            Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(264:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(268:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Radio.create({ value: 'alipay', group: 'paymentGroup' });
            Radio.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(270:9)", "entry");
            Radio.checked(this.selectedPayment === 'alipay');
            Radio.onChange((isChecked: boolean) => {
                if (isChecked) {
                    this.selectedPayment = 'alipay';
                }
            });
        }, Radio);
        // 支付宝
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(281:7)", "entry");
            Divider.color('#E5E5E5');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 华为钱包
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(285:7)", "entry");
            // 华为钱包
            Row.width('100%');
            // 华为钱包
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('华为钱包');
            Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(286:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(290:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Radio.create({ value: 'huawei', group: 'paymentGroup' });
            Radio.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(292:9)", "entry");
            Radio.checked(this.selectedPayment === 'huawei');
            Radio.onChange((isChecked: boolean) => {
                if (isChecked) {
                    this.selectedPayment = 'huawei';
                }
            });
        }, Radio);
        // 华为钱包
        Row.pop();
        Column.pop();
    }
    // 构建底部操作栏
    BottomActionBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(312:5)", "entry");
            Row.width('100%');
            Row.height(70);
            Row.backgroundColor(Color.White);
            Row.padding({ left: 16, right: 16 });
            Row.border({ width: { top: 1 }, color: '#E5E5E5' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(313:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('合计：');
            Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(314:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.productData) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`¥${(this.productData.price * this.quantity).toFixed(2)}`);
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(319:11)", "entry");
                        Text.fontSize(20);
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
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('创建订单');
            Button.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(328:7)", "entry");
            Button.fontSize(16);
            Button.fontColor(Color.White);
            Button.backgroundColor('#FF5722');
            Button.borderRadius(20);
            Button.width(120);
            Button.height(44);
            Button.onClick(() => {
                this.createOrder();
            });
        }, Button);
        Button.pop();
        Row.pop();
    }
    // 创建订单
    createOrder() {
        if (!this.selectedAddress) {
            AlertDialog.show({
                title: '提示',
                message: '请选择收货地址',
                autoCancel: true,
                alignment: DialogAlignment.Center
            });
            return;
        }
        if (!this.productData) {
            return;
        }
        // 跳转到支付页面
        router.pushUrl({
            url: 'pages/PaymentPage',
            params: {
                productData: this.productData,
                quantity: this.quantity,
                address: this.selectedAddress,
                paymentMethod: this.selectedPayment
            }
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(375:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(377:7)", "entry");
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
            Button.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(378:9)", "entry");
            Button.width(40);
            Button.height(40);
            Button.backgroundColor(Color.Transparent);
            Button.onClick(() => {
                router.back();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(379:11)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(380:13)", "entry");
            Text.fontSize(20);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        Row.pop();
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(392:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('创建订单');
            Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(394:9)", "entry");
            Text.fontSize(18);
            Text.fontColor(Color.White);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(399:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(401:9)", "entry");
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
                        Column.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(411:9)", "entry");
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(412:11)", "entry");
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.color('#FF5722');
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(417:11)", "entry");
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
                        // 订单内容
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(427:9)", "entry");
                        // 订单内容
                        Scroll.width('100%');
                        // 订单内容
                        Scroll.layoutWeight(1);
                        // 订单内容
                        Scroll.scrollBar(BarState.Off);
                        // 订单内容
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CreateOrderPage.ets(428:11)", "entry");
                        Column.width('100%');
                        Column.padding(12);
                    }, Column);
                    // 商品信息
                    this.ProductInfoCard.bind(this)();
                    // 收货地址
                    this.AddressCard.bind(this)();
                    // 支付方式
                    this.PaymentMethodCard.bind(this)();
                    Column.pop();
                    // 订单内容
                    Scroll.pop();
                    // 底部操作栏
                    this.BottomActionBar.bind(this)();
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
        return "CreateOrderPage";
    }
}
registerNamedRoute(() => new CreateOrderPage(undefined, {}), "", { bundleName: "com.atomicservice.account_atomicservice_sample", moduleName: "entry", pagePath: "pages/CreateOrderPage", pageFullPath: "entry/src/main/ets/pages/CreateOrderPage", integratedHsp: "false", moduleType: "followWithHap" });
