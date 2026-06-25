/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { MessageRecord, MessageType, getMessageTypeName } from '../models/MessageModel';
import { MessageService } from '../services/MessageService';

@Component
export struct MessagePage {
  @Prop mainBoxPadding: number = 0;
  @State messages: MessageRecord[] = [];
  @State currentTab: 'all' | MessageType = 'all';
  @State isLoading: boolean = true;

  private messageService: MessageService = MessageService.getInstance();

  aboutToAppear() {
    this.loadMessages();
  }

  onPageShow() {
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading = true;
    this.messages = this.messageService.getAllMessages();
    this.isLoading = false;
  }

  // 获取筛选后的消息
  getFilteredMessages(): MessageRecord[] {
    if (this.currentTab === 'all') {
      return this.messages;
    }
    return this.messages.filter(m => m.type === this.currentTab);
  }

  // 获取未读数量
  getUnreadCount(type?: 'all' | MessageType): number {
    if (type === 'all' || !type) {
      return this.messageService.getUnreadCount();
    }
    return this.messageService.getUnreadCountByType(type);
  }

  // 点击消息
  onMessageClick(message: MessageRecord) {
    // 标记为已读
    this.messageService.markAsRead(message.id);

    // 如果是订单消息且有相关订单ID，跳转到订单详情
    if (message.type === 'order' && message.relatedOrderId) {
      router.pushUrl({
        url: 'pages/OrderDetailPage',
        params: {
          orderId: message.relatedOrderId
        }
      });
    }

    // 刷新消息列表
    this.loadMessages();
  }

  // 标记全部已读
  markAllRead() {
    this.messageService.markAllAsRead();
    this.loadMessages();
  }

  // 获取消息图标
  getMessageIcon(type: MessageType): string {
    switch (type) {
      case 'system':
        return '⚙️';
      case 'order':
        return '📦';
      case 'activity':
        return '🎉';
    }
  }

  // 格式化时间显示（今天/昨天/更早）
  formatTime(timeStr: string): string {
    try {
      const msgDate = new Date(timeStr);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterdayStart = new Date(todayStart.getTime() - 86400000);

      if (msgDate >= todayStart) {
        return `今天 ${msgDate.getHours().toString().padStart(2, '0')}:${msgDate.getMinutes().toString().padStart(2, '0')}`;
      } else if (msgDate >= yesterdayStart) {
        return `昨天 ${msgDate.getHours().toString().padStart(2, '0')}:${msgDate.getMinutes().toString().padStart(2, '0')}`;
      } else {
        return timeStr;
      }
    } catch (e) {
      return timeStr;
    }
  }

  build() {
    Column() {
      // 消息标题
      Row() {
        Text('消息中心')
          .fontSize(24)
          .fontWeight(FontWeight.Bold)

        Blank()

        if (this.getUnreadCount('all') > 0) {
          Text('全部已读')
            .fontSize(13)
            .fontColor('#FF5722')
            .onClick(() => {
              this.markAllRead();
            })
        }
      }
      .width('100%')
      .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, top: 20, bottom: 12 })

      // 分类标签
      Scroll() {
        Row() {
          // 全部
          this.TabItem('全部', 'all', this.getUnreadCount('all'))
          // 各分类
          this.TabItem('系统通知', 'system', this.getUnreadCount('system'))
          this.TabItem('订单通知', 'order', this.getUnreadCount('order'))
          this.TabItem('活动通知', 'activity', this.getUnreadCount('activity'))
        }
        .width('100%')
        .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding })
      }
      .scrollable(ScrollDirection.Horizontal)
      .scrollBar(BarState.Off)
      .width('100%')
      .margin({ bottom: 8 })

      // 消息列表
      if (this.isLoading) {
        Column() {
          LoadingProgress()
            .width(40)
            .height(40)
            .color('#FF5722')
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        Scroll() {
          Column() {
            if (this.getFilteredMessages().length === 0) {
              // 空状态
              Column() {
                Text('💬')
                  .fontSize(60)
                  .opacity(0.4)
                  .margin({ bottom: 16 })

                Text('暂无消息')
                  .fontSize(16)
                  .fontColor('#999999')
              }
              .width('100%')
              .height(200)
              .justifyContent(FlexAlign.Center)
            } else {
              ForEach(this.getFilteredMessages(), (message: MessageRecord) => {
                this.MessageItem(message);
              }, (message: MessageRecord) => message.id)
            }
          }
          .width('100%')
          .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, bottom: 16 })
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  TabItem(label: string, tab: 'all' | MessageType, unreadCount: number) {
    Column() {
      Row() {
        Text(label)
          .fontSize(14)
          .fontColor(this.currentTab === tab ? '#FF5722' : '#666666')
          .fontWeight(this.currentTab === tab ? FontWeight.Bold : FontWeight.Normal)

        if (unreadCount > 0) {
          Text(`${unreadCount}`)
            .fontSize(10)
            .fontColor(Color.White)
            .backgroundColor('#FF5722')
            .borderRadius(8)
            .padding({ left: 5, right: 5, top: 2, bottom: 2 })
            .margin({ left: 4 })
        }
      }

      if (this.currentTab === tab) {
        Divider()
          .width(20)
          .height(2)
          .color('#FF5722')
          .margin({ top: 6 })
      }
    }
    .padding({ right: 20, top: 6, bottom: 6 })
    .onClick(() => {
      this.currentTab = tab;
    })
  }

  @Builder
  MessageItem(message: MessageRecord) {
    Row() {
      // 消息图标
      Text(this.getMessageIcon(message.type))
        .fontSize(28)
        .margin({ right: 12 })

      // 消息内容
      Column() {
        Row() {
          Text(message.title)
            .fontSize(15)
            .fontColor('#333333')
            .fontWeight(message.isRead ? FontWeight.Normal : FontWeight.Bold)
            .layoutWeight(1)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })

          Text(this.formatTime(message.createTime))
            .fontSize(12)
            .fontColor('#999999')
        }
        .width('100%')

        Text(message.content)
          .fontSize(13)
          .fontColor('#666666')
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')
          .margin({ top: 4 })

        // 消息类型标签
        Text(getMessageTypeName(message.type))
          .fontSize(11)
          .fontColor('#FF5722')
          .margin({ top: 6 })
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
    }
    .width('100%')
    .padding(14)
    .backgroundColor(message.isRead ? '#FAFAFA' : Color.White)
    .borderRadius(10)
    .margin({ bottom: 10 })
    .onClick(() => {
      this.onMessageClick(message);
    })
  }
}
