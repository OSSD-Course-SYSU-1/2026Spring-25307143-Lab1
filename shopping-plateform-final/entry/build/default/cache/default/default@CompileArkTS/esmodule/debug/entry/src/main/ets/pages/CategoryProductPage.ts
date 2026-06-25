if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CategoryProductPage_Params {
    currentCategory?: CategoryType;
    currentMode?: 'shopping' | 'market';
    products?: ProductItem[];
}
import router from "@ohos:router";
import { CATEGORIES } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/models/ProductModel";
import type { ProductItem, CategoryType, CategoryConfig } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/models/ProductModel";
import { ProductService } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/services/ProductService";
class CategoryProductPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentCategory = new ObservedPropertySimplePU('comprehensive', this, "currentCategory");
        this.__currentMode = new ObservedPropertySimplePU('shopping', this, "currentMode");
        this.__products = new ObservedPropertyObjectPU([], this, "products");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CategoryProductPage_Params) {
        if (params.currentCategory !== undefined) {
            this.currentCategory = params.currentCategory;
        }
        if (params.currentMode !== undefined) {
            this.currentMode = params.currentMode;
        }
        if (params.products !== undefined) {
            this.products = params.products;
        }
    }
    updateStateVars(params: CategoryProductPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__products.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentCategory.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__products.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentCategory: ObservedPropertySimplePU<CategoryType>;
    get currentCategory() {
        return this.__currentCategory.get();
    }
    set currentCategory(newValue: CategoryType) {
        this.__currentCategory.set(newValue);
    }
    private __currentMode: ObservedPropertySimplePU<'shopping' | 'market'>;
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: 'shopping' | 'market') {
        this.__currentMode.set(newValue);
    }
    private __products: ObservedPropertyObjectPU<ProductItem[]>;
    get products() {
        return this.__products.get();
    }
    set products(newValue: ProductItem[]) {
        this.__products.set(newValue);
    }
    aboutToAppear() {
        // 获取路由参数
        const params = router.getParams() as Record<string, Object>;
        if (params) {
            if (params['category']) {
                this.currentCategory = params['category'] as CategoryType;
            }
            if (params['currentMode']) {
                this.currentMode = params['currentMode'] as 'shopping' | 'market';
            }
        }
        this.loadProducts();
    }
    loadProducts() {
        this.products = ProductService.getInstance().getProducts(this.currentMode, this.currentCategory);
    }
    // 获取分类名称
    private getCategoryName(category: CategoryType): string {
        const config = CATEGORIES.find(c => c.id === category);
        return config ? config.name : '综合';
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
            Row.padding({ left: 8, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('←');
            Button.width(40);
            Button.height(40);
            Button.fontSize(20);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor('#333333');
            Button.onClick(() => {
                router.back();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.getCategoryName(this.currentCategory)}商品`);
            Text.fontSize(20);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.width(40);
        }, Blank);
        Blank.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分类切换
            Scroll.create();
            // 分类切换
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 分类切换
            Scroll.scrollBar(BarState.Off);
            // 分类切换
            Scroll.width('100%');
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 4, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const cat = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(cat.name);
                    Text.fontSize(14);
                    Text.fontColor(this.currentCategory === cat.id ? '#FF5722' : '#666666');
                    Text.fontWeight(this.currentCategory === cat.id ? FontWeight.Bold : FontWeight.Normal);
                    Text.padding({ left: 14, right: 14, top: 6, bottom: 6 });
                    Text.backgroundColor(this.currentCategory === cat.id ? '#FFE0B2' : '#F5F5F5');
                    Text.borderRadius(15);
                    Text.margin({ right: 8 });
                    Text.onClick(() => {
                        this.currentCategory = cat.id;
                        this.loadProducts();
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, CATEGORIES, forEachItemGenFunction, (cat: CategoryConfig): string => cat.id, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 分类切换
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 商品列表
            if (this.products.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无商品');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
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
                            const item = _item;
                            this.ProductItem.bind(this)(item);
                        };
                        this.forEachUpdateFunction(elmtId, this.products, forEachItemGenFunction, (item: ProductItem) => item.id, false, false);
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
    ProductItem(item: ProductItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor(Color.White);
            Row.borderRadius(8);
            Row.margin({ bottom: 10 });
            Row.onClick(() => {
                router.pushUrl({
                    url: 'pages/ProductDetailPage',
                    params: {
                        productData: item,
                        mode: this.currentMode
                    }
                });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(item.imageUrl);
            Image.width(100);
            Image.height(100);
            Image.borderRadius(8);
            Image.objectFit(ImageFit.Cover);
            Image.backgroundColor('#F0F0F0');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.name);
            Text.fontSize(15);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Medium);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${item.price}`);
            Text.fontSize(18);
            Text.fontColor('#FF5722');
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${item.sales}人付款`);
            Text.fontSize(12);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.shopName);
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CategoryProductPage";
    }
}
registerNamedRoute(() => new CategoryProductPage(undefined, {}), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/CategoryProductPage", pageFullPath: "entry/src/main/ets/pages/CategoryProductPage", integratedHsp: "false", moduleType: "followWithHap" });
