if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Address_Params {
    address?: functionalButtonComponentManager.ChooseAddressResult;
    onChange?: (phone: functionalButtonComponentManager.ChooseAddressResult | undefined) => void;
}
import { FunctionalButton } from "@hms:core.atomicserviceComponent.atomicserviceUi";
import { functionalButtonComponentManager } from "@hms:core.atomicserviceComponent.atomicserviceUi";
import { showErrorMessage } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/Utils";
import hilog from "@ohos:hilog";
const logTag: string = 'Address';
const domainId: number = 0x0000;
export class Address extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__address = new SynchedPropertyObjectOneWayPU(params.address, this, "address");
        this.onChange = () => {
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Address_Params) {
        if (params.onChange !== undefined) {
            this.onChange = params.onChange;
        }
    }
    updateStateVars(params: Address_Params) {
        this.__address.reset(params.address);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__address.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__address.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __address: SynchedPropertySimpleOneWayPU<functionalButtonComponentManager.ChooseAddressResult>;
    get address() {
        return this.__address.get();
    }
    set address(newValue: functionalButtonComponentManager.ChooseAddressResult) {
        this.__address.set(newValue);
    }
    private onChange: (phone: functionalButtonComponentManager.ChooseAddressResult | undefined) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({
                direction: FlexDirection.RowReverse,
                alignItems: ItemAlign.Center
            });
            Flex.width('100%');
            Flex.constraintSize({ minHeight: 56 });
            Flex.padding({
                left: 12,
                right: 12,
                top: 4,
                bottom: 4
            });
            Flex.margin({ top: 12 });
            Flex.backgroundColor({ "id": 125829597, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Flex.borderRadius(20);
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.address) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777252, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Image.fillColor({ "id": 125829120, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Image.opacity(0.2);
                        Image.width(12);
                        Image.height(24);
                        Image.margin({ left: 4 });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.layoutWeight(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777239, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontSize({ "id": 125829679, "type": 10002, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.width(16);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ top: 8, bottom: 8 });
            Row.justifyContent(FlexAlign.End);
            Row.layoutWeight(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.address) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.alignItems(HorizontalAlign.End);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.address.userName} ${this.address.mobileNumber}`);
                        Text.fontSize({ "id": 125829680, "type": 10002, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.wordBreak(WordBreak.BREAK_ALL);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.address.provinceName} ${this.address.cityName} ${this.address.districtName}` +
                            ` ${this.address.streetName} ${this.address.detailedAddress}`);
                        Text.fontSize({ "id": 125829680, "type": 10002, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.wordBreak(WordBreak.BREAK_ALL);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    if (!If.canRetake('addressFunctionalButtonId')) {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            __Common__.create(true);
                            __Common__.id('addressFunctionalButtonId');
                        }, __Common__);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new FunctionalButton(this, {
                                        params: {
                                            openType: functionalButtonComponentManager.OpenType.CHOOSE_ADDRESS,
                                            label: { "id": 16777229, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" },
                                            // Adjust the button style.
                                            styleOption: {
                                                styleConfig: new functionalButtonComponentManager
                                                    .ButtonConfig()
                                                    .width(72)
                                                    .height(28)
                                                    .fontSize(14)
                                                    .padding({ left: 12, right: 12 })
                                                    .backgroundColor({ "id": 125829510, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" })
                                                    .fontColor({ "id": 125829171, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" })
                                                    .fontWeight(FontWeight.Medium)
                                            }
                                        },
                                        controller: new functionalButtonComponentManager.FunctionalButtonController()
                                            .onChooseAddress((err, data) => {
                                            if (err) {
                                                // Processing upon an error.
                                                showErrorMessage(this.getUIContext(), err);
                                                return;
                                            }
                                            // Processing upon a success.
                                            // ...
                                            hilog.info(domainId, logTag, 'Succeeded in getting address.');
                                            this.onChange(data);
                                        })
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/Address.ets", line: 58, col: 13 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            params: {
                                                openType: functionalButtonComponentManager.OpenType.CHOOSE_ADDRESS,
                                                label: { "id": 16777229, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" },
                                                // Adjust the button style.
                                                styleOption: {
                                                    styleConfig: new functionalButtonComponentManager
                                                        .ButtonConfig()
                                                        .width(72)
                                                        .height(28)
                                                        .fontSize(14)
                                                        .padding({ left: 12, right: 12 })
                                                        .backgroundColor({ "id": 125829510, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" })
                                                        .fontColor({ "id": 125829171, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" })
                                                        .fontWeight(FontWeight.Medium)
                                                }
                                            },
                                            controller: new functionalButtonComponentManager.FunctionalButtonController()
                                                .onChooseAddress((err, data) => {
                                                if (err) {
                                                    // Processing upon an error.
                                                    showErrorMessage(this.getUIContext(), err);
                                                    return;
                                                }
                                                // Processing upon a success.
                                                // ...
                                                hilog.info(domainId, logTag, 'Succeeded in getting address.');
                                                this.onChange(data);
                                            })
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                        params: {
                                            openType: functionalButtonComponentManager.OpenType.CHOOSE_ADDRESS,
                                            label: { "id": 16777229, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" },
                                            // Adjust the button style.
                                            styleOption: {
                                                styleConfig: new functionalButtonComponentManager
                                                    .ButtonConfig()
                                                    .width(72)
                                                    .height(28)
                                                    .fontSize(14)
                                                    .padding({ left: 12, right: 12 })
                                                    .backgroundColor({ "id": 125829510, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" })
                                                    .fontColor({ "id": 125829171, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" })
                                                    .fontWeight(FontWeight.Medium)
                                            }
                                        }
                                    });
                                }
                            }, { name: "FunctionalButton" });
                        }
                        __Common__.pop();
                    }
                });
            }
        }, If);
        If.pop();
        Row.pop();
        Row.pop();
        Flex.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
