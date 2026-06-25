if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MyMarketPage_Params {
    resaleOrders?: ResaleOrder[];
    filteredOrders?: ResaleOrder[];
    isLoading?: boolean;
    currentUserId?: string;
    currentTab?: string;
    tabs?: TabItem[];
}
import router from "@ohos:router";
import { ResaleManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/ResaleManager";
import type { ResaleOrder, ResaleStatus } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/ResaleManager";
import { AccountManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/AccountManager";
// 标签项接口
interface TabItem {
    key: string;
    name: string;
}
class MyMarketPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__resaleOrders = new ObservedPropertyObjectPU([], this, "resaleOrders");
        this.__filteredOrders = new ObservedPropertyObjectPU([], this, "filteredOrders");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__currentUserId = new ObservedPropertySimplePU('', this, "currentUserId");
        this.__currentTab = new ObservedPropertySimplePU('all', this, "currentTab");
        this.tabs = [
            { key: 'all', name: '全部' },
            { key: 'draft', name: '草稿' },
            { key: 'published', name: '已发布' },
            { key: 'sold', name: '已售出' },
            { key: 'cancelled', name: '已取消' }
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MyMarketPage_Params) {
        if (params.resaleOrders !== undefined) {
            this.resaleOrders = params.resaleOrders;
        }
        if (params.filteredOrders !== undefined) {
            this.filteredOrders = params.filteredOrders;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.currentUserId !== undefined) {
            this.currentUserId = params.currentUserId;
        }
        if (params.currentTab !== undefined) {
            this.currentTab = params.currentTab;
        }
        if (params.tabs !== undefined) {
            this.tabs = params.tabs;
        }
    }
    updateStateVars(params: MyMarketPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__resaleOrders.purgeDependencyOnElmtId(rmElmtId);
        this.__filteredOrders.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUserId.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTab.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__resaleOrders.aboutToBeDeleted();
        this.__filteredOrders.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__currentUserId.aboutToBeDeleted();
        this.__currentTab.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __resaleOrders: ObservedPropertyObjectPU<ResaleOrder[]>;
    get resaleOrders() {
        return this.__resaleOrders.get();
    }
    set resaleOrders(newValue: ResaleOrder[]) {
        this.__resaleOrders.set(newValue);
    }
    private __filteredOrders: ObservedPropertyObjectPU<ResaleOrder[]>;
    get filteredOrders() {
        return this.__filteredOrders.get();
    }
    set filteredOrders(newValue: ResaleOrder[]) {
        this.__filteredOrders.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __currentUserId: ObservedPropertySimplePU<string>;
    get currentUserId() {
        return this.__currentUserId.get();
    }
    set currentUserId(newValue: string) {
        this.__currentUserId.set(newValue);
    }
    private __currentTab: ObservedPropertySimplePU<string>;
    get currentTab() {
        return this.__currentTab.get();
    }
    set currentTab(newValue: string) {
        this.__currentTab.set(newValue);
    }
    // 状态标签
    private tabs: TabItem[];
    aboutToAppear() {
        // 获取当前登录用户ID
        this.currentUserId = AccountManager.getInstance().getCurrentUserId();
        // 获取路由参数
        const params = router.getParams() as Record<string, string>;
        if (params && params['marketType']) {
            this.currentTab = params['marketType'];
        }
        this.loadResaleOrders();
    }
    // 加载用户的转售订单
    loadResaleOrders() {
        this.resaleOrders = ResaleManager.getInstance().getUserResaleOrders(this.currentUserId);
        this.filterOrders();
        this.isLoading = false;
    }
    // 筛选订单
    filterOrders() {
        if (this.currentTab === 'all') {
            this.filteredOrders = this.resaleOrders;
        }
        else {
            this.filteredOrders = this.resaleOrders.filter(order => order.status === this.currentTab);
        }
    }
    // 切换标签
    switchTab(key: string) {
        this.currentTab = key;
        this.filterOrders();
    }
    // 获取状态文本
    getStatusText(status: ResaleStatus): string {
        switch (status) {
            case 'draft':
                return '草稿';
            case 'published':
                return '已发布';
            case 'sold':
                return '已售出';
            case 'cancelled':
                return '已取消';
            default:
                return '未知';
        }
    }
    // 获取状态颜色
    getStatusColor(status: ResaleStatus): string {
        switch (status) {
            case 'draft':
                return '#999999';
            case 'published':
                return '#4CAF50';
            case 'sold':
                return '#FF5722';
            case 'cancelled':
                return '#CCCCCC';
            default:
                return '#999999';
        }
    }
    // 编辑转售订单
    editResaleOrder(order: ResaleOrder) {
        router.pushUrl({
            url: 'pages/ResaleEditPage',
            params: {
                resaleId: order.resaleId,
                productData: {
                    id: order.product.id,
                    name: order.product.name,
                    price: order.originalPrice,
                    imageUrl: order.product.imageUrl,
                    shopName: order.product.shopName,
                    description: order.description
                },
                quantity: order.product.quantity,
                orderId: order.originalOrderId,
                resalePrice: order.resalePrice,
                description: order.description
            }
        });
    }
    // 删除转售订单
    deleteResaleOrder(order: ResaleOrder) {
        AlertDialog.show({
            title: '确认删除',
            message: `确定要删除转售订单"${order.product.name}"吗？`,
            autoCancel: true,
            alignment: DialogAlignment.Center,
            primaryButton: {
                value: '取消',
                action: () => { }
            },
            secondaryButton: {
                value: '删除',
                action: () => {
                    ResaleManager.getInstance().deleteResaleOrder(order.resaleId);
                    this.loadResaleOrders();
                }
            }
        });
    }
    // 下架转售订单
    unpublishResaleOrder(order: ResaleOrder) {
        ResaleManager.getInstance().updateResaleOrderStatus(order.resaleId, 'draft');
        this.loadResaleOrders();
        AlertDialog.show({
            title: '成功',
            message: '转售订单已下架',
            autoCancel: true,
            alignment: DialogAlignment.Center
        });
    }
    // 重新发布
    republishResaleOrder(order: ResaleOrder) {
        ResaleManager.getInstance().publishResaleOrder(order.resaleId);
        this.loadResaleOrders();
        AlertDialog.show({
            title: '成功',
            message: '转售订单已重新发布',
            autoCancel: true,
            alignment: DialogAlignment.Center
        });
    }
    ResaleOrderItemBuilder(order: ResaleOrder, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Color.White);
            Column.borderRadius(8);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品图片
            Image.create(order.product.imageUrl);
            // 商品图片
            Image.width(100);
            // 商品图片
            Image.height(100);
            // 商品图片
            Image.borderRadius(8);
            // 商品图片
            Image.objectFit(ImageFit.Cover);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品信息
            Column.create();
            // 商品信息
            Column.layoutWeight(1);
            // 商品信息
            Column.alignItems(HorizontalAlign.Start);
            // 商品信息
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(order.product.name);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`原价: ¥${order.originalPrice}`);
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.decoration({ type: TextDecorationType.LineThrough });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`转售价: ¥${order.resalePrice}`);
            Text.fontSize(14);
            Text.fontColor('#FF5722');
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getStatusText(order.status));
            Text.fontSize(12);
            Text.fontColor(Color.White);
            Text.backgroundColor(this.getStatusColor(order.status));
            Text.borderRadius(4);
            Text.padding({ left: 8, right: 8, top: 2, bottom: 2 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`浏览: ${order.viewCount}`);
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`x${order.product.quantity}`);
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        // 商品信息
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮
            Row.create();
            // 操作按钮
            Row.width('100%');
            // 操作按钮
            Row.margin({ top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('编辑');
            Button.fontSize(12);
            Button.fontColor('#666666');
            Button.backgroundColor('#F0F0F0');
            Button.borderRadius(15);
            Button.height(30);
            Button.layoutWeight(1);
            Button.onClick(() => {
                this.editResaleOrder(order);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (order.status === 'published') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('下架');
                        Button.fontSize(12);
                        Button.fontColor('#FF9800');
                        Button.backgroundColor('#FFF3E0');
                        Button.borderRadius(15);
                        Button.height(30);
                        Button.layoutWeight(1);
                        Button.margin({ left: 8 });
                        Button.onClick(() => {
                            this.unpublishResaleOrder(order);
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else if (order.status === 'draft') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('发布');
                        Button.fontSize(12);
                        Button.fontColor('#4CAF50');
                        Button.backgroundColor('#C8E6C9');
                        Button.borderRadius(15);
                        Button.height(30);
                        Button.layoutWeight(1);
                        Button.margin({ left: 8 });
                        Button.onClick(() => {
                            this.republishResaleOrder(order);
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('删除');
            Button.fontSize(12);
            Button.fontColor('#FF5722');
            Button.backgroundColor('#FFEBEE');
            Button.borderRadius(15);
            Button.height(30);
            Button.layoutWeight(1);
            Button.margin({ left: 8 });
            Button.onClick(() => {
                this.deleteResaleOrder(order);
            });
        }, Button);
        Button.pop();
        // 操作按钮
        Row.pop();
        Column.pop();
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
            Text.create('我的市集');
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
            // 标签栏
            Scroll.create();
            // 标签栏
            Scroll.width('100%');
            // 标签栏
            Scroll.scrollable(ScrollDirection.Horizontal);
            // 标签栏
            Scroll.scrollBar(BarState.Off);
            // 标签栏
            Scroll.backgroundColor(Color.White);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    Column.onClick(() => {
                        this.switchTab(tab.key);
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab.name);
                    Text.fontSize(14);
                    Text.fontColor(this.currentTab === tab.key ? '#FF5722' : '#666666');
                    Text.fontWeight(this.currentTab === tab.key ? FontWeight.Bold : FontWeight.Normal);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.currentTab === tab.key) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Divider.create();
                                Divider.width(20);
                                Divider.height(2);
                                Divider.color('#FF5722');
                                Divider.margin({ top: 4 });
                            }, Divider);
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabs, forEachItemGenFunction, (tab: TabItem) => tab.key, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // 标签栏
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 内容区域
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
            else if (this.filteredOrders.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 空状态
                        Column.create();
                        // 空状态
                        Column.width('100%');
                        // 空状态
                        Column.layoutWeight(1);
                        // 空状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🏪');
                        Text.fontSize(60);
                        Text.opacity(0.5);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.currentTab === 'all' ? '暂无转售订单' : `暂无${this.tabs.find(t => t.key === this.currentTab)?.name || ''}订单`);
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                        Text.margin({ top: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.currentTab === 'all') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('在订单详情页点击"转售"即可发布');
                                    Text.fontSize(12);
                                    Text.fontColor('#CCCCCC');
                                    Text.margin({ top: 8 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithLabel('去转售');
                                    Button.fontSize(14);
                                    Button.fontColor(Color.White);
                                    Button.backgroundColor('#4CAF50');
                                    Button.borderRadius(20);
                                    Button.width(120);
                                    Button.height(40);
                                    Button.margin({ top: 16 });
                                    Button.onClick(() => {
                                        router.pushUrl({ url: 'pages/ResaleSelectPage' });
                                    });
                                }, Button);
                                Button.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    // 空状态
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 转售订单列表
                        Scroll.create();
                        // 转售订单列表
                        Scroll.width('100%');
                        // 转售订单列表
                        Scroll.layoutWeight(1);
                        // 转售订单列表
                        Scroll.scrollBar(BarState.Off);
                        // 转售订单列表
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 统计信息
                        Row.create();
                        // 统计信息
                        Row.width('100%');
                        // 统计信息
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`共 ${this.filteredOrders.length} 个订单`);
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.currentTab === 'all') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`已发布: ${this.resaleOrders.filter(o => o.status === 'published').length}`);
                                    Text.fontSize(12);
                                    Text.fontColor('#4CAF50');
                                    Text.margin({ right: 8 });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`已售出: ${this.resaleOrders.filter(o => o.status === 'sold').length}`);
                                    Text.fontSize(12);
                                    Text.fontColor('#FF5722');
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
                    // 统计信息
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const order = _item;
                            this.ResaleOrderItemBuilder.bind(this)(order);
                        };
                        this.forEachUpdateFunction(elmtId, this.filteredOrders, forEachItemGenFunction, (order: ResaleOrder) => order.resaleId, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    // 转售订单列表
                    Scroll.pop();
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
        return "MyMarketPage";
    }
}
registerNamedRoute(() => new MyMarketPage(undefined, {}), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/MyMarketPage", pageFullPath: "entry/src/main/ets/pages/MyMarketPage", integratedHsp: "false", moduleType: "followWithHap" });
