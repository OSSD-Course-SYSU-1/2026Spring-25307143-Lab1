/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { ResaleManager, ResaleOrder } from '../common/ResaleManager';
import { AccountManager } from '../common/AccountManager';

// 商品详情数据接口
interface ProductDetail {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  shopName: string;
  description: string;
}

@Entry
@Component
struct ResaleEditPage {
  @State productData: ProductDetail | null = null;
  @State quantity: number = 1;
  @State orderId: string = '';
  @State resalePrice: number = 0;
  @State description: string = '';
  @State isPublishing: boolean = false;
  @State currentUserId: string = '';
  @State currentUsername: string = '';

  aboutToAppear() {
    // 获取当前登录用户信息
    const user = AccountManager.getInstance().getCurrentUser();
    if (user) {
      this.currentUserId = user.userId;
      this.currentUsername = user.username;
    }
    
    // 获取路由传递的参数
    const params = router.getParams() as Record<string, Object>;
    if (params && params['productData']) {
      this.productData = params['productData'] as ProductDetail;
      // 默认转售价格等于原价
      this.resalePrice = this.productData.price;
    }
    if (params && params['quantity']) {
      this.quantity = params['quantity'] as number;
    }
    if (params && params['orderId']) {
      this.orderId = params['orderId'] as string;
    }
  }

  // 发布转售订单
  publishResale() {
    if (!this.productData) {
      return;
    }

    if (this.resalePrice <= 0) {
      AlertDialog.show({
        title: '提示',
        message: '请输入有效的转售价格',
        autoCancel: true,
        alignment: DialogAlignment.Center
      });
      return;
    }

    this.isPublishing = true;

    // 创建转售订单
    const resaleOrder = ResaleManager.getInstance().createResaleOrder(
      this.orderId,
      {
        id: this.productData.id,
        name: this.productData.name,
        price: this.productData.price,
        imageUrl: this.productData.imageUrl,
        quantity: this.quantity,
        shopName: this.productData.shopName
      },
      this.resalePrice,
      this.description,
      this.currentUserId,
      this.currentUsername
    );

    // 发布转售订单
    ResaleManager.getInstance().publishResaleOrder(resaleOrder.resaleId);

    setTimeout(() => {
      this.isPublishing = false;
      AlertDialog.show({
        title: '发布成功',
        message: '转售订单已发布到市集',
        autoCancel: true,
        alignment: DialogAlignment.Center,
        confirm: {
          value: '确定',
          action: () => {
            router.back();
          }
        }
      });
    }, 1000);
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

        Text('编辑转售信息')
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

      Scroll() {
        Column() {
          // 商品信息卡片
          Column() {
            Text('商品信息')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .width('100%')
              .margin({ bottom: 12 })

            if (this.productData) {
              Row() {
                Image(this.productData.imageUrl)
                  .width(100)
                  .height(100)
                  .borderRadius(8)
                  .objectFit(ImageFit.Cover)

                Column() {
                  Text(this.productData.name)
                    .fontSize(16)
                    .fontWeight(FontWeight.Medium)
                    .maxLines(2)
                    .textOverflow({ overflow: TextOverflow.Ellipsis })

                  Text(`店铺: ${this.productData.shopName}`)
                    .fontSize(12)
                    .fontColor('#999999')
                    .margin({ top: 4 })

                  Row() {
                    Text(`原价: ¥${this.productData.price}`)
                      .fontSize(14)
                      .fontColor('#999999')

                    Text(`x${this.quantity}`)
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
            }
          }
          .width('100%')
          .padding(16)
          .backgroundColor(Color.White)
          .borderRadius(8)
          .margin({ bottom: 12 })

          // 转售价格设置
          Column() {
            Text('转售价格')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .width('100%')
              .margin({ bottom: 12 })

            Row() {
              Text('¥')
                .fontSize(24)
                .fontColor('#FF5722')
                .fontWeight(FontWeight.Bold)

              TextInput({ placeholder: '请输入转售价格', text: this.resalePrice.toString() })
                .type(InputType.Number)
                .fontSize(24)
                .fontColor('#FF5722')
                .fontWeight(FontWeight.Bold)
                .layoutWeight(1)
                .backgroundColor(Color.Transparent)
                .onChange((value: string) => {
                  this.resalePrice = parseFloat(value) || 0;
                })
            }
            .width('100%')
            .alignItems(VerticalAlign.Center)

            // 价格提示
            if (this.productData) {
              Row() {
                if (this.resalePrice > this.productData.price) {
                  Text(`比原价高 ¥${(this.resalePrice - this.productData.price).toFixed(2)}`)
                    .fontSize(12)
                    .fontColor('#FF5722')
                } else if (this.resalePrice < this.productData.price) {
                  Text(`比原价低 ¥${(this.productData.price - this.resalePrice).toFixed(2)}`)
                    .fontSize(12)
                    .fontColor('#4CAF50')
                } else {
                  Text('与原价相同')
                    .fontSize(12)
                    .fontColor('#999999')
                }
              }
              .width('100%')
              .margin({ top: 8 })
            }
          }
          .width('100%')
          .padding(16)
          .backgroundColor(Color.White)
          .borderRadius(8)
          .margin({ bottom: 12 })

          // 转售描述
          Column() {
            Text('转售描述（可选）')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .width('100%')
              .margin({ bottom: 12 })

            TextArea({ placeholder: '请输入转售描述，如商品成色、使用情况等', text: this.description })
              .fontSize(14)
              .height(120)
              .width('100%')
              .backgroundColor('#F5F5F5')
              .borderRadius(8)
              .onChange((value: string) => {
                this.description = value;
              })
          }
          .width('100%')
          .padding(16)
          .backgroundColor(Color.White)
          .borderRadius(8)
          .margin({ bottom: 12 })

          // 温馨提示
          Column() {
            Text('温馨提示')
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor('#FF9800')
              .width('100%')

            Text('• 转售商品将在市集中展示给其他用户\n• 请如实描述商品状况，避免纠纷\n• 转售成功后，订单状态将更新为已售出')
              .fontSize(12)
              .fontColor('#999999')
              .lineHeight(20)
              .width('100%')
              .margin({ top: 8 })
          }
          .width('100%')
          .padding(16)
          .backgroundColor('#FFF3E0')
          .borderRadius(8)
        }
        .width('100%')
        .padding(16)
      }
      .width('100%')
      .layoutWeight(1)
      .scrollBar(BarState.Off)
      .edgeEffect(EdgeEffect.Spring)

      // 底部发布按钮
      Column() {
        Button(this.isPublishing ? '发布中...' : '发布')
          .width('100%')
          .height(50)
          .fontSize(18)
          .fontColor(Color.White)
          .backgroundColor(this.isPublishing ? '#CCCCCC' : '#4CAF50')
          .borderRadius(25)
          .enabled(!this.isPublishing)
          .onClick(() => {
            this.publishResale();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, bottom: 16, top: 8 })
      .backgroundColor(Color.White)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}
