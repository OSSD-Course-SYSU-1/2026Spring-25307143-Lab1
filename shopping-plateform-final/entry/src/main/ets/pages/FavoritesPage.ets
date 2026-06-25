/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { FavoriteRecord } from '../models/FavoriteModel';
import { FavoriteService } from '../services/FavoriteService';

@Entry
@Component
struct FavoritesPage {
  @State favorites: FavoriteRecord[] = [];
  @State isLoading: boolean = true;

  private favoriteService: FavoriteService = FavoriteService.getInstance();

  aboutToAppear() {
    this.loadFavorites();
  }

  onPageShow() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.isLoading = true;
    this.favorites = this.favoriteService.getAllFavorites();
    this.isLoading = false;
  }

  // 取消收藏
  removeFavorite(productId: string, productName: string) {
    AlertDialog.show({
      title: '确认取消收藏',
      message: `确定要取消收藏"${productName}"吗？`,
      autoCancel: true,
      alignment: DialogAlignment.Center,
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '确定',
        action: () => {
          this.favoriteService.removeFavorite(productId);
          this.loadFavorites();
        }
      }
    });
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

        Text('我的收藏')
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
      } else if (this.favorites.length === 0) {
        // 空收藏夹
        Column() {
          Text('❤️')
            .fontSize(60)
            .opacity(0.4)
            .margin({ bottom: 16 })

          Text('还没有收藏商品')
            .fontSize(16)
            .fontColor('#999999')
            .margin({ bottom: 8 })

          Text('去逛逛，发现喜欢的商品吧')
            .fontSize(14)
            .fontColor('#CCCCCC')

          Button('去逛逛')
            .fontSize(14)
            .fontColor(Color.White)
            .backgroundColor('#FF5722')
            .borderRadius(20)
            .width(140)
            .height(40)
            .margin({ top: 20 })
            .onClick(() => {
              router.back();
            })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else {
        // 收藏列表
        Scroll() {
          Column() {
            Row() {
              Text(`共 ${this.favorites.length} 件商品`)
                .fontSize(13)
                .fontColor('#999999')
            }
            .width('100%')
            .padding({ bottom: 12 })

            ForEach(this.favorites, (item: FavoriteRecord) => {
              this.FavoriteItem(item);
            }, (item: FavoriteRecord) => item.productId)
          }
          .width('100%')
          .padding({ left: 16, right: 16, bottom: 16 })
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }

  @Builder
  FavoriteItem(item: FavoriteRecord) {
    Row() {
      // 商品图片
      Image(item.imageUrl)
        .width(100)
        .height(100)
        .borderRadius(8)
        .objectFit(ImageFit.Cover)
        .backgroundColor('#F0F0F0')

      // 商品信息
      Column() {
        Text(item.name)
          .fontSize(15)
          .fontColor('#333333')
          .fontWeight(FontWeight.Medium)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')

        Text(item.shopName)
          .fontSize(12)
          .fontColor('#999999')
          .margin({ top: 4 })

        Row() {
          Text(`¥${item.price}`)
            .fontSize(18)
            .fontColor('#FF5722')
            .fontWeight(FontWeight.Bold)

          Blank()

          Text(item.addedTime)
            .fontSize(11)
            .fontColor('#CCCCCC')
        }
        .width('100%')
        .margin({ top: 8 })
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .margin({ left: 12 })

      // 取消收藏按钮
      Button('取消收藏')
        .fontSize(12)
        .fontColor('#FF5722')
        .backgroundColor('#FFF0ED')
        .borderRadius(15)
        .height(30)
        .padding({ left: 10, right: 10 })
        .onClick(() => {
          this.removeFavorite(item.productId, item.name);
        })
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Color.White)
    .borderRadius(10)
    .margin({ bottom: 10 })
    .onClick(() => {
      // 跳转到商品详情
      router.pushUrl({
        url: 'pages/ProductDetailPage',
        params: {
          productData: {
            id: item.productId,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            sales: 0,
            shopName: item.shopName,
            description: item.description,
            shippingAddress: '',
            stock: 999,
            category: ''
          }
        }
      });
    })
  }
}
