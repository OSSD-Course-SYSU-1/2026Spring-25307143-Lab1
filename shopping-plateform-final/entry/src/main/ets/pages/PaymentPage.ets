/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { OrderManager, OrderRecord } from '../common/OrderManager';
import { AccountManager } from '../common/AccountManager';

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
struct PaymentPage {
  @State productData: ProductDetail | null = null;
  @State quantity: number = 1;
  @State address: Address | null = null;
  @State paymentMethod: string = 'wechat';
  @State isLoading: boolean = true;
  @State isPaying: boolean = false;
  @State paymentStatus: 'pending' | 'success' | 'failed' = 'pending';

  aboutToAppear() {
    // 获取路由传递的参数
    const params = router.getParams() as Record<string, Object>;
    if (params && params['productData']) {
      this.productData = params['productData'] as ProductDetail;
    }
    if (params && params['quantity']) {
      this.quantity = params['quantity'] as number;
    }
    if (params && params['address']) {
      this.address = params['address'] as Address;
    }
    if (params && params['paymentMethod']) {
      this.paymentMethod = params['paymentMethod'] as string;
    }
    this.isLoading = false;
  }

  // 获取支付方式名称
  getPaymentMethodName(): string {
    switch (this.paymentMethod) {
      case 'wechat':
        return '微信支付';
      case 'alipay':
        return '支付宝';
      case 'huawei':
        return '华为钱包';
      default:
        return '未知支付方式';
    }
  }

  // 模拟支付过程
  simulatePayment() {
    this.isPaying = true;
    this.paymentStatus = 'pending';

    // 模拟支付延迟
    setTimeout(() => {
      // 模拟支付成功（90%成功率）
      const isSuccess = Math.random() > 0.1;
      this.paymentStatus = isSuccess ? 'success' : 'failed';
      this.isPaying = false;

      if (isSuccess) {
        // 支付成功，跳转到订单详情页
        setTimeout(() => {
          this.goToOrderDetail();
        }, 1500);
      }
    }, 2000);
  }

  // 跳转到订单详情页
  goToOrderDetail() {
    if (!this.productData || !this.address) {
      return;
    }

    const now = new Date();
    const orderCreateTime = now.toLocaleString();
    const orderId = OrderManager.getInstance().generateOrderId();

    // 创建待付款订单记录并保存到OrderManager
    const order: OrderRecord = {
      orderId: orderId,
      userId: AccountManager.getInstance().getCurrentUserId(),
      product: {
        id: this.productData.id,
        name: this.productData.name,
        price: this.productData.price,
        imageUrl: this.productData.imageUrl,
        quantity: this.quantity,
        shopName: this.productData.shopName
      },
      totalPrice: this.productData.price * this.quantity,
      address: {
        name: this.address.name,
        phone: this.address.phone,
        address: this.address.address
      },
      paymentMethod: this.getPaymentMethodName(),
      createTime: orderCreateTime,
      payTime: '',
      status: 'pending'
    };

    // 保存待付款订单到OrderManager（带过期时间）
    OrderManager.getInstance().createPendingOrder(order);

    // 跳转到订单详情页，用户可以在那里付款
    router.replaceUrl({
      url: 'pages/OrderDetailPage',
      params: {
        orderId: orderId
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

        Text(this.getPaymentMethodName())
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
        Column() {
          // 支付金额
          Column() {
            Text('支付金额')
              .fontSize(16)
              .fontColor('#666666')
              .margin({ bottom: 12 })

            if (this.productData) {
              Text(`¥${(this.productData.price * this.quantity).toFixed(2)}`)
                .fontSize(36)
                .fontColor('#FF5722')
                .fontWeight(FontWeight.Bold)
            }
          }
          .width('100%')
          .padding(30)
          .margin({ top: 50 })

          // 支付状态
          if (this.paymentStatus === 'pending' && !this.isPaying) {
            // 待支付状态
            Column() {
              Text('请确认支付')
                .fontSize(16)
                .fontColor('#333333')
                .margin({ bottom: 20 })

              Button('确认支付')
                .fontSize(16)
                .fontColor(Color.White)
                .backgroundColor('#FF5722')
                .borderRadius(20)
                .width(200)
                .height(44)
                .onClick(() => {
                  this.simulatePayment();
                })
            }
            .width('100%')
            .padding(20)
          } else if (this.isPaying) {
            // 支付中状态
            Column() {
              LoadingProgress()
                .width(50)
                .height(50)
                .color('#FF5722')

              Text('支付中，请稍候...')
                .fontSize(16)
                .fontColor('#666666')
                .margin({ top: 20 })
            }
            .width('100%')
            .padding(20)
          } else if (this.paymentStatus === 'success') {
            // 支付成功状态
            Column() {
              Text('✓')
                .fontSize(60)
                .fontColor('#4CAF50')
                .margin({ bottom: 20 })

              Text('支付成功')
                .fontSize(20)
                .fontColor('#4CAF50')
                .fontWeight(FontWeight.Bold)

              Text('即将跳转到订单详情...')
                .fontSize(14)
                .fontColor('#999999')
                .margin({ top: 12 })
            }
            .width('100%')
            .padding(20)
          } else if (this.paymentStatus === 'failed') {
            // 支付失败状态
            Column() {
              Text('✗')
                .fontSize(60)
                .fontColor('#F44336')
                .margin({ bottom: 20 })

              Text('支付失败')
                .fontSize(20)
                .fontColor('#F44336')
                .fontWeight(FontWeight.Bold)

              Button('重新支付')
                .fontSize(16)
                .fontColor(Color.White)
                .backgroundColor('#FF5722')
                .borderRadius(20)
                .width(200)
                .height(44)
                .margin({ top: 20 })
                .onClick(() => {
                  this.simulatePayment();
                })
            }
            .width('100%')
            .padding(20)
          }

          // 商品信息摘要
          if (this.productData) {
            Column() {
              Row() {
                Image(this.productData.imageUrl)
                  .width(60)
                  .height(60)
                  .objectFit(ImageFit.Cover)
                  .borderRadius(8)

                Column() {
                  Text(this.productData.name)
                    .fontSize(14)
                    .fontColor('#333333')
                    .maxLines(2)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })
                    .width('100%')

                  Text(`¥${this.productData.price} x${this.quantity}`)
                    .fontSize(14)
                    .fontColor('#FF5722')
                    .margin({ top: 4 })
                }
                .layoutWeight(1)
                .alignItems(HorizontalAlign.Start)
                .margin({ left: 12 })
              }
              .width('100%')
            }
            .width('100%')
            .padding(16)
            .backgroundColor(Color.White)
            .borderRadius(8)
            .margin({ top: 30, left: 16, right: 16 })
          }
        }
        .width('100%')
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}
