/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  seller: string;
}

@Component
export struct ProductRecommendList {
  @Prop currentMode: 'shopping' | 'market' = 'shopping';
  @Prop mainBoxPadding: number = 16;
  
  // 淘宝真实商品数据
  @State shoppingProducts: Product[] = [
    {
      id: '1',
      name: '树莓派人形机器人AI视觉大模型TonyPi仿生双足具身智能Python编程',
      price: '3699.00',
      image: 'https://img.alicdn.com/imgextra/i1/2201505950941/O1CN01b9Yn2f1Ip1lBcepD3_!!2201505950941.png_760x760q30.jpg_.webp',
      description: 'AI视觉大模型，仿生双足设计',
      seller: '幻尔旗舰店'
    },
    {
      id: '2',
      name: '【618立即抢购】毛戈平鱼子酱面膜涂抹熬夜救星舒缓修护抗皱紧致',
      price: '299.00',
      image: 'https://img.alicdn.com/imgextra/i2/839895996/O1CN01cqDCSd1uADugGJQZV_!!839895996.jpg_760x760q30.jpg_.webp',
      description: '熬夜救星，舒缓修护抗皱紧致',
      seller: 'MAOGEPING毛戈平官方旗舰店'
    },
    {
      id: '3',
      name: '苏泊尔电烤箱家用大容量蒸烤炸一体多功能智能调控长效预约烘焙箱',
      price: '599.00',
      image: 'https://img.alicdn.com/imgextra/i3/2219155702334/O1CN01nMjc3X1T71RStDyKK_!!2219155702334.jpg_760x760q30.jpg_.webp',
      description: '蒸烤炸一体，多功能智能调控',
      seller: '苏泊尔智能阳台旗舰店'
    },
    {
      id: '4',
      name: '灵动创想初音未来马尾甩甩毛绒玩偶周边挂件fufu公仔娃娃生日礼物',
      price: '89.00',
      image: 'https://img.alicdn.com/imgextra//8b/56/TB1bRlZQpXXXXbZXpXXSutbFXXX.jpg_760x760q30.jpg_.webp',
      description: '初音未来周边，毛绒玩偶',
      seller: '灵动创想旗舰店'
    }
  ];

  @State marketProducts: Product[] = [
    {
      id: '1',
      name: '二手相机',
      price: '1200.00',
      image: '',
      description: '九成新，成色很好',
      seller: '摄影爱好者'
    },
    {
      id: '2',
      name: '二手书籍',
      price: '35.00',
      image: '',
      description: '编程技术书籍，无笔记',
      seller: '学生转卖'
    },
    {
      id: '3',
      name: '二手家具',
      price: '280.00',
      image: '',
      description: '实木书桌，自提',
      seller: '搬家转卖'
    },
    {
      id: '4',
      name: '二手乐器',
      price: '450.00',
      image: '',
      description: '吉他，音色不错',
      seller: '音乐爱好者'
    },
    {
      id: '5',
      name: '二手游戏机',
      price: '800.00',
      image: '',
      description: '游戏主机，配件齐全',
      seller: '玩家转卖'
    }
  ];

  private getProducts(): Product[] {
    return this.currentMode === 'shopping' ? this.shoppingProducts : this.marketProducts;
  }

  build() {
    Column() {
      // 标题
      Row() {
        Text($r('app.string.product_recommend'))
          .fontSize(16)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Medium)
      }
      .width('100%')
      .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding, bottom: 16 })

      // 商品列表
      List() {
        ForEach(this.getProducts(), (product: Product) => {
          ListItem() {
            this.ProductCard(product);
          }
          .margin({ bottom: 12 })
        }, (product: Product) => product.id)
      }
      .width('100%')
      .layoutWeight(1)
      .padding({ left: this.mainBoxPadding, right: this.mainBoxPadding })
      .scrollBar(BarState.Auto)
      .edgeEffect(EdgeEffect.Spring)
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  ProductCard(product: Product) {
    Row() {
      // 商品图片
      Column() {
        if (product.image) {
          Image(product.image)
            .width(100)
            .height(100)
            .objectFit(ImageFit.Cover)
            .borderRadius(8)
        } else {
          Column() {
            Image($r('app.media.ic_cart'))
              .width(48)
              .height(48)
              .opacity(0.5)
          }
          .width(100)
          .height(100)
          .justifyContent(FlexAlign.Center)
          .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
          .borderRadius(8)
        }
      }

      // 商品信息
      Column() {
        Text(product.name)
          .fontSize(16)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Medium)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .margin({ bottom: 8 })

        Text(product.description)
          .fontSize(12)
          .fontColor($r('sys.color.ohos_id_color_text_secondary'))
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .margin({ bottom: 8 })

        Row() {
          Text(`¥${product.price}`)
            .fontSize(18)
            .fontColor($r('app.color.activity_color'))
            .fontWeight(FontWeight.Bold)

          Blank()

          Text(product.seller)
            .fontSize(12)
            .fontColor($r('sys.color.ohos_id_color_text_secondary'))
        }
        .width('100%')
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .margin({ left: 12 })
    }
    .width('100%')
    .padding(12)
    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
    .borderRadius(12)
    .onClick(() => {
      // 点击商品，跳转到商品详情页
      router.pushUrl({
        url: 'pages/ProductDetailPage',
        params: {
          productData: {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            imageUrl: product.image,
            sales: 0,
            shopName: product.seller,
            description: product.description,
            shippingAddress: '',
            stock: 999,
            category: ''
          },
          mode: this.currentMode
        }
      });
    })
  }
}
