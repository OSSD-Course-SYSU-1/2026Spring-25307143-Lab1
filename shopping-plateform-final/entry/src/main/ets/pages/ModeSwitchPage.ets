/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { ProductRecommendList } from '../components/ProductRecommendList';
import { router } from '@kit.ArkUI';

@Component
export struct ModeSwitchPage {
  @Prop mainBoxPadding: number = 16;
  @Prop currentMode: 'shopping' | 'market' = 'shopping';
  @StorageLink('currentMode') appMode: 'shopping' | 'market' = 'shopping';

  build() {
    Column() {
      // 模式说明
      Column() {
        Text($r('app.string.mode_description'))
          .fontSize(14)
          .fontColor($r('sys.color.ohos_id_color_text_secondary'))
          .textAlign(TextAlign.Center)
          .margin({ bottom: 24 })
      }
      .width('100%')
      .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding })

      // 当前模式显示
      Column() {
        Text($r('app.string.current_mode'))
          .fontSize(16)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Medium)
          .margin({ bottom: 16 })

        // 当前模式卡片
        Row() {
          Column() {
            Image(this.appMode === 'shopping' ? $r('app.media.ic_cart_active') : $r('app.media.ic_mode_active'))
              .width(48)
              .height(48)
              .margin({ bottom: 12 })

            Text(this.appMode === 'shopping' ? $r('app.string.shopping_mode_name') : $r('app.string.market_mode_name'))
              .fontSize(18)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .fontWeight(FontWeight.Bold)
          }
          .width('100%')
          .alignItems(HorizontalAlign.Center)
        }
        .width('100%')
        .height(160)
        .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
        .borderRadius(16)
        .padding(24)
        .margin({ bottom: 32 })
      }
      .width('100%')
      .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding })

      // 切换按钮
      Column() {
        Button(this.appMode === 'shopping' ? $r('app.string.switch_to_market') : $r('app.string.switch_to_shopping'))
          .width('100%')
          .height(48)
          .fontSize(16)
          .fontColor(Color.White)
          .backgroundColor($r('app.color.activity_color'))
          .borderRadius(24)
          .onClick(() => {
            // 切换模式
            this.appMode = this.appMode === 'shopping' ? 'market' : 'shopping';
          })
      }
      .width('100%')
      .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding })

      // 功能按钮区域
      Column() {
        if (this.appMode === 'market') {
          // 市集模式：我的市集按钮
          Column() {
            Button('我的市集')
              .width('100%')
              .height(48)
              .fontSize(16)
              .fontColor(Color.White)
              .backgroundColor($r('app.color.activity_color'))
              .borderRadius(24)
              .margin({ top: 24 })
              .onClick(() => {
                // 跳转到我的市集页面
                router.pushUrl({
                  url: 'pages/MyMarketPage'
                });
              })
          }
          .width('100%')
          .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding })
        } else {
          // 购物模式：转售按钮
          Column() {
            Button($r('app.string.resell_product'))
              .width('100%')
              .height(48)
              .fontSize(16)
              .fontColor(Color.White)
              .backgroundColor($r('app.color.activity_color'))
              .borderRadius(24)
              .margin({ top: 24 })
              .onClick(() => {
                // 跳转到转售订单选择页面
                router.pushUrl({
                  url: 'pages/ResaleSelectPage'
                });
              })
          }
          .width('100%')
          .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding })
        }
      }
      .width('100%')

      // 商品推荐列表
      Column() {
        ProductRecommendList({
          currentMode: this.appMode,
          mainBoxPadding: this.mainBoxPadding
        });
      }
      .width('100%')
      .layoutWeight(1)
      .margin({ top: 24 })
    }
    .width('100%')
    .height('100%')
    .alignItems(HorizontalAlign.Start)
  }
}
