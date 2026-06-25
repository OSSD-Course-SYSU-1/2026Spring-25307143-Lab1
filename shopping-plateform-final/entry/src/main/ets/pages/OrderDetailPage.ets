/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { OrderManager, OrderRecord, OrderStatus } from '../common/OrderManager';
import { ResaleManager } from '../common/ResaleManager';

@Entry
@Component
struct OrderDetailPage {
  @State order: OrderRecord | null = null;
  @State isLoading: boolean = true;
  @State orderId: string = '';
  @State remainingTime: number = 0; // 剩余时间（秒）
  private timer: number = -1; // 定时器ID

  aboutToAppear() {
    // 获取路由传递的参数
    const params = router.getParams() as Record<string, Object>;
    if (params && params['orderId']) {
      this.orderId = params['orderId'] as string;
      this.loadOrder();
    } else {
      this.isLoading = false;
    }
  }

  aboutToDisappear() {
    // 清除定时器
    if (this.timer !== -1) {
      clearInterval(this.timer);
      this.timer = -1;
    }
  }

  // 启动倒计时
  startCountdown() {
    // 清除旧定时器
    if (this.timer !== -1) {
      clearInterval(this.timer);
    }
    
    // 获取剩余时间
    this.remainingTime = OrderManager.getInstance().getOrderRemainingTime(this.orderId);
    
    // 如果有待付款订单，启动定时器
    if (this.remainingTime > 0) {
      this.timer = setInterval(() => {
        this.remainingTime = OrderManager.getInstance().getOrderRemainingTime(this.orderId);
        
        // 如果时间到了，刷新订单状态
        if (this.remainingTime <= 0) {
          clearInterval(this.timer);
          this.timer = -1;
          this.loadOrder();
        }
      }, 1000);
    }
  }

  // 格式化剩余时间
  formatRemainingTime(): string {
    if (this.remainingTime <= 0) {
      return '已超时';
    }
    
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // 加载订单数据
  loadOrder() {
    const orderData = OrderManager.getInstance().getOrderById(this.orderId);
    this.order = orderData !== undefined ? orderData : null;
    this.isLoading = false;
    
    // 如果是待付款订单，启动倒计时
    if (this.order && this.order.status === 'pending') {
      this.startCountdown();
    }
  }

  // 获取状态文本
  getStatusText(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return '待付款';
      case 'paid':
        return '待发货';
      case 'shipped':
        return '待收货';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  }

  // 获取状态颜色
  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'paid':
        return '#2196F3';
      case 'shipped':
        return '#4CAF50';
      case 'completed':
        return '#999999';
      case 'cancelled':
        return '#F44336';
      default:
        return '#999999';
    }
  }

  // 取消订单
  cancelOrder() {
    if (!this.order) return;
    
    AlertDialog.show({
      title: '确认取消',
      message: '确定要取消这个订单吗？',
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '确定',
        action: () => {
          OrderManager.getInstance().updateOrderStatus(this.order!.orderId, 'cancelled');
          this.loadOrder();
        }
      }
    });
  }

  // 立即付款
  payNow() {
    if (!this.order) return;
    
    AlertDialog.show({
      title: '支付确认',
      message: `确定支付 ¥${this.order.totalPrice.toFixed(2)} 吗？`,
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '确定支付',
        action: () => {
          const success = OrderManager.getInstance().payOrder(this.order!.orderId);
          if (success) {
            this.loadOrder();
          } else {
            AlertDialog.show({
              title: '支付失败',
              message: '订单已超时或状态异常',
              primaryButton: {
                value: '确定',
                action: () => {
                  this.loadOrder();
                }
              }
            });
          }
        }
      }
    });
  }

  // 确认收货
  confirmReceive() {
    if (!this.order) return;
    
    AlertDialog.show({
      title: '确认收货',
      message: '确定已收到商品吗？',
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '确定',
        action: () => {
          OrderManager.getInstance().updateOrderStatus(this.order!.orderId, 'completed');
          this.loadOrder();
        }
      }
    });
  }

  // 申请转售
  applyResale() {
    if (!this.order) return;
    
    router.pushUrl({
      url: 'pages/ResaleEditPage',
      params: {
        productData: {
          id: this.order.product.id,
          name: this.order.product.name,
          price: this.order.product.price,
          imageUrl: this.order.product.imageUrl,
          shopName: this.order.product.shopName,
          description: ''
        },
        quantity: this.order.product.quantity,
        orderId: this.order.orderId
      }
    });
  }

  // 再次购买
  buyAgain() {
    if (!this.order) return;
    
    router.pushUrl({
      url: 'pages/ProductDetailPage',
      params: {
        productId: this.order.product.id
      }
    });
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

        Text('订单详情')
          .fontSize(18)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Bold)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)

        Blank().width(48)
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })

      if (this.isLoading) {
        // 加载中
        Column() {
          LoadingProgress()
            .width(48)
            .height(48)
            .color($r('sys.color.ohos_id_color_emphasize'))

          Text('加载中...')
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))
            .margin({ top: 16 })
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      } else if (this.order) {
        // 订单详情内容
        Scroll() {
          Column() {
            // 订单状态卡片
            this.OrderStatusCard();

            // 收货地址
            this.AddressCard();

            // 商品信息
            this.ProductCard();

            // 订单信息
            this.OrderInfoCard();
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 16, bottom: 80 })
        }
        .layoutWeight(1)

        // 底部操作按钮
        this.BottomActions();
      } else {
        // 订单不存在
        Column() {
          Text('订单不存在')
            .fontSize(16)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))
        }
        .width('100%')
        .height('100%')
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('sys.color.ohos_id_color_panel_bg'))
  }

  @Builder
  OrderStatusCard() {
    Column() {
      Row() {
        // 状态图标
        if (this.order?.status === 'completed') {
          Text('✓')
            .fontSize(30)
            .fontColor('#4CAF50')
        } else if (this.order?.status === 'cancelled') {
          Text('✕')
            .fontSize(30)
            .fontColor('#F44336')
        } else {
          LoadingProgress()
            .width(30)
            .height(30)
            .color(this.getStatusColor(this.order?.status || 'pending'))
        }

        Column() {
          Text(this.getStatusText(this.order?.status || 'pending'))
            .fontSize(18)
            .fontColor(this.getStatusColor(this.order?.status || 'pending'))
            .fontWeight(FontWeight.Bold)

          if (this.order?.status === 'pending') {
            Row() {
              Text('请在 ')
                .fontSize(14)
                .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              
              Text(this.formatRemainingTime())
                .fontSize(14)
                .fontColor('#FF9800')
                .fontWeight(FontWeight.Bold)
              
              Text(' 内完成付款')
                .fontSize(14)
                .fontColor($r('sys.color.ohos_id_color_text_secondary'))
            }
            .margin({ top: 4 })
          } else if (this.order?.status === 'paid') {
            Text('商家正在准备发货')
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              .margin({ top: 4 })
          } else if (this.order?.status === 'shipped') {
            Text('商品正在配送中')
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              .margin({ top: 4 })
          } else if (this.order?.status === 'completed') {
            Text('感谢您的购买')
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              .margin({ top: 4 })
          } else if (this.order?.status === 'cancelled') {
            Text('订单已取消')
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              .margin({ top: 4 })
          }
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        .margin({ left: 16 })
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(12)
    .margin({ bottom: 12 })
  }

  @Builder
  AddressCard() {
    Column() {
      Row() {
        Image($r('sys.media.ohos_ic_public_location'))
          .width(20)
          .height(20)
          .fillColor($r('sys.color.ohos_id_color_emphasize'))

        Text('收货地址')
          .fontSize(14)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Medium)
          .margin({ left: 8 })
      }
      .width('100%')
      .margin({ bottom: 12 })

      Column() {
        Row() {
          Text(this.order?.address.name || '收货人')
            .fontSize(16)
            .fontColor($r('sys.color.ohos_id_color_text_primary'))
            .fontWeight(FontWeight.Bold)

          Text(this.order?.address.phone || '手机号')
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))
            .margin({ left: 16 })
        }
        .width('100%')

        Text(this.order?.address.address || '详细地址')
          .fontSize(14)
          .fontColor($r('sys.color.ohos_id_color_text_secondary'))
          .margin({ top: 8 })
      }
      .alignItems(HorizontalAlign.Start)
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(12)
    .margin({ bottom: 12 })
  }

  @Builder
  ProductCard() {
    Column() {
      Row() {
        Text('商品信息')
          .fontSize(14)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Medium)
      }
      .width('100%')
      .margin({ bottom: 12 })

      Row() {
        Image(this.order?.product.imageUrl || $r('app.media.ic_cart'))
          .width(80)
          .height(80)
          .borderRadius(8)
          .objectFit(ImageFit.Cover)

        Column() {
          Text(this.order?.product.name || '商品名称')
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_primary'))
            .fontWeight(FontWeight.Medium)
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })

          Text(this.order?.product.shopName || '店铺名称')
            .fontSize(12)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))
            .margin({ top: 4 })

          Row() {
            Text(`¥${(this.order?.product.price || 0).toFixed(2)}`)
              .fontSize(16)
              .fontColor($r('app.color.activity_color'))
              .fontWeight(FontWeight.Bold)

            Blank()

            Text(`x${this.order?.product.quantity || 1}`)
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
          }
          .width('100%')
          .margin({ top: 8 })
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        .margin({ left: 12 })
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(12)
    .margin({ bottom: 12 })
  }

  @Builder
  OrderInfoCard() {
    Column() {
      Text('订单信息')
        .fontSize(14)
        .fontColor($r('sys.color.ohos_id_color_text_primary'))
        .fontWeight(FontWeight.Medium)
        .margin({ bottom: 12 })

      this.InfoRow('订单编号', this.order?.orderId || '')
      this.InfoRow('创建时间', this.order?.createTime || '')
      
      if (this.order?.payTime) {
        this.InfoRow('付款时间', this.order.payTime)
      }
      
      if (this.order?.completeTime) {
        this.InfoRow('完成时间', this.order.completeTime)
      }

      // 价格明细
      Column() {
        Row() {
          Text('商品总价')
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))

          Blank()

          Text(`¥${(this.order?.totalPrice || 0).toFixed(2)}`)
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_primary'))
        }
        .width('100%')
        .margin({ top: 12 })

        Row() {
          Text('运费')
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))

          Blank()

          Text('免运费')
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_primary'))
        }
        .width('100%')
        .margin({ top: 8 })

        Row() {
          Text('实付款')
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_primary'))
            .fontWeight(FontWeight.Bold)

          Blank()

          Text(`¥${(this.order?.totalPrice || 0).toFixed(2)}`)
            .fontSize(18)
            .fontColor($r('app.color.activity_color'))
            .fontWeight(FontWeight.Bold)
        }
        .width('100%')
        .margin({ top: 12 })
      }
      .width('100%')
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(12)
  }

  @Builder
  InfoRow(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor($r('sys.color.ohos_id_color_text_secondary'))

      Blank()

      Text(value)
        .fontSize(14)
        .fontColor($r('sys.color.ohos_id_color_text_primary'))
    }
    .width('100%')
    .margin({ top: 8 })
  }

  @Builder
  BottomActions() {
    Row() {
      if (this.order?.status === 'pending') {
        // 待付款状态
        Button('取消订单')
          .fontSize(14)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
          .borderRadius(20)
          .height(40)
          .onClick(() => {
            this.cancelOrder();
          })

        Button('立即付款')
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor($r('app.color.activity_color'))
          .borderRadius(20)
          .height(40)
          .layoutWeight(1)
          .margin({ left: 12 })
          .onClick(() => {
            this.payNow();
          })
      } else if (this.order?.status === 'paid') {
        // 待发货状态
        Button('取消订单')
          .fontSize(14)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
          .borderRadius(20)
          .height(40)
          .onClick(() => {
            this.cancelOrder();
          })
      } else if (this.order?.status === 'shipped') {
        // 待收货状态
        Button('确认收货')
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor($r('app.color.activity_color'))
          .borderRadius(20)
          .height(40)
          .layoutWeight(1)
          .onClick(() => {
            this.confirmReceive();
          })
      } else if (this.order?.status === 'completed') {
        // 已完成状态
        Button('申请转售')
          .fontSize(14)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
          .borderRadius(20)
          .height(40)
          .onClick(() => {
            this.applyResale();
          })

        Button('再次购买')
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor($r('app.color.activity_color'))
          .borderRadius(20)
          .height(40)
          .layoutWeight(1)
          .margin({ left: 12 })
          .onClick(() => {
            this.buyAgain();
          })
      } else if (this.order?.status === 'cancelled') {
        // 已取消状态
        Button('再次购买')
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor($r('app.color.activity_color'))
          .borderRadius(20)
          .height(40)
          .layoutWeight(1)
          .onClick(() => {
            this.buyAgain();
          })
      }
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
  }
}
