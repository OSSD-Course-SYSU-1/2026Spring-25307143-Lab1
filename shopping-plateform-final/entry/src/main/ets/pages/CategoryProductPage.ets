/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { ProductItem, CategoryType, CATEGORIES, CategoryConfig } from '../models/ProductModel';
import { ProductService } from '../services/ProductService';

@Entry
@Component
struct CategoryProductPage {
  @State currentCategory: CategoryType = 'comprehensive';
  @State currentMode: 'shopping' | 'market' = 'shopping';
  @State products: ProductItem[] = [];

  aboutToAppear() {
    // 获取路由参数
    const params = router.getParams() as Record<string, Object>;
    if (params) {
      if (params['category']) {
        this.currentCategory = params['category'] as CategoryType;
      }
      if (params['currentMode']) {
        this.currentMode = params['currentMode'] as 'shopping' | 'market';
      }
    }
    this.loadProducts();
  }

  loadProducts() {
    this.products = ProductService.getInstance().getProducts(this.currentMode, this.currentCategory);
  }

  // 获取分类名称
  private getCategoryName(category: CategoryType): string {
    const config = CATEGORIES.find(c => c.id === category);
    return config ? config.name : '综合';
  }

  build() {
    Column() {
      // 标题栏
      Row() {
        Button('←')
          .width(40)
          .height(40)
          .fontSize(20)
          .backgroundColor(Color.Transparent)
          .fontColor('#333333')
          .onClick(() => {
            router.back();
          })

        Text(`${this.getCategoryName(this.currentCategory)}商品`)
          .fontSize(20)
          .fontColor('#333333')
          .fontWeight(FontWeight.Bold)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)

        Blank().width(40)
      }
      .width('100%')
      .height(56)
      .padding({ left: 8, right: 16 })

      // 分类切换
      Scroll() {
        Row() {
          ForEach(CATEGORIES, (cat: CategoryConfig) => {
            Text(cat.name)
              .fontSize(14)
              .fontColor(this.currentCategory === cat.id ? '#FF5722' : '#666666')
              .fontWeight(this.currentCategory === cat.id ? FontWeight.Bold : FontWeight.Normal)
              .padding({ left: 14, right: 14, top: 6, bottom: 6 })
              .backgroundColor(this.currentCategory === cat.id ? '#FFE0B2' : '#F5F5F5')
              .borderRadius(15)
              .margin({ right: 8 })
              .onClick(() => {
                this.currentCategory = cat.id;
                this.loadProducts();
              })
          }, (cat: CategoryConfig): string => cat.id)
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 4, bottom: 8 })
      }
      .scrollable(ScrollDirection.Horizontal)
      .scrollBar(BarState.Off)
      .width('100%')

      // 商品列表
      if (this.products.length === 0) {
        Column() {
          Text('暂无商品')
            .fontSize(16)
            .fontColor('#999999')
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        Scroll() {
          Column() {
            ForEach(this.products, (item: ProductItem) => {
              this.ProductItem(item);
            }, (item: ProductItem) => item.id)
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 8, bottom: 16 })
        }
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  @Builder
  ProductItem(item: ProductItem) {
    Row() {
      Image(item.imageUrl)
        .width(100)
        .height(100)
        .borderRadius(8)
        .objectFit(ImageFit.Cover)
        .backgroundColor('#F0F0F0')

      Column() {
        Text(item.name)
          .fontSize(15)
          .fontColor('#333333')
          .fontWeight(FontWeight.Medium)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .margin({ bottom: 6 })

        Text(`¥${item.price}`)
          .fontSize(18)
          .fontColor('#FF5722')
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: 4 })

        Row() {
          Text(`${item.sales}人付款`)
            .fontSize(12)
            .fontColor('#999999')

          Blank()

          Text(item.shopName)
            .fontSize(12)
            .fontColor('#999999')
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
        .width('100%')
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .margin({ left: 12 })
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Color.White)
    .borderRadius(8)
    .margin({ bottom: 10 })
    .onClick(() => {
      router.pushUrl({
        url: 'pages/ProductDetailPage',
        params: {
          productData: item,
          mode: this.currentMode
        }
      });
    })
  }
}
