/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { ProductItem, CategoryType, CATEGORIES } from '../models/ProductModel';
import { ProductService } from '../services/ProductService';

@Entry
@Component
struct SearchResultPage {
  @State keyword: string = '';
  @State currentMode: 'shopping' | 'market' = 'shopping';
  @State currentCategory: CategoryType = 'comprehensive';
  @State searchResults: ProductItem[] = [];
  @State isLoading: boolean = true;

  aboutToAppear() {
    const params = router.getParams() as Record<string, Object>;
    if (params) {
      if (params['keyword']) {
        this.keyword = params['keyword'] as string;
      }
      if (params['category']) {
        this.currentCategory = params['category'] as CategoryType;
      }
      if (params['currentMode']) {
        this.currentMode = params['currentMode'] as 'shopping' | 'market';
      }
    }
    this.doSearch();
  }

  doSearch() {
    this.isLoading = true;
    // 使用 ProductService 进行搜索
    this.searchResults = ProductService.getInstance().searchProducts(
      this.keyword, this.currentMode, this.currentCategory
    );
    this.isLoading = false;
  }

  // 切换分类
  switchCategory(category: CategoryType) {
    this.currentCategory = category;
    this.doSearch();
  }

  build() {
    Column() {
      // 顶部搜索栏
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

        Row() {
          Text('🔍')
            .fontSize(14)
            .margin({ right: 6 })

          Text(this.keyword)
            .fontSize(14)
            .fontColor('#333333')
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
        .layoutWeight(1)
        .height(36)
        .padding({ left: 12, right: 12 })
        .backgroundColor('#F5F5F5')
        .borderRadius(18)
      }
      .width('100%')
      .height(56)
      .padding({ left: 8, right: 16 })
      .backgroundColor(Color.White)

      // 分类筛选
      Scroll() {
        Row() {
          ForEach(CATEGORIES, (category: { id: CategoryType; name: string }) => {
            Text(category.name)
              .fontSize(14)
              .fontColor(this.currentCategory === category.id ? '#FF5722' : '#666666')
              .fontWeight(this.currentCategory === category.id ? FontWeight.Bold : FontWeight.Normal)
              .padding({ left: 12, right: 12, top: 6, bottom: 6 })
              .backgroundColor(this.currentCategory === category.id ? '#FFE0B2' : '#F5F5F5')
              .borderRadius(15)
              .margin({ right: 8 })
              .onClick(() => {
                this.switchCategory(category.id);
              })
          }, (category: { id: CategoryType }) => category.id)
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 8, bottom: 8 })
      }
      .scrollable(ScrollDirection.Horizontal)
      .scrollBar(BarState.Off)
      .width('100%')

      // 搜索结果计数
      Row() {
        Text(`找到 ${this.searchResults.length} 个商品`)
          .fontSize(13)
          .fontColor('#999999')
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 8, bottom: 8 })

      // 搜索结果列表
      if (this.isLoading) {
        Column() {
          LoadingProgress()
            .width(50)
            .height(50)
            .color('#FF5722')
          Text('搜索中...')
            .fontSize(14)
            .fontColor('#999999')
            .margin({ top: 10 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else if (this.searchResults.length === 0) {
        // 空结果
        Column() {
          Text('🔍')
            .fontSize(60)
            .margin({ bottom: 16 })
          Text('未找到相关商品')
            .fontSize(16)
            .fontColor('#999999')
            .margin({ bottom: 8 })
          Text(`换个关键词试试吧`)
            .fontSize(14)
            .fontColor('#CCCCCC')
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        Scroll() {
          Column() {
            ForEach(this.searchResults, (item: ProductItem) => {
              this.SearchResultItem(item);
            }, (item: ProductItem) => item.id)
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 8, bottom: 16 })
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Off)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  @Builder
  SearchResultItem(item: ProductItem) {
    Row() {
      // 商品图片
      Image(item.imageUrl)
        .width(100)
        .height(100)
        .borderRadius(8)
        .objectFit(ImageFit.Cover)
        .backgroundColor('#F0F0F0')
        .onError(() => {
          // 图片加载失败显示默认图
        })

      // 商品信息
      Column() {
        Text(item.name)
          .fontSize(15)
          .fontColor('#333333')
          .fontWeight(FontWeight.Medium)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')

        Text(item.description)
          .fontSize(12)
          .fontColor('#999999')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')
          .margin({ top: 4 })

        Row() {
          Text(`¥${item.price}`)
            .fontSize(18)
            .fontColor('#FF5722')
            .fontWeight(FontWeight.Bold)

          Blank()

          Text(`${item.sales}人付款`)
            .fontSize(12)
            .fontColor('#999999')
        }
        .width('100%')
        .margin({ top: 8 })
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
      // 跳转到商品详情
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
