if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ResaleEditPage_Params {
    productData?: ProductDetail | null;
    quantity?: number;
    orderId?: string;
    resalePrice?: number;
    description?: string;
    isPublishing?: boolean;
    currentUserId?: string;
    currentUsername?: string;
}
import router from "@ohos:router";
import { ResaleManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/ResaleManager";
import { AccountManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/AccountManager";
// 商品详情数据接口
interface ProductDetail {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    shopName: string;
    description: string;
}
class ResaleEditPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__productData = new ObservedPropertyObjectPU(null, this, "productData");
        this.__quantity = new ObservedPropertySimplePU(1, this, "quantity");
        this.__orderId = new ObservedPropertySimplePU('', this, "orderId");
        this.__resalePrice = new ObservedPropertySimplePU(0, this, "resalePrice");
        this.__description = new ObservedPropertySimplePU('', this, "description");
        this.__isPublishing = new ObservedPropertySimplePU(false, this, "isPublishing");
        this.__currentUserId = new ObservedPropertySimplePU('', this, "currentUserId");
        this.__currentUsername = new ObservedPropertySimplePU('', this, "currentUsername");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ResaleEditPage_Params) {
        if (params.productData !== undefined) {
            this.productData = params.productData;
        }
        if (params.quantity !== undefined) {
            this.quantity = params.quantity;
        }
        if (params.orderId !== undefined) {
            this.orderId = params.orderId;
        }
        if (params.resalePrice !== undefined) {
            this.resalePrice = params.resalePrice;
        }
        if (params.description !== undefined) {
            this.description = params.description;
        }
        if (params.isPublishing !== undefined) {
            this.isPublishing = params.isPublishing;
        }
        if (params.currentUserId !== undefined) {
            this.currentUserId = params.currentUserId;
        }
        if (params.currentUsername !== undefined) {
            this.currentUsername = params.currentUsername;
        }
    }
    updateStateVars(params: ResaleEditPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__productData.purgeDependencyOnElmtId(rmElmtId);
        this.__quantity.purgeDependencyOnElmtId(rmElmtId);
        this.__orderId.purgeDependencyOnElmtId(rmElmtId);
        this.__resalePrice.purgeDependencyOnElmtId(rmElmtId);
        this.__description.purgeDependencyOnElmtId(rmElmtId);
        this.__isPublishing.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUserId.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUsername.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__productData.aboutToBeDeleted();
        this.__quantity.aboutToBeDeleted();
        this.__orderId.aboutToBeDeleted();
        this.__resalePrice.aboutToBeDeleted();
        this.__description.aboutToBeDeleted();
        this.__isPublishing.aboutToBeDeleted();
        this.__currentUserId.aboutToBeDeleted();
        this.__currentUsername.aboutToBeDeleted();
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
    private __orderId: ObservedPropertySimplePU<string>;
    get orderId() {
        return this.__orderId.get();
    }
    set orderId(newValue: string) {
        this.__orderId.set(newValue);
    }
    private __resalePrice: ObservedPropertySimplePU<number>;
    get resalePrice() {
        return this.__resalePrice.get();
    }
    set resalePrice(newValue: number) {
        this.__resalePrice.set(newValue);
    }
    private __description: ObservedPropertySimplePU<string>;
    get description() {
        return this.__description.get();
    }
    set description(newValue: string) {
        this.__description.set(newValue);
    }
    private __isPublishing: ObservedPropertySimplePU<boolean>;
    get isPublishing() {
        return this.__isPublishing.get();
    }
    set isPublishing(newValue: boolean) {
        this.__isPublishing.set(newValue);
    }
    private __currentUserId: ObservedPropertySimplePU<string>;
    get currentUserId() {
        return this.__currentUserId.get();
    }
    set currentUserId(newValue: string) {
        this.__currentUserId.set(newValue);
    }
    private __currentUsername: ObservedPropertySimplePU<string>;
    get currentUsername() {
        return this.__currentUsername.get();
    }
    set currentUsername(newValue: string) {
        this.__currentUsername.set(newValue);
    }
    aboutToAppear() {
        // 获取当前登录用户信息
        const user = AccountManager.getInstance().getCurrentUser();
        if (user) {
            this.currentUserId = user.userId;
            this.currentUsername = user.username;
        }
        // 获取路由传递的参数
        const params = router.getParams() as Record<string, Object>;
        if (params && params['productData']) {
            this.productData = params['productData'] as ProductDetail;
            // 默认转售价格等于原价
            this.resalePrice = this.productData.price;
        }
        if (params && params['quantity']) {
            this.quantity = params['quantity'] as number;
        }
        if (params && params['orderId']) {
            this.orderId = params['orderId'] as string;
        }
    }
    // 发布转售订单
    publishResale() {
        if (!this.productData) {
            return;
        }
        if (this.resalePrice <= 0) {
            AlertDialog.show({
                title: '提示',
                message: '请输入有效的转售价格',
                autoCancel: true,
                alignment: DialogAlignment.Center
            });
            return;
        }
        this.isPublishing = true;
        // 创建转售订单
        const resaleOrder = ResaleManager.getInstance().createResaleOrder(this.orderId, {
            id: this.productData.id,
            name: this.productData.name,
            price: this.productData.price,
            imageUrl: this.productData.imageUrl,
            quantity: this.quantity,
            shopName: this.productData.shopName
        }, this.resalePrice, this.description, this.currentUserId, this.currentUsername);
        // 发布转售订单
        ResaleManager.getInstance().publishResaleOrder(resaleOrder.resaleId);
        setTimeout(() => {
            this.isPublishing = false;
            AlertDialog.show({
                title: '发布成功',
                message: '转售订单已发布到市集',
                autoCancel: true,
                alignment: DialogAlignment.Center,
                confirm: {
                    value: '确定',
                    action: () => {
                        router.back();
                    }
                }
            });
        }, 1000);
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
            Text.create('编辑转售信息');
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
            Scroll.create();
            Scroll.width('100%');
            Scroll.layoutWeight(1);
            Scroll.scrollBar(BarState.Off);
            Scroll.edgeEffect(EdgeEffect.Spring);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品信息卡片
            Column.create();
            // 商品信息卡片
            Column.width('100%');
            // 商品信息卡片
            Column.padding(16);
            // 商品信息卡片
            Column.backgroundColor(Color.White);
            // 商品信息卡片
            Column.borderRadius(8);
            // 商品信息卡片
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('商品信息');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.width('100%');
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.productData) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.productData.imageUrl);
                        Image.width(100);
                        Image.height(100);
                        Image.borderRadius(8);
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.layoutWeight(1);
                        Column.alignItems(HorizontalAlign.Start);
                        Column.margin({ left: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.productData.name);
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`店铺: ${this.productData.shopName}`);
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
                        Text.create(`原价: ¥${this.productData.price}`);
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`x${this.quantity}`);
                        Text.fontSize(12);
                        Text.fontColor('#999999');
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    Column.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 商品信息卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 转售价格设置
            Column.create();
            // 转售价格设置
            Column.width('100%');
            // 转售价格设置
            Column.padding(16);
            // 转售价格设置
            Column.backgroundColor(Color.White);
            // 转售价格设置
            Column.borderRadius(8);
            // 转售价格设置
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('转售价格');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.width('100%');
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('¥');
            Text.fontSize(24);
            Text.fontColor('#FF5722');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入转售价格', text: this.resalePrice.toString() });
            TextInput.type(InputType.Number);
            TextInput.fontSize(24);
            TextInput.fontColor('#FF5722');
            TextInput.fontWeight(FontWeight.Bold);
            TextInput.layoutWeight(1);
            TextInput.backgroundColor(Color.Transparent);
            TextInput.onChange((value: string) => {
                this.resalePrice = parseFloat(value) || 0;
            });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 价格提示
            if (this.productData) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ top: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.resalePrice > this.productData.price) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`比原价高 ¥${(this.resalePrice - this.productData.price).toFixed(2)}`);
                                    Text.fontSize(12);
                                    Text.fontColor('#FF5722');
                                }, Text);
                                Text.pop();
                            });
                        }
                        else if (this.resalePrice < this.productData.price) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`比原价低 ¥${(this.productData.price - this.resalePrice).toFixed(2)}`);
                                    Text.fontSize(12);
                                    Text.fontColor('#4CAF50');
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('与原价相同');
                                    Text.fontSize(12);
                                    Text.fontColor('#999999');
                                }, Text);
                                Text.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 转售价格设置
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 转售描述
            Column.create();
            // 转售描述
            Column.width('100%');
            // 转售描述
            Column.padding(16);
            // 转售描述
            Column.backgroundColor(Color.White);
            // 转售描述
            Column.borderRadius(8);
            // 转售描述
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('转售描述（可选）');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.width('100%');
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ placeholder: '请输入转售描述，如商品成色、使用情况等', text: this.description });
            TextArea.fontSize(14);
            TextArea.height(120);
            TextArea.width('100%');
            TextArea.backgroundColor('#F5F5F5');
            TextArea.borderRadius(8);
            TextArea.onChange((value: string) => {
                this.description = value;
            });
        }, TextArea);
        // 转售描述
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 温馨提示
            Column.create();
            // 温馨提示
            Column.width('100%');
            // 温馨提示
            Column.padding(16);
            // 温馨提示
            Column.backgroundColor('#FFF3E0');
            // 温馨提示
            Column.borderRadius(8);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('温馨提示');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FF9800');
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('• 转售商品将在市集中展示给其他用户\n• 请如实描述商品状况，避免纠纷\n• 转售成功后，订单状态将更新为已售出');
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.lineHeight(20);
            Text.width('100%');
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        // 温馨提示
        Column.pop();
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部发布按钮
            Column.create();
            // 底部发布按钮
            Column.width('100%');
            // 底部发布按钮
            Column.padding({ left: 16, right: 16, bottom: 16, top: 8 });
            // 底部发布按钮
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isPublishing ? '发布中...' : '发布');
            Button.width('100%');
            Button.height(50);
            Button.fontSize(18);
            Button.fontColor(Color.White);
            Button.backgroundColor(this.isPublishing ? '#CCCCCC' : '#4CAF50');
            Button.borderRadius(25);
            Button.enabled(!this.isPublishing);
            Button.onClick(() => {
                this.publishResale();
            });
        }, Button);
        Button.pop();
        // 底部发布按钮
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ResaleEditPage";
    }
}
registerNamedRoute(() => new ResaleEditPage(undefined, {}), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/ResaleEditPage", pageFullPath: "entry/src/main/ets/pages/ResaleEditPage", integratedHsp: "false", moduleType: "followWithHap" });
