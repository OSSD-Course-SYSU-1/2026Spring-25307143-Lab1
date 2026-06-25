/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { OrderManager, OrderRecord } from '../common/OrderManager';
import { AccountManager } from '../common/AccountManager';

@Entry
@Component
struct ResaleSelectPage {
  @State orders: OrderRecord[] = [];
  @State isLoading: boolean = true;
  @State currentUserId: string = '';

  aboutToAppear() {
    // 获取当前登录用户ID
    this.currentUserId = AccountManager.getInstance().getCurrentUserId();
    this.loadOrders();
  }

  // 加载已完成订单
  loadOrders() {
    this.orders = OrderManager.getInstance().getCompletedOrders(this.currentUserId);
    this.isLoading = false;
  }

  // 格式化时间
  formatTime(time: string): string {
    return time.split(' ')[0]; // 只显示日期部分
  }

  // 选择订单进行转售
  selectOrder(order: OrderRecord) {
    router.pushUrl({
      url: 'pages/ResaleEditPage',
      params: {
        productData: {
          id: order.product.id,
          name: order.product.name,
          price: order.product.price,
          imageUrl: order.product.imageUrl,
          shopName: order.product.shopName,
          description: '',
          shippingAddress: '',
          stock: 100,
          category: ''
        },
        quantity: order.product.quantity,
        orderId: order.orderId
      }
    });
  }

  @Builder
  OrderItemBuilder(order: OrderRecord) {
    Row() {
      // 商品图片
      Image(order.product.imageUrl)
        .width(80)
        .height(80)
        .borderRadius(8)
        .objectFit(ImageFit.Cover)

      // 商品信息
      Column() {
        Text(order.product.name)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        Text(`店铺: ${order.product.shopName}`)
          .fontSize(12)
          .fontColor('#999999')
          .margin({ top: 4 })

        Row() {
          Text(`¥${order.product.price}`)
            .fontSize(16)
            .fontColor('#FF5722')
            .fontWeight(FontWeight.Bold)

          Text(`x${order.product.quantity}`)
            .fontSize(12)
            .fontColor('#999999')
            .margin({ left: 8 })
        }
        .margin({ top: 8 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
      .margin({ left: 12 })

      // 选择按钮
      Button('转售')
        .fontSize(12)
        .fontColor(Color.White)
        .backgroundColor('#4CAF50')
        .borderRadius(15)
        .width(60)
        .height(30)
        .onClick(() => {
          this.selectOrder(order);
        })
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Color.White)
    .borderRadius(8)
    .margin({ bottom: 8 })
  }

  build() {
    Column() {
      // 标题栏
      Row() {
        Image($r('app.media.hwid_ic_back'))
          .width(24)
          .height(24)
          .onClick(() => {
            router.back();
          })

        Text('选择转售订单')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)

        Blank()
          .width(24)
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor(Color.White)

      // 内容区域
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
      } else if (this.orders.length === 0) {
        // 空状态
        Column() {
          Text('📦')
            .fontSize(60)
            .opacity(0.5)

          Text('暂无可转售订单')
            .fontSize(16)
            .fontColor('#999999')
            .margin({ top: 16 })

          Text('完成购物后即可转售商品')
            .fontSize(12)
            .fontColor('#CCCCCC')
            .margin({ top: 8 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        // 订单列表
        Scroll() {
          Column() {
            Text('选择要转售的商品')
              .fontSize(14)
              .fontColor('#666666')
              .width('100%')
              .margin({ bottom: 12 })

            ForEach(this.orders, (order: OrderRecord) => {
              this.OrderItemBuilder(order)
            }, (order: OrderRecord) => order.orderId)
          }
          .width('100%')
          .padding(16)
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Off)
        .edgeEffect(EdgeEffect.Spring)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}
