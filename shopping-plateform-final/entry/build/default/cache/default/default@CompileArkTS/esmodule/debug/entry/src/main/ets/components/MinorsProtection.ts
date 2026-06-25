if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MinorsProtection_Params {
    minorsProtectionMode?: boolean;
    availableTimeMode?: boolean;
    userTurnOffFlag?: boolean;
    lowerAge?: number;
    upperAge?: number;
}
import hilog from "@ohos:hilog";
import minorsProtection from "@hms:core.account.minorsProtection";
import type { BusinessError } from "@ohos:base";
const domainId: number = 0x0000;
const logTag: string = 'MinorsProtection';
export class MinorsProtection extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__minorsProtectionMode = new SynchedPropertySimpleTwoWayPU(params.minorsProtectionMode, this, "minorsProtectionMode");
        this.__availableTimeMode = new SynchedPropertySimpleTwoWayPU(params.availableTimeMode, this, "availableTimeMode");
        this.__userTurnOffFlag = new SynchedPropertySimpleTwoWayPU(params.userTurnOffFlag, this, "userTurnOffFlag");
        this.__lowerAge = new SynchedPropertySimpleTwoWayPU(params.lowerAge, this, "lowerAge");
        this.__upperAge = new SynchedPropertySimpleTwoWayPU(params.upperAge, this, "upperAge");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MinorsProtection_Params) {
    }
    updateStateVars(params: MinorsProtection_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__minorsProtectionMode.purgeDependencyOnElmtId(rmElmtId);
        this.__availableTimeMode.purgeDependencyOnElmtId(rmElmtId);
        this.__userTurnOffFlag.purgeDependencyOnElmtId(rmElmtId);
        this.__lowerAge.purgeDependencyOnElmtId(rmElmtId);
        this.__upperAge.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__minorsProtectionMode.aboutToBeDeleted();
        this.__availableTimeMode.aboutToBeDeleted();
        this.__userTurnOffFlag.aboutToBeDeleted();
        this.__lowerAge.aboutToBeDeleted();
        this.__upperAge.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __minorsProtectionMode: SynchedPropertySimpleTwoWayPU<boolean>;
    get minorsProtectionMode() {
        return this.__minorsProtectionMode.get();
    }
    set minorsProtectionMode(newValue: boolean) {
        this.__minorsProtectionMode.set(newValue);
    }
    private __availableTimeMode: SynchedPropertySimpleTwoWayPU<boolean>;
    get availableTimeMode() {
        return this.__availableTimeMode.get();
    }
    set availableTimeMode(newValue: boolean) {
        this.__availableTimeMode.set(newValue);
    }
    private __userTurnOffFlag: SynchedPropertySimpleTwoWayPU<boolean>;
    get userTurnOffFlag() {
        return this.__userTurnOffFlag.get();
    }
    set userTurnOffFlag(newValue: boolean) {
        this.__userTurnOffFlag.set(newValue);
    }
    private __lowerAge: SynchedPropertySimpleTwoWayPU<number>;
    get lowerAge() {
        return this.__lowerAge.get();
    }
    set lowerAge(newValue: number) {
        this.__lowerAge.set(newValue);
    }
    private __upperAge: SynchedPropertySimpleTwoWayPU<number>;
    get upperAge() {
        return this.__upperAge.get();
    }
    set upperAge(newValue: number) {
        this.__upperAge.set(newValue);
    }
    // Call the API for enabling the youth mode.
    private turnOnMinorsMode() {
        if (canIUse('SystemCapability.AuthenticationServices.HuaweiID.MinorsProtection')) {
            // Check whether the current device supports the youth mode.
            try {
                if (!minorsProtection.supportMinorsMode()) {
                    hilog.info(domainId, logTag, 'The current device environment does not support the youth mode, ' +
                        'please check the current device environment.');
                    return;
                }
            }
            catch (error) {
                hilog.error(domainId, logTag, `Failed to invoke supportMinorsMode. errCode: ${error.code}, message: ${error.message}`);
                return;
            }
            // Call the API for enabling the youth mode.
            minorsProtection.leadToTurnOnMinorsMode(this.getUIContext().getHostContext())
                .catch((error: BusinessError<Object>) => {
                hilog.error(domainId, logTag, `Failed to turnOnMinorsMode. errCode: ${error.code}, errMessage: ${error.message}`);
            });
        }
        else {
            hilog.info(domainId, logTag, 'The current device does not support the invoking of the leadToTurnOnMinorsMode interface.');
        }
    }
    // Call the API for verifying the youth mode password.
    private async verifyMinorsProtectionCredential(): Promise<boolean> {
        hilog.info(domainId, logTag, 'into verifyMinorsProtectionCredential');
        try {
            if (canIUse('SystemCapability.AuthenticationServices.HuaweiID.MinorsProtection')) {
                // Check whether the current device supports the youth mode.
                try {
                    if (!minorsProtection.supportMinorsMode()) {
                        hilog.info(domainId, logTag, 'The current device environment does not support the youth mode, ' +
                            'please check the current device environment.');
                        return false;
                    }
                    const result = await minorsProtection.verifyMinorsProtectionCredential(this.getUIContext().getHostContext());
                    hilog.info(domainId, logTag, `Succeeded in getting verifyMinorsProtectionCredential result: ${result.valueOf()}`);
                    return result;
                }
                catch (error) {
                    this.getUIContext().getPromptAction().showToast({ message: error.message });
                    hilog.error(domainId, logTag, `Failed to invoke verifyMinorsProtectionCredential or supportMinorsMode. errCode: ${error.code},
           errMessage: ${error.message}`);
                    return false;
                }
            }
            else {
                hilog.info(domainId, logTag, 'The current device does not support the invoking of the verifyMinorsProtectionCredential interface.');
                return false;
            }
        }
        catch (err) {
            hilog.error(domainId, logTag, `Failed to invoke verifyMinorsProtectionCredential. errCode: ${err?.code},
      errMessage: ${err?.message}`);
            return false;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height(this.minorsProtectionMode && !this.userTurnOffFlag ? 168 : 56);
            Column.padding({
                left: 12,
                right: 12
            });
            Column.margin({ top: 12 });
            Column.backgroundColor({ "id": 125829597, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Column.justifyContent(FlexAlign.SpaceBetween);
            Column.borderRadius(20);
            Column.constraintSize({
                minHeight: 56
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.height(56);
            Row.padding({
                top: 4,
                bottom: 4
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777234, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontSize({ "id": 125829679, "type": 10002, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.height('50%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Normal });
            Button.height(48);
            Button.width(48);
            Button.borderRadius(8);
            Button.id('minorProtectionButton');
            Button.onClick(() => {
                hilog.info(domainId, logTag, 'minorProtection onClick');
                // If the youth mode is enabled, a dialog box needs to be displayed when the user taps the switch.
                if (this.minorsProtectionMode) {
                    if (this.userTurnOffFlag) {
                        this.userTurnOffFlag = false;
                    }
                    else {
                        this.getUIContext().showAlertDialog({
                            title: '',
                            subtitle: '',
                            message: { "id": 16777227, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" },
                            autoCancel: false,
                            alignment: DialogAlignment.Center,
                            gridCount: 4,
                            offset: { dx: 0, dy: -20 },
                            primaryButton: {
                                value: { "id": 16777224, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" },
                                action: () => {
                                    hilog.info(domainId, logTag, 'Callback when the first button is clicked');
                                }
                            },
                            secondaryButton: {
                                value: { "id": 16777225, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" },
                                action: async () => {
                                    /*
                                     * The user taps the button to disable the youth mode.
                                     * The API for disabling the youth mode is called.
                                     * */
                                    this.userTurnOffFlag = await this.verifyMinorsProtectionCredential();
                                }
                            },
                            cancel: () => {
                                hilog.info(domainId, logTag, 'Closed callbacks');
                            },
                            textStyle: {
                                wordBreak: WordBreak.BREAK_WORD
                            }
                        });
                    }
                }
                else {
                    // Call the API for enabling the youth mode.
                    this.turnOnMinorsMode();
                }
            });
            Button.backgroundColor(Color.Transparent);
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.minorsProtectionMode && !this.userTurnOffFlag });
            Toggle.selectedColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Toggle.hitTestBehavior(HitTestMode.None);
        }, Toggle);
        Toggle.pop();
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.justifyContent(FlexAlign.SpaceBetween);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.minorsProtectionMode && !this.userTurnOffFlag) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.strokeWidth(0.5);
                    }, Divider);
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.height(56);
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.padding({
                            top: 4,
                            bottom: 4
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777221, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontSize({ "id": 125829679, "type": 10002, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Medium);
                        Text.height('50%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777220, "type": 10003, params: [this.lowerAge, this.upperAge], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontSize({ "id": 125829680, "type": 10002, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Divider.create();
                        Divider.strokeWidth(0.5);
                    }, Divider);
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.height(56);
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.padding({
                            top: 4,
                            bottom: 4
                        });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777222, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontSize({ "id": 125829679, "type": 10002, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontWeight(FontWeight.Medium);
                        Text.height('50%');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Normal });
                        Button.height(48);
                        Button.width(48);
                        Button.borderRadius(8);
                        Button.id('availableTimeButton');
                        Button.onClick(async () => {
                            // Password is required for adjusting youth mode–related settings.
                            const result = await this.verifyMinorsProtectionCredential();
                            if (result) {
                                this.availableTimeMode = !this.availableTimeMode;
                            }
                        });
                        Button.backgroundColor(Color.Transparent);
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Toggle.create({ type: ToggleType.Switch, isOn: this.availableTimeMode });
                        Toggle.selectedColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Toggle.hitTestBehavior(HitTestMode.None);
                    }, Toggle);
                    Toggle.pop();
                    Button.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
