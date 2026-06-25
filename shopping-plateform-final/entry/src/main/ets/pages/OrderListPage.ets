/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { OrderManager, OrderRecord, OrderStatus } from '../common/OrderManager';
import { AccountManager } from '../common/AccountManager';

// 标签项接口
interface TabItem {
  key: string;
  name: string;
}

@Entry
@Component
struct OrderListPage {
  @State orders: OrderRecord[] = [];
  @State filteredOrders: OrderRecord[] = [];
  @State isLoading: boolean = true;
  @State currentTab: string = 'all';
  @State currentUserId: string = '';
  private checkTimer: number = -1; // 定时检查超时订单

  // 订单状态标签
  private tabs: TabItem[] = [
    { key: 'all', name: '全部' },
    { key: 'pending', name: '待付款' },
    { key: 'paid', name: '待发货' },
    { key: 'shipped', name: '待收货' },
    { key: 'completed', name: '已完成' },
    { key: 'cancelled', name: '已取消' }
  ];

  aboutToAppear() {
    this.currentUserId = AccountManager.getInstance().getCurrentUserId();
    
    const params = router.getParams() as Record<string, string>;
    if (params && params['orderType']) {
      this.currentTab = params['orderType'];
    }
    this.loadOrders();
    
    // 启动定时检查超时订单（每30秒检查一次）
    this.startExpireCheck();
  }

  aboutToDisappear() {
    // 清除定时器
    if (this.checkTimer !== -1) {
      clearInterval(this.checkTimer);
      this.checkTimer = -1;
    }
  }

  // 启动超时检查
  startExpireCheck() {
    this.checkTimer = setInterval(() => {
      const expiredOrders = OrderManager.getInstance().checkAndCancelExpiredOrders();
      if (expiredOrders.length > 0) {
        // 有订单超时被取消，刷新列表
        this.loadOrders();
      }
    }, 30000); // 每30秒检查一次
  }

  onPageShow() {
    this.currentUserId = AccountManager.getInstance().getCurrentUserId();
    this.loadOrders();
  }


  // 加载订单
  loadOrders() {
    // 先检查超时订单
    OrderManager.getInstance().checkAndCancelExpiredOrders();
    
    this.orders = OrderManager.getInstance().getUserOrders(this.currentUserId);
    this.filterOrders();
    this.isLoading = false;
  }

  // 筛选订单
  filterOrders() {
    if (this.currentTab === 'all') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.currentTab);
    }
  }

  // 切换标签
  switchTab(key: string) {
    this.currentTab = key;
    this.filterOrders();
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

  // 格式化剩余时间
  formatRemainingTime(expireTime: number): string {
    const now = Date.now();
    const remaining = expireTime - now;
    
    if (remaining <= 0) {
      return '已超时';
    }
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}分${seconds}秒`;
    } else {
      return `${seconds}秒`;
    }
  }

  // 查看订单详情
  viewOrderDetail(order: OrderRecord) {
    router.pushUrl({
      url: 'pages/OrderDetailPage',
      params: {
        orderId: order.orderId
      }
    });
  }

  // 取消订单
  cancelOrder(order: OrderRecord) {
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
          OrderManager.getInstance().updateOrderStatus(order.orderId, 'cancelled');
          this.loadOrders();
        }
      }
    });
  }

  // 确认收货
  confirmReceive(order: OrderRecord) {
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
          OrderManager.getInstance().updateOrderStatus(order.orderId, 'completed');
          this.loadOrders();
        }
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

        Text('我的订单')
          .fontSize(18)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Bold)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)

        Blank().width(24)
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })

      // 标签栏
      Scroll() {
        Row() {
          ForEach(this.tabs, (tab: TabItem) => {
            Column() {
              Text(tab.name)
                .fontSize(14)
                .fontColor(this.currentTab === tab.key ? $r('app.color.activity_color') : $r('sys.color.ohos_id_color_text_secondary'))
                .fontWeight(this.currentTab === tab.key ? FontWeight.Bold : FontWeight.Normal)

              if (this.currentTab === tab.key) {
                Divider()
                  .width(20)
                  .height(2)
                  .color($r('app.color.activity_color'))
                  .margin({ top: 4 })
              }
            }
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            .onClick(() => {
              this.switchTab(tab.key);
            })
          }, (tab: TabItem) => tab.key)
        }
        .width('100%')
      }
      .width('100%')
      .scrollable(ScrollDirection.Horizontal)
      .scrollBar(BarState.Off)
      .backgroundColor($r('sys.color.ohos_id_color_card_bg'))

      // 订单列表
      if (this.isLoading) {
        Column() {
          LoadingProgress()
            .width(48)
            .height(48)
            .color($r('app.color.activity_color'))

          Text('加载中...')
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))
            .margin({ top: 16 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else if (this.filteredOrders.length === 0) {
        // 空状态
        Column() {
          Text('📦')
            .fontSize(60)
            .opacity(0.5)

          Text('暂无订单')
            .fontSize(16)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))
            .margin({ top: 16 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        Scroll() {
          Column() {
            ForEach(this.filteredOrders, (order: OrderRecord) => {
              this.OrderItem(order);
            }, (order: OrderRecord) => order.orderId)
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 8, bottom: 16 })
        }
        .width('100%')
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('sys.color.ohos_id_color_panel_bg'))
  }

  @Builder
  OrderItem(order: OrderRecord) {
    Column() {
      // 订单头部
      Row() {
        Text(`订单号: ${order.orderId}`)
          .fontSize(12)
          .fontColor($r('sys.color.ohos_id_color_text_secondary'))
          .layoutWeight(1)

        // 如果是待付款订单，显示倒计时
        if (order.status === 'pending' && order.expireTime) {
          Text(this.formatRemainingTime(order.expireTime))
            .fontSize(12)
            .fontColor('#FF9800')
            .margin({ right: 12 })
        }

        Text(this.getStatusText(order.status))
          .fontSize(14)
          .fontColor(this.getStatusColor(order.status))
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
      .margin({ bottom: 12 })

      // 商品列表
      Row() {
        Image(order.product.imageUrl || $r('app.media.ic_cart'))
          .width(80)
          .height(80)
          .borderRadius(8)
          .backgroundColor($r('sys.color.ohos_id_color_card_bg'))

        Column() {
          Text(order.product.name)
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_primary'))
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })

          Text(`¥${order.product.price}`)
            .fontSize(14)
            .fontColor($r('app.color.activity_color'))
            .fontWeight(FontWeight.Bold)
            .margin({ top: 4 })

          Text(`x${order.product.quantity}`)
            .fontSize(12)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))
            .margin({ top: 2 })
        }
        .alignItems(HorizontalAlign.Start)
        .layoutWeight(1)
        .margin({ left: 12 })
      }
      .width('100%')
      .margin({ bottom: 8 })

      // 订单底部
      Row() {
        Text(`下单时间: ${order.createTime}`)
          .fontSize(12)
          .fontColor($r('sys.color.ohos_id_color_text_secondary'))
          .layoutWeight(1)

        Text(`合计: ¥${order.totalPrice.toFixed(2)}`)
          .fontSize(14)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Bold)
      }
      .width('100%')
      .margin({ top: 8 })

      // 操作按钮
      Row() {
        Blank().layoutWeight(1)

        if (order.status === 'pending') {
          Button('取消订单')
            .height(32)
            .fontSize(12)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))
            .backgroundColor(Color.Transparent)
            .border({ width: 1, color: $r('sys.color.ohos_id_color_text_secondary'), radius: 16 })
            .margin({ right: 8 })
            .onClick(() => {
              this.cancelOrder(order);
            })

          Button('去付款')
            .height(32)
            .fontSize(12)
            .fontColor(Color.White)
            .backgroundColor($r('app.color.activity_color'))
            .borderRadius(16)
            .onClick(() => {
              this.viewOrderDetail(order);
            })
        } else if (order.status === 'shipped') {
          Button('确认收货')
            .height(32)
            .fontSize(12)
            .fontColor(Color.White)
            .backgroundColor($r('app.color.activity_color'))
            .borderRadius(16)
            .onClick(() => {
              this.confirmReceive(order);
            })
        } else {
          Button('查看详情')
            .height(32)
            .fontSize(12)
            .fontColor($r('app.color.activity_color'))
            .backgroundColor(Color.Transparent)
            .border({ width: 1, color: $r('app.color.activity_color'), radius: 16 })
            .onClick(() => {
              this.viewOrderDetail(order);
            })
        }
      }
      .width('100%')
      .margin({ top: 12 })
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(12)
    .margin({ bottom: 12 })
    .onClick(() => {
      this.viewOrderDetail(order);
    })
  }
}
