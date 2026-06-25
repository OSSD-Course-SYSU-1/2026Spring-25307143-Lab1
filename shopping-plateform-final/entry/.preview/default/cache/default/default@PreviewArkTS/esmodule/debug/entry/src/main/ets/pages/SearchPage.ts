if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SearchPage_Params {
    searchText?: string;
    currentCategory?: CategoryType;
    currentMode?: 'shopping' | 'market';
    searchHistory?: string[];
    hotSearchWords?: string[];
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
class SearchPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__searchText = new ObservedPropertySimplePU('', this, "searchText");
        this.__currentCategory = new ObservedPropertySimplePU('comprehensive', this, "currentCategory");
        this.__currentMode = new ObservedPropertySimplePU('shopping', this, "currentMode");
        this.__searchHistory = new ObservedPropertyObjectPU(['手机', '电脑', '衣服', '鞋子'], this, "searchHistory");
        this.__hotSearchWords = new ObservedPropertyObjectPU(['华为手机', '运动鞋', '美妆套装', '户外背包', '母婴用品', '数码相机'], this, "hotSearchWords");
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
    setInitiallyProvidedValue(params: SearchPage_Params) {
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.currentCategory !== undefined) {
            this.currentCategory = params.currentCategory;
        }
        if (params.currentMode !== undefined) {
            this.currentMode = params.currentMode;
        }
        if (params.searchHistory !== undefined) {
            this.searchHistory = params.searchHistory;
        }
        if (params.hotSearchWords !== undefined) {
            this.hotSearchWords = params.hotSearchWords;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
    }
    updateStateVars(params: SearchPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__currentCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__searchHistory.purgeDependencyOnElmtId(rmElmtId);
        this.__hotSearchWords.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__searchText.aboutToBeDeleted();
        this.__currentCategory.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__searchHistory.aboutToBeDeleted();
        this.__hotSearchWords.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
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
    private __searchHistory: ObservedPropertyObjectPU<string[]>;
    get searchHistory() {
        return this.__searchHistory.get();
    }
    set searchHistory(newValue: string[]) {
        this.__searchHistory.set(newValue);
    }
    private __hotSearchWords: ObservedPropertyObjectPU<string[]>;
    get hotSearchWords() {
        return this.__hotSearchWords.get();
    }
    set hotSearchWords(newValue: string[]) {
        this.__hotSearchWords.set(newValue);
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
    // 执行搜索
    performSearch() {
        if (this.searchText.trim()) {
            // 添加到搜索历史
            if (!this.searchHistory.includes(this.searchText.trim())) {
                this.searchHistory.unshift(this.searchText.trim());
                if (this.searchHistory.length > 10) {
                    this.searchHistory.pop();
                }
            }
            // 这里应该跳转到搜索结果页面
            console.log('Search for:', this.searchText);
        }
    }
    // 清空搜索历史
    clearHistory() {
        this.searchHistory = [];
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SearchPage.ets(69:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SearchPage.ets(71:7)", "entry");
            // 搜索栏
            Row.width('100%');
            // 搜索栏
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('←');
            Button.debugLine("entry/src/main/ets/pages/SearchPage.ets(72:9)", "entry");
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
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SearchPage.ets(82:9)", "entry");
            Row.layoutWeight(1);
            Row.height(40);
            Row.padding({ left: 12, right: 12 });
            Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Row.borderRadius(20);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🔍');
            Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(83:11)", "entry");
            Text.fontSize(16);
            Text.margin({ right: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '搜索商品', text: this.searchText });
            TextInput.debugLine("entry/src/main/ets/pages/SearchPage.ets(87:11)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(40);
            TextInput.fontSize(14);
            TextInput.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            TextInput.backgroundColor(Color.Transparent);
            TextInput.onChange((value: string) => {
                this.searchText = value;
            });
            TextInput.onSubmit(() => {
                this.performSearch();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.searchText) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✕');
                        Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(101:13)", "entry");
                        Text.fontSize(16);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.onClick(() => {
                            this.searchText = '';
                        });
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
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('搜索');
            Button.debugLine("entry/src/main/ets/pages/SearchPage.ets(115:9)", "entry");
            Button.height(40);
            Button.fontSize(14);
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Button.borderRadius(20);
            Button.margin({ left: 8 });
            Button.onClick(() => {
                this.performSearch();
            });
        }, Button);
        Button.pop();
        // 搜索栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分类筛选
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/SearchPage.ets(130:7)", "entry");
            // 分类筛选
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 分类筛选
            Scroll.scrollBar(BarState.Off);
            // 分类筛选
            Scroll.width('100%');
            // 分类筛选
            Scroll.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            // 分类筛选
            Scroll.margin({ top: 8 });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SearchPage.ets(131:9)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const category = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/SearchPage.ets(133:13)", "entry");
                    Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    Column.onClick(() => {
                        this.currentCategory = category.id;
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(category.name);
                    Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(134:15)", "entry");
                    Text.fontSize(14);
                    Text.fontColor(this.currentCategory === category.id ? { "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" } : { "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    Text.fontWeight(this.currentCategory === category.id ? FontWeight.Bold : FontWeight.Normal);
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction, (category: CategoryConfig) => category.id, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 分类筛选
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/SearchPage.ets(155:7)", "entry");
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SearchPage.ets(156:9)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 搜索历史
            if (this.searchHistory.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/SearchPage.ets(159:13)", "entry");
                        Column.width('100%');
                        Column.padding(16);
                        Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Column.borderRadius(12);
                        Column.margin({ top: 16, bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/SearchPage.ets(160:15)", "entry");
                        Row.width('100%');
                        Row.margin({ bottom: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('搜索历史');
                        Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(161:17)", "entry");
                        Text.fontSize(16);
                        Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/SearchPage.ets(166:17)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('清空');
                        Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(168:17)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.onClick(() => {
                            this.clearHistory();
                        });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Flex.create({ wrap: FlexWrap.Wrap });
                        Flex.debugLine("entry/src/main/ets/pages/SearchPage.ets(178:15)", "entry");
                        Flex.width('100%');
                    }, Flex);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const keyword = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(keyword);
                                Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(180:19)", "entry");
                                Text.fontSize(14);
                                Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                                Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
                                Text.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                                Text.borderRadius(16);
                                Text.margin({ right: 8, bottom: 8 });
                                Text.onClick(() => {
                                    this.searchText = keyword;
                                    this.performSearch();
                                });
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.searchHistory, forEachItemGenFunction, (keyword: string) => keyword, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Flex.pop();
                    Column.pop();
                });
            }
            // 热门搜索
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 热门搜索
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SearchPage.ets(203:11)", "entry");
            // 热门搜索
            Column.width('100%');
            // 热门搜索
            Column.padding(16);
            // 热门搜索
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            // 热门搜索
            Column.borderRadius(12);
            // 热门搜索
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('热门搜索');
            Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(204:13)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap });
            Flex.debugLine("entry/src/main/ets/pages/SearchPage.ets(210:13)", "entry");
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const keyword = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/SearchPage.ets(212:17)", "entry");
                    Row.padding({ left: 12, right: 12, top: 8, bottom: 8 });
                    Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    Row.borderRadius(16);
                    Row.margin({ right: 8, bottom: 8 });
                    Row.onClick(() => {
                        this.searchText = keyword;
                        this.performSearch();
                    });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(`${index + 1}`);
                    Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(213:19)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(index < 3 ? { "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" } : { "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    Text.fontWeight(FontWeight.Bold);
                    Text.margin({ right: 8 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(keyword);
                    Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(219:19)", "entry");
                    Text.fontSize(14);
                    Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                }, Text);
                Text.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.hotSearchWords, forEachItemGenFunction, (keyword: string) => keyword, true, false);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
        // 热门搜索
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 推荐商品
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SearchPage.ets(242:11)", "entry");
            // 推荐商品
            Column.width('100%');
            // 推荐商品
            Column.padding(16);
            // 推荐商品
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            // 推荐商品
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('推荐商品');
            Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(243:13)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.ProductItem.bind(this)(item);
            };
            this.forEachUpdateFunction(elmtId, [1, 2, 3], forEachItemGenFunction, (item: number) => item.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        // 推荐商品
        Column.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    ProductItem(index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/SearchPage.ets(270:5)", "entry");
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Row.borderRadius(8);
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777295, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/SearchPage.ets(271:7)", "entry");
            Image.width(80);
            Image.height(80);
            Image.borderRadius(8);
            Image.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/SearchPage.ets(277:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`推荐商品${index}`);
            Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(278:9)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${(index * 99.9).toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(284:9)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.getCategoryName(this.currentCategory)}分类`);
            Text.debugLine("entry/src/main/ets/pages/SearchPage.ets(290:9)", "entry");
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
        return "SearchPage";
    }
}
registerNamedRoute(() => new SearchPage(undefined, {}), "", { bundleName: "com.atomicservice.account_atomicservice_sample", moduleName: "entry", pagePath: "pages/SearchPage", pageFullPath: "entry/src/main/ets/pages/SearchPage", integratedHsp: "false", moduleType: "followWithHap" });
