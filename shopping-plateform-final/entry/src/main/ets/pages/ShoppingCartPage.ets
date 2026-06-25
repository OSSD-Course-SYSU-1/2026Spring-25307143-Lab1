/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { CartManager, CartItem, CartMode } from '../common/CartManager';
import { CartService } from '../services/CartService';

@Component
export struct ShoppingCartPage {
  @Prop mainBoxPadding: number = 16;
  @Prop @Watch('onModeChange') currentMode: CartMode = 'shopping';
  @State cartItems: CartItem[] = [];
  @State isAllSelected: boolean = false;

  aboutToAppear() {
    this.loadCartItems();
  }

  // 监听模式变化，自动重载购物车数据
  onModeChange(): void {
    this.loadCartItems();
  }

  // 加载购物车商品
  loadCartItems() {
    this.cartItems = CartManager.getInstance().getCartItems(this.currentMode);
    this.updateAllSelectedStatus();
    // 更新导航栏 Badge
    AppStorage.setOrCreate('cartBadgeCount', CartManager.getInstance().getCartCount(this.currentMode));
  }

  // 更新全选状态
  updateAllSelectedStatus() {
    if (this.cartItems.length === 0) {
      this.isAllSelected = false;
    } else {
      this.isAllSelected = this.cartItems.every(item => item.selected);
    }
  }

  // 切换商品选中状态
  toggleItemSelection(item: CartItem) {
    const newSelected = !item.selected;
    // 立即更新本地状态，防止复选框闪烁
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems[index].selected = newSelected;
      this.cartItems = [...this.cartItems];
      this.updateAllSelectedStatus();
    }
    // 异步持久化
    CartService.getInstance().updateSelected(item.id, newSelected, this.currentMode).then(() => {
      this.loadCartItems();
    });
  }

  // 切换全选状态
  toggleAllSelection() {
    const newStatus = !this.isAllSelected;
    // 立即更新本地状态，防止复选框闪烁
    this.cartItems.forEach(item => {
      item.selected = newStatus;
    });
    this.cartItems = [...this.cartItems];
    this.isAllSelected = newStatus;
    // 异步持久化
    CartService.getInstance().selectAll(newStatus, this.currentMode).then(() => {
      this.loadCartItems();
    });
  }

  // 增加商品数量
  increaseQuantity(item: CartItem) {
    CartService.getInstance().updateQuantity(item.id, item.quantity + 1, this.currentMode).then(() => {
      this.loadCartItems();
    });
  }

  // 减少商品数量
  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      CartService.getInstance().updateQuantity(item.id, item.quantity - 1, this.currentMode).then(() => {
        this.loadCartItems();
      });
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
        action: () => {}
      },
      secondaryButton: {
        value: '删除',
        action: () => {
          CartService.getInstance().removeFromCart(item.id, this.currentMode).then(() => {
            this.loadCartItems();
          });
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

  build() {
    Column() {
      // 购物车标题
      Column() {
        Text(this.currentMode === 'shopping' ? '购物车' : '市集购物车')
          .fontSize(20)
          .fontColor('#333333')
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: 8 })

        Text(`共${this.cartItems.length}件商品`)
          .fontSize(14)
          .fontColor('#999999')
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
      .padding({ top: 20, bottom: 16 })

      if (this.cartItems.length === 0) {
        // 空购物车状态
        Column() {
          Text('🛒')
            .fontSize(60)
            .margin({ bottom: 20 })

          Text('购物车是空的')
            .fontSize(16)
            .fontColor('#999999')
            .margin({ bottom: 20 })

          Button('去购物')
            .fontSize(16)
            .fontColor(Color.White)
            .backgroundColor('#FF5722')
            .borderRadius(20)
            .width(150)
            .height(44)
            .onClick(() => {
              router.pushUrl({ url: 'pages/Index' });
            })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        // 商品列表
        Scroll() {
          Column() {
            ForEach(this.cartItems, (item: CartItem) => {
              this.CartItemBuilder(item);
            })
          }
          .width('100%')
          .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, bottom: 16 })
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Off)
        .edgeEffect(EdgeEffect.Spring)

        // 底部结算栏
        Column() {
          // 全选
          Row() {
            Checkbox()
              .select(this.isAllSelected)
              .onChange((isChecked: boolean) => {
                this.toggleAllSelection();
              })

            Text('全选')
              .fontSize(14)
              .fontColor('#333333')
              .margin({ left: 8 })

            Blank()

            Text('合计：')
              .fontSize(14)
              .fontColor('#666666')

            Text(`¥${this.getTotalPrice().toFixed(2)}`)
              .fontSize(20)
              .fontColor('#FF5722')
              .fontWeight(FontWeight.Bold)
              .margin({ left: 4 })
          }
          .width('100%')
          .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, bottom: 12 })

          Button('去结算')
            .width('100%')
            .height(48)
            .fontSize(16)
            .fontColor(Color.White)
            .backgroundColor('#FF5722')
            .borderRadius(24)
            .margin({ left: this.mainBoxPadding, right: this.mainBoxPadding })
            .onClick(() => {
              this.goCheckout();
            })
        }
        .width('100%')
        .padding({ top: 12, bottom: 12 })
        .backgroundColor(Color.White)
        .border({ width: { top: 1 }, color: '#E5E5E5' })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  @Builder
  CartItemBuilder(item: CartItem) {
    Row() {
      // 选择框
      Checkbox()
        .select(item.selected)
        .onChange((isChecked: boolean) => {
          this.toggleItemSelection(item);
        })
        .margin({ right: 8 })

      // 商品图片
      Image(item.imageUrl)
        .width(80)
        .height(80)
        .objectFit(ImageFit.Cover)
        .borderRadius(8)
        .backgroundColor('#F5F5F5')

      // 商品信息
      Column() {
        Text(item.name)
          .fontSize(14)
          .fontColor('#333333')
          .fontWeight(FontWeight.Medium)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')

        Text(item.shopName)
          .fontSize(12)
          .fontColor('#999999')
          .margin({ top: 4 })

        Row() {
          Text(`¥${item.price}`)
            .fontSize(16)
            .fontColor('#FF5722')
            .fontWeight(FontWeight.Bold)

          Blank()

          // 数量控制
          Row() {
            Button('-')
              .fontSize(16)
              .fontColor('#666666')
              .backgroundColor('#F5F5F5')
              .width(28)
              .height(28)
              .onClick(() => {
                this.decreaseQuantity(item);
              })

            Text(`${item.quantity}`)
              .fontSize(14)
              .fontColor('#333333')
              .margin({ left: 8, right: 8 })

            Button('+')
              .fontSize(16)
              .fontColor('#666666')
              .backgroundColor('#F5F5F5')
              .width(28)
              .height(28)
              .onClick(() => {
                this.increaseQuantity(item);
              })
          }
        }
        .width('100%')
        .margin({ top: 8 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
      .margin({ left: 12 })
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Color.White)
    .borderRadius(8)
    .margin({ bottom: 12 })
    .gesture(
      LongPressGesture()
        .onAction(() => {
          this.deleteItem(item);
        })
    )
  }
}
