if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ShoppingCartPage_Params {
    mainBoxPadding?: number;
    currentMode?: CartMode;
    cartItems?: CartItem[];
    isAllSelected?: boolean;
}
import router from "@ohos:router";
import { CartManager } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/CartManager";
import type { CartItem, CartMode } from "@bundle:com.atomicservice.account_atomicservice_sample/entry/ets/common/CartManager";
export class ShoppingCartPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__mainBoxPadding = new SynchedPropertySimpleOneWayPU(params.mainBoxPadding, this, "mainBoxPadding");
        this.__currentMode = new SynchedPropertySimpleOneWayPU(params.currentMode, this, "currentMode");
        this.__cartItems = new ObservedPropertyObjectPU([], this, "cartItems");
        this.__isAllSelected = new ObservedPropertySimplePU(false, this, "isAllSelected");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ShoppingCartPage_Params) {
        if (params.mainBoxPadding === undefined) {
            this.__mainBoxPadding.set(16);
        }
        if (params.currentMode === undefined) {
            this.__currentMode.set('shopping');
        }
        if (params.cartItems !== undefined) {
            this.cartItems = params.cartItems;
        }
        if (params.isAllSelected !== undefined) {
            this.isAllSelected = params.isAllSelected;
        }
    }
    updateStateVars(params: ShoppingCartPage_Params) {
        this.__mainBoxPadding.reset(params.mainBoxPadding);
        this.__currentMode.reset(params.currentMode);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__mainBoxPadding.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__cartItems.purgeDependencyOnElmtId(rmElmtId);
        this.__isAllSelected.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__mainBoxPadding.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__cartItems.aboutToBeDeleted();
        this.__isAllSelected.aboutToBeDeleted();
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
    private __currentMode: SynchedPropertySimpleOneWayPU<CartMode>;
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: CartMode) {
        this.__currentMode.set(newValue);
    }
    private __cartItems: ObservedPropertyObjectPU<CartItem[]>;
    get cartItems() {
        return this.__cartItems.get();
    }
    set cartItems(newValue: CartItem[]) {
        this.__cartItems.set(newValue);
    }
    private __isAllSelected: ObservedPropertySimplePU<boolean>;
    get isAllSelected() {
        return this.__isAllSelected.get();
    }
    set isAllSelected(newValue: boolean) {
        this.__isAllSelected.set(newValue);
    }
    aboutToAppear() {
        this.loadCartItems();
    }
    // 加载购物车商品
    loadCartItems() {
        this.cartItems = CartManager.getInstance().getCartItems(this.currentMode);
        this.updateAllSelectedStatus();
    }
    // 更新全选状态
    updateAllSelectedStatus() {
        if (this.cartItems.length === 0) {
            this.isAllSelected = false;
        }
        else {
            this.isAllSelected = this.cartItems.every(item => item.selected);
        }
    }
    // 切换商品选中状态
    toggleItemSelection(item: CartItem) {
        CartManager.getInstance().updateSelected(item.id, !item.selected, this.currentMode);
        this.loadCartItems();
    }
    // 切换全选状态
    toggleAllSelection() {
        const newStatus = !this.isAllSelected;
        CartManager.getInstance().selectAll(newStatus, this.currentMode);
        this.loadCartItems();
    }
    // 增加商品数量
    increaseQuantity(item: CartItem) {
        CartManager.getInstance().updateQuantity(item.id, item.quantity + 1, this.currentMode);
        this.loadCartItems();
    }
    // 减少商品数量
    decreaseQuantity(item: CartItem) {
        if (item.quantity > 1) {
            CartManager.getInstance().updateQuantity(item.id, item.quantity - 1, this.currentMode);
            this.loadCartItems();
        }
    }
    // 删除商品
    deleteItem(item: CartItem) {
        AlertDialog.show({
            title: '确认删除',
            message: `确定要删除"${item.name}"吗？`,
            autoCancel: true,
            alignment: DialogAlignment.Center,
            primaryButton: {
                value: '取消',
                action: () => { }
            },
            secondaryButton: {
                value: '删除',
                action: () => {
                    CartManager.getInstance().removeFromCart(item.id, this.currentMode);
                    this.loadCartItems();
                }
            }
        });
    }
    // 计算总价
    getTotalPrice(): number {
        return CartManager.getInstance().getSelectedTotalPrice(this.currentMode);
    }
    // 去结算
    goCheckout() {
        const selectedItems = CartManager.getInstance().getSelectedItems(this.currentMode);
        if (selectedItems.length === 0) {
            AlertDialog.show({
                title: '提示',
                message: '请选择要结算的商品',
                autoCancel: true,
                alignment: DialogAlignment.Center
            });
            return;
        }
        // 跳转到结算页面（这里简化处理，直接使用第一个商品）
        const firstItem = selectedItems[0];
        router.pushUrl({
            url: 'pages/CreateOrderPage',
            params: {
                productData: {
                    id: firstItem.id,
                    name: firstItem.name,
                    price: firstItem.price,
                    imageUrl: firstItem.imageUrl,
                    shopName: firstItem.shopName,
                    description: '',
                    shippingAddress: '',
                    stock: 100,
                    category: ''
                },
                quantity: firstItem.quantity
            }
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(121:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 购物车标题
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(123:7)", "entry");
            // 购物车标题
            Column.width('100%');
            // 购物车标题
            Column.alignItems(HorizontalAlign.Center);
            // 购物车标题
            Column.padding({ top: 20, bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.currentMode === 'shopping' ? '购物车' : '市集购物车');
            Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(124:9)", "entry");
            Text.fontSize(20);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`共${this.cartItems.length}件商品`);
            Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(130:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#999999');
        }, Text);
        Text.pop();
        // 购物车标题
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.cartItems.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 空购物车状态
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(140:9)", "entry");
                        // 空购物车状态
                        Column.width('100%');
                        // 空购物车状态
                        Column.layoutWeight(1);
                        // 空购物车状态
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🛒');
                        Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(141:11)", "entry");
                        Text.fontSize(60);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('购物车是空的');
                        Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(145:11)", "entry");
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('去购物');
                        Button.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(150:11)", "entry");
                        Button.fontSize(16);
                        Button.fontColor(Color.White);
                        Button.backgroundColor('#FF5722');
                        Button.borderRadius(20);
                        Button.width(150);
                        Button.height(44);
                        Button.onClick(() => {
                            router.pushUrl({ url: 'pages/Index' });
                        });
                    }, Button);
                    Button.pop();
                    // 空购物车状态
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 商品列表
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(166:9)", "entry");
                        // 商品列表
                        Scroll.width('100%');
                        // 商品列表
                        Scroll.layoutWeight(1);
                        // 商品列表
                        Scroll.scrollBar(BarState.Off);
                        // 商品列表
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(167:11)", "entry");
                        Column.width('100%');
                        Column.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            this.CartItemBuilder.bind(this)(item);
                        };
                        this.forEachUpdateFunction(elmtId, this.cartItems, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    // 商品列表
                    Scroll.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 底部结算栏
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(181:9)", "entry");
                        // 底部结算栏
                        Column.width('100%');
                        // 底部结算栏
                        Column.padding({ top: 12, bottom: 12 });
                        // 底部结算栏
                        Column.backgroundColor(Color.White);
                        // 底部结算栏
                        Column.border({ width: { top: 1 }, color: '#E5E5E5' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 全选
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(183:11)", "entry");
                        // 全选
                        Row.width('100%');
                        // 全选
                        Row.padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Checkbox.create();
                        Checkbox.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(184:13)", "entry");
                        Checkbox.select(this.isAllSelected);
                        Checkbox.onChange((isChecked: boolean) => {
                            this.toggleAllSelection();
                        });
                    }, Checkbox);
                    Checkbox.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('全选');
                        Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(190:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#333333');
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(195:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('合计：');
                        Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(197:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`¥${this.getTotalPrice().toFixed(2)}`);
                        Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(201:13)", "entry");
                        Text.fontSize(20);
                        Text.fontColor('#FF5722');
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ left: 4 });
                    }, Text);
                    Text.pop();
                    // 全选
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('去结算');
                        Button.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(210:11)", "entry");
                        Button.width('100%');
                        Button.height(48);
                        Button.fontSize(16);
                        Button.fontColor(Color.White);
                        Button.backgroundColor('#FF5722');
                        Button.borderRadius(24);
                        Button.margin({ left: this.mainBoxPadding, right: this.mainBoxPadding });
                        Button.onClick(() => {
                            this.goCheckout();
                        });
                    }, Button);
                    Button.pop();
                    // 底部结算栏
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    CartItemBuilder(item: CartItem, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(235:5)", "entry");
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor(Color.White);
            Row.borderRadius(8);
            Row.margin({ bottom: 12 });
            Gesture.create(GesturePriority.Low);
            LongPressGesture.create();
            LongPressGesture.onAction(() => {
                this.deleteItem(item);
            });
            LongPressGesture.pop();
            Gesture.pop();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 选择框
            Checkbox.create();
            Checkbox.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(237:7)", "entry");
            // 选择框
            Checkbox.select(item.selected);
            // 选择框
            Checkbox.onChange((isChecked: boolean) => {
                this.toggleItemSelection(item);
            });
            // 选择框
            Checkbox.margin({ right: 8 });
        }, Checkbox);
        // 选择框
        Checkbox.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品图片
            Image.create(item.imageUrl);
            Image.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(245:7)", "entry");
            // 商品图片
            Image.width(80);
            // 商品图片
            Image.height(80);
            // 商品图片
            Image.objectFit(ImageFit.Cover);
            // 商品图片
            Image.borderRadius(8);
            // 商品图片
            Image.backgroundColor('#F5F5F5');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品信息
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(253:7)", "entry");
            // 商品信息
            Column.layoutWeight(1);
            // 商品信息
            Column.alignItems(HorizontalAlign.Start);
            // 商品信息
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.name);
            Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(254:9)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Medium);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.shopName);
            Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(262:9)", "entry");
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(267:9)", "entry");
            Row.width('100%');
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${item.price}`);
            Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(268:11)", "entry");
            Text.fontSize(16);
            Text.fontColor('#FF5722');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(273:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数量控制
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(276:11)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('-');
            Button.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(277:13)", "entry");
            Button.fontSize(16);
            Button.fontColor('#666666');
            Button.backgroundColor('#F5F5F5');
            Button.width(28);
            Button.height(28);
            Button.onClick(() => {
                this.decreaseQuantity(item);
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${item.quantity}`);
            Text.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(287:13)", "entry");
            Text.fontSize(14);
            Text.fontColor('#333333');
            Text.margin({ left: 8, right: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+');
            Button.debugLine("entry/src/main/ets/pages/ShoppingCartPage.ets(292:13)", "entry");
            Button.fontSize(16);
            Button.fontColor('#666666');
            Button.backgroundColor('#F5F5F5');
            Button.width(28);
            Button.height(28);
            Button.onClick(() => {
                this.increaseQuantity(item);
            });
        }, Button);
        Button.pop();
        // 数量控制
        Row.pop();
        Row.pop();
        // 商品信息
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
