/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { AccountManager, UserAccount } from '../common/AccountManager';

@Entry
@Component
struct LoginPage {
  @State account: string = '';
  @State password: string = '';
  @State isLoading: boolean = false;
  @State showPassword: boolean = false;
  @State isLogin: boolean = false;

  aboutToAppear() {
    // 检查是否已登录
    this.isLogin = AppStorage.get<boolean>('isLogin') || false;
  }

  // 登录
  doLogin() {
    if (!this.account) {
      AlertDialog.show({
        title: '提示',
        message: '请输入账号',
        autoCancel: true
      });
      return;
    }

    if (!this.password) {
      AlertDialog.show({
        title: '提示',
        message: '请输入密码',
        autoCancel: true
      });
      return;
    }

    this.isLoading = true;

    // 模拟网络延迟
    setTimeout(() => {
      const result = AccountManager.getInstance().login(this.account, this.password);
      this.isLoading = false;

      if (result.success && result.user) {
        AlertDialog.show({
          title: '登录成功',
          message: `欢迎回来，${result.user.username}！`,
          autoCancel: true,
          alignment: DialogAlignment.Center
        });

        // 延迟返回，让用户看到提示
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        AlertDialog.show({
          title: '登录失败',
          message: result.message,
          autoCancel: true
        });
      }
    }, 500);
  }

  // 快速登录（用于演示）
  quickLogin(user: UserAccount) {
    this.account = user.account;
    this.password = user.password;
    this.doLogin();
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

        Text('登录')
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

      Scroll() {
        Column() {
          // Logo
          Column() {
            Image($r('app.media.avatar'))
              .width(80)
              .height(80)
              .borderRadius(40)
              .margin({ bottom: 16 })

            Text('市集')
              .fontSize(24)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .fontWeight(FontWeight.Bold)
          }
          .margin({ top: 40, bottom: 32 })

          // 账号输入
          Column() {
            Text('账号')
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              .margin({ bottom: 8 })

            TextInput({ placeholder: '请输入账号', text: this.account })
              .width('100%')
              .height(48)
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
              .borderRadius(8)
              .onChange((value: string) => {
                this.account = value;
              })
          }
          .width('100%')
          .alignItems(HorizontalAlign.Start)
          .margin({ bottom: 16 })

          // 密码输入
          Column() {
            Text('密码')
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              .margin({ bottom: 8 })

            TextInput({ placeholder: '请输入密码', text: this.password })
              .width('100%')
              .height(48)
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
              .borderRadius(8)
              .type(this.showPassword ? InputType.Normal : InputType.Password)
              .onChange((value: string) => {
                this.password = value;
              })
          }
          .width('100%')
          .alignItems(HorizontalAlign.Start)
          .margin({ bottom: 24 })

          // 登录按钮
          Button(this.isLoading ? '登录中...' : '登录')
            .width('100%')
            .height(48)
            .fontSize(16)
            .fontColor(Color.White)
            .backgroundColor($r('app.color.activity_color'))
            .borderRadius(24)
            .enabled(!this.isLoading)
            .onClick(() => {
              this.doLogin();
            })

          // 分隔线
          Row() {
            Divider().layoutWeight(1)
            Text('测试账号')
              .fontSize(14)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              .margin({ left: 16, right: 16 })
            Divider().layoutWeight(1)
          }
          .width('100%')
          .margin({ top: 32, bottom: 16 })

          // 快速登录按钮
          Column() {
            // 原神账号
            Row() {
              Column() {
                Text('原神牛逼')
                  .fontSize(14)
                  .fontColor($r('sys.color.ohos_id_color_text_primary'))
                  .fontWeight(FontWeight.Bold)
                
                Text('账号: yuanshen')
                  .fontSize(12)
                  .fontColor($r('sys.color.ohos_id_color_text_secondary'))
                  .margin({ top: 4 })
                
                Text('密码: yuanshen123')
                  .fontSize(12)
                  .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              }
              .alignItems(HorizontalAlign.Start)
              .layoutWeight(1)

              Button('登录')
                .height(36)
                .fontSize(14)
                .fontColor(Color.White)
                .backgroundColor($r('app.color.activity_color'))
                .borderRadius(18)
                .onClick(() => {
                  this.quickLogin({
                    userId: 'user001',
                    username: '原神牛逼',
                    account: 'yuanshen',
                    password: 'yuanshen123',
                    avatar: '',
                    phone: '13800138001'
                  });
                })
            }
            .width('100%')
            .padding(16)
            .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
            .borderRadius(12)

            // 鸣潮账号
            Row() {
              Column() {
                Text('鸣潮牛逼')
                  .fontSize(14)
                  .fontColor($r('sys.color.ohos_id_color_text_primary'))
                  .fontWeight(FontWeight.Bold)
                
                Text('账号: mingchao')
                  .fontSize(12)
                  .fontColor($r('sys.color.ohos_id_color_text_secondary'))
                  .margin({ top: 4 })
                
                Text('密码: mingchao123')
                  .fontSize(12)
                  .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              }
              .alignItems(HorizontalAlign.Start)
              .layoutWeight(1)

              Button('登录')
                .height(36)
                .fontSize(14)
                .fontColor(Color.White)
                .backgroundColor($r('app.color.activity_color'))
                .borderRadius(18)
                .onClick(() => {
                  this.quickLogin({
                    userId: 'user002',
                    username: '鸣潮牛逼',
                    account: 'mingchao',
                    password: 'mingchao123',
                    avatar: '',
                    phone: '13800138002'
                  });
                })
            }
            .width('100%')
            .padding(16)
            .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
            .borderRadius(12)
            .margin({ top: 12 })
          }
          .width('100%')

          // 用户协议
          Column() {
            Text('登录即表示同意')
              .fontSize(12)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))

            Row() {
              Text('《用户协议》')
                .fontSize(12)
                .fontColor($r('app.color.activity_color'))

              Text('和')
                .fontSize(12)
                .fontColor($r('sys.color.ohos_id_color_text_secondary'))

              Text('《隐私政策》')
                .fontSize(12)
                .fontColor($r('app.color.activity_color'))
            }
          }
          .margin({ top: 24 })
        }
        .width('100%')
        .padding({ left: 32, right: 32 })
      }
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('sys.color.ohos_id_color_panel_bg'))
  }
}
