if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ModeSwitchPage_Params {
    mainBoxPadding?: number;
    currentMode?: 'shopping' | 'market';
    appMode?: 'shopping' | 'market';
}
import { ProductRecommendList } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/components/ProductRecommendList";
import router from "@ohos:router";
export class ModeSwitchPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__mainBoxPadding = new SynchedPropertySimpleOneWayPU(params.mainBoxPadding, this, "mainBoxPadding");
        this.__currentMode = new SynchedPropertySimpleOneWayPU(params.currentMode, this, "currentMode");
        this.__appMode = this.createStorageLink('currentMode', 'shopping', "appMode");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ModeSwitchPage_Params) {
        if (params.mainBoxPadding === undefined) {
            this.__mainBoxPadding.set(16);
        }
        if (params.currentMode === undefined) {
            this.__currentMode.set('shopping');
        }
    }
    updateStateVars(params: ModeSwitchPage_Params) {
        this.__mainBoxPadding.reset(params.mainBoxPadding);
        this.__currentMode.reset(params.currentMode);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__mainBoxPadding.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__appMode.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__mainBoxPadding.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__appMode.aboutToBeDeleted();
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
    private __currentMode: SynchedPropertySimpleOneWayPU<'shopping' | 'market'>;
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: 'shopping' | 'market') {
        this.__currentMode.set(newValue);
    }
    private __appMode: ObservedPropertyAbstractPU<'shopping' | 'market'>;
    get appMode() {
        return this.__appMode.get();
    }
    set appMode(newValue: 'shopping' | 'market') {
        this.__appMode.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 模式说明
            Column.create();
            // 模式说明
            Column.width('100%');
            // 模式说明
            Column.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777274, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
            Text.margin({ bottom: 24 });
        }, Text);
        Text.pop();
        // 模式说明
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 当前模式显示
            Column.create();
            // 当前模式显示
            Column.width('100%');
            // 当前模式显示
            Column.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777271, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 当前模式卡片
            Row.create();
            // 当前模式卡片
            Row.width('100%');
            // 当前模式卡片
            Row.height(160);
            // 当前模式卡片
            Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            // 当前模式卡片
            Row.borderRadius(16);
            // 当前模式卡片
            Row.padding(24);
            // 当前模式卡片
            Row.margin({ bottom: 32 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.appMode === 'shopping' ? { "id": 16777262, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 16777268, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Image.width(48);
            Image.height(48);
            Image.margin({ bottom: 12 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.appMode === 'shopping' ? { "id": 16777276, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 16777273, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontSize(18);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Column.pop();
        // 当前模式卡片
        Row.pop();
        // 当前模式显示
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 切换按钮
            Column.create();
            // 切换按钮
            Column.width('100%');
            // 切换按钮
            Column.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.appMode === 'shopping' ? { "id": 16777277, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 16777278, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Button.width('100%');
            Button.height(48);
            Button.fontSize(16);
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Button.borderRadius(24);
            Button.onClick(() => {
                // 切换模式
                this.appMode = this.appMode === 'shopping' ? 'market' : 'shopping';
            });
        }, Button);
        Button.pop();
        // 切换按钮
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能按钮区域
            Column.create();
            // 功能按钮区域
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.appMode === 'market') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 市集模式：我的市集按钮
                        Column.create();
                        // 市集模式：我的市集按钮
                        Column.width('100%');
                        // 市集模式：我的市集按钮
                        Column.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('我的市集');
                        Button.width('100%');
                        Button.height(48);
                        Button.fontSize(16);
                        Button.fontColor(Color.White);
                        Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Button.borderRadius(24);
                        Button.margin({ top: 24 });
                        Button.onClick(() => {
                            // 跳转到我的市集页面
                            router.pushUrl({
                                url: 'pages/MyMarketPage'
                            });
                        });
                    }, Button);
                    Button.pop();
                    // 市集模式：我的市集按钮
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 购物模式：转售按钮
                        Column.create();
                        // 购物模式：转售按钮
                        Column.width('100%');
                        // 购物模式：转售按钮
                        Column.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel({ "id": 16777297, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Button.width('100%');
                        Button.height(48);
                        Button.fontSize(16);
                        Button.fontColor(Color.White);
                        Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Button.borderRadius(24);
                        Button.margin({ top: 24 });
                        Button.onClick(() => {
                            // 跳转到转售订单选择页面
                            router.pushUrl({
                                url: 'pages/ResaleSelectPage'
                            });
                        });
                    }, Button);
                    Button.pop();
                    // 购物模式：转售按钮
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 功能按钮区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品推荐列表
            Column.create();
            // 商品推荐列表
            Column.width('100%');
            // 商品推荐列表
            Column.layoutWeight(1);
            // 商品推荐列表
            Column.margin({ top: 24 });
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new ProductRecommendList(this, {
                        currentMode: this.appMode,
                        mainBoxPadding: this.mainBoxPadding
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/ModeSwitchPage.ets", line: 125, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            currentMode: this.appMode,
                            mainBoxPadding: this.mainBoxPadding
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        currentMode: this.appMode,
                        mainBoxPadding: this.mainBoxPadding
                    });
                }
            }, { name: "ProductRecommendList" });
        }
        // 商品推荐列表
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
