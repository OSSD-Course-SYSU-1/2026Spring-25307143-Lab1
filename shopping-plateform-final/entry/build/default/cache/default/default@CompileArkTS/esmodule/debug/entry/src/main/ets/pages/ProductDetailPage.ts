if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProductDetailPage_Params {
    productDetail?: ProductDetail | null;
    isLoading?: boolean;
    selectedQuantity?: number;
    currentMode?: CartMode;
    isFavorited?: boolean;
}
import router from "@ohos:router";
import type { CartItem, CartMode } from '../common/CartManager';
import { FavoriteService } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/services/FavoriteService";
import { CartService } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/services/CartService";
import type { FavoriteRecord } from '../models/FavoriteModel';
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
class ProductDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__productDetail = new ObservedPropertyObjectPU(null, this, "productDetail");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__selectedQuantity = new ObservedPropertySimplePU(1, this, "selectedQuantity");
        this.__currentMode = new ObservedPropertySimplePU('shopping', this, "currentMode");
        this.__isFavorited = new ObservedPropertySimplePU(false, this, "isFavorited");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProductDetailPage_Params) {
        if (params.productDetail !== undefined) {
            this.productDetail = params.productDetail;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.selectedQuantity !== undefined) {
            this.selectedQuantity = params.selectedQuantity;
        }
        if (params.currentMode !== undefined) {
            this.currentMode = params.currentMode;
        }
        if (params.isFavorited !== undefined) {
            this.isFavorited = params.isFavorited;
        }
    }
    updateStateVars(params: ProductDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__productDetail.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedQuantity.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__isFavorited.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__productDetail.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__selectedQuantity.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__isFavorited.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __productDetail: ObservedPropertyObjectPU<ProductDetail | null>;
    get productDetail() {
        return this.__productDetail.get();
    }
    set productDetail(newValue: ProductDetail | null) {
        this.__productDetail.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __selectedQuantity: ObservedPropertySimplePU<number>;
    get selectedQuantity() {
        return this.__selectedQuantity.get();
    }
    set selectedQuantity(newValue: number) {
        this.__selectedQuantity.set(newValue);
    }
    private __currentMode: ObservedPropertySimplePU<CartMode>; // 当前购物车模式
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: CartMode) {
        this.__currentMode.set(newValue);
    }
    private __isFavorited: ObservedPropertySimplePU<boolean>; // 是否已收藏
    get isFavorited() {
        return this.__isFavorited.get();
    }
    set isFavorited(newValue: boolean) {
        this.__isFavorited.set(newValue);
    }
    aboutToAppear() {
        // 获取路由传递的参数
        const params = router.getParams() as Record<string, Object>;
        if (params && params['productData']) {
            this.productDetail = params['productData'] as ProductDetail;
        }
        // 获取当前模式参数
        if (params && params['mode']) {
            this.currentMode = params['mode'] as CartMode;
        }
        // 检查是否已收藏
        if (this.productDetail) {
            this.isFavorited = FavoriteService.getInstance().isFavorite(this.productDetail.id);
        }
        this.isLoading = false;
    }
    // 切换收藏状态
    toggleFavorite() {
        if (!this.productDetail) {
            return;
        }
        const record: FavoriteRecord = {
            productId: this.productDetail.id,
            name: this.productDetail.name,
            price: this.productDetail.price,
            imageUrl: this.productDetail.imageUrl,
            shopName: this.productDetail.shopName,
            description: this.productDetail.description,
            addedTime: new Date().toLocaleString('zh-CN')
        };
        FavoriteService.getInstance().toggleFavorite(record).then((isFav: boolean) => {
            this.isFavorited = isFav;
        });
    }
    // 构建商品图片区域
    ProductImageBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.productDetail) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.productDetail.imageUrl);
                        Image.width('100%');
                        Image.height(350);
                        Image.objectFit(ImageFit.Cover);
                    }, Image);
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
    // 构建商品信息区域
    ProductInfoBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.productDetail) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(16);
                        Column.backgroundColor(Color.White);
                        Column.borderRadius({ topLeft: 16, topRight: 16 });
                        Column.margin({ top: -16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 价格
                        Row.create();
                        // 价格
                        Row.alignItems(VerticalAlign.Bottom);
                        // 价格
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('¥');
                        Text.fontSize(16);
                        Text.fontColor('#FF5722');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.productDetail.price}`);
                        Text.fontSize(28);
                        Text.fontColor('#FF5722');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    // 价格
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 商品名称
                        Text.create(this.productDetail.name);
                        // 商品名称
                        Text.fontSize(18);
                        // 商品名称
                        Text.fontColor('#333333');
                        // 商品名称
                        Text.fontWeight(FontWeight.Medium);
                        // 商品名称
                        Text.maxLines(3);
                        // 商品名称
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        // 商品名称
                        Text.width('100%');
                        // 商品名称
                        Text.margin({ bottom: 16 });
                    }, Text);
                    // 商品名称
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 销量和库存
                        Row.create();
                        // 销量和库存
                        Row.width('100%');
                        // 销量和库存
                        Row.margin({ bottom: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`已售 ${this.productDetail.sales} 件`);
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`库存 ${this.productDetail.stock} 件`);
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    // 销量和库存
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 分割线
                        Divider.create();
                        // 分割线
                        Divider.color('#E5E5E5');
                        // 分割线
                        Divider.margin({ bottom: 16 });
                    }, Divider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 发货地
                        Row.create();
                        // 发货地
                        Row.width('100%');
                        // 发货地
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('发货地：');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.productDetail.shippingAddress);
                        Text.fontSize(14);
                        Text.fontColor('#333333');
                    }, Text);
                    Text.pop();
                    // 发货地
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 商品分类
                        Row.create();
                        // 商品分类
                        Row.width('100%');
                        // 商品分类
                        Row.margin({ bottom: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('分类：');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.productDetail.category);
                        Text.fontSize(14);
                        Text.fontColor('#333333');
                    }, Text);
                    Text.pop();
                    // 商品分类
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 分割线
                        Divider.create();
                        // 分割线
                        Divider.color('#E5E5E5');
                        // 分割线
                        Divider.margin({ bottom: 16 });
                    }, Divider);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 商品详情标题
                        Text.create('商品详情');
                        // 商品详情标题
                        Text.fontSize(16);
                        // 商品详情标题
                        Text.fontColor('#333333');
                        // 商品详情标题
                        Text.fontWeight(FontWeight.Medium);
                        // 商品详情标题
                        Text.width('100%');
                        // 商品详情标题
                        Text.margin({ bottom: 12 });
                    }, Text);
                    // 商品详情标题
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 商品描述
                        Text.create(this.productDetail.description);
                        // 商品描述
                        Text.fontSize(14);
                        // 商品描述
                        Text.fontColor('#666666');
                        // 商品描述
                        Text.lineHeight(22);
                        // 商品描述
                        Text.width('100%');
                    }, Text);
                    // 商品描述
                    Text.pop();
                    Column.pop();
                });
            }
            else // 构建店铺信息
             {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    // 构建店铺信息
    ShopInfoBuilder(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.productDetail) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(16);
                        Column.backgroundColor(Color.White);
                        Column.margin({ top: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 店铺图标
                        Column.create();
                        // 店铺图标
                        Column.width(50);
                        // 店铺图标
                        Column.height(50);
                        // 店铺图标
                        Column.backgroundColor('#FF5722');
                        // 店铺图标
                        Column.borderRadius(25);
                        // 店铺图标
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.productDetail.shopName.charAt(0));
                        Text.fontSize(24);
                        Text.fontColor(Color.White);
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    // 店铺图标
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 店铺名称
                        Column.create();
                        // 店铺名称
                        Column.alignItems(HorizontalAlign.Start);
                        // 店铺名称
                        Column.margin({ left: 12 });
                        // 店铺名称
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.productDetail.shopName);
                        Text.fontSize(16);
                        Text.fontColor('#333333');
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('进店看看 >');
                        Text.fontSize(12);
                        Text.fontColor('#999999');
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    // 店铺名称
                    Column.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            else // 构建底部操作栏
             {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    // 构建底部操作栏
    BottomActionBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(60);
            Row.backgroundColor(Color.White);
            Row.padding({ left: 16, right: 16 });
            Row.border({ width: { top: 1 }, color: '#E5E5E5' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 客服
            Column.create();
            // 客服
            Column.layoutWeight(1);
            // 客服
            Column.padding(8);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('客服');
            Text.fontSize(12);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        // 客服
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 购物车
            Column.create();
            // 购物车
            Column.layoutWeight(1);
            // 购物车
            Column.padding(8);
            // 购物车
            Column.onClick(() => {
                // 跳转到购物车页面（切换底部Tab）
                AppStorage.setOrCreate('switchToPage', 'ShoppingCartPage');
                router.pushUrl({ url: 'pages/Index' });
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('购物车');
            Text.fontSize(12);
            Text.fontColor('#666666');
        }, Text);
        Text.pop();
        // 购物车
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 加入购物车
            Button.createWithLabel('加入购物车');
            // 加入购物车
            Button.fontSize(14);
            // 加入购物车
            Button.fontColor('#FF5722');
            // 加入购物车
            Button.backgroundColor('#FFE0B2');
            // 加入购物车
            Button.borderRadius(20);
            // 加入购物车
            Button.layoutWeight(2);
            // 加入购物车
            Button.height(40);
            // 加入购物车
            Button.onClick(() => {
                // 加入购物车
                if (this.productDetail) {
                    const cartItem: CartItem = {
                        id: this.productDetail.id,
                        name: this.productDetail.name,
                        price: this.productDetail.price,
                        imageUrl: this.productDetail.imageUrl,
                        quantity: this.selectedQuantity,
                        shopName: this.productDetail.shopName,
                        selected: true
                    };
                    CartService.getInstance().addToCart(cartItem, this.currentMode).then(() => {
                        // 提示用户
                        AlertDialog.show({
                            title: '成功',
                            message: `商品已加入${this.currentMode === 'shopping' ? '购物车' : '市集购物车'}`,
                            autoCancel: true,
                            alignment: DialogAlignment.Center
                        });
                    });
                }
            });
        }, Button);
        // 加入购物车
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 立即购买
            Button.createWithLabel('立即购买');
            // 立即购买
            Button.fontSize(14);
            // 立即购买
            Button.fontColor(Color.White);
            // 立即购买
            Button.backgroundColor('#FF5722');
            // 立即购买
            Button.borderRadius(20);
            // 立即购买
            Button.layoutWeight(2);
            // 立即购买
            Button.height(40);
            // 立即购买
            Button.margin({ left: 8 });
            // 立即购买
            Button.onClick(() => {
                // 立即购买，跳转到创建订单页面
                if (this.productDetail) {
                    router.pushUrl({
                        url: 'pages/CreateOrderPage',
                        params: {
                            productData: this.productDetail,
                            quantity: this.selectedQuantity
                        }
                    });
                }
            });
        }, Button);
        // 立即购买
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
            // 返回按钮
            Button.createWithChild();
            // 返回按钮
            Button.width(40);
            // 返回按钮
            Button.height(40);
            // 返回按钮
            Button.backgroundColor(Color.Transparent);
            // 返回按钮
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
        // 返回按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('商品详情');
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
            // 收藏按钮
            Text.create(this.isFavorited ? '❤️' : '🤍');
            // 收藏按钮
            Text.fontSize(22);
            // 收藏按钮
            Text.width(40);
            // 收藏按钮
            Text.height(40);
            // 收藏按钮
            Text.onClick(() => {
                this.toggleFavorite();
            });
        }, Text);
        // 收藏按钮
        Text.pop();
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 加载状态
                        Column.create();
                        // 加载状态
                        Column.width('100%');
                        // 加载状态
                        Column.layoutWeight(1);
                        // 加载状态
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
                    // 加载状态
                    Column.pop();
                });
            }
            else if (this.productDetail) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 商品详情内容
                        Scroll.create();
                        // 商品详情内容
                        Scroll.width('100%');
                        // 商品详情内容
                        Scroll.layoutWeight(1);
                        // 商品详情内容
                        Scroll.scrollBar(BarState.Off);
                        // 商品详情内容
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                    }, Column);
                    // 商品图片
                    this.ProductImageBuilder.bind(this)();
                    // 商品信息
                    this.ProductInfoBuilder.bind(this)();
                    // 店铺信息
                    this.ShopInfoBuilder.bind(this)();
                    Column.pop();
                    // 商品详情内容
                    Scroll.pop();
                    // 底部操作栏
                    this.BottomActionBar.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 错误状态
                        Column.create();
                        // 错误状态
                        Column.width('100%');
                        // 错误状态
                        Column.layoutWeight(1);
                        // 错误状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('商品信息加载失败');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('返回');
                        Button.fontSize(14);
                        Button.backgroundColor('#FF5722');
                        Button.margin({ top: 20 });
                        Button.onClick(() => {
                            router.back();
                        });
                    }, Button);
                    Button.pop();
                    // 错误状态
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
        return "ProductDetailPage";
    }
}
registerNamedRoute(() => new ProductDetailPage(undefined, {}), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/ProductDetailPage", pageFullPath: "entry/src/main/ets/pages/ProductDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
