if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface HomePage_Params {
    mainBoxPadding?: number;
    currentMode?: string;
    message?: string;
    currentCategory?: string;
    productList?: ProductItem[];
    isLoading?: boolean;
    searchKeyword?: string;
    categories?: string[];
    categoryNames?: Record<string, string>;
}
import router from "@ohos:router";
function GoodsItemBuilder(item: ProductItem, index: number, parent = null) {
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Column.create();
        Column.debugLine("entry/src/main/ets/pages/HomePage.ets(8:3)", "entry");
        Column.width('100%');
        Column.backgroundColor(Color.White);
        Column.borderRadius(8);
        Column.shadow({ radius: 2, color: '#1A000000', offsetX: 0, offsetY: 1 });
        Column.onClick(() => {
            // 跳转到商品详情页
            router.pushUrl({
                url: 'pages/ProductDetailPage',
                params: {
                    productData: item
                }
            });
        });
    }, Column);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        // 商品图片
        Image.create(item.imageUrl);
        Image.debugLine("entry/src/main/ets/pages/HomePage.ets(10:5)", "entry");
        // 商品图片
        Image.width('100%');
        // 商品图片
        Image.height(120);
        // 商品图片
        Image.objectFit(ImageFit.Cover);
        // 商品图片
        Image.borderRadius({ topLeft: 8, topRight: 8 });
    }, Image);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        // 商品信息
        Column.create();
        Column.debugLine("entry/src/main/ets/pages/HomePage.ets(17:5)", "entry");
        // 商品信息
        Column.padding(8);
        // 商品信息
        Column.alignItems(HorizontalAlign.Start);
    }, Column);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        // 商品名称
        Text.create(item.name);
        Text.debugLine("entry/src/main/ets/pages/HomePage.ets(19:7)", "entry");
        // 商品名称
        Text.fontSize(14);
        // 商品名称
        Text.fontColor('#333333');
        // 商品名称
        Text.maxLines(2);
        // 商品名称
        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        // 商品名称
        Text.margin({ top: 8, bottom: 4 });
    }, Text);
    // 商品名称
    Text.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        // 价格和销量
        Row.create();
        Row.debugLine("entry/src/main/ets/pages/HomePage.ets(27:7)", "entry");
        // 价格和销量
        Row.width('100%');
        // 价格和销量
        Row.margin({ bottom: 4 });
    }, Row);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(`¥${item.price}`);
        Text.debugLine("entry/src/main/ets/pages/HomePage.ets(28:9)", "entry");
        Text.fontSize(16);
        Text.fontColor('#FF5722');
        Text.fontWeight(FontWeight.Bold);
    }, Text);
    Text.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Blank.create();
        Blank.debugLine("entry/src/main/ets/pages/HomePage.ets(33:9)", "entry");
    }, Blank);
    Blank.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Text.create(`${item.sales}人付款`);
        Text.debugLine("entry/src/main/ets/pages/HomePage.ets(35:9)", "entry");
        Text.fontSize(12);
        Text.fontColor('#999999');
    }, Text);
    Text.pop();
    // 价格和销量
    Row.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        // 店铺信息
        Text.create(item.shopName);
        Text.debugLine("entry/src/main/ets/pages/HomePage.ets(43:7)", "entry");
        // 店铺信息
        Text.fontSize(12);
        // 店铺信息
        Text.fontColor('#666666');
        // 店铺信息
        Text.maxLines(1);
        // 店铺信息
        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
    }, Text);
    // 店铺信息
    Text.pop();
    // 商品信息
    Column.pop();
    Column.pop();
}
// 商品数据接口
interface ProductItem {
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
export class HomePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__mainBoxPadding = new SynchedPropertySimpleOneWayPU(params.mainBoxPadding, this, "mainBoxPadding");
        this.__currentMode = new SynchedPropertySimpleOneWayPU(params.currentMode, this, "currentMode");
        this.__message = new ObservedPropertySimplePU('Hello World', this, "message");
        this.__currentCategory = new ObservedPropertySimplePU('comprehensive', this, "currentCategory");
        this.__productList = new ObservedPropertyObjectPU([], this, "productList");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__searchKeyword = new ObservedPropertySimplePU('', this, "searchKeyword");
        this.categories = ['comprehensive', 'baby', 'sports', 'beauty', 'outdoor', 'digital'];
        this.categoryNames = {
            'comprehensive': '综合',
            'baby': '母婴',
            'sports': '运动',
            'beauty': '美妆',
            'outdoor': '户外',
            'digital': '数码'
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: HomePage_Params) {
        if (params.mainBoxPadding === undefined) {
            this.__mainBoxPadding.set(0);
        }
        if (params.currentMode === undefined) {
            this.__currentMode.set('shopping');
        }
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.currentCategory !== undefined) {
            this.currentCategory = params.currentCategory;
        }
        if (params.productList !== undefined) {
            this.productList = params.productList;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.searchKeyword !== undefined) {
            this.searchKeyword = params.searchKeyword;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
        if (params.categoryNames !== undefined) {
            this.categoryNames = params.categoryNames;
        }
    }
    updateStateVars(params: HomePage_Params) {
        this.__mainBoxPadding.reset(params.mainBoxPadding);
        this.__currentMode.reset(params.currentMode);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__mainBoxPadding.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__currentCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__productList.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__searchKeyword.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__mainBoxPadding.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        this.__currentCategory.aboutToBeDeleted();
        this.__productList.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__searchKeyword.aboutToBeDeleted();
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
    private __currentMode: SynchedPropertySimpleOneWayPU<string>;
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: string) {
        this.__currentMode.set(newValue);
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    private __currentCategory: ObservedPropertySimplePU<string>; // 当前分类
    get currentCategory() {
        return this.__currentCategory.get();
    }
    set currentCategory(newValue: string) {
        this.__currentCategory.set(newValue);
    }
    private __productList: ObservedPropertyObjectPU<ProductItem[]>; // 商品列表
    get productList() {
        return this.__productList.get();
    }
    set productList(newValue: ProductItem[]) {
        this.__productList.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __searchKeyword: ObservedPropertySimplePU<string>; // 搜索关键词
    get searchKeyword() {
        return this.__searchKeyword.get();
    }
    set searchKeyword(newValue: string) {
        this.__searchKeyword.set(newValue);
    }
    // 分类列表
    private categories: string[];
    private categoryNames: Record<string, string>;
    aboutToAppear() {
        // 加载商品数据
        this.loadProducts();
    }
    // 加载商品数据
    loadProducts() {
        this.isLoading = true;
        // 模拟加载延迟
        setTimeout(() => {
            this.productList = this.generateMockProducts();
            this.isLoading = false;
        }, 500);
    }
    // 生成模拟商品数据
    generateMockProducts(): ProductItem[] {
        const products: ProductItem[] = [];
        // 淘宝真实商品数据
        const taobaoProducts: ProductItem[] = [
            {
                id: 'product_1',
                name: '树莓派人形机器人AI视觉大模型TonyPi仿生双足具身智能Python编程',
                price: 3699,
                imageUrl: 'https://img.alicdn.com/imgextra/i1/2201505950941/O1CN01b9Yn2f1Ip1lBcepD3_!!2201505950941.png_760x760q30.jpg_.webp',
                sales: 128,
                shopName: '幻尔旗舰店',
                description: '树莓派人形机器人TonyPi是一款具备AI视觉大模型能力的仿生双足机器人，支持Python编程，适合STEM教育和人工智能学习。具备自主导航、语音交互、视觉识别等功能，是学习机器人和AI技术的理想平台。',
                shippingAddress: '广东省深圳市',
                stock: 50,
                category: '数码'
            },
            {
                id: 'product_2',
                name: '【618立即抢购】毛戈平鱼子酱面膜涂抹熬夜救星舒缓修护抗皱紧致',
                price: 299,
                imageUrl: 'https://img.alicdn.com/imgextra/i2/839895996/O1CN01cqDCSd1uADugGJQZV_!!839895996.jpg_760x760q30.jpg_.webp',
                sales: 5623,
                shopName: 'MAOGEPING毛戈平官方旗舰店',
                description: '毛戈平鱼子酱面膜，富含深海鱼子酱精华，能够深层滋养肌肤，舒缓修护，抗皱紧致。适合熬夜肌肤使用，快速恢复肌肤弹性与光泽，让肌肤重现年轻状态。',
                shippingAddress: '上海市',
                stock: 200,
                category: '美妆'
            },
            {
                id: 'product_3',
                name: '苏泊尔电烤箱家用大容量蒸烤炸一体多功能智能调控长效预约烘焙箱',
                price: 599,
                imageUrl: 'https://img.alicdn.com/imgextra/i3/2219155702334/O1CN01nMjc3X1T71RStDyKK_!!2219155702334.jpg_760x760q30.jpg_.webp',
                sales: 892,
                shopName: '苏泊尔智能阳台旗舰店',
                description: '苏泊尔电烤箱，大容量设计，支持蒸、烤、炸多种烹饪方式。智能温控系统，长效预约功能，让烹饪更轻松。适合家庭使用，满足各种烘焙需求。',
                shippingAddress: '浙江省杭州市',
                stock: 150,
                category: '综合'
            },
            {
                id: 'product_4',
                name: '灵动创想初音未来马尾甩甩毛绒玩偶周边挂件fufu公仔娃娃生日礼物',
                price: 89,
                imageUrl: 'https://img.alicdn.com/imgextra//8b/56/TB1bRlZQpXXXXbZXpXXSutbFXXX.jpg_760x760q30.jpg_.webp',
                sales: 3456,
                shopName: '灵动创想旗舰店',
                description: '初音未来官方授权毛绒玩偶，采用优质毛绒材质，手感柔软舒适。可爱的马尾甩甩造型，适合作为挂件或摆件，是初音未来粉丝的必备收藏品。',
                shippingAddress: '北京市',
                stock: 300,
                category: '综合'
            }
        ];
        // 根据当前模式返回不同数据
        if (this.currentMode === 'shopping') {
            // 购物模式：返回淘宝真实数据
            return taobaoProducts;
        }
        else {
            // 市集模式：返回模拟二手数据
            for (let i = 1; i <= 10; i++) {
                products.push({
                    id: `market_product_${i}`,
                    name: `二手${this.categoryNames[this.currentCategory]}商品${i} - 成色良好`,
                    price: Math.floor(Math.random() * 300) + 50,
                    imageUrl: `https://via.placeholder.com/200x200?text=二手商品${i}`,
                    sales: Math.floor(Math.random() * 100),
                    shopName: '个人卖家',
                    description: `这是二手${this.categoryNames[this.currentCategory]}商品，成色良好，使用时间不长，功能完好，价格实惠。欢迎咨询购买。`,
                    shippingAddress: '全国包邮',
                    stock: 1,
                    category: this.categoryNames[this.currentCategory]
                });
            }
            return products;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/HomePage.ets(199:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部搜索栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/HomePage.ets(201:7)", "entry");
            // 顶部搜索栏
            Row.width('100%');
            // 顶部搜索栏
            Row.height(56);
            // 顶部搜索栏
            Row.backgroundColor('#FF5722');
            // 顶部搜索栏
            Row.alignItems(VerticalAlign.Center);
            // 顶部搜索栏
            Row.padding({ left: 12, right: 0 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索输入框
            TextInput.create({ placeholder: '搜索商品', text: this.searchKeyword });
            TextInput.debugLine("entry/src/main/ets/pages/HomePage.ets(203:9)", "entry");
            // 搜索输入框
            TextInput.layoutWeight(1);
            // 搜索输入框
            TextInput.height(36);
            // 搜索输入框
            TextInput.backgroundColor('#FFFFFF');
            // 搜索输入框
            TextInput.borderRadius(18);
            // 搜索输入框
            TextInput.placeholderColor('#999999');
            // 搜索输入框
            TextInput.placeholderFont({ size: 14 });
            // 搜索输入框
            TextInput.fontColor('#333333');
            // 搜索输入框
            TextInput.fontSize(14);
            // 搜索输入框
            TextInput.padding({ left: 16, right: 16 });
            // 搜索输入框
            TextInput.onChange((value: string) => {
                this.searchKeyword = value;
            });
            // 搜索输入框
            TextInput.onSubmit(() => {
                // 执行搜索
                this.loadProducts();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索按钮
            Button.createWithLabel('搜索');
            Button.debugLine("entry/src/main/ets/pages/HomePage.ets(222:9)", "entry");
            // 搜索按钮
            Button.fontSize(14);
            // 搜索按钮
            Button.fontColor('#FFFFFF');
            // 搜索按钮
            Button.backgroundColor('#FF5722');
            // 搜索按钮
            Button.borderRadius(18);
            // 搜索按钮
            Button.height(36);
            // 搜索按钮
            Button.width(60);
            // 搜索按钮
            Button.margin({ left: 8, right: 12 });
            // 搜索按钮
            Button.onClick(() => {
                // 执行搜索
                this.loadProducts();
            });
        }, Button);
        // 搜索按钮
        Button.pop();
        // 顶部搜索栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分类标签
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/HomePage.ets(242:7)", "entry");
            // 分类标签
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 分类标签
            Scroll.width('100%');
            // 分类标签
            Scroll.padding({ left: 10, right: 10, top: 10, bottom: 10 });
            // 分类标签
            Scroll.backgroundColor('#F5F5F5');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/HomePage.ets(243:9)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const category = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.categoryNames[category]);
                    Text.debugLine("entry/src/main/ets/pages/HomePage.ets(245:13)", "entry");
                    Text.fontSize(14);
                    Text.fontColor(this.currentCategory === category ? '#FF5722' : '#666666');
                    Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                    Text.backgroundColor(this.currentCategory === category ? '#FFE0B2' : '#FFFFFF');
                    Text.borderRadius(15);
                    Text.margin({ right: 8 });
                    Text.onClick(() => {
                        this.currentCategory = category;
                        this.loadProducts();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 分类标签
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 商品列表
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/HomePage.ets(267:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/HomePage.ets(268:11)", "entry");
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.color('#FF5722');
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.debugLine("entry/src/main/ets/pages/HomePage.ets(273:11)", "entry");
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
                        Grid.create();
                        Grid.debugLine("entry/src/main/ets/pages/HomePage.ets(282:9)", "entry");
                        Grid.columnsTemplate('1fr 1fr');
                        Grid.rowsGap(10);
                        Grid.columnsGap(10);
                        Grid.padding(10);
                        Grid.width('100%');
                        Grid.layoutWeight(1);
                    }, Grid);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const item = _item;
                            {
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    GridItem.create(() => { }, false);
                                    GridItem.debugLine("entry/src/main/ets/pages/HomePage.ets(284:13)", "entry");
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation2(itemCreation2, GridItem);
                                    GoodsItemBuilder.bind(this)(item, index);
                                    GridItem.pop();
                                };
                                observedDeepRender();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.productList, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Grid.pop();
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
        return "HomePage";
    }
}
registerNamedRoute(() => new HomePage(undefined, {}), "", { bundleName: "com.atomicservice.account_atomicservice_sample", moduleName: "entry", pagePath: "pages/HomePage", pageFullPath: "entry/src/main/ets/pages/HomePage", integratedHsp: "false", moduleType: "followWithHap" });
