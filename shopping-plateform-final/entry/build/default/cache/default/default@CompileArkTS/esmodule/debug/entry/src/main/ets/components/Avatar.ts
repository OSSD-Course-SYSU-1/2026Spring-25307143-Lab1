if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Avatar_Params {
    avatar?: string | undefined;
    onChange?: (avatar: string | undefined) => void;
}
import { FunctionalButton } from "@hms:core.atomicserviceComponent.atomicserviceUi";
import { functionalButtonComponentManager } from "@hms:core.atomicserviceComponent.atomicserviceUi";
import type { BusinessError } from "@ohos:base";
import hilog from "@ohos:hilog";
import { copyFile, showErrorMessage } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/Utils";
const logTag: string = 'Avatar';
const domainId: number = 0x0000;
export class Avatar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__avatar = new SynchedPropertyObjectTwoWayPU(params.avatar, this, "avatar");
        this.onChange = () => {
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Avatar_Params) {
        if (params.onChange !== undefined) {
            this.onChange = params.onChange;
        }
    }
    updateStateVars(params: Avatar_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__avatar.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__avatar.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __avatar: SynchedPropertySimpleOneWayPU<string | undefined>;
    get avatar() {
        return this.__avatar.get();
    }
    set avatar(newValue: string | undefined) {
        this.__avatar.set(newValue);
    }
    private onChange: (avatar: string | undefined) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(64);
            Row.padding({ left: 12, right: 12 });
            Row.margin({ top: 12 });
            Row.backgroundColor({ "id": 125829597, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.borderRadius(20);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.avatar) {
                this.ifElseBranchUpdateFunction(0, () => {
                    if (!If.canRetake('avatarFunctionalButtonId')) {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            __Common__.create(true);
                            __Common__.id('avatarFunctionalButtonId');
                        }, __Common__);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new FunctionalButton(this, {
                                        params: {
                                            openType: functionalButtonComponentManager.OpenType.CHOOSE_AVATAR,
                                            label: '',
                                            styleOption: {
                                                size: functionalButtonComponentManager.SizeType.DEFAULT,
                                                bgColor: functionalButtonComponentManager.ColorType.DEFAULT,
                                                plain: false,
                                                disabled: false,
                                                loading: false,
                                                hoverClass: functionalButtonComponentManager.HoverClassType.HOVER_CLASS,
                                                hoverStartTime: 0,
                                                hoverStayTime: 0,
                                                styleConfig: new functionalButtonComponentManager.ButtonConfig()
                                                    .backgroundColor(Color.Transparent)
                                                    .borderWidth(0)
                                                    .borderRadius(20)
                                                    .type(ButtonType.Circle)
                                                    .backgroundImagePosition(Alignment.Center)
                                                    .backgroundImageSize(ImageSize.Cover)
                                                    .height(40)
                                                    .width(40)
                                                    .backgroundImage({ "id": 16777244, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" })
                                            }
                                        },
                                        controller: new functionalButtonComponentManager.FunctionalButtonController()
                                            .onChooseAvatar(async (err: BusinessError, data: functionalButtonComponentManager.ChooseAvatarResult) => {
                                            if (err) {
                                                showErrorMessage(this.getUIContext(), err);
                                                return;
                                            }
                                            // Preferentially use the cloud storage to store the avatar to ensure consistency between devices.
                                            // ...
                                            // In this example, the avatar is stored locally.
                                            if (data.avatarUri) {
                                                this.onChange(copyFile(this.getUIContext(), data.avatarUri));
                                                this.avatar = data.avatarUri;
                                            }
                                        })
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/Avatar.ets", line: 22, col: 11 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            params: {
                                                openType: functionalButtonComponentManager.OpenType.CHOOSE_AVATAR,
                                                label: '',
                                                styleOption: {
                                                    size: functionalButtonComponentManager.SizeType.DEFAULT,
                                                    bgColor: functionalButtonComponentManager.ColorType.DEFAULT,
                                                    plain: false,
                                                    disabled: false,
                                                    loading: false,
                                                    hoverClass: functionalButtonComponentManager.HoverClassType.HOVER_CLASS,
                                                    hoverStartTime: 0,
                                                    hoverStayTime: 0,
                                                    styleConfig: new functionalButtonComponentManager.ButtonConfig()
                                                        .backgroundColor(Color.Transparent)
                                                        .borderWidth(0)
                                                        .borderRadius(20)
                                                        .type(ButtonType.Circle)
                                                        .backgroundImagePosition(Alignment.Center)
                                                        .backgroundImageSize(ImageSize.Cover)
                                                        .height(40)
                                                        .width(40)
                                                        .backgroundImage({ "id": 16777244, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" })
                                                }
                                            },
                                            controller: new functionalButtonComponentManager.FunctionalButtonController()
                                                .onChooseAvatar(async (err: BusinessError, data: functionalButtonComponentManager.ChooseAvatarResult) => {
                                                if (err) {
                                                    showErrorMessage(this.getUIContext(), err);
                                                    return;
                                                }
                                                // Preferentially use the cloud storage to store the avatar to ensure consistency between devices.
                                                // ...
                                                // In this example, the avatar is stored locally.
                                                if (data.avatarUri) {
                                                    this.onChange(copyFile(this.getUIContext(), data.avatarUri));
                                                    this.avatar = data.avatarUri;
                                                }
                                            })
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                        params: {
                                            openType: functionalButtonComponentManager.OpenType.CHOOSE_AVATAR,
                                            label: '',
                                            styleOption: {
                                                size: functionalButtonComponentManager.SizeType.DEFAULT,
                                                bgColor: functionalButtonComponentManager.ColorType.DEFAULT,
                                                plain: false,
                                                disabled: false,
                                                loading: false,
                                                hoverClass: functionalButtonComponentManager.HoverClassType.HOVER_CLASS,
                                                hoverStartTime: 0,
                                                hoverStayTime: 0,
                                                styleConfig: new functionalButtonComponentManager.ButtonConfig()
                                                    .backgroundColor(Color.Transparent)
                                                    .borderWidth(0)
                                                    .borderRadius(20)
                                                    .type(ButtonType.Circle)
                                                    .backgroundImagePosition(Alignment.Center)
                                                    .backgroundImageSize(ImageSize.Cover)
                                                    .height(40)
                                                    .width(40)
                                                    .backgroundImage({ "id": 16777244, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" })
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
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.avatar);
                        Image.height(40);
                        Image.width(40);
                        Image.borderRadius(20);
                        Image.onError((err) => {
                            hilog.info(domainId, logTag, `Avatar image load fail, errMessage is ${err.message}`);
                            // When the avatar address becomes invalid, clear the invalid address.
                            this.onChange(undefined);
                            this.avatar = '';
                        });
                    }, Image);
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777230, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.fontSize(16);
            Text.margin({ left: 12 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777252, "type": 20000, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.fillColor({ "id": 125829120, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Image.opacity(0.2);
            Image.width(12);
            Image.height(24);
        }, Image);
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
