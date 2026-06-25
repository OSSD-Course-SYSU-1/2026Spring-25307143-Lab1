/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { AccountManager, UserAccount } from '../common/AccountManager';

@Entry
@Component
struct ProfileEditPage {
  @State currentUser: UserAccount | null = null;
  @State hasChanges: boolean = false;

  aboutToAppear() {
    this.loadUserInfo();
  }

  // 加载用户信息
  loadUserInfo() {
    this.currentUser = AccountManager.getInstance().getCurrentUser();
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

        Text('个人资料')
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

      Scroll() {
        Column() {
          // 头像
          Column() {
            if (this.currentUser && this.currentUser.avatar) {
              Image(this.currentUser.avatar)
                .width(100)
                .height(100)
                .borderRadius(50)
            } else {
              Image($r('app.media.avatar'))
                .width(100)
                .height(100)
                .borderRadius(50)
            }
          }
          .margin({ bottom: 24 })

          // 基本信息
          Column() {
            Text('基本信息')
              .fontSize(16)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .fontWeight(FontWeight.Bold)
              .margin({ bottom: 16 })

            // 用户名
            this.InfoItem('用户名', this.currentUser?.username || '')

            // 账号
            this.InfoItem('账号', this.currentUser?.account || '')

            // 手机号
            this.InfoItem('手机号', this.currentUser?.phone || '')
          }
          .width('100%')
          .padding(16)
          .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
          .borderRadius(12)
          .margin({ bottom: 16 })

          // 账号安全
          Column() {
            Text('账号安全')
              .fontSize(16)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .fontWeight(FontWeight.Bold)
              .margin({ bottom: 16 })

            this.MenuItem('修改密码', () => {
              AlertDialog.show({
                title: '提示',
                message: '演示账号不支持修改密码',
                autoCancel: true
              });
            })

            this.MenuItem('绑定手机', () => {
              AlertDialog.show({
                title: '提示',
                message: '演示账号不支持绑定手机',
                autoCancel: true
              });
            })

            this.MenuItem('实名认证', () => {
              AlertDialog.show({
                title: '提示',
                message: '演示账号不支持实名认证',
                autoCancel: true
              });
            })
          }
          .width('100%')
          .padding(16)
          .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
          .borderRadius(12)
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 16 })
      }
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('sys.color.ohos_id_color_panel_bg'))
  }

  @Builder
  InfoItem(label: string, value: string) {
    Row() {
      Text(label)
        .fontSize(14)
        .fontColor($r('sys.color.ohos_id_color_text_secondary'))
        .width(60)

      Text(value)
        .fontSize(14)
        .fontColor($r('sys.color.ohos_id_color_text_primary'))
        .layoutWeight(1)
    }
    .width('100%')
    .padding({ top: 8, bottom: 8 })
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
