if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ShoppingPage_Params {
    cards?: number[];
    minorsProtectionMode?: boolean;
    availableTimeMode?: boolean;
    silentLoginMap?: Map<string, UserInfo>;
    mainBoxPadding?: number;
}
import hilog from "@ohos:hilog";
import type { UserInfo } from '../common/UserInfo';
const logTag: string = 'ShoppingPage';
const domainId: number = 0x0000;
export class ShoppingPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.cards = [152, 152, 152, 152, 152, 152, 152, 152];
        this.__minorsProtectionMode = this.createStorageLink('minorsProtectionMode', false, "minorsProtectionMode");
        this.__availableTimeMode = this.createStorageLink('availableTimeMode', true, "availableTimeMode");
        this.__silentLoginMap = this.createStorageLink('silentLoginMap', new Map<string, UserInfo>([]), "silentLoginMap");
        this.__mainBoxPadding = new SynchedPropertySimpleOneWayPU(params.mainBoxPadding, this, "mainBoxPadding");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ShoppingPage_Params) {
        if (params.cards !== undefined) {
            this.cards = params.cards;
        }
    }
    updateStateVars(params: ShoppingPage_Params) {
        this.__mainBoxPadding.reset(params.mainBoxPadding);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__minorsProtectionMode.purgeDependencyOnElmtId(rmElmtId);
        this.__availableTimeMode.purgeDependencyOnElmtId(rmElmtId);
        this.__silentLoginMap.purgeDependencyOnElmtId(rmElmtId);
        this.__mainBoxPadding.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__minorsProtectionMode.aboutToBeDeleted();
        this.__availableTimeMode.aboutToBeDeleted();
        this.__silentLoginMap.aboutToBeDeleted();
        this.__mainBoxPadding.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private cards: number[];
    private __minorsProtectionMode: ObservedPropertyAbstractPU<boolean>;
    get minorsProtectionMode() {
        return this.__minorsProtectionMode.get();
    }
    set minorsProtectionMode(newValue: boolean) {
        this.__minorsProtectionMode.set(newValue);
    }
    private __availableTimeMode: ObservedPropertyAbstractPU<boolean>;
    get availableTimeMode() {
        return this.__availableTimeMode.get();
    }
    set availableTimeMode(newValue: boolean) {
        this.__availableTimeMode.set(newValue);
    }
    private __silentLoginMap: ObservedPropertyAbstractPU<Map<string, UserInfo>>;
    get silentLoginMap() {
        return this.__silentLoginMap.get();
    }
    set silentLoginMap(newValue: Map<string, UserInfo>) {
        this.__silentLoginMap.set(newValue);
    }
    private __mainBoxPadding: SynchedPropertySimpleOneWayPU<number>;
    get mainBoxPadding() {
        return this.__mainBoxPadding.get();
    }
    set mainBoxPadding(newValue: number) {
        this.__mainBoxPadding.set(newValue);
    }
    aboutToAppear() {
        hilog.info(domainId, logTag, 'aboutToAppear');
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                Card.bind(this)(item);
            };
            this.forEachUpdateFunction(elmtId, this.cards, forEachItemGenFunction, (item: number, index: number) => `${item}_${index}`, false, true);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
function Card(cardHeight: number, parent = null) {
    const __cardHeight__ = cardHeight;
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, cardHeight = __cardHeight__) => {
        Row.create();
        Row.margin({ top: 12 });
        Row.padding({ left: 16, right: 16 });
        Row.height(cardHeight);
        Row.backgroundColor({ "id": 125829597, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
        Row.borderRadius(20);
        Row.width('100%');
    }, Row);
    Row.pop();
}
