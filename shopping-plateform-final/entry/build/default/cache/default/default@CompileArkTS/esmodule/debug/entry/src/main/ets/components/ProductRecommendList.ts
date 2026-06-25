if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProductRecommendList_Params {
    currentMode?: 'shopping' | 'market';
    mainBoxPadding?: number;
    shoppingProducts?: Product[];
    marketProducts?: Product[];
}
import router from "@ohos:router";
interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    seller: string;
}
export class ProductRecommendList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentMode = new SynchedPropertySimpleOneWayPU(params.currentMode, this, "currentMode");
        this.__mainBoxPadding = new SynchedPropertySimpleOneWayPU(params.mainBoxPadding, this, "mainBoxPadding");
        this.__shoppingProducts = new ObservedPropertyObjectPU([
            {
                id: '1',
                name: '树莓派人形机器人AI视觉大模型TonyPi仿生双足具身智能Python编程',
                price: '3699.00',
                image: 'https://img.alicdn.com/imgextra/i1/2201505950941/O1CN01b9Yn2f1Ip1lBcepD3_!!2201505950941.png_760x760q30.jpg_.webp',
                description: 'AI视觉大模型，仿生双足设计',
                seller: '幻尔旗舰店'
            },
            {
                id: '2',
                name: '【618立即抢购】毛戈平鱼子酱面膜涂抹熬夜救星舒缓修护抗皱紧致',
                price: '299.00',
                image: 'https://img.alicdn.com/imgextra/i2/839895996/O1CN01cqDCSd1uADugGJQZV_!!839895996.jpg_760x760q30.jpg_.webp',
                description: '熬夜救星，舒缓修护抗皱紧致',
                seller: 'MAOGEPING毛戈平官方旗舰店'
            },
            {
                id: '3',
                name: '苏泊尔电烤箱家用大容量蒸烤炸一体多功能智能调控长效预约烘焙箱',
                price: '599.00',
                image: 'https://img.alicdn.com/imgextra/i3/2219155702334/O1CN01nMjc3X1T71RStDyKK_!!2219155702334.jpg_760x760q30.jpg_.webp',
                description: '蒸烤炸一体，多功能智能调控',
                seller: '苏泊尔智能阳台旗舰店'
            },
            {
                id: '4',
                name: '灵动创想初音未来马尾甩甩毛绒玩偶周边挂件fufu公仔娃娃生日礼物',
                price: '89.00',
                image: 'https://img.alicdn.com/imgextra//8b/56/TB1bRlZQpXXXXbZXpXXSutbFXXX.jpg_760x760q30.jpg_.webp',
                description: '初音未来周边，毛绒玩偶',
                seller: '灵动创想旗舰店'
            }
        ], this, "shoppingProducts");
        this.__marketProducts = new ObservedPropertyObjectPU([
            {
                id: '1',
                name: '二手相机',
                price: '1200.00',
                image: '',
                description: '九成新，成色很好',
                seller: '摄影爱好者'
            },
            {
                id: '2',
                name: '二手书籍',
                price: '35.00',
                image: '',
                description: '编程技术书籍，无笔记',
                seller: '学生转卖'
            },
            {
                id: '3',
                name: '二手家具',
                price: '280.00',
                image: '',
                description: '实木书桌，自提',
                seller: '搬家转卖'
            },
            {
                id: '4',
                name: '二手乐器',
                price: '450.00',
                image: '',
                description: '吉他，音色不错',
                seller: '音乐爱好者'
            },
            {
                id: '5',
                name: '二手游戏机',
                price: '800.00',
                image: '',
                description: '游戏主机，配件齐全',
                seller: '玩家转卖'
            }
        ], this, "marketProducts");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProductRecommendList_Params) {
        if (params.currentMode === undefined) {
            this.__currentMode.set('shopping');
        }
        if (params.mainBoxPadding === undefined) {
            this.__mainBoxPadding.set(16);
        }
        if (params.shoppingProducts !== undefined) {
            this.shoppingProducts = params.shoppingProducts;
        }
        if (params.marketProducts !== undefined) {
            this.marketProducts = params.marketProducts;
        }
    }
    updateStateVars(params: ProductRecommendList_Params) {
        this.__currentMode.reset(params.currentMode);
        this.__mainBoxPadding.reset(params.mainBoxPadding);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__mainBoxPadding.purgeDependencyOnElmtId(rmElmtId);
        this.__shoppingProducts.purgeDependencyOnElmtId(rmElmtId);
        this.__marketProducts.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentMode.aboutToBeDeleted();
        this.__mainBoxPadding.aboutToBeDeleted();
        this.__shoppingProducts.aboutToBeDeleted();
        this.__marketProducts.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentMode: SynchedPropertySimpleOneWayPU<'shopping' | 'market'>;
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: 'shopping' | 'market') {
        this.__currentMode.set(newValue);
    }
    private __mainBoxPadding: SynchedPropertySimpleOneWayPU<number>;
    get mainBoxPadding() {
        return this.__mainBoxPadding.get();
    }
    set mainBoxPadding(newValue: number) {
        this.__mainBoxPadding.set(newValue);
    }
    // 淘宝真实商品数据
    private __shoppingProducts: ObservedPropertyObjectPU<Product[]>;
    get shoppingProducts() {
        return this.__shoppingProducts.get();
    }
    set shoppingProducts(newValue: Product[]) {
        this.__shoppingProducts.set(newValue);
    }
    private __marketProducts: ObservedPropertyObjectPU<Product[]>;
    get marketProducts() {
        return this.__marketProducts.get();
    }
    set marketProducts(newValue: Product[]) {
        this.__marketProducts.set(newValue);
    }
    private getProducts(): Product[] {
        return this.currentMode === 'shopping' ? this.shoppingProducts : this.marketProducts;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Row.create();
            // 标题
            Row.width('100%');
            // 标题
            Row.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777294, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        // 标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品列表
            List.create();
            // 商品列表
            List.width('100%');
            // 商品列表
            List.layoutWeight(1);
            // 商品列表
            List.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
            // 商品列表
            List.scrollBar(BarState.Auto);
            // 商品列表
            List.edgeEffect(EdgeEffect.Spring);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const product = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, true);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                        ListItem.margin({ bottom: 12 });
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.ProductCard.bind(this)(product);
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.getProducts(), forEachItemGenFunction, (product: Product) => product.id, false, false);
        }, ForEach);
        ForEach.pop();
        // 商品列表
        List.pop();
        Column.pop();
    }
    ProductCard(product: Product, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Row.borderRadius(12);
            Row.onClick(() => {
                // 点击商品，跳转到商品详情页
                router.pushUrl({
                    url: 'pages/ProductDetailPage',
                    params: {
                        productData: {
                            id: product.id,
                            name: product.name,
                            price: parseFloat(product.price),
                            imageUrl: product.image,
                            sales: 0,
                            shopName: product.seller,
                            description: product.description,
                            shippingAddress: '',
                            stock: 999,
                            category: ''
                        },
                        mode: this.currentMode
                    }
                });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品图片
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (product.image) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(product.image);
                        Image.width(100);
                        Image.height(100);
                        Image.objectFit(ImageFit.Cover);
                        Image.borderRadius(8);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width(100);
                        Column.height(100);
                        Column.justifyContent(FlexAlign.Center);
                        Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Column.borderRadius(8);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Image.width(48);
                        Image.height(48);
                        Image.opacity(0.5);
                    }, Image);
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 商品图片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品信息
            Column.create();
            // 商品信息
            Column.alignItems(HorizontalAlign.Start);
            // 商品信息
            Column.layoutWeight(1);
            // 商品信息
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(product.name);
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(product.description);
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${product.price}`);
            Text.fontSize(18);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(product.seller);
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        // 商品信息
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
