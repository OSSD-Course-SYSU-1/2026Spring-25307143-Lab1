/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';

/**
 * 通用商品卡片组件（列表形式）
 */

interface CardProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sales: number;
  shopName: string;
  description: string;
}

@Component
export struct ProductCard {
  @Prop product: CardProduct | null = null;
  @Prop mode: 'shopping' | 'market' = 'shopping';
  @Prop showShopName: boolean = true;
  @Prop showDescription: boolean = false;

  build() {
    if (!this.product) {
      return;
    }

    Row() {
      // 商品图片
      Image(this.product.imageUrl)
        .width(100)
        .height(100)
        .borderRadius(8)
        .objectFit(ImageFit.Cover)
        .backgroundColor('#F0F0F0')
        .onError(() => {
          // 图片加载失败不处理，显示背景色
        })

      // 商品信息
      Column() {
        Text(this.product.name)
          .fontSize(15)
          .fontColor('#333333')
          .fontWeight(FontWeight.Medium)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')

        if (this.showDescription && this.product.description) {
          Text(this.product.description)
            .fontSize(12)
            .fontColor('#999999')
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .width('100%')
            .margin({ top: 4 })
        }

        Row() {
          Text(`¥${this.product.price}`)
            .fontSize(18)
            .fontColor('#FF5722')
            .fontWeight(FontWeight.Bold)

          Blank()

          if (this.showShopName) {
            Text(this.product.shopName)
              .fontSize(12)
              .fontColor('#999999')
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
          }

          if (this.product.sales > 0) {
            Text(`${this.product.sales}人付款`)
              .fontSize(12)
              .fontColor('#999999')
              .margin({ left: 4 })
          }
        }
        .width('100%')
        .margin({ top: 6 })
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .margin({ left: 12 })
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Color.White)
    .borderRadius(8)
  }
}
