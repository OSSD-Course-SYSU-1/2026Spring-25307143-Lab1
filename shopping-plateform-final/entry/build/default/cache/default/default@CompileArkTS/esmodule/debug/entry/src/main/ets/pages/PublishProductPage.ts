if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface PublishProductPage_Params {
    productImage?: string;
    productName?: string;
    productPrice?: string;
    shippingMethod?: string;
    shippingAddress?: string;
    productDescription?: string;
    showImagePicker?: boolean;
    context?: common.UIAbilityContext;
}
import camera from "@ohos:multimedia.camera";
import picker from "@ohos:multimedia.cameraPicker";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
import type common from "@ohos:app.ability.common";
import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type { Permissions } from "@ohos:abilityAccessCtrl";
import type { BusinessError } from "@ohos:base";
import router from "@ohos:router";
import { AccountManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/AccountManager";
import { ResaleManager } from "@bundle:com.atomicservice.6917609041042536136/entry/ets/common/ResaleManager";
class PublishProductPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__productImage = new ObservedPropertySimplePU('', this, "productImage");
        this.__productName = new ObservedPropertySimplePU('', this, "productName");
        this.__productPrice = new ObservedPropertySimplePU('', this, "productPrice");
        this.__shippingMethod = new ObservedPropertySimplePU('快递', this, "shippingMethod");
        this.__shippingAddress = new ObservedPropertySimplePU('', this, "shippingAddress");
        this.__productDescription = new ObservedPropertySimplePU('', this, "productDescription");
        this.__showImagePicker = new ObservedPropertySimplePU(false, this, "showImagePicker");
        this.context = getContext(this) as common.UIAbilityContext;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: PublishProductPage_Params) {
        if (params.productImage !== undefined) {
            this.productImage = params.productImage;
        }
        if (params.productName !== undefined) {
            this.productName = params.productName;
        }
        if (params.productPrice !== undefined) {
            this.productPrice = params.productPrice;
        }
        if (params.shippingMethod !== undefined) {
            this.shippingMethod = params.shippingMethod;
        }
        if (params.shippingAddress !== undefined) {
            this.shippingAddress = params.shippingAddress;
        }
        if (params.productDescription !== undefined) {
            this.productDescription = params.productDescription;
        }
        if (params.showImagePicker !== undefined) {
            this.showImagePicker = params.showImagePicker;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
    }
    updateStateVars(params: PublishProductPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__productImage.purgeDependencyOnElmtId(rmElmtId);
        this.__productName.purgeDependencyOnElmtId(rmElmtId);
        this.__productPrice.purgeDependencyOnElmtId(rmElmtId);
        this.__shippingMethod.purgeDependencyOnElmtId(rmElmtId);
        this.__shippingAddress.purgeDependencyOnElmtId(rmElmtId);
        this.__productDescription.purgeDependencyOnElmtId(rmElmtId);
        this.__showImagePicker.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__productImage.aboutToBeDeleted();
        this.__productName.aboutToBeDeleted();
        this.__productPrice.aboutToBeDeleted();
        this.__shippingMethod.aboutToBeDeleted();
        this.__shippingAddress.aboutToBeDeleted();
        this.__productDescription.aboutToBeDeleted();
        this.__showImagePicker.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __productImage: ObservedPropertySimplePU<string>;
    get productImage() {
        return this.__productImage.get();
    }
    set productImage(newValue: string) {
        this.__productImage.set(newValue);
    }
    private __productName: ObservedPropertySimplePU<string>;
    get productName() {
        return this.__productName.get();
    }
    set productName(newValue: string) {
        this.__productName.set(newValue);
    }
    private __productPrice: ObservedPropertySimplePU<string>;
    get productPrice() {
        return this.__productPrice.get();
    }
    set productPrice(newValue: string) {
        this.__productPrice.set(newValue);
    }
    private __shippingMethod: ObservedPropertySimplePU<string>;
    get shippingMethod() {
        return this.__shippingMethod.get();
    }
    set shippingMethod(newValue: string) {
        this.__shippingMethod.set(newValue);
    }
    private __shippingAddress: ObservedPropertySimplePU<string>;
    get shippingAddress() {
        return this.__shippingAddress.get();
    }
    set shippingAddress(newValue: string) {
        this.__shippingAddress.set(newValue);
    }
    private __productDescription: ObservedPropertySimplePU<string>;
    get productDescription() {
        return this.__productDescription.get();
    }
    set productDescription(newValue: string) {
        this.__productDescription.set(newValue);
    }
    private __showImagePicker: ObservedPropertySimplePU<boolean>;
    get showImagePicker() {
        return this.__showImagePicker.get();
    }
    set showImagePicker(newValue: boolean) {
        this.__showImagePicker.set(newValue);
    }
    private context: common.UIAbilityContext;
    // 请求权限
    async requestPermissions(): Promise<boolean> {
        const permissions: Permissions[] = ['ohos.permission.CAMERA', 'ohos.permission.READ_MEDIA'];
        const atManager = abilityAccessCtrl.createAtManager();
        try {
            const grantStatus = await atManager.requestPermissionsFromUser(this.context, permissions);
            return grantStatus.authResults.every(result => result === 0);
        }
        catch (error) {
            const err = error as BusinessError;
            console.error('Request permissions failed: ' + err.message);
            return false;
        }
    }
    // 拍照
    async takePhoto() {
        try {
            const pickerProfile: picker.PickerProfile = {
                cameraPosition: camera.CameraPosition.CAMERA_POSITION_BACK
            };
            const pickerResult: picker.PickerResult = await picker.pick(this.context, [picker.PickerMediaType.PHOTO], pickerProfile);
            if (pickerResult && pickerResult.resultCode === 0 && pickerResult.resultUri) {
                this.productImage = pickerResult.resultUri;
                this.showImagePicker = false;
            }
        }
        catch (error) {
            const err = error as BusinessError;
            console.error('Take photo failed: ' + err.message);
        }
    }
    // 从图库选择
    async chooseFromGallery() {
        try {
            const photoSelectOptions: photoAccessHelper.PhotoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
            photoSelectOptions.MIMEType = photoAccessHelper.PhotoViewMIMETypes.IMAGE_TYPE;
            photoSelectOptions.maxSelectNumber = 1;
            const photoPicker: photoAccessHelper.PhotoViewPicker = new photoAccessHelper.PhotoViewPicker();
            const photoSelectResult: photoAccessHelper.PhotoSelectResult = await photoPicker.select(photoSelectOptions);
            if (photoSelectResult && photoSelectResult.photoUris && photoSelectResult.photoUris.length > 0) {
                this.productImage = photoSelectResult.photoUris[0];
                this.showImagePicker = false;
            }
        }
        catch (error) {
            const err = error as BusinessError;
            console.error('Choose from gallery failed: ' + err.message);
        }
    }
    // 发布商品
    publishProduct() {
        if (!this.productImage || !this.productName || !this.productPrice || !this.shippingAddress) {
            AlertDialog.show({
                title: '提示',
                message: '请填写完整的商品信息',
                autoCancel: true,
                alignment: DialogAlignment.Center
            });
            return;
        }
        const price = parseFloat(this.productPrice);
        if (isNaN(price) || price <= 0) {
            AlertDialog.show({
                title: '提示',
                message: '请输入有效的价格',
                autoCancel: true,
                alignment: DialogAlignment.Center
            });
            return;
        }
        // 保存到ResaleManager
        const currentUser = AccountManager.getInstance().getCurrentUser();
        const sellerId = currentUser ? currentUser.userId : 'guest_' + Date.now();
        const sellerName = currentUser ? currentUser.username : '访客';
        ResaleManager.getInstance().createResaleOrder('manual_' + Date.now(), {
            id: 'product_' + Date.now(),
            name: this.productName,
            price: price,
            imageUrl: this.productImage,
            quantity: 1,
            shopName: sellerName
        }, price, this.productDescription || this.productName, sellerId, sellerName);
        // 发布成功后返回
        AlertDialog.show({
            title: '成功',
            message: '商品发布成功！',
            autoCancel: false,
            alignment: DialogAlignment.Center,
            primaryButton: {
                value: '确定',
                action: () => {
                    router.back();
                }
            }
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Column.bindSheet({ value: this.showImagePicker, changeEvent: newValue => { this.showImagePicker = newValue; } }, { builder: () => {
                    this.ImagePickerSheet.call(this);
                } }, {
                height: 200,
                backgroundColor: { "id": 125829552, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" },
                dragBar: true
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题栏
            Row.create();
            // 标题栏
            Row.width('100%');
            // 标题栏
            Row.justifyContent(FlexAlign.Center);
            // 标题栏
            Row.height(56);
            // 标题栏
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777296, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontSize(20);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 16, bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品图片
            Column.create();
            // 商品图片
            Column.width('100%');
            // 商品图片
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.productImage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.productImage);
                        Image.width('100%');
                        Image.height(200);
                        Image.objectFit(ImageFit.Cover);
                        Image.borderRadius(8);
                        Image.onClick(() => {
                            this.showImagePicker = true;
                        });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height(200);
                        Column.justifyContent(FlexAlign.Center);
                        Column.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Column.borderRadius(8);
                        Column.onClick(() => {
                            this.showImagePicker = true;
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Image.width(48);
                        Image.height(48);
                        Image.opacity(0.5);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create({ "id": 16777290, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Text.fontSize(14);
                        Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
                        Text.margin({ top: 8 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 商品图片
        Column.pop();
        // 商品名称
        this.InputItem.bind(this)({ "id": 16777292, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" }, this.productName, (value: string) => {
            this.productName = value;
        });
        // 商品价格
        this.InputItem.bind(this)({ "id": 16777293, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" }, this.productPrice, (value: string) => {
            this.productPrice = value;
        }, 'number');
        // 发货方式
        this.SelectItem.bind(this)({ "id": 16777300, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" }, this.shippingMethod, ['快递', '自提', '同城配送'], (value: string) => {
            this.shippingMethod = value;
        });
        // 发货地址
        this.InputItem.bind(this)({ "id": 16777299, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" }, this.shippingAddress, (value: string) => {
            this.shippingAddress = value;
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品描述
            Column.create();
            // 商品描述
            Column.width('100%');
            // 商品描述
            Column.alignItems(HorizontalAlign.Start);
            // 商品描述
            Column.margin({ bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777289, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ placeholder: { "id": 16777287, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" }, text: this.productDescription });
            TextArea.width('100%');
            TextArea.height(120);
            TextArea.fontSize(14);
            TextArea.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            TextArea.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            TextArea.borderRadius(8);
            TextArea.onChange((value: string) => {
                this.productDescription = value;
            });
        }, TextArea);
        // 商品描述
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发布按钮
            Button.createWithLabel({ "id": 16777295, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            // 发布按钮
            Button.width('100%');
            // 发布按钮
            Button.height(48);
            // 发布按钮
            Button.fontSize(16);
            // 发布按钮
            Button.fontColor(Color.White);
            // 发布按钮
            Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            // 发布按钮
            Button.borderRadius(24);
            // 发布按钮
            Button.onClick(() => {
                this.publishProduct();
            });
        }, Button);
        // 发布按钮
        Button.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    InputItem(label: Resource, value: string, onChange: (value: string) => void, type: string = 'text', parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: { "id": 16777287, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" }, text: value });
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.fontSize(14);
            TextInput.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            TextInput.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            TextInput.borderRadius(8);
            TextInput.type(type === 'number' ? InputType.Number : InputType.Normal);
            TextInput.onChange(onChange);
        }, TextInput);
        Column.pop();
    }
    SelectItem(label: Resource, value: string, options: string[], onChange: (value: string) => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(14);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(48);
            Row.padding({ left: 16, right: 16 });
            Row.backgroundColor({ "id": 125829555, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Row.borderRadius(8);
            Row.onClick(() => {
                // 显示选择对话框
                // 实际应用中应该使用Picker组件
                if (options.length > 0) {
                    onChange(options[0]);
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.fontSize(14);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('▼');
            Text.fontSize(12);
            Text.fontColor({ "id": 125829216, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    ImagePickerSheet(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ top: 16, bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777290, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontSize(16);
            Text.fontColor({ "id": 125829210, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 24 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777302, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.height(48);
            Button.fontSize(14);
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Button.borderRadius(24);
            Button.onClick(() => {
                this.takePhoto();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.width(16);
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel({ "id": 16777280, "type": 10003, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Button.layoutWeight(1);
            Button.height(48);
            Button.fontSize(14);
            Button.fontColor(Color.White);
            Button.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.atomicservice.6917609041042536136", "moduleName": "entry" });
            Button.borderRadius(24);
            Button.onClick(() => {
                this.chooseFromGallery();
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "PublishProductPage";
    }
}
registerNamedRoute(() => new PublishProductPage(undefined, {}), "", { bundleName: "com.atomicservice.6917609041042536136", moduleName: "entry", pagePath: "pages/PublishProductPage", pageFullPath: "entry/src/main/ets/pages/PublishProductPage", integratedHsp: "false", moduleType: "followWithHap" });
