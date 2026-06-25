if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProfileEditPage_Params {
    currentUser?: UserAccount | null;
    hasChanges?: boolean;
}
import router from "@ohos:router";
import { AccountManager } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/AccountManager";
import type { UserAccount } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/AccountManager";
class ProfileEditPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentUser = new ObservedPropertyObjectPU(null, this, "currentUser");
        this.__hasChanges = new ObservedPropertySimplePU(false, this, "hasChanges");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProfileEditPage_Params) {
        if (params.currentUser !== undefined) {
            this.currentUser = params.currentUser;
        }
        if (params.hasChanges !== undefined) {
            this.hasChanges = params.hasChanges;
        }
    }
    updateStateVars(params: ProfileEditPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentUser.purgeDependencyOnElmtId(rmElmtId);
        this.__hasChanges.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentUser.aboutToBeDeleted();
        this.__hasChanges.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentUser: ObservedPropertyObjectPU<UserAccount | null>;
    get currentUser() {
        return this.__currentUser.get();
    }
    set currentUser(newValue: UserAccount | null) {
        this.__currentUser.set(newValue);
    }
    private __hasChanges: ObservedPropertySimplePU<boolean>;
    get hasChanges() {
        return this.__hasChanges.get();
    }
    set hasChanges(newValue: boolean) {
        this.__hasChanges.set(newValue);
    }
    aboutToAppear() {
        this.loadUserInfo();
    }
    // 加载用户信息
    loadUserInfo() {
        this.currentUser = AccountManager.getInstance().getCurrentUser();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(23:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(25:7)", "entry");
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.height(56);
            // 标题栏
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777296, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(26:9)", "entry");
            Image.width(24);
            Image.height(24);
            Image.onClick(() => {
                router.back();
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人资料');
            Text.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(33:9)", "entry");
            Text.fontSize(18);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(40:9)", "entry");
            Blank.width(48);
        }, Blank);
        Blank.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(46:7)", "entry");
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(47:9)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 16, bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 头像
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(49:11)", "entry");
            // 头像
            Column.margin({ bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentUser && this.currentUser.avatar) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.currentUser.avatar);
                        Image.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(51:15)", "entry");
                        Image.width(100);
                        Image.height(100);
                        Image.borderRadius(50);
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777285, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(56:15)", "entry");
                        Image.width(100);
                        Image.height(100);
                        Image.borderRadius(50);
                    }, Image);
                });
            }
        }, If);
        If.pop();
        // 头像
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 基本信息
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(65:11)", "entry");
            // 基本信息
            Column.width('100%');
            // 基本信息
            Column.padding(16);
            // 基本信息
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            // 基本信息
            Column.borderRadius(12);
            // 基本信息
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('基本信息');
            Text.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(66:13)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        // 用户名
        this.InfoItem.bind(this)('用户名', this.currentUser?.username || '');
        // 账号
        this.InfoItem.bind(this)('账号', this.currentUser?.account || '');
        // 手机号
        this.InfoItem.bind(this)('手机号', this.currentUser?.phone || '');
        // 基本信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 账号安全
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(88:11)", "entry");
            // 账号安全
            Column.width('100%');
            // 账号安全
            Column.padding(16);
            // 账号安全
            Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            // 账号安全
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('账号安全');
            Text.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(89:13)", "entry");
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.MenuItem.bind(this)('修改密码', () => {
            AlertDialog.show({
                title: '提示',
                message: '演示账号不支持修改密码',
                autoCancel: true
            });
        });
        this.MenuItem.bind(this)('绑定手机', () => {
            AlertDialog.show({
                title: '提示',
                message: '演示账号不支持绑定手机',
                autoCancel: true
            });
        });
        this.MenuItem.bind(this)('实名认证', () => {
            AlertDialog.show({
                title: '提示',
                message: '演示账号不支持实名认证',
                autoCancel: true
            });
        });
        // 账号安全
        Column.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    InfoItem(label: string, value: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(136:5)", "entry");
            Row.width('100%');
            Row.padding({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(137:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.width(60);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(142:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
    }
    MenuItem(title: string, onClick: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(153:5)", "entry");
            Row.width('100%');
            Row.height(48);
            Row.onClick(onClick);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(154:7)", "entry");
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 125830088, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/ProfileEditPage.ets(159:7)", "entry");
            Image.width(16);
            Image.height(16);
            Image.fillColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        }, Image);
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ProfileEditPage";
    }
}
registerNamedRoute(() => new ProfileEditPage(undefined, {}), "", { bundleName: "com.atomicservice.account_atomicservice_sample", moduleName: "entry", pagePath: "pages/ProfileEditPage", pageFullPath: "entry/src/main/ets/pages/ProfileEditPage", integratedHsp: "false", moduleType: "followWithHap" });
