if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PersonalInfoPage_Params {
    userInfo?: UserInfo;
    silentLoginMap?: Map<string, UserInfo>;
    minorsProtectionMode?: boolean;
    availableTimeMode?: boolean;
    userTurnOffFlag?: boolean;
    lowerAge?: number;
    upperAge?: number;
    mainBoxPadding?: number;
    showMinorsProtectionItem?: boolean;
    avatar?: string;
}
import hilog from "@ohos:hilog";
import type { UserInfo } from '../common/UserInfo';
import { Avatar } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/components/Avatar";
import { Phone } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/components/Phone";
import { Address } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/components/Address";
import { InvoiceTitle } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/components/InvoiceTitle";
import { MinorsProtection } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/components/MinorsProtection";
const logTag: string = 'PersonalInfoPage';
const domainId: number = 0x0000;
export class PersonalInfoPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__userInfo = this.createStorageLink('userInfo', {}, "userInfo");
        this.__silentLoginMap = this.createStorageLink('silentLoginMap', new Map<string, UserInfo>([]), "silentLoginMap");
        this.__minorsProtectionMode = this.createStorageLink('minorsProtectionMode', false, "minorsProtectionMode");
        this.__availableTimeMode = this.createStorageLink('availableTimeMode', true, "availableTimeMode");
        this.__userTurnOffFlag = this.createStorageLink('userTurnOffFlag', false, "userTurnOffFlag");
        this.__lowerAge = this.createStorageLink('lowerAge', -1, "lowerAge");
        this.__upperAge = this.createStorageLink('upperAge', -1, "upperAge");
        this.__mainBoxPadding = new SynchedPropertySimpleOneWayPU(params.mainBoxPadding, this, "mainBoxPadding");
        this.__showMinorsProtectionItem = this.createStorageLink('showMinorsProtectionItem', true, "showMinorsProtectionItem");
        this.__avatar = new ObservedPropertySimplePU('', this, "avatar");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("userInfo", this.updateSilentLoginMap);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PersonalInfoPage_Params) {
        if (params.avatar !== undefined) {
            this.avatar = params.avatar;
        }
    }
    updateStateVars(params: PersonalInfoPage_Params) {
        this.__mainBoxPadding.reset(params.mainBoxPadding);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__userInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__silentLoginMap.purgeDependencyOnElmtId(rmElmtId);
        this.__minorsProtectionMode.purgeDependencyOnElmtId(rmElmtId);
        this.__availableTimeMode.purgeDependencyOnElmtId(rmElmtId);
        this.__userTurnOffFlag.purgeDependencyOnElmtId(rmElmtId);
        this.__lowerAge.purgeDependencyOnElmtId(rmElmtId);
        this.__upperAge.purgeDependencyOnElmtId(rmElmtId);
        this.__mainBoxPadding.purgeDependencyOnElmtId(rmElmtId);
        this.__showMinorsProtectionItem.purgeDependencyOnElmtId(rmElmtId);
        this.__avatar.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__userInfo.aboutToBeDeleted();
        this.__silentLoginMap.aboutToBeDeleted();
        this.__minorsProtectionMode.aboutToBeDeleted();
        this.__availableTimeMode.aboutToBeDeleted();
        this.__userTurnOffFlag.aboutToBeDeleted();
        this.__lowerAge.aboutToBeDeleted();
        this.__upperAge.aboutToBeDeleted();
        this.__mainBoxPadding.aboutToBeDeleted();
        this.__showMinorsProtectionItem.aboutToBeDeleted();
        this.__avatar.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __userInfo: ObservedPropertyAbstractPU<UserInfo>;
    get userInfo() {
        return this.__userInfo.get();
    }
    set userInfo(newValue: UserInfo) {
        this.__userInfo.set(newValue);
    }
    private __silentLoginMap: ObservedPropertyAbstractPU<Map<string, UserInfo>>;
    get silentLoginMap() {
        return this.__silentLoginMap.get();
    }
    set silentLoginMap(newValue: Map<string, UserInfo>) {
        this.__silentLoginMap.set(newValue);
    }
    private __minorsProtectionMode: ObservedPropertyAbstractPU<boolean>; // Youth mode status.
    get minorsProtectionMode() {
        return this.__minorsProtectionMode.get();
    }
    set minorsProtectionMode(newValue: boolean) {
        this.__minorsProtectionMode.set(newValue);
    }
    private __availableTimeMode: ObservedPropertyAbstractPU<boolean>; // Screen time limit status.
    get availableTimeMode() {
        return this.__availableTimeMode.get();
    }
    set availableTimeMode(newValue: boolean) {
        this.__availableTimeMode.set(newValue);
    }
    /*
     * If the flag for disabling the atomic service's youth mode separately is true,
     * this indicates that the user has disabled the youth mode in the atomic service.
     * */
    private __userTurnOffFlag: ObservedPropertyAbstractPU<boolean>;
    get userTurnOffFlag() {
        return this.__userTurnOffFlag.get();
    }
    set userTurnOffFlag(newValue: boolean) {
        this.__userTurnOffFlag.set(newValue);
    }
    private __lowerAge: ObservedPropertyAbstractPU<number>; // Lower limit of the obtained age group.
    get lowerAge() {
        return this.__lowerAge.get();
    }
    set lowerAge(newValue: number) {
        this.__lowerAge.set(newValue);
    }
    private __upperAge: ObservedPropertyAbstractPU<number>; // Upper limit of the obtained age group.
    get upperAge() {
        return this.__upperAge.get();
    }
    set upperAge(newValue: number) {
        this.__upperAge.set(newValue);
    }
    private __mainBoxPadding: SynchedPropertySimpleOneWayPU<number>;
    get mainBoxPadding() {
        return this.__mainBoxPadding.get();
    }
    set mainBoxPadding(newValue: number) {
        this.__mainBoxPadding.set(newValue);
    }
    private __showMinorsProtectionItem: ObservedPropertyAbstractPU<boolean>; // Determine whether to show the entry to youth mode settings.
    get showMinorsProtectionItem() {
        return this.__showMinorsProtectionItem.get();
    }
    set showMinorsProtectionItem(newValue: boolean) {
        this.__showMinorsProtectionItem.set(newValue);
    }
    private __avatar: ObservedPropertySimplePU<string>;
    get avatar() {
        return this.__avatar.get();
    }
    set avatar(newValue: string) {
        this.__avatar.set(newValue);
    }
    // Update persistently stored data silentLoginMap.
    updateSilentLoginMap() {
        const unionID = AppStorage.get('currentUser') as string;
        this.silentLoginMap.set(unionID, this.userInfo);
    }
    // Check whether user information is stored in userInfo.
    private hasCache(): boolean {
        return this.userInfo.address !== undefined ||
            this.userInfo.invoiceTitle !== undefined ||
            this.userInfo.phone !== undefined ||
            this.userInfo.avatar !== undefined;
    }
    // Remove the association.
    private disassociate() {
        // Delete personal information from AppStorage.
        this.userInfo = {};
        this.avatar = '';
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // Avatar.
                    Avatar(this, {
                        avatar: this.__avatar,
                        onChange: (avatar) => {
                            hilog.info(domainId, logTag, `Avatar has updated: ${avatar}`);
                            this.userInfo.avatar = avatar;
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PersonalInfoPage.ets", line: 59, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            avatar: this.avatar,
                            onChange: (avatar) => {
                                hilog.info(domainId, logTag, `Avatar has updated: ${avatar}`);
                                this.userInfo.avatar = avatar;
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "Avatar" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // Mobile number.
                    Phone(this, {
                        phone: this.userInfo.phone,
                        onChange: (phone) => {
                            hilog.info(domainId, logTag, `Phone number has updated: ${phone}`);
                            this.userInfo.phone = phone;
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PersonalInfoPage.ets", line: 68, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            phone: this.userInfo.phone,
                            onChange: (phone) => {
                                hilog.info(domainId, logTag, `Phone number has updated: ${phone}`);
                                this.userInfo.phone = phone;
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        phone: this.userInfo.phone
                    });
                }
            }, { name: "Phone" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // Shipping address.
                    Address(this, {
                        address: this.userInfo.address,
                        onChange: (address) => {
                            hilog.info(domainId, logTag, `Address has updated`);
                            this.userInfo.address = address;
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PersonalInfoPage.ets", line: 77, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            address: this.userInfo.address,
                            onChange: (address) => {
                                hilog.info(domainId, logTag, `Address has updated`);
                                this.userInfo.address = address;
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        address: this.userInfo.address
                    });
                }
            }, { name: "Address" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // Invoice title.
                    InvoiceTitle(this, {
                        invoiceTitle: this.userInfo.invoiceTitle,
                        onChange: (invoiceTitle) => {
                            hilog.info(domainId, logTag, `InvoiceTitle has updated`);
                            this.userInfo.invoiceTitle = invoiceTitle;
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PersonalInfoPage.ets", line: 86, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            invoiceTitle: this.userInfo.invoiceTitle,
                            onChange: (invoiceTitle) => {
                                hilog.info(domainId, logTag, `InvoiceTitle has updated`);
                                this.userInfo.invoiceTitle = invoiceTitle;
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        invoiceTitle: this.userInfo.invoiceTitle
                    });
                }
            }, { name: "InvoiceTitle" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Youth mode switch.
            if (this.showMinorsProtectionItem) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new MinorsProtection(this, {
                                    minorsProtectionMode: this.__minorsProtectionMode,
                                    availableTimeMode: this.__availableTimeMode,
                                    userTurnOffFlag: this.__userTurnOffFlag,
                                    lowerAge: this.__lowerAge,
                                    upperAge: this.__upperAge
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/PersonalInfoPage.ets", line: 96, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        minorsProtectionMode: this.minorsProtectionMode,
                                        availableTimeMode: this.availableTimeMode,
                                        userTurnOffFlag: this.userTurnOffFlag,
                                        lowerAge: this.lowerAge,
                                        upperAge: this.upperAge
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "MinorsProtection" });
                    }
                });
            }
            // Remove the association.
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Remove the association.
            Row.create();
            // Remove the association.
            Row.padding({
                bottom: 8,
                top: 24
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ stateEffect: this.hasCache() });
            Button.backgroundColor({ "id": 125829510, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Button.fontColor({ "id": 125830979, "type": 10001, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Button.width('100%');
            Button.height(40);
            Button.opacity(this.hasCache() ? 1 : 0.4);
            Button.constraintSize({
                maxWidth: 448
            });
            Button.id('disassociateButton');
            Button.onClick(() => {
                this.disassociate();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777228, "type": 10003, params: [], "bundleName": "com.atomicservice.account_atomicservice_sample", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        Button.pop();
        // Remove the association.
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.layoutWeight(1);
        }, Row);
        Row.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
