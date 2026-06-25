if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentPage?: PageType;
    silentLoginMap?: Map<string, UserInfo>;
    minorsProtectionMode?: boolean;
    userTurnOffFlag?: boolean;
    lowerAge?: number;
    upperAge?: number;
    statusBarHeight?: number;
    isLandScape?: boolean;
    isPad?: boolean;
    isPhone?: boolean;
    displayWidth?: number;
    mainBoxPadding?: number;
    showMinorsProtectionItem?: boolean;
    currentMode?: AppMode;
    switchToPage?: string;
    cartCount?: number;
}
import hilog from "@ohos:hilog";
import authentication from "@hms:core.authentication";
import minorsProtection from "@hms:core.account.minorsProtection";
import util from "@ohos:util";
import type { BusinessError } from "@ohos:base";
import display from "@ohos:display";
import type { UserInfo } from '../common/UserInfo';
import { HomePage } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/pages/HomePage";
import { MessagePage } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/pages/MessagePage";
import { ModeSwitchPage } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/pages/ModeSwitchPage";
import { ShoppingCartPage } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/pages/ShoppingCartPage";
import { MyPage } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/pages/MyPage";
import { ErrorCode } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/ErrorCodeEntity";
import { CartService } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/services/CartService";
import { OrderService } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/services/OrderService";
import { FavoriteService } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/services/FavoriteService";
import { MessageService } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/services/MessageService";
import { CartManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/CartManager";
const storage: LocalStorage = new LocalStorage();
// Uses persistently stored data to simulate silent sign-in.
PersistentStorage.persistProp('silentLoginMap', new Map<string, UserInfo>([]));
// Flag for disabling the atomic service's youth mode separately.
PersistentStorage.persistProp('userTurnOffFlag', false);
// 当前模式：'shopping' - 常规购物模式，'market' - 市集模式
PersistentStorage.persistProp('currentMode', 'shopping');
const logTag: string = 'Index';
const domainId: number = 0x0000;
// 页面类型定义
type PageType = 'HomePage' | 'MessagePage' | 'ModeSwitchPage' | 'ShoppingCartPage' | 'MyPage';
// 模式类型定义
type AppMode = 'shopping' | 'market';
const CHECK_BIG_DISPLAY: number = 1000;
const CHECK_DEVICE2IN1: number = 1440;
const CHECK_PHONE: number = 600;
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentPage = new ObservedPropertySimplePU('HomePage', this, "currentPage");
        this.__silentLoginMap = this.createStorageProp('silentLoginMap', new Map<string, UserInfo>([]), "silentLoginMap");
        this.__minorsProtectionMode = this.createStorageLink('minorsProtectionMode', false, "minorsProtectionMode");
        this.__userTurnOffFlag = this.createStorageLink('userTurnOffFlag', false, "userTurnOffFlag");
        this.__lowerAge = this.createStorageLink('lowerAge', -1, "lowerAge");
        this.__upperAge = this.createStorageLink('upperAge', -1, "upperAge");
        this.__statusBarHeight = this.createStorageProp('statusBarHeight', 0, "statusBarHeight");
        this.__mainBoxPadding = new ObservedPropertySimplePU(0, this, "mainBoxPadding");
        this.__showMinorsProtectionItem = this.createStorageLink('showMinorsProtectionItem', true, "showMinorsProtectionItem");
        this.__currentMode = this.createStorageLink('currentMode', 'shopping', "currentMode");
        this.__switchToPage = this.createStorageLink('switchToPage', '', "switchToPage");
        this.__cartCount = new ObservedPropertySimplePU(0, this, "cartCount");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.currentPage !== undefined) {
            this.currentPage = params.currentPage;
        }
        if (params.mainBoxPadding !== undefined) {
            this.mainBoxPadding = params.mainBoxPadding;
        }
        if (params.cartCount !== undefined) {
            this.cartCount = params.cartCount;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentPage.purgeDependencyOnElmtId(rmElmtId);
        this.__silentLoginMap.purgeDependencyOnElmtId(rmElmtId);
        this.__minorsProtectionMode.purgeDependencyOnElmtId(rmElmtId);
        this.__userTurnOffFlag.purgeDependencyOnElmtId(rmElmtId);
        this.__lowerAge.purgeDependencyOnElmtId(rmElmtId);
        this.__upperAge.purgeDependencyOnElmtId(rmElmtId);
        this.__statusBarHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__isLandScape.purgeDependencyOnElmtId(rmElmtId);
        this.__isPad.purgeDependencyOnElmtId(rmElmtId);
        this.__isPhone.purgeDependencyOnElmtId(rmElmtId);
        this.__displayWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__mainBoxPadding.purgeDependencyOnElmtId(rmElmtId);
        this.__showMinorsProtectionItem.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__switchToPage.purgeDependencyOnElmtId(rmElmtId);
        this.__cartCount.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentPage.aboutToBeDeleted();
        this.__silentLoginMap.aboutToBeDeleted();
        this.__minorsProtectionMode.aboutToBeDeleted();
        this.__userTurnOffFlag.aboutToBeDeleted();
        this.__lowerAge.aboutToBeDeleted();
        this.__upperAge.aboutToBeDeleted();
        this.__statusBarHeight.aboutToBeDeleted();
        this.__isLandScape.aboutToBeDeleted();
        this.__isPad.aboutToBeDeleted();
        this.__isPhone.aboutToBeDeleted();
        this.__displayWidth.aboutToBeDeleted();
        this.__mainBoxPadding.aboutToBeDeleted();
        this.__showMinorsProtectionItem.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__switchToPage.aboutToBeDeleted();
        this.__cartCount.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentPage: ObservedPropertySimplePU<PageType>; // Current screen.
    get currentPage() {
        return this.__currentPage.get();
    }
    set currentPage(newValue: PageType) {
        this.__currentPage.set(newValue);
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
    private __statusBarHeight: ObservedPropertyAbstractPU<number>;
    get statusBarHeight() {
        return this.__statusBarHeight.get();
    }
    set statusBarHeight(newValue: number) {
        this.__statusBarHeight.set(newValue);
    }
    private __isLandScape: ObservedPropertyAbstractPU<boolean> = this.createLocalStorageLink<boolean>('isLandScape', false, "isLandScape");
    get isLandScape() {
        return this.__isLandScape.get();
    }
    set isLandScape(newValue: boolean) {
        this.__isLandScape.set(newValue);
    }
    private __isPad: ObservedPropertyAbstractPU<boolean> = this.createLocalStorageLink<boolean>('isPad', false, "isPad");
    get isPad() {
        return this.__isPad.get();
    }
    set isPad(newValue: boolean) {
        this.__isPad.set(newValue);
    }
    private __isPhone: ObservedPropertyAbstractPU<boolean> = this.createLocalStorageLink<boolean>('isPhone', false, "isPhone");
    get isPhone() {
        return this.__isPhone.get();
    }
    set isPhone(newValue: boolean) {
        this.__isPhone.set(newValue);
    }
    private __displayWidth: ObservedPropertyAbstractPU<number> = this.createLocalStorageLink<number>('displayWidth', 0, "displayWidth");
    get displayWidth() {
        return this.__displayWidth.get();
    }
    set displayWidth(newValue: number) {
        this.__displayWidth.set(newValue);
    }
    private __mainBoxPadding: ObservedPropertySimplePU<number>;
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
    private __currentMode: ObservedPropertyAbstractPU<AppMode>; // 当前模式
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: AppMode) {
        this.__currentMode.set(newValue);
    }
    private __switchToPage: ObservedPropertyAbstractPU<string>; // 页面跳转目标
    get switchToPage() {
        return this.__switchToPage.get();
    }
    set switchToPage(newValue: string) {
        this.__switchToPage.set(newValue);
    }
    private __cartCount: ObservedPropertySimplePU<number>; // 购物车数量
    get cartCount() {
        return this.__cartCount.get();
    }
    set cartCount(newValue: number) {
        this.__cartCount.set(newValue);
    }
    aboutToAppear() {
        hilog.info(domainId, logTag, 'Index aboutToAppear');
        // Call getMinorsProtectionInfoSync to query the youth mode status in the aboutToAppear lifecycle.
        this.getMinorsProtectionInfoSync();
        // 从持久化存储加载数据
        this.loadPersistedData();
    }
    onPageShow() {
        // Silent login and minors protection check
        this.silentLogin();
        this.showMinorsProtectionItem = this.checkMinorsProtectionSupportStatus();
        // 处理从其他页面跳转回来的页面切换
        if (this.switchToPage === 'ShoppingCartPage') {
            this.currentPage = 'ShoppingCartPage';
            AppStorage.setOrCreate('switchToPage', '');
        }
        // 更新购物车数量
        this.updateCartCount();
    }
    // 更新购物车数量（用于导航栏Badge显示）
    updateCartCount() {
        this.cartCount = CartManager.getInstance().getCartCount(this.currentMode);
    }
    /**
     * 从持久化存储加载购物车、订单、收藏、消息数据
     */
    private async loadPersistedData(): Promise<void> {
        try {
            await CartService.getInstance().loadCartFromStorage();
            await OrderService.getInstance().loadOrdersFromStorage();
            await FavoriteService.getInstance().loadFavoritesFromStorage();
            await MessageService.getInstance().loadMessagesFromStorage();
            hilog.info(domainId, logTag, 'Persisted data loaded successfully');
        }
        catch (error) {
            hilog.error(domainId, logTag, `Failed to load persisted data. err: ${JSON.stringify(error)}`);
        }
    }
    // Obtain information about the youth mode.
    private getMinorsProtectionInfoSync() {
        if (canIUse('SystemCapability.AuthenticationServices.HuaweiID.MinorsProtection')) {
            // Check whether the current device supports the youth mode.
            try {
                if (!minorsProtection.supportMinorsMode()) {
                    hilog.info(domainId, logTag, 'The current device environment does not support the youth mode, please check the current device environment.');
                    return;
                }
                // Call getMinorsProtectionInfoSync to query the youth mode status.
                const minorsProtectionInfo: minorsProtection.MinorsProtectionInfo = minorsProtection.getMinorsProtectionInfoSync();
                // Obtain the youth mode status.
                const minorsProtectionMode: boolean = minorsProtectionInfo.minorsProtectionMode;
                hilog.info(domainId, logTag, `Succeeded in getting minorsProtectionMode is: ${minorsProtectionMode}`);
                this.minorsProtectionMode = minorsProtectionInfo.minorsProtectionMode;
                // The youth mode has been enabled. Obtain the age group information.
                if (minorsProtectionMode) {
                    const ageGroup: minorsProtection.AgeGroup | undefined = minorsProtectionInfo.ageGroup;
                    if (ageGroup) {
                        this.lowerAge = ageGroup.lowerAge;
                        this.upperAge = ageGroup.upperAge;
                        hilog.info(domainId, logTag, `Succeeded in getting lowerAge is: ${ageGroup.lowerAge}`);
                        hilog.info(domainId, logTag, `Succeeded in getting upperAge is: ${ageGroup.upperAge}`);
                    }
                }
                else {
                    /*
                     * The youth mode is not enabled on the device.
                     * It is recommended that the atomic service follow the youth mode status on the device
                     * and display all content without age restrictions.
                     * The device's youth mode is disabled.
                     * Set the flag for disabling the atomic service's youth mode separately to false.
                     * Then, the atomic service will follow the device's youth mode status.
                     * */
                    this.userTurnOffFlag = false;
                }
            }
            catch (error) {
                hilog.error(domainId, logTag, `Failed to invoke supportMinorsMode or getMinorsProtectionInfoSync. errCode: ${error.code}, message: ${error.message}`);
            }
        }
        else {
            hilog.info(domainId, logTag, 'The current device does not support the invoking of the getMinorsProtectionInfoSync interface.');
        }
    }
    // Check whether the current device supports the youth mode.
    private checkMinorsProtectionSupportStatus(): boolean {
        /*
         * Use the canIUse and supportMinorsMode APIs to check whether the device supports the youth mode.
         * If not, the youth mode entry will not be displayed.
         * */
        if (canIUse('SystemCapability.AuthenticationServices.HuaweiID.MinorsProtection')) {
            try {
                return minorsProtection.supportMinorsMode();
            }
            catch (error) {
                hilog.error(domainId, logTag, `Failed to invoke supportMinorsMode. errCode: ${error.code}, message: ${error.message}`);
            }
        }
        return false;
    }
    // Handle the error.
    dealAllError(error: BusinessError): void {
        hilog.error(domainId, logTag, `Failed to login, errorCode: ${error.code}, errorMsg: ${error.message}`);
        /*
         * In app sign-in scenarios involving UI interactions,
         * it is recommended to guide users with the following error code prompts:
         * */
        if (error.code === ErrorCode.ERROR_CODE_LOGIN_OUT) {
            /*
             * The user has not signed in with a HUAWEI ID.
             * Use a HUAWEI ID to sign in and try again, or sign in to the app in another way.
             * */
        }
        else if (error.code === ErrorCode.AUTHENTICATION_NETWORK_ERROR) {
            // Network exception. Check the current network status and try again, or sign in to the app in another way.       
        }
        else if (error.code === ErrorCode.ERROR_CODE_INTERNAL_ERROR) {
            // Sign-in failed. Try another sign-in option.
        }
        else if (error.code === ErrorCode.ERROR_CODE_USER_CANCEL) {
            // The user cancels the authorization.
        }
        else if (error.code === ErrorCode.ERROR_CODE_SYSTEM_SERVICE) {
            // System service exception. Try again later or sign in to the app in another way.
        }
        else if (error.code === ErrorCode.ERROR_CODE_REQUEST_REFUSE) {
            // Repeated request. No further action is needed.
        }
        else {
            // Sign-in failed. Try another sign-in option.
        }
    }
    // Silent sign-in.
    silentLogin() {
        // Execute the sign-in request.
        try {
            // Create a sign-in request and set parameters.
            const loginRequest = new authentication.HuaweiIDProvider().createLoginWithHuaweiIDRequest();
            /*
             * false: If the user has not signed in to the HUAWEI ID,
             * the HUAWEI ID sign-in screen will not be displayed. Instead, error code 1001502001 will be returned.
             * */
            loginRequest.forceLogin = false;
            // Used to prevent cross-site request forgery. You are advised to assign a value to state as follows:
            loginRequest.state = util.generateRandomUUID();
            // Execute the sign-in request.
            const controller = new authentication.AuthenticationController();
            controller.executeRequest(loginRequest).then((response: authentication.LoginWithHuaweiIDResponse) => {
                const loginWithHuaweiIDResponse = response as authentication.LoginWithHuaweiIDResponse;
                const state = loginWithHuaweiIDResponse.state;
                if (state && loginRequest.state !== state) {
                    hilog.error(domainId, logTag, `Failed to login. The state is different, response state: ${state}`);
                    return;
                }
                const loginWithHuaweiIDCredential = loginWithHuaweiIDResponse.data!;
                const code = loginWithHuaweiIDCredential.authorizationCode;
                const unionID = loginWithHuaweiIDCredential.unionID;
                // Process authorization code.
                // 在生产环境中，应将 authorizationCode 发送到后端服务器，
                // 由后端调用华为 Account Kit 服务端 API 换取 access token，
                // 再使用 access token 获取用户信息。
                hilog.info(domainId, logTag, `Silent login success, authorizationCode: ${code ? '获取成功' : '为空'}`);
                console.info(`Silent login success, unionID: ${unionID}`);
                // Update the information about the currently signed-in user.
                AppStorage.setOrCreate('currentUser', unionID);
                if (this.silentLoginMap.has(unionID)) {
                    /*
                     * If the information about the current user is found in the persistently stored data,
                     * obtain the information and store it in AppStorage.
                     * */
                    AppStorage.setOrCreate('userInfo', this.silentLoginMap.get(unionID)!);
                }
                else {
                    // Create an empty object if the target is not found.
                    AppStorage.setOrCreate('userInfo', {});
                }
            }).catch((error: BusinessError) => {
                this.dealAllError(error);
            });
        }
        catch (error) {
            hilog.error(domainId, logTag, `Failed to login, err: ${JSON.stringify(error)}`);
        }
    }
    // Update the screen information.
    private setDeviceDisplayData() {
        try {
            const displayObj: display.Display = display.getDefaultDisplaySync();
            const orientation: display.Orientation = displayObj.orientation;
            const width: number = this.getUIContext().px2vp(displayObj.width);
            const height: number = this.getUIContext().px2vp(displayObj.height);
            this.displayWidth = width;
            this.isPhone = width < CHECK_PHONE || height < CHECK_PHONE;
            this.isLandScape =
                orientation === display.Orientation.LANDSCAPE || orientation === display.Orientation.LANDSCAPE_INVERTED;
            this.isPad = width > CHECK_BIG_DISPLAY && width < CHECK_DEVICE2IN1;
        }
        catch (error) {
            hilog.error(domainId, logTag, `Failed to get the default display object. Code: ${error?.code}, message: ${error?.message}`);
        }
    }
    private getMainBoxPadding(): number {
        // Constant used to define page width and margins.
        const FIRST_DISPLAY_WIDTH: number = 400;
        const SECOND_DISPLAY_WIDTH: number = 800;
        // Padding used for screens of different widths.
        const FIRST_PADDING: number = 16;
        const SECOND_PADDING: number = 24;
        const THIRD_PADDING: number = 32;
        if (this.displayWidth <= FIRST_DISPLAY_WIDTH) {
            return FIRST_PADDING;
        }
        else if (this.displayWidth > FIRST_DISPLAY_WIDTH && this.displayWidth <= SECOND_DISPLAY_WIDTH) {
            return SECOND_PADDING;
        }
        else {
            return THIRD_PADDING;
        }
    }
    // 获取页面标题
    private getPageTitle(): Resource {
        if (this.currentPage === 'HomePage') {
            return { "id": 16777257, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else if (this.currentPage === 'MessagePage') {
            return { "id": 16777258, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else if (this.currentPage === 'ModeSwitchPage') {
            // 根据当前模式显示不同的标题
            return this.currentMode === 'shopping' ? { "id": 16777272, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 16777275, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else if (this.currentPage === 'ShoppingCartPage') {
            return { "id": 16777260, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else {
            return { "id": 16777236, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
    }
    // 获取导航栏图标
    private getNavIcon(pageName: PageType): Resource {
        if (pageName === 'HomePage') {
            return this.currentPage === pageName ? { "id": 16777264, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 16777263, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else if (pageName === 'MessagePage') {
            return this.currentPage === pageName ? { "id": 16777266, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 16777265, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else if (pageName === 'ModeSwitchPage') {
            return this.currentPage === pageName ? { "id": 16777268, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 16777267, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else if (pageName === 'ShoppingCartPage') {
            return this.currentPage === pageName ? { "id": 16777262, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 16777261, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else {
            return this.currentPage === pageName ? { "id": 16777270, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 16777269, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
    }
    // 获取导航栏文字
    private getNavText(pageName: PageType): Resource {
        if (pageName === 'HomePage') {
            return { "id": 16777257, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else if (pageName === 'MessagePage') {
            return { "id": 16777258, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else if (pageName === 'ModeSwitchPage') {
            // 根据当前模式显示不同的文字
            return this.currentMode === 'shopping' ? { "id": 16777272, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 16777275, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else if (pageName === 'ShoppingCartPage') {
            return { "id": 16777260, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
        else {
            return { "id": 16777236, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" };
        }
    }
    NavBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({
                direction: this.isLandScape && this.isPad ? FlexDirection.Column : FlexDirection.Row,
                justifyContent: this.isLandScape && this.isPad ? FlexAlign.Center : FlexAlign.SpaceAround
            });
            Flex.shadow({
                type: ShadowType.COLOR,
                color: '#ff807b7b',
                offsetX: 0,
                offsetY: 0,
                fill: true
            } as ShadowOptions);
            Flex.width(this.isLandScape && this.isPad ? 96 : '100%');
            Flex.height(this.isLandScape && this.isPad ? '100%' : 80);
            Flex.alignSelf(ItemAlign.Center);
            Flex.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Flex);
        this.Unit.bind(this)('HomePage');
        this.Unit.bind(this)('MessagePage');
        this.Unit.bind(this)('ModeSwitchPage');
        this.Unit.bind(this)('ShoppingCartPage');
        this.Unit.bind(this)('MyPage');
        Flex.pop();
    }
    Unit(routerName: PageType, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Center);
            Column.width(this.isLandScape && this.isPad ? '100%' : '20%');
            Column.height(this.isLandScape && this.isPad ? 80 : 60);
            Column.justifyContent(FlexAlign.Center);
            Column.padding({
                top: 8,
                bottom: 8
            });
            Column.id('unit' + routerName);
            Column.onClick(() => {
                this.currentPage = routerName;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (routerName === 'ShoppingCartPage' && this.cartCount > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Badge.create({
                            count: this.cartCount,
                            position: BadgePosition.RightTop,
                            style: { badgeSize: 16, badgeColor: '#FF5722' }
                        });
                    }, Badge);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.getNavIcon(routerName));
                        Image.width(24);
                        Image.height(24);
                        Image.opacity(this.currentPage === routerName ? 1 : 0.6);
                        Image.draggable(false);
                    }, Image);
                    Badge.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.getNavIcon(routerName));
                        Image.width(24);
                        Image.height(24);
                        Image.opacity(this.currentPage === routerName ? 1 : 0.6);
                        Image.draggable(false);
                    }, Image);
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getNavText(routerName));
            Text.fontSize(10);
            Text.lineHeight(13);
            Text.fontColor(this.currentPage === routerName ? { "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" } : { "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Regular);
            Text.textAlign(TextAlign.Center);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({
                direction: this.isLandScape && this.isPad ? FlexDirection.RowReverse : FlexDirection.Column,
                justifyContent: FlexAlign.SpaceAround
            });
            Flex.padding({ top: this.isLandScape && this.isPhone ? 0 : this.getUIContext().px2vp(this.statusBarHeight) });
            Flex.onSizeChange(() => {
                this.setDeviceDisplayData();
                this.mainBoxPadding = this.getMainBoxPadding();
            });
            Flex.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.Start);
            Row.height(36);
            Row.margin({ top: 10, bottom: 10 });
            Row.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getPageTitle());
            Text.fontSize(28);
            Text.lineHeight(36);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.layoutWeight(1);
            Row.padding({ bottom: this.isLandScape && this.isPad ? 34 : 0 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentPage === 'HomePage') {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new HomePage(this, { mainBoxPadding: this.mainBoxPadding, currentMode: this.currentMode }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 428, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        mainBoxPadding: this.mainBoxPadding,
                                        currentMode: this.currentMode
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    mainBoxPadding: this.mainBoxPadding, currentMode: this.currentMode
                                });
                            }
                        }, { name: "HomePage" });
                    }
                });
            }
            else if (this.currentPage === 'MessagePage') {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new MessagePage(this, { mainBoxPadding: this.mainBoxPadding }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 430, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        mainBoxPadding: this.mainBoxPadding
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    mainBoxPadding: this.mainBoxPadding
                                });
                            }
                        }, { name: "MessagePage" });
                    }
                });
            }
            else if (this.currentPage === 'ModeSwitchPage') {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new ModeSwitchPage(this, { mainBoxPadding: this.mainBoxPadding, currentMode: this.currentMode }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 432, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        mainBoxPadding: this.mainBoxPadding,
                                        currentMode: this.currentMode
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    mainBoxPadding: this.mainBoxPadding, currentMode: this.currentMode
                                });
                            }
                        }, { name: "ModeSwitchPage" });
                    }
                });
            }
            else if (this.currentPage === 'ShoppingCartPage') {
                this.ifElseBranchUpdateFunction(3, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new ShoppingCartPage(this, { mainBoxPadding: this.mainBoxPadding, currentMode: this.currentMode }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 434, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        mainBoxPadding: this.mainBoxPadding,
                                        currentMode: this.currentMode
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    mainBoxPadding: this.mainBoxPadding, currentMode: this.currentMode
                                });
                            }
                        }, { name: "ShoppingCartPage" });
                    }
                });
            }
            else if (this.currentPage === 'MyPage') {
                this.ifElseBranchUpdateFunction(4, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new MyPage(this, { mainBoxPadding: this.mainBoxPadding }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 436, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        mainBoxPadding: this.mainBoxPadding
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    mainBoxPadding: this.mainBoxPadding
                                });
                            }
                        }, { name: "MyPage" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(5, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.NavBar.bind(this)();
        Row.pop();
        Flex.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
if (storage && storage.routeName != undefined && storage.storage != undefined) {
    registerNamedRoute(() => new Index(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : storage.storage), storage.routeName, { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
}
else if (storage && storage.routeName != undefined && storage.storage == undefined) {
    registerNamedRoute(() => new Index(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : storage.storage), storage.routeName, { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
}
else if (storage && storage.routeName == undefined && storage.storage != undefined) {
    registerNamedRoute(() => new Index(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : storage.storage), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
}
else if (storage && storage.useSharedStorage != undefined) {
    registerNamedRoute(() => new Index(undefined, {}, storage.useSharedStorage ? LocalStorage.getShared() : undefined), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
}
else {
    registerNamedRoute(() => new Index(undefined, {}, storage), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
}
