if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CategoryProductPage_Params {
    currentCategory?: CategoryType;
    currentMode?: 'shopping' | 'market';
    categories?: CategoryConfig[];
}
import router from "@ohos:router";
// 商品分类类型
type CategoryType = 'comprehensive' | 'baby' | 'sports' | 'beauty' | 'outdoor' | 'digital';
// 分类配置
interface CategoryConfig {
    id: CategoryType;
    name: string;
}
class CategoryProductPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentCategory = new ObservedPropertySimplePU('comprehensive', this, "currentCategory");
        this.__currentMode = new ObservedPropertySimplePU('shopping', this, "currentMode");
        this.categories = [
            { id: 'comprehensive', name: '综合' },
            { id: 'baby', name: '母婴' },
            { id: 'sports', name: '运动' },
            { id: 'beauty', name: '美妆' },
            { id: 'outdoor', name: '户外' },
            { id: 'digital', name: '数码' }
        ];
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
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
    }
    updateStateVars(params: CategoryProductPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentCategory.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
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
    // 分类列表
    private categories: CategoryConfig[];
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
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(45:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(47:7)", "entry");
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.height(56);
            // 标题栏
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('←');
            Button.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(48:9)", "entry");
            Button.width(40);
            Button.height(40);
            Button.fontSize(20);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Button.onClick(() => {
                router.back();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.getCategoryName(this.currentCategory)}商品`);
            Text.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(58:9)", "entry");
            Text.fontSize(20);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(65:9)", "entry");
            Blank.width(40);
        }, Blank);
        Blank.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品列表
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(72:7)", "entry");
            // 商品列表
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(73:9)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 16, bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.ProductItem.bind(this)(item);
            };
            this.forEachUpdateFunction(elmtId, [1, 2, 3, 4, 5, 6, 7, 8], forEachItemGenFunction, (item: number) => item.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        // 商品列表
        Scroll.pop();
        Column.pop();
    }
    ProductItem(index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(90:5)", "entry");
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Row.borderRadius(8);
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777295, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(91:7)", "entry");
            Image.width(100);
            Image.height(100);
            Image.borderRadius(8);
            Image.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(97:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.getCategoryName(this.currentCategory)}商品${index}`);
            Text.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(98:9)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${(index * 99.9).toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(104:9)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`销量: ${Math.floor(Math.random() * 1000)}`);
            Text.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(110:9)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`好评率: ${(Math.random() * 20 + 80).toFixed(1)}%`);
            Text.debugLine("entry/src/main/ets/pages/CategoryProductPage.ets(115:9)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
    }
    // 获取分类名称
    private getCategoryName(category: CategoryType): string {
        const categoryConfig = this.categories.find(c => c.id === category);
        return categoryConfig ? categoryConfig.name : '综合';
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CategoryProductPage";
    }
}
registerNamedRoute(() => new CategoryProductPage(undefined, {}), "", { bundleName: "com.atomicservice.account_atomicservice_sample", moduleName: "entry", pagePath: "pages/CategoryProductPage", pageFullPath: "entry/src/main/ets/pages/CategoryProductPage", integratedHsp: "false", moduleType: "followWithHap" });
