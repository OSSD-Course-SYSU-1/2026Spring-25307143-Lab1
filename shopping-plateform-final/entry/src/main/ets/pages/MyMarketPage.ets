/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { ResaleManager, ResaleOrder, ResaleStatus } from '../common/ResaleManager';
import { AccountManager } from '../common/AccountManager';

// 标签项接口
interface TabItem {
  key: string;
  name: string;
}

@Entry
@Component
struct MyMarketPage {
  @State resaleOrders: ResaleOrder[] = [];
  @State filteredOrders: ResaleOrder[] = [];
  @State isLoading: boolean = true;
  @State currentUserId: string = '';
  @State currentTab: string = 'all';

  // 状态标签
  private tabs: TabItem[] = [
    { key: 'all', name: '全部' },
    { key: 'draft', name: '草稿' },
    { key: 'published', name: '已发布' },
    { key: 'sold', name: '已售出' },
    { key: 'cancelled', name: '已取消' }
  ];

  aboutToAppear() {
    // 获取当前登录用户ID
    this.currentUserId = AccountManager.getInstance().getCurrentUserId();
    
    // 获取路由参数
    const params = router.getParams() as Record<string, string>;
    if (params && params['marketType']) {
      this.currentTab = params['marketType'];
    }
    this.loadResaleOrders();
  }

  // 加载用户的转售订单
  loadResaleOrders() {
    this.resaleOrders = ResaleManager.getInstance().getUserResaleOrders(this.currentUserId);
    this.filterOrders();
    this.isLoading = false;
  }

  // 筛选订单
  filterOrders() {
    if (this.currentTab === 'all') {
      this.filteredOrders = this.resaleOrders;
    } else {
      this.filteredOrders = this.resaleOrders.filter(order => order.status === this.currentTab);
    }
  }

  // 切换标签
  switchTab(key: string) {
    this.currentTab = key;
    this.filterOrders();
  }

  // 获取状态文本
  getStatusText(status: ResaleStatus): string {
    switch (status) {
      case 'draft':
        return '草稿';
      case 'published':
        return '已发布';
      case 'sold':
        return '已售出';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  }

  // 获取状态颜色
  getStatusColor(status: ResaleStatus): string {
    switch (status) {
      case 'draft':
        return '#999999';
      case 'published':
        return '#4CAF50';
      case 'sold':
        return '#FF5722';
      case 'cancelled':
        return '#CCCCCC';
      default:
        return '#999999';
    }
  }

  // 编辑转售订单
  editResaleOrder(order: ResaleOrder) {
    router.pushUrl({
      url: 'pages/ResaleEditPage',
      params: {
        resaleId: order.resaleId,
        productData: {
          id: order.product.id,
          name: order.product.name,
          price: order.originalPrice,
          imageUrl: order.product.imageUrl,
          shopName: order.product.shopName,
          description: order.description
        },
        quantity: order.product.quantity,
        orderId: order.originalOrderId,
        resalePrice: order.resalePrice,
        description: order.description
      }
    });
  }

  // 删除转售订单
  deleteResaleOrder(order: ResaleOrder) {
    AlertDialog.show({
      title: '确认删除',
      message: `确定要删除转售订单"${order.product.name}"吗？`,
      autoCancel: true,
      alignment: DialogAlignment.Center,
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '删除',
        action: () => {
          ResaleManager.getInstance().deleteResaleOrder(order.resaleId);
          this.loadResaleOrders();
        }
      }
    });
  }

  // 下架转售订单
  unpublishResaleOrder(order: ResaleOrder) {
    ResaleManager.getInstance().updateResaleOrderStatus(order.resaleId, 'draft');
    this.loadResaleOrders();
    AlertDialog.show({
      title: '成功',
      message: '转售订单已下架',
      autoCancel: true,
      alignment: DialogAlignment.Center
    });
  }

  // 重新发布
  republishResaleOrder(order: ResaleOrder) {
    ResaleManager.getInstance().publishResaleOrder(order.resaleId);
    this.loadResaleOrders();
    AlertDialog.show({
      title: '成功',
      message: '转售订单已重新发布',
      autoCancel: true,
      alignment: DialogAlignment.Center
    });
  }

  @Builder
  ResaleOrderItemBuilder(order: ResaleOrder) {
    Column() {
      Row() {
        // 商品图片
        Image(order.product.imageUrl)
          .width(100)
          .height(100)
          .borderRadius(8)
          .objectFit(ImageFit.Cover)

        // 商品信息
        Column() {
          Text(order.product.name)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })

          Row() {
            Text(`原价: ¥${order.originalPrice}`)
              .fontSize(12)
              .fontColor('#999999')
              .decoration({ type: TextDecorationType.LineThrough })

            Text(`转售价: ¥${order.resalePrice}`)
              .fontSize(14)
              .fontColor('#FF5722')
              .fontWeight(FontWeight.Bold)
              .margin({ left: 8 })
          }
          .margin({ top: 8 })

          Row() {
            Text(this.getStatusText(order.status))
              .fontSize(12)
              .fontColor(Color.White)
              .backgroundColor(this.getStatusColor(order.status))
              .borderRadius(4)
              .padding({ left: 8, right: 8, top: 2, bottom: 2 })

            Text(`浏览: ${order.viewCount}`)
              .fontSize(12)
              .fontColor('#999999')
              .margin({ left: 8 })

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
      }
      .width('100%')

      // 操作按钮
      Row() {
        Button('编辑')
          .fontSize(12)
          .fontColor('#666666')
          .backgroundColor('#F0F0F0')
          .borderRadius(15)
          .height(30)
          .layoutWeight(1)
          .onClick(() => {
            this.editResaleOrder(order);
          })

        if (order.status === 'published') {
          Button('下架')
            .fontSize(12)
            .fontColor('#FF9800')
            .backgroundColor('#FFF3E0')
            .borderRadius(15)
            .height(30)
            .layoutWeight(1)
            .margin({ left: 8 })
            .onClick(() => {
              this.unpublishResaleOrder(order);
            })
        } else if (order.status === 'draft') {
          Button('发布')
            .fontSize(12)
            .fontColor('#4CAF50')
            .backgroundColor('#C8E6C9')
            .borderRadius(15)
            .height(30)
            .layoutWeight(1)
            .margin({ left: 8 })
            .onClick(() => {
              this.republishResaleOrder(order);
            })
        }

        Button('删除')
          .fontSize(12)
          .fontColor('#FF5722')
          .backgroundColor('#FFEBEE')
          .borderRadius(15)
          .height(30)
          .layoutWeight(1)
          .margin({ left: 8 })
          .onClick(() => {
            this.deleteResaleOrder(order);
          })
      }
      .width('100%')
      .margin({ top: 12 })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Color.White)
    .borderRadius(8)
    .margin({ bottom: 12 })
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

        Text('我的市集')
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

      // 标签栏
      Scroll() {
        Row() {
          ForEach(this.tabs, (tab: TabItem) => {
            Column() {
              Text(tab.name)
                .fontSize(14)
                .fontColor(this.currentTab === tab.key ? '#FF5722' : '#666666')
                .fontWeight(this.currentTab === tab.key ? FontWeight.Bold : FontWeight.Normal)

              if (this.currentTab === tab.key) {
                Divider()
                  .width(20)
                  .height(2)
                  .color('#FF5722')
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
      } else if (this.filteredOrders.length === 0) {
        // 空状态
        Column() {
          Text('🏪')
            .fontSize(60)
            .opacity(0.5)

          Text(this.currentTab === 'all' ? '暂无转售订单' : `暂无${this.tabs.find(t => t.key === this.currentTab)?.name || ''}订单`)
            .fontSize(16)
            .fontColor('#999999')
            .margin({ top: 16 })

          if (this.currentTab === 'all') {
            Text('在订单详情页点击"转售"即可发布')
              .fontSize(12)
              .fontColor('#CCCCCC')
              .margin({ top: 8 })

            Button('去转售')
              .fontSize(14)
              .fontColor(Color.White)
              .backgroundColor('#4CAF50')
              .borderRadius(20)
              .width(120)
              .height(40)
              .margin({ top: 16 })
              .onClick(() => {
                router.pushUrl({ url: 'pages/ResaleSelectPage' });
              })
          }
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        // 转售订单列表
        Scroll() {
          Column() {
            // 统计信息
            Row() {
              Text(`共 ${this.filteredOrders.length} 个订单`)
                .fontSize(14)
                .fontColor('#666666')

              Blank()

              if (this.currentTab === 'all') {
                Text(`已发布: ${this.resaleOrders.filter(o => o.status === 'published').length}`)
                  .fontSize(12)
                  .fontColor('#4CAF50')
                  .margin({ right: 8 })

                Text(`已售出: ${this.resaleOrders.filter(o => o.status === 'sold').length}`)
                  .fontSize(12)
                  .fontColor('#FF5722')
              }
            }
            .width('100%')
            .margin({ bottom: 12 })

            ForEach(this.filteredOrders, (order: ResaleOrder) => {
              this.ResaleOrderItemBuilder(order)
            }, (order: ResaleOrder) => order.resaleId)
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
