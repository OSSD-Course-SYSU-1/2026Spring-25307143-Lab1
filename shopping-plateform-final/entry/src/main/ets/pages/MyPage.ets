/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { AccountManager, UserAccount } from '../common/AccountManager';
import { OrderManager, OrderRecord } from '../common/OrderManager';
import { ResaleManager, ResaleOrder } from '../common/ResaleManager';

@Component
export struct MyPage {
  @Prop mainBoxPadding: number = 16;
  @StorageLink('currentMode') currentMode: 'shopping' | 'market' = 'shopping';
  @StorageLink('isLogin') isLoggedIn: boolean = false;
  @StorageLink('currentUserId') currentUserId: string = '';
  @StorageLink('username') username: string = '';
  @StorageLink('userAvatar') userAvatar: string = '';
  @State currentUser: UserAccount | null = null;
  @State orderStats: Map<string, number> = new Map();
  @State resaleStats: Map<string, number> = new Map();

  aboutToAppear() {
    this.checkLoginStatus();
  }

  onPageShow() {
    this.checkLoginStatus();
  }

  // 检查登录状态
  checkLoginStatus() {
    this.currentUser = AccountManager.getInstance().getCurrentUser();
    
    if (this.isLoggedIn && this.currentUser) {
      this.loadOrderStats();
      this.loadResaleStats();
    } else {
      this.orderStats = new Map();
      this.resaleStats = new Map();
    }
  }

  // 加载订单统计
  loadOrderStats() {
    // 先检查超时订单
    OrderManager.getInstance().checkAndCancelExpiredOrders();
    
    const orders = OrderManager.getInstance().getUserOrders(this.currentUserId);
    
    const stats = new Map<string, number>();
    stats.set('all', orders.length);
    stats.set('pending', orders.filter(o => o.status === 'pending').length);
    stats.set('paid', orders.filter(o => o.status === 'paid').length);
    stats.set('shipped', orders.filter(o => o.status === 'shipped').length);
    stats.set('completed', orders.filter(o => o.status === 'completed').length);
    stats.set('cancelled', orders.filter(o => o.status === 'cancelled').length);
    
    this.orderStats = stats;
  }

  // 加载转售统计
  loadResaleStats() {
    const resales = ResaleManager.getInstance().getUserResaleOrders(this.currentUserId);
    
    const stats = new Map<string, number>();
    stats.set('all', resales.length);
    stats.set('published', resales.filter(r => r.status === 'published').length);
    stats.set('sold', resales.filter(r => r.status === 'sold').length);
    
    this.resaleStats = stats;
  }

  // 跳转到登录页面
  goToLogin() {
    router.pushUrl({
      url: 'pages/LoginPage'
    });
  }

  // 跳转到个人资料修改页面
  goToProfileEdit() {
    if (!this.isLoggedIn) {
      this.goToLogin();
      return;
    }
    router.pushUrl({
      url: 'pages/ProfileEditPage'
    });
  }

  // 跳转到订单列表页面
  goToOrderList(orderType?: string) {
    if (!this.isLoggedIn) {
      this.goToLogin();
      return;
    }
    router.pushUrl({
      url: 'pages/OrderListPage',
      params: {
        orderType: orderType || 'all'
      }
    });
  }

  // 跳转到我的集市页面
  goToMyMarket(marketType?: string) {
    if (!this.isLoggedIn) {
      this.goToLogin();
      return;
    }
    router.pushUrl({
      url: 'pages/MyMarketPage',
      params: {
        marketType: marketType || 'all'
      }
    });
  }

  // 退出登录
  logout() {
    AlertDialog.show({
      title: '退出登录',
      message: '确定要退出当前账号吗？',
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '确定',
        action: () => {
          AccountManager.getInstance().logout();

          this.currentUser = null;
          this.orderStats = new Map();
          this.resaleStats = new Map();
        }
      }
    });
  }

  // 手机号脱敏
  maskPhoneNumber(phone: string): string {
    if (phone && phone.length === 11) {
      return phone.substring(0, 3) + '****' + phone.substring(7);
    }
    return phone;
  }

  build() {
    Column() {
      // 用户信息区域
      this.UserInfoSection();

      // 功能列表区域
      Scroll() {
        Column() {
          // 快捷入口
          this.QuickEntrySection();

          // 我的订单
          this.OrderSection();

          // 市集模式下的额外功能
          if (this.currentMode === 'market') {
            this.MarketSection();
          }

          // 账号管理
          this.AccountSection();
        }
        .width('100%')
        .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding })
      }
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('sys.color.ohos_id_color_panel_bg'))
  }

  @Builder
  UserInfoSection() {
    Column() {
      if (this.isLoggedIn) {
        // 已登录状态
        Row() {
          // 用户头像
          Image((this.currentUser?.avatar || this.userAvatar) || $r('app.media.avatar'))
            .width(80)
            .height(80)
            .borderRadius(40)
            .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
            .onClick(() => {
              this.goToProfileEdit();
            })

          Column() {
            Text(this.currentUser?.username || this.username || '用户')
              .fontSize(18)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .fontWeight(FontWeight.Bold)

            if (this.currentUser?.phone) {
              Text(this.maskPhoneNumber(this.currentUser.phone))
                .fontSize(14)
                .fontColor($r('sys.color.ohos_id_color_text_secondary'))
                .margin({ top: 4 })
            }

            if (this.currentUser?.account) {
              Text(`账号: ${this.currentUser.account}`)
                .fontSize(12)
                .fontColor($r('sys.color.ohos_id_color_text_secondary'))
                .margin({ top: 2 })
            }
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          .margin({ left: 16 })

          Image($r('sys.media.ohos_ic_public_arrow_right'))
            .width(24)
            .height(24)
            .fillColor($r('sys.color.ohos_id_color_text_secondary'))
        }
        .width('100%')
        .padding(16)
        .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
        .borderRadius(12)
        .onClick(() => {
          this.goToProfileEdit();
        })
      } else {
        // 未登录状态
        Row() {
          Image($r('app.media.avatar'))
            .width(80)
            .height(80)
            .borderRadius(40)
            .backgroundColor($r('sys.color.ohos_id_color_card_bg'))

          Column() {
            Text('点击登录')
              .fontSize(18)
              .fontColor($r('app.color.activity_color'))
              .fontWeight(FontWeight.Bold)

            Text('登录后可使用更多功能')
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              .margin({ top: 4 })
          }
          .alignItems(HorizontalAlign.Start)
          .layoutWeight(1)
          .margin({ left: 16 })

          Image($r('sys.media.ohos_ic_public_arrow_right'))
            .width(24)
            .height(24)
            .fillColor($r('sys.color.ohos_id_color_text_secondary'))
        }
        .width('100%')
        .padding(16)
        .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
        .borderRadius(12)
        .onClick(() => {
          this.goToLogin();
        })
      }
    }
    .width('100%')
    .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, top: 16, bottom: 16 })
  }

  @Builder
  QuickEntrySection() {
    Column() {
      Text('快捷入口')
        .fontSize(16)
        .fontColor($r('sys.color.ohos_id_color_text_primary'))
        .fontWeight(FontWeight.Medium)
        .margin({ bottom: 16 })

      Row() {
        this.QuickEntryItem('商品浏览', $r('app.media.ic_cart'), () => {
          router.pushUrl({ url: 'pages/Index' });
        })
        this.QuickEntryItem('我的订单', $r('app.media.ic_me'), () => { this.goToOrderList(); })
        this.QuickEntryItem('收藏夹', $r('app.media.ic_home'), () => {
          if (!this.isLoggedIn) {
            this.goToLogin();
            return;
          }
          router.pushUrl({ url: 'pages/FavoritesPage' });
        })
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceAround)
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(12)
    .margin({ bottom: 12 })
  }

  @Builder
  OrderSection() {
    Column() {
      Row() {
        Text('我的订单')
          .fontSize(16)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Medium)

        Blank()

        Row() {
          Text('查看全部')
            .fontSize(12)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))

          Image($r('sys.media.ohos_ic_public_arrow_right'))
            .width(16)
            .height(16)
            .fillColor($r('sys.color.ohos_id_color_text_secondary'))
        }
        .onClick(() => {
          this.goToOrderList('all');
        })
      }
      .width('100%')
      .margin({ bottom: 16 })

      Row() {
        this.OrderStatusItem('待付款', this.orderStats.get('pending') || 0, () => { this.goToOrderList('pending'); })
        this.OrderStatusItem('待发货', this.orderStats.get('paid') || 0, () => { this.goToOrderList('paid'); })
        this.OrderStatusItem('待收货', this.orderStats.get('shipped') || 0, () => { this.goToOrderList('shipped'); })
        this.OrderStatusItem('已完成', this.orderStats.get('completed') || 0, () => { this.goToOrderList('completed'); })
        this.OrderStatusItem('退款/售后', this.orderStats.get('cancelled') || 0, () => { this.goToOrderList('cancelled'); })
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceAround)
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(12)
    .margin({ bottom: 12 })
  }

  @Builder
  MarketSection() {
    Column() {
      Row() {
        Text('我的市集')
          .fontSize(16)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Medium)

        Blank()

        Row() {
          Text('查看全部')
            .fontSize(12)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))

          Image($r('sys.media.ohos_ic_public_arrow_right'))
            .width(16)
            .height(16)
            .fillColor($r('sys.color.ohos_id_color_text_secondary'))
        }
        .onClick(() => {
          this.goToMyMarket('all');
        })
      }
      .width('100%')
      .margin({ bottom: 16 })

      Row() {
        this.MarketStatusItem('我的发布', this.resaleStats.get('published') || 0, () => { this.goToMyMarket('published'); })
        this.MarketStatusItem('已售商品', this.resaleStats.get('sold') || 0, () => { this.goToMyMarket('sold'); })
        this.MarketStatusItem('待发货', 0, () => { this.goToMyMarket('published'); })
        this.MarketStatusItem('我的转卖', this.resaleStats.get('all') || 0, () => { this.goToMyMarket('all'); })
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceAround)
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(12)
    .margin({ bottom: 12 })
  }

  @Builder
  AccountSection() {
    Column() {
      Text('账号管理')
        .fontSize(16)
        .fontColor($r('sys.color.ohos_id_color_text_primary'))
        .fontWeight(FontWeight.Medium)
        .margin({ bottom: 16 })

      if (this.isLoggedIn) {
        // 已登录状态
        this.MenuItem('切换账号', () => {
          this.goToLogin();
        })

        this.MenuItem('退出当前账号', () => {
          this.logout();
        })
      } else {
        // 未登录状态
        this.MenuItem('登录账号', () => {
          this.goToLogin();
        })
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(12)
    .margin({ bottom: 12 })
  }

  @Builder
  QuickEntryItem(title: string, icon: Resource, onClick: () => void) {
    Column() {
      Image(icon)
        .width(40)
        .height(40)
        .margin({ bottom: 8 })

      Text(title)
        .fontSize(12)
        .fontColor($r('sys.color.ohos_id_color_text_secondary'))
    }
    .alignItems(HorizontalAlign.Center)
    .onClick(onClick)
  }

  @Builder
  OrderStatusItem(title: string, count: number, onClick: () => void) {
    Column() {
      Badge({
        count: count,
        position: BadgePosition.RightTop,
        style: { badgeSize: 16, badgeColor: '#FF5722' }
      }) {
        Column() {
          Image($r('app.media.ic_cart'))
            .width(32)
            .height(32)
            .margin({ bottom: 4 })
        }
      }

      Text(title)
        .fontSize(12)
        .fontColor($r('sys.color.ohos_id_color_text_secondary'))
    }
    .alignItems(HorizontalAlign.Center)
    .onClick(onClick)
  }

  @Builder
  MarketStatusItem(title: string, count: number, onClick: () => void) {
    Column() {
      Badge({
        count: count,
        position: BadgePosition.RightTop,
        style: { badgeSize: 16, badgeColor: '#FF5722' }
      }) {
        Column() {
          Image($r('app.media.ic_cart'))
            .width(32)
            .height(32)
            .margin({ bottom: 4 })
        }
      }

      Text(title)
        .fontSize(12)
        .fontColor($r('sys.color.ohos_id_color_text_secondary'))
    }
    .alignItems(HorizontalAlign.Center)
    .onClick(onClick)
  }

  @Builder
  MenuItem(title: string, onClick: () => void) {
    Row() {
      Text(title)
        .fontSize(14)
        .fontColor($r('sys.color.ohos_id_color_text_primary'))
        .layoutWeight(1)

      Image($r('sys.media.ohos_ic_public_arrow_right'))
        .width(16)
        .height(16)
        .fillColor($r('sys.color.ohos_id_color_text_secondary'))
    }
    .width('100%')
    .height(48)
    .onClick(onClick)
  }
}
