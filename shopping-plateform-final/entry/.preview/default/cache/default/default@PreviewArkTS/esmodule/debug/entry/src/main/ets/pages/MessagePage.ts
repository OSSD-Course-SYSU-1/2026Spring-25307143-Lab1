if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MessagePage_Params {
    mainBoxPadding?: number;
}
import hilog from "@ohos:hilog";
const logTag: string = 'MessagePage';
const domainId: number = 0x0000;
export class MessagePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__mainBoxPadding = new SynchedPropertySimpleOneWayPU(params.mainBoxPadding, this, "mainBoxPadding");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MessagePage_Params) {
        if (params.mainBoxPadding === undefined) {
            this.__mainBoxPadding.set(0);
        }
    }
    updateStateVars(params: MessagePage_Params) {
        this.__mainBoxPadding.reset(params.mainBoxPadding);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__mainBoxPadding.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__mainBoxPadding.aboutToBeDeleted();
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
    aboutToAppear() {
        hilog.info(domainId, logTag, 'MessagePage aboutToAppear');
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MessagePage.ets(18:5)", "entry");
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 消息列表区域
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MessagePage.ets(20:7)", "entry");
            // 消息列表区域
            Column.width('100%');
            // 消息列表区域
            Column.layoutWeight(1);
            // 消息列表区域
            Column.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, top: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('消息中心');
            Text.debugLine("entry/src/main/ets/pages/MessagePage.ets(21:9)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 消息列表示例
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MessagePage.ets(27:9)", "entry");
            // 消息列表示例
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/pages/MessagePage.ets(29:13)", "entry");
                    Row.width('100%');
                    Row.padding(16);
                    Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    Row.borderRadius(8);
                    Row.margin({ bottom: 12 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/MessagePage.ets(30:15)", "entry");
                    Column.alignItems(HorizontalAlign.Start);
                    Column.layoutWeight(1);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('系统通知');
                    Text.debugLine("entry/src/main/ets/pages/MessagePage.ets(31:17)", "entry");
                    Text.fontSize(16);
                    Text.fontWeight(FontWeight.Medium);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('这是一条系统消息示例，点击查看详情');
                    Text.debugLine("entry/src/main/ets/pages/MessagePage.ets(34:17)", "entry");
                    Text.fontSize(14);
                    Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    Text.margin({ top: 4 });
                    Text.maxLines(2);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('刚刚');
                    Text.debugLine("entry/src/main/ets/pages/MessagePage.ets(44:15)", "entry");
                    Text.fontSize(12);
                    Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                }, Text);
                Text.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, [1, 2, 3], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 消息列表示例
        Column.pop();
        // 消息列表区域
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
