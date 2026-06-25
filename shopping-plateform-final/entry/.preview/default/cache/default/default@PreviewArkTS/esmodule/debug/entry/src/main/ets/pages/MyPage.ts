if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MyPage_Params {
    mainBoxPadding?: number;
    currentMode?: 'shopping' | 'market';
    isLoggedIn?: boolean;
    currentUserId?: string;
    username?: string;
    userAvatar?: string;
    currentUser?: UserAccount | null;
    orderStats?: Map<string, number>;
    resaleStats?: Map<string, number>;
}
import router from "@ohos:router";
import { AccountManager } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/AccountManager";
import type { UserAccount } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/AccountManager";
import { OrderManager } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/OrderManager";
import { ResaleManager } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/ResaleManager";
export class MyPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__mainBoxPadding = new SynchedPropertySimpleOneWayPU(params.mainBoxPadding, this, "mainBoxPadding");
        this.__currentMode = this.createStorageLink('currentMode', 'shopping', "currentMode");
        this.__isLoggedIn = this.createStorageLink('isLogin', false, "isLoggedIn");
        this.__currentUserId = this.createStorageLink('currentUserId', '', "currentUserId");
        this.__username = this.createStorageLink('username', '', "username");
        this.__userAvatar = this.createStorageLink('userAvatar', '', "userAvatar");
        this.__currentUser = new ObservedPropertyObjectPU(null, this, "currentUser");
        this.__orderStats = new ObservedPropertyObjectPU(new Map(), this, "orderStats");
        this.__resaleStats = new ObservedPropertyObjectPU(new Map(), this, "resaleStats");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MyPage_Params) {
        if (params.mainBoxPadding === undefined) {
            this.__mainBoxPadding.set(16);
        }
        if (params.currentUser !== undefined) {
            this.currentUser = params.currentUser;
        }
        if (params.orderStats !== undefined) {
            this.orderStats = params.orderStats;
        }
        if (params.resaleStats !== undefined) {
            this.resaleStats = params.resaleStats;
        }
    }
    updateStateVars(params: MyPage_Params) {
        this.__mainBoxPadding.reset(params.mainBoxPadding);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__mainBoxPadding.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoggedIn.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUserId.purgeDependencyOnElmtId(rmElmtId);
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__userAvatar.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUser.purgeDependencyOnElmtId(rmElmtId);
        this.__orderStats.purgeDependencyOnElmtId(rmElmtId);
        this.__resaleStats.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__mainBoxPadding.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__isLoggedIn.aboutToBeDeleted();
        this.__currentUserId.aboutToBeDeleted();
        this.__username.aboutToBeDeleted();
        this.__userAvatar.aboutToBeDeleted();
        this.__currentUser.aboutToBeDeleted();
        this.__orderStats.aboutToBeDeleted();
        this.__resaleStats.aboutToBeDeleted();
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
    private __currentMode: ObservedPropertyAbstractPU<'shopping' | 'market'>;
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: 'shopping' | 'market') {
        this.__currentMode.set(newValue);
    }
    private __isLoggedIn: ObservedPropertyAbstractPU<boolean>;
    get isLoggedIn() {
        return this.__isLoggedIn.get();
    }
    set isLoggedIn(newValue: boolean) {
        this.__isLoggedIn.set(newValue);
    }
    private __currentUserId: ObservedPropertyAbstractPU<string>;
    get currentUserId() {
        return this.__currentUserId.get();
    }
    set currentUserId(newValue: string) {
        this.__currentUserId.set(newValue);
    }
    private __username: ObservedPropertyAbstractPU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __userAvatar: ObservedPropertyAbstractPU<string>;
    get userAvatar() {
        return this.__userAvatar.get();
    }
    set userAvatar(newValue: string) {
        this.__userAvatar.set(newValue);
    }
    private __currentUser: ObservedPropertyObjectPU<UserAccount | null>;
    get currentUser() {
        return this.__currentUser.get();
    }
    set currentUser(newValue: UserAccount | null) {
        this.__currentUser.set(newValue);
    }
    private __orderStats: ObservedPropertyObjectPU<Map<string, number>>;
    get orderStats() {
        return this.__orderStats.get();
    }
    set orderStats(newValue: Map<string, number>) {
        this.__orderStats.set(newValue);
    }
    private __resaleStats: ObservedPropertyObjectPU<Map<string, number>>;
    get resaleStats() {
        return this.__resaleStats.get();
    }
    set resaleStats(newValue: Map<string, number>) {
        this.__resaleStats.set(newValue);
    }
    aboutToAppear() {
        this.checkLoginStatus();
    }
    onPageShow() {
        this.checkLoginStatus();
    }
    // 检查登录状态
    checkLoginStatus() {
        this.currentUser = AccountManager.getInstance().getCurrentUser();
        if (this.isLoggedIn && this.currentUser) {
            this.loadOrderStats();
            this.loadResaleStats();
        }
        else {
            this.orderStats = new Map();
            this.resaleStats = new Map();
        }
    }
    // 加载订单统计
    loadOrderStats() {
        const orders = OrderManager.getInstance().getUserOrders(this.currentUserId);
        const stats = new Map<string, number>();
        stats.set('all', orders.length);
        stats.set('pending', orders.filter(o => o.status === 'pending').length);
        stats.set('paid', orders.filter(o => o.status === 'paid').length);
        stats.set('shipped', orders.filter(o => o.status === 'shipped').length);
        stats.set('completed', orders.filter(o => o.status === 'completed').length);
        stats.set('cancelled', orders.filter(o => o.status === 'cancelled').length);
        this.orderStats = stats;
    }
    // 加载转售统计
    loadResaleStats() {
        const resales = ResaleManager.getInstance().getUserResaleOrders(this.currentUserId);
        const stats = new Map<string, number>();
        stats.set('all', resales.length);
        stats.set('published', resales.filter(r => r.status === 'published').length);
        stats.set('sold', resales.filter(r => r.status === 'sold').length);
        this.resaleStats = stats;
    }
    // 跳转到登录页面
    goToLogin() {
        router.pushUrl({
            url: 'pages/LoginPage'
        });
    }
    // 跳转到个人资料修改页面
    goToProfileEdit() {
        if (!this.isLoggedIn) {
            this.goToLogin();
            return;
        }
        router.pushUrl({
            url: 'pages/ProfileEditPage'
        });
    }
    // 跳转到订单列表页面
    goToOrderList(orderType?: string) {
        if (!this.isLoggedIn) {
            this.goToLogin();
            return;
        }
        router.pushUrl({
            url: 'pages/OrderListPage',
            params: {
                orderType: orderType || 'all'
            }
        });
    }
    // 跳转到我的集市页面
    goToMyMarket(marketType?: string) {
        if (!this.isLoggedIn) {
            this.goToLogin();
            return;
        }
        router.pushUrl({
            url: 'pages/MyMarketPage',
            params: {
                marketType: marketType || 'all'
            }
        });
    }
    // 退出登录
    logout() {
        AlertDialog.show({
            title: '退出登录',
            message: '确定要退出当前账号吗？',
            primaryButton: {
                value: '取消',
                action: () => { }
            },
            secondaryButton: {
                value: '确定',
                action: () => {
                    AccountManager.getInstance().logout();
                    this.currentUser = null;
                    this.orderStats = new Map();
                    this.resaleStats = new Map();
                }
            }
        });
    }
    // 手机号脱敏
    maskPhoneNumber(phone: string): string {
        if (phone && phone.length === 11) {
            return phone.substring(0, 3) + '****' + phone.substring(7);
        }
        return phone;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(146:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Column);
        // 用户信息区域
        this.UserInfoSection.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能列表区域
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/MyPage.ets(151:7)", "entry");
            // 功能列表区域
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(152:9)", "entry");
            Column.width('100%');
            Column.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
        }, Column);
        // 快捷入口
        this.QuickEntrySection.bind(this)();
        // 我的订单
        this.OrderSection.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 市集模式下的额外功能
            if (this.currentMode === 'market') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.MarketSection.bind(this)();
                });
            }
            // 账号管理
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 账号管理
        this.AccountSection.bind(this)();
        Column.pop();
        // 功能列表区域
        Scroll.pop();
        Column.pop();
    }
    UserInfoSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(179:5)", "entry");
            Column.width('100%');
            Column.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, top: 16, bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoggedIn) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 已登录状态
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/MyPage.ets(182:9)", "entry");
                        // 已登录状态
                        Row.width('100%');
                        // 已登录状态
                        Row.padding(16);
                        // 已登录状态
                        Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 已登录状态
                        Row.borderRadius(12);
                        // 已登录状态
                        Row.onClick(() => {
                            this.goToProfileEdit();
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户头像
                        Image.create((this.currentUser?.avatar || this.userAvatar) || { "id": 16777285, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/MyPage.ets(184:11)", "entry");
                        // 用户头像
                        Image.width(80);
                        // 用户头像
                        Image.height(80);
                        // 用户头像
                        Image.borderRadius(40);
                        // 用户头像
                        Image.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 用户头像
                        Image.onClick(() => {
                            this.goToProfileEdit();
                        });
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/MyPage.ets(193:11)", "entry");
                        Column.alignItems(HorizontalAlign.Start);
                        Column.layoutWeight(1);
                        Column.margin({ left: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.currentUser?.username || this.username || '用户');
                        Text.debugLine("entry/src/main/ets/pages/MyPage.ets(194:13)", "entry");
                        Text.fontSize(18);
                        Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.currentUser?.phone) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.maskPhoneNumber(this.currentUser.phone));
                                    Text.debugLine("entry/src/main/ets/pages/MyPage.ets(200:15)", "entry");
                                    Text.fontSize(14);
                                    Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                                    Text.margin({ top: 4 });
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
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.currentUser?.account) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`账号: ${this.currentUser.account}`);
                                    Text.debugLine("entry/src/main/ets/pages/MyPage.ets(207:15)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                                    Text.margin({ top: 2 });
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
                        Image.create({ "id": 125830088, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/MyPage.ets(217:11)", "entry");
                        Image.width(24);
                        Image.height(24);
                        Image.fillColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    }, Image);
                    // 已登录状态
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 未登录状态
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/MyPage.ets(231:9)", "entry");
                        // 未登录状态
                        Row.width('100%');
                        // 未登录状态
                        Row.padding(16);
                        // 未登录状态
                        Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        // 未登录状态
                        Row.borderRadius(12);
                        // 未登录状态
                        Row.onClick(() => {
                            this.goToLogin();
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777285, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/MyPage.ets(232:11)", "entry");
                        Image.width(80);
                        Image.height(80);
                        Image.borderRadius(40);
                        Image.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/MyPage.ets(238:11)", "entry");
                        Column.alignItems(HorizontalAlign.Start);
                        Column.layoutWeight(1);
                        Column.margin({ left: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击登录');
                        Text.debugLine("entry/src/main/ets/pages/MyPage.ets(239:13)", "entry");
                        Text.fontSize(18);
                        Text.fontColor({ "id": 16777287, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('登录后可使用更多功能');
                        Text.debugLine("entry/src/main/ets/pages/MyPage.ets(244:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 125830088, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/MyPage.ets(253:11)", "entry");
                        Image.width(24);
                        Image.height(24);
                        Image.fillColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    }, Image);
                    // 未登录状态
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    QuickEntrySection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(273:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Column.borderRadius(12);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('快捷入口');
            Text.debugLine("entry/src/main/ets/pages/MyPage.ets(274:7)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MyPage.ets(280:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.QuickEntryItem.bind(this)('商品浏览', { "id": 16777295, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" }, () => { });
        this.QuickEntryItem.bind(this)('我的订单', { "id": 16777284, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" }, () => { this.goToOrderList(); });
        this.QuickEntryItem.bind(this)('收藏夹', { "id": 16777303, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" }, () => { });
        Row.pop();
        Column.pop();
    }
    OrderSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(297:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Column.borderRadius(12);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MyPage.ets(298:7)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的订单');
            Text.debugLine("entry/src/main/ets/pages/MyPage.ets(299:9)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/MyPage.ets(304:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MyPage.ets(306:9)", "entry");
            Row.onClick(() => {
                this.goToOrderList('all');
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('查看全部');
            Text.debugLine("entry/src/main/ets/pages/MyPage.ets(307:11)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125830088, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/MyPage.ets(311:11)", "entry");
            Image.width(16);
            Image.height(16);
            Image.fillColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Image);
        Row.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MyPage.ets(323:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.OrderStatusItem.bind(this)('待付款', this.orderStats.get('pending') || 0, () => { this.goToOrderList('pending'); });
        this.OrderStatusItem.bind(this)('待发货', this.orderStats.get('paid') || 0, () => { this.goToOrderList('paid'); });
        this.OrderStatusItem.bind(this)('待收货', this.orderStats.get('shipped') || 0, () => { this.goToOrderList('shipped'); });
        this.OrderStatusItem.bind(this)('已完成', this.orderStats.get('completed') || 0, () => { this.goToOrderList('completed'); });
        this.OrderStatusItem.bind(this)('退款/售后', this.orderStats.get('cancelled') || 0, () => { this.goToOrderList('cancelled'); });
        Row.pop();
        Column.pop();
    }
    MarketSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(342:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Column.borderRadius(12);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MyPage.ets(343:7)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的市集');
            Text.debugLine("entry/src/main/ets/pages/MyPage.ets(344:9)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/MyPage.ets(349:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MyPage.ets(351:9)", "entry");
            Row.onClick(() => {
                this.goToMyMarket('all');
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('查看全部');
            Text.debugLine("entry/src/main/ets/pages/MyPage.ets(352:11)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125830088, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/MyPage.ets(356:11)", "entry");
            Image.width(16);
            Image.height(16);
            Image.fillColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Image);
        Row.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MyPage.ets(368:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.MarketStatusItem.bind(this)('我的发布', this.resaleStats.get('published') || 0, () => { this.goToMyMarket('published'); });
        this.MarketStatusItem.bind(this)('已售商品', this.resaleStats.get('sold') || 0, () => { this.goToMyMarket('sold'); });
        this.MarketStatusItem.bind(this)('待发货', 0, () => { this.goToMyMarket('published'); });
        this.MarketStatusItem.bind(this)('我的转卖', this.resaleStats.get('all') || 0, () => { this.goToMyMarket('all'); });
        Row.pop();
        Column.pop();
    }
    AccountSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(386:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Column.borderRadius(12);
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('账号管理');
            Text.debugLine("entry/src/main/ets/pages/MyPage.ets(387:7)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoggedIn) {
                this.ifElseBranchUpdateFunction(0, () => {
                    // 已登录状态
                    this.MenuItem.bind(this)('切换账号', () => {
                        this.goToLogin();
                    });
                    this.MenuItem.bind(this)('退出当前账号', () => {
                        this.logout();
                    });
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    // 未登录状态
                    this.MenuItem.bind(this)('登录账号', () => {
                        this.goToLogin();
                    });
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    QuickEntryItem(title: string, icon: Resource, onClick: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(418:5)", "entry");
            Column.alignItems(HorizontalAlign.Center);
            Column.onClick(onClick);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(icon);
            Image.debugLine("entry/src/main/ets/pages/MyPage.ets(419:7)", "entry");
            Image.width(40);
            Image.height(40);
            Image.margin({ bottom: 8 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/MyPage.ets(424:7)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
    }
    OrderStatusItem(title: string, count: number, onClick: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(434:5)", "entry");
            Column.alignItems(HorizontalAlign.Center);
            Column.onClick(onClick);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Badge.create({
                count: count,
                position: BadgePosition.RightTop,
                style: { badgeSize: 16, badgeColor: '#FF5722' }
            });
            Badge.debugLine("entry/src/main/ets/pages/MyPage.ets(435:7)", "entry");
        }, Badge);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(440:9)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777295, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/MyPage.ets(441:11)", "entry");
            Image.width(32);
            Image.height(32);
            Image.margin({ bottom: 4 });
        }, Image);
        Column.pop();
        Badge.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/MyPage.ets(448:7)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
    }
    MarketStatusItem(title: string, count: number, onClick: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(458:5)", "entry");
            Column.alignItems(HorizontalAlign.Center);
            Column.onClick(onClick);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Badge.create({
                count: count,
                position: BadgePosition.RightTop,
                style: { badgeSize: 16, badgeColor: '#FF5722' }
            });
            Badge.debugLine("entry/src/main/ets/pages/MyPage.ets(459:7)", "entry");
        }, Badge);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MyPage.ets(464:9)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777295, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/MyPage.ets(465:11)", "entry");
            Image.width(32);
            Image.height(32);
            Image.margin({ bottom: 4 });
        }, Image);
        Column.pop();
        Badge.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/MyPage.ets(472:7)", "entry");
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
    }
    MenuItem(title: string, onClick: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/MyPage.ets(482:5)", "entry");
            Row.width('100%');
            Row.height(48);
            Row.onClick(onClick);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/MyPage.ets(483:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125830088, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/MyPage.ets(488:7)", "entry");
            Image.width(16);
            Image.height(16);
            Image.fillColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Image);
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
