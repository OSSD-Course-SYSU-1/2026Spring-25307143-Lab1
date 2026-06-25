if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginPage_Params {
    account?: string;
    password?: string;
    isLoading?: boolean;
    showPassword?: boolean;
    isLogin?: boolean;
}
import router from "@ohos:router";
import { AccountManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/AccountManager";
import type { UserAccount } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/AccountManager";
class LoginPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__account = new ObservedPropertySimplePU('', this, "account");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__showPassword = new ObservedPropertySimplePU(false, this, "showPassword");
        this.__isLogin = new ObservedPropertySimplePU(false, this, "isLogin");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginPage_Params) {
        if (params.account !== undefined) {
            this.account = params.account;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.showPassword !== undefined) {
            this.showPassword = params.showPassword;
        }
        if (params.isLogin !== undefined) {
            this.isLogin = params.isLogin;
        }
    }
    updateStateVars(params: LoginPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__account.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__showPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__isLogin.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__account.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__showPassword.aboutToBeDeleted();
        this.__isLogin.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __account: ObservedPropertySimplePU<string>;
    get account() {
        return this.__account.get();
    }
    set account(newValue: string) {
        this.__account.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __showPassword: ObservedPropertySimplePU<boolean>;
    get showPassword() {
        return this.__showPassword.get();
    }
    set showPassword(newValue: boolean) {
        this.__showPassword.set(newValue);
    }
    private __isLogin: ObservedPropertySimplePU<boolean>;
    get isLogin() {
        return this.__isLogin.get();
    }
    set isLogin(newValue: boolean) {
        this.__isLogin.set(newValue);
    }
    aboutToAppear() {
        // 检查是否已登录
        this.isLogin = AppStorage.get<boolean>('isLogin') || false;
    }
    // 登录
    doLogin() {
        if (!this.account) {
            AlertDialog.show({
                title: '提示',
                message: '请输入账号',
                autoCancel: true
            });
            return;
        }
        if (!this.password) {
            AlertDialog.show({
                title: '提示',
                message: '请输入密码',
                autoCancel: true
            });
            return;
        }
        this.isLoading = true;
        // 模拟网络延迟
        setTimeout(() => {
            const result = AccountManager.getInstance().login(this.account, this.password);
            this.isLoading = false;
            if (result.success && result.user) {
                AlertDialog.show({
                    title: '登录成功',
                    message: `欢迎回来，${result.user.username}！`,
                    autoCancel: true,
                    alignment: DialogAlignment.Center
                });
                // 延迟返回，让用户看到提示
                setTimeout(() => {
                    router.back();
                }, 1000);
            }
            else {
                AlertDialog.show({
                    title: '登录失败',
                    message: result.message,
                    autoCancel: true
                });
            }
        }, 500);
    }
    // 快速登录（用于演示）
    quickLogin(user: UserAccount) {
        this.account = user.account;
        this.password = user.password;
        this.doLogin();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
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
            Text.create('登录');
            Text.fontSize(18);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
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
            Scroll.create();
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 32, right: 32 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Logo
            Column.create();
            // Logo
            Column.margin({ top: 40, bottom: 32 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777243, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Image.width(80);
            Image.height(80);
            Image.borderRadius(40);
            Image.margin({ bottom: 16 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('市集');
            Text.fontSize(24);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // Logo
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 账号输入
            Column.create();
            // 账号输入
            Column.width('100%');
            // 账号输入
            Column.alignItems(HorizontalAlign.Start);
            // 账号输入
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('账号');
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入账号', text: this.account });
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(14);
            TextInput.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            TextInput.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            TextInput.borderRadius(8);
            TextInput.onChange((value: string) => {
                this.account = value;
            });
        }, TextInput);
        // 账号输入
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码输入
            Column.create();
            // 密码输入
            Column.width('100%');
            // 密码输入
            Column.alignItems(HorizontalAlign.Start);
            // 密码输入
            Column.margin({ bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码');
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入密码', text: this.password });
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(14);
            TextInput.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            TextInput.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            TextInput.borderRadius(8);
            TextInput.type(this.showPassword ? InputType.Normal : InputType.Password);
            TextInput.onChange((value: string) => {
                this.password = value;
            });
        }, TextInput);
        // 密码输入
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录按钮
            Button.createWithLabel(this.isLoading ? '登录中...' : '登录');
            // 登录按钮
            Button.width('100%');
            // 登录按钮
            Button.height(48);
            // 登录按钮
            Button.fontSize(16);
            // 登录按钮
            Button.fontColor(Color.White);
            // 登录按钮
            Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            // 登录按钮
            Button.borderRadius(24);
            // 登录按钮
            Button.enabled(!this.isLoading);
            // 登录按钮
            Button.onClick(() => {
                this.doLogin();
            });
        }, Button);
        // 登录按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分隔线
            Row.create();
            // 分隔线
            Row.width('100%');
            // 分隔线
            Row.margin({ top: 32, bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.layoutWeight(1);
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('测试账号');
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.margin({ left: 16, right: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.layoutWeight(1);
        }, Divider);
        // 分隔线
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 快速登录按钮
            Column.create();
            // 快速登录按钮
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 原神账号
            Row.create();
            // 原神账号
            Row.width('100%');
            // 原神账号
            Row.padding(16);
            // 原神账号
            Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            // 原神账号
            Row.borderRadius(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('原神牛逼');
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('账号: yuanshen');
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码: yuanshen123');
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('登录');
            Button.height(36);
            Button.fontSize(14);
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Button.borderRadius(18);
            Button.onClick(() => {
                this.quickLogin({
                    userId: 'user001',
                    username: '原神牛逼',
                    account: 'yuanshen',
                    password: 'yuanshen123',
                    avatar: '',
                    phone: '13800138001'
                });
            });
        }, Button);
        Button.pop();
        // 原神账号
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 鸣潮账号
            Row.create();
            // 鸣潮账号
            Row.width('100%');
            // 鸣潮账号
            Row.padding(16);
            // 鸣潮账号
            Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            // 鸣潮账号
            Row.borderRadius(12);
            // 鸣潮账号
            Row.margin({ top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('鸣潮牛逼');
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('账号: mingchao');
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('密码: mingchao123');
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('登录');
            Button.height(36);
            Button.fontSize(14);
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Button.borderRadius(18);
            Button.onClick(() => {
                this.quickLogin({
                    userId: 'user002',
                    username: '鸣潮牛逼',
                    account: 'mingchao',
                    password: 'mingchao123',
                    avatar: '',
                    phone: '13800138002'
                });
            });
        }, Button);
        Button.pop();
        // 鸣潮账号
        Row.pop();
        // 快速登录按钮
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户协议
            Column.create();
            // 用户协议
            Column.margin({ top: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('登录即表示同意');
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('《用户协议》');
            Text.fontSize(12);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('和');
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('《隐私政策》');
            Text.fontSize(12);
            Text.fontColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        // 用户协议
        Column.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LoginPage";
    }
}
registerNamedRoute(() => new LoginPage(undefined, {}), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/LoginPage", pageFullPath: "entry/src/main/ets/pages/LoginPage", integratedHsp: "false", moduleType: "followWithHap" });
