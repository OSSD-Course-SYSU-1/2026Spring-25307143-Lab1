/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';

// 商品详情数据接口
interface ProductDetail {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sales: number;
  shopName: string;
  description: string;
  shippingAddress: string;
  stock: number;
  category: string;
}

// 收货地址接口
interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

@Entry
@Component
struct CreateOrderPage {
  @State productData: ProductDetail | null = null;
  @State quantity: number = 1;
  @State selectedPayment: string = 'wechat'; // wechat, alipay, huawei
  @State selectedAddress: Address | null = null;
  @State isLoading: boolean = true;

  // 模拟地址列表
  private addresses: Address[] = [
    {
      id: '1',
      name: '张三',
      phone: '13800138000',
      address: '广东省深圳市南山区科技园南区',
      isDefault: true
    },
    {
      id: '2',
      name: '李四',
      phone: '13900139000',
      address: '北京市海淀区中关村大街',
      isDefault: false
    }
  ];

  aboutToAppear() {
    // 获取路由传递的参数
    const params = router.getParams() as Record<string, Object>;
    if (params && params['productData']) {
      this.productData = params['productData'] as ProductDetail;
    }
    if (params && params['quantity']) {
      this.quantity = params['quantity'] as number;
    }
    
    // 设置默认地址
    this.selectedAddress = this.addresses.find(addr => addr.isDefault) || this.addresses[0];
    this.isLoading = false;
  }

  // 构建商品信息卡片
  @Builder
  ProductInfoCard() {
    if (this.productData) {
      Column() {
        Row() {
          // 商品图片
          Image(this.productData.imageUrl)
            .width(80)
            .height(80)
            .objectFit(ImageFit.Cover)
            .borderRadius(8)

          // 商品信息
          Column() {
            Text(this.productData.name)
              .fontSize(14)
              .fontColor('#333333')
              .maxLines(2)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .width('100%')

            Row() {
              Text(`¥${this.productData.price}`)
                .fontSize(16)
                .fontColor('#FF5722')
                .fontWeight(FontWeight.Bold)

              Blank()

              Text(`x${this.quantity}`)
                .fontSize(14)
                .fontColor('#999999')
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

        // 分割线
        Divider()
          .color('#E5E5E5')

        // 小计
        Row() {
          Text('小计')
            .fontSize(14)
            .fontColor('#666666')

          Blank()

          Text(`¥${(this.productData.price * this.quantity).toFixed(2)}`)
            .fontSize(16)
            .fontColor('#FF5722')
            .fontWeight(FontWeight.Bold)
        }
        .width('100%')
        .padding({ left: 12, right: 12, top: 12, bottom: 12 })
      }
      .width('100%')
      .backgroundColor(Color.White)
      .borderRadius(8)
      .margin({ bottom: 12 })
    }
  }

  // 构建收货地址卡片
  @Builder
  AddressCard() {
    Column() {
      Row() {
        Text('收货地址')
          .fontSize(16)
          .fontColor('#333333')
          .fontWeight(FontWeight.Medium)

        Blank()

        Text('选择地址 >')
          .fontSize(14)
          .fontColor('#FF5722')
      }
      .width('100%')
      .padding(12)

      Divider()
        .color('#E5E5E5')

      if (this.selectedAddress) {
        Column() {
          Row() {
            Text(this.selectedAddress.name)
              .fontSize(14)
              .fontColor('#333333')
              .fontWeight(FontWeight.Medium)

            Text(this.selectedAddress.phone)
              .fontSize(14)
              .fontColor('#666666')
              .margin({ left: 12 })
          }

          Text(this.selectedAddress.address)
            .fontSize(14)
            .fontColor('#666666')
            .margin({ top: 8 })
            .width('100%')
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
        .padding(12)
      } else {
        Text('请选择收货地址')
          .fontSize(14)
          .fontColor('#999999')
          .padding(12)
      }
    }
    .width('100%')
    .backgroundColor(Color.White)
    .borderRadius(8)
    .margin({ bottom: 12 })
    .onClick(() => {
      // 显示地址选择对话框
      this.showAddressSelector();
    })
  }

  // 显示地址选择对话框
  showAddressSelector() {
    AlertDialog.show({
      title: '选择收货地址',
      message: this.addresses
        .map((addr, i) => `${i + 1}. ${addr.name} ${addr.phone}\n   ${addr.address}${addr.isDefault ? ' (默认)' : ''}`)
        .join('\n\n'),
      autoCancel: true,
      alignment: DialogAlignment.Center,
      primaryButton: {
        value: '地址1: ' + this.addresses[0].name,
        action: () => {
          this.selectedAddress = this.addresses[0];
        }
      },
      secondaryButton: {
        value: '地址2: ' + this.addresses[1].name,
        action: () => {
          this.selectedAddress = this.addresses[1];
        }
      }
    });
  }

  // 构建支付方式卡片
  @Builder
  PaymentMethodCard() {
    Column() {
      Text('支付方式')
        .fontSize(16)
        .fontColor('#333333')
        .fontWeight(FontWeight.Medium)
        .width('100%')
        .padding(12)

      Divider()
        .color('#E5E5E5')

      // 微信支付
      Row() {
        Text('微信支付')
          .fontSize(14)
          .fontColor('#333333')

        Blank()

        Radio({ value: 'wechat', group: 'paymentGroup' })
          .checked(this.selectedPayment === 'wechat')
          .onChange((isChecked: boolean) => {
            if (isChecked) {
              this.selectedPayment = 'wechat';
            }
          })
      }
      .width('100%')
      .padding(12)

      Divider()
        .color('#E5E5E5')

      // 支付宝
      Row() {
        Text('支付宝')
          .fontSize(14)
          .fontColor('#333333')

        Blank()

        Radio({ value: 'alipay', group: 'paymentGroup' })
          .checked(this.selectedPayment === 'alipay')
          .onChange((isChecked: boolean) => {
            if (isChecked) {
              this.selectedPayment = 'alipay';
            }
          })
      }
      .width('100%')
      .padding(12)

      Divider()
        .color('#E5E5E5')

      // 华为钱包
      Row() {
        Text('华为钱包')
          .fontSize(14)
          .fontColor('#333333')

        Blank()

        Radio({ value: 'huawei', group: 'paymentGroup' })
          .checked(this.selectedPayment === 'huawei')
          .onChange((isChecked: boolean) => {
            if (isChecked) {
              this.selectedPayment = 'huawei';
            }
          })
      }
      .width('100%')
      .padding(12)
    }
    .width('100%')
    .backgroundColor(Color.White)
    .borderRadius(8)
    .margin({ bottom: 12 })
  }

  // 构建底部操作栏
  @Builder
  BottomActionBar() {
    Row() {
      Column() {
        Text('合计：')
          .fontSize(14)
          .fontColor('#666666')

        if (this.productData) {
          Text(`¥${(this.productData.price * this.quantity).toFixed(2)}`)
            .fontSize(20)
            .fontColor('#FF5722')
            .fontWeight(FontWeight.Bold)
        }
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      Button('创建订单')
        .fontSize(16)
        .fontColor(Color.White)
        .backgroundColor('#FF5722')
        .borderRadius(20)
        .width(120)
        .height(44)
        .onClick(() => {
          this.createOrder();
        })
    }
    .width('100%')
    .height(70)
    .backgroundColor(Color.White)
    .padding({ left: 16, right: 16 })
    .border({ width: { top: 1 }, color: '#E5E5E5' })
  }

  // 创建订单
  createOrder() {
    if (!this.selectedAddress) {
      AlertDialog.show({
        title: '提示',
        message: '请选择收货地址',
        autoCancel: true,
        alignment: DialogAlignment.Center
      });
      return;
    }

    if (!this.productData) {
      return;
    }

    // 跳转到支付页面
    router.pushUrl({
      url: 'pages/PaymentPage',
      params: {
        productData: this.productData,
        quantity: this.quantity,
        address: this.selectedAddress,
        paymentMethod: this.selectedPayment
      }
    });
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Button() {
          Row() {
            Text('←')
              .fontSize(20)
              .fontColor(Color.White)
          }
        }
        .width(40)
        .height(40)
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          router.back();
        })

        Blank()

        Text('创建订单')
          .fontSize(18)
          .fontColor(Color.White)
          .fontWeight(FontWeight.Medium)

        Blank()

        Row()
          .width(40)
          .height(40)
      }
      .width('100%')
      .height(56)
      .backgroundColor('#FF5722')
      .padding({ left: 8, right: 8 })

      if (this.isLoading) {
        Column() {
          LoadingProgress()
            .width(50)
            .height(50)
            .color('#FF5722')

          Text('加载中...')
            .fontSize(14)
            .fontColor('#999999')
            .margin({ top: 10 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        // 订单内容
        Scroll() {
          Column() {
            // 商品信息
            this.ProductInfoCard()

            // 收货地址
            this.AddressCard()

            // 支付方式
            this.PaymentMethodCard()
          }
          .width('100%')
          .padding(12)
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Off)
        .edgeEffect(EdgeEffect.Spring)

        // 底部操作栏
        this.BottomActionBar()
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}
