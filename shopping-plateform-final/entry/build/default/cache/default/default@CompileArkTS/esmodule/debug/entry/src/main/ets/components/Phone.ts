if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Phone_Params {
    phone?: string;
    onChange?: (phone: string | undefined) => void;
}
import { FunctionalButton } from "@hms:core.atomicserviceComponent.atomicserviceUi";
import { functionalButtonComponentManager } from "@hms:core.atomicserviceComponent.atomicserviceUi";
import hilog from "@ohos:hilog";
import { cancelAuthorization, showErrorMessage } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/Utils";
const logTag: string = 'Phone';
const domainId: number = 0x0000;
export class Phone extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__phone = new SynchedPropertySimpleOneWayPU(params.phone, this, "phone");
        this.onChange = () => {
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Phone_Params) {
        if (params.onChange !== undefined) {
            this.onChange = params.onChange;
        }
    }
    updateStateVars(params: Phone_Params) {
        this.__phone.reset(params.phone);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__phone.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __phone: SynchedPropertySimpleOneWayPU<string>;
    get phone() {
        return this.__phone.get();
    }
    set phone(newValue: string) {
        this.__phone.set(newValue);
    }
    private onChange: (phone: string | undefined) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ direction: FlexDirection.RowReverse, alignItems: ItemAlign.Center });
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
            if (this.phone) {
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
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.layoutWeight(1);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777238, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontSize({ "id": 125829679, "type": 10002, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.padding({ top: 8, bottom: 8 });
            Row.justifyContent(FlexAlign.End);
            Row.constraintSize({ minHeight: 48, maxWidth: '60%' });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.phone) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.phone);
                        Text.fontSize({ "id": 125829680, "type": 10002, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
                        Text.textAlign(TextAlign.End);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    if (!If.canRetake('phoneFunctionalButtonId')) {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            __Common__.create(true);
                            __Common__.id('phoneFunctionalButtonId');
                        }, __Common__);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new FunctionalButton(this, {
                                        params: {
                                            openType: functionalButtonComponentManager.OpenType.GET_PHONE_NUMBER,
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
                                            .onGetPhoneNumber((err, data) => {
                                            if (err) {
                                                // Processing upon an error.
                                                showErrorMessage(this.getUIContext(), err);
                                                return;
                                            }
                                            // Processing upon a success.
                                            // ...
                                            hilog.info(domainId, logTag, 'succeeded in getting phone number.');
                                            const code = data.code;
                                            /*
                                             * After obtaining the authorization code, send it to the atomic service server.
                                             * The atomic service server calls the Account Kit server API to obtain an access token,
                                             * and then use the access token to obtain the user's mobile number.
                                             * ...
                                             * In this example, the mobile number is not actually obtained.
                                             * The mobile number is used for display purposes only.
                                             * */
                                            this.onChange('180******00');
                                            /*
                                             * The example demonstrates that a user will be prompted for authorization
                                             * to access their mobile number on each use.
                                             * Please note that this is a sample scenario.
                                             * */
                                            cancelAuthorization();
                                        })
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/Phone.ets", line: 40, col: 13 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            params: {
                                                openType: functionalButtonComponentManager.OpenType.GET_PHONE_NUMBER,
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
                                                .onGetPhoneNumber((err, data) => {
                                                if (err) {
                                                    // Processing upon an error.
                                                    showErrorMessage(this.getUIContext(), err);
                                                    return;
                                                }
                                                // Processing upon a success.
                                                // ...
                                                hilog.info(domainId, logTag, 'succeeded in getting phone number.');
                                                const code = data.code;
                                                /*
                                                 * After obtaining the authorization code, send it to the atomic service server.
                                                 * The atomic service server calls the Account Kit server API to obtain an access token,
                                                 * and then use the access token to obtain the user's mobile number.
                                                 * ...
                                                 * In this example, the mobile number is not actually obtained.
                                                 * The mobile number is used for display purposes only.
                                                 * */
                                                this.onChange('180******00');
                                                /*
                                                 * The example demonstrates that a user will be prompted for authorization
                                                 * to access their mobile number on each use.
                                                 * Please note that this is a sample scenario.
                                                 * */
                                                cancelAuthorization();
                                            })
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                        params: {
                                            openType: functionalButtonComponentManager.OpenType.GET_PHONE_NUMBER,
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
