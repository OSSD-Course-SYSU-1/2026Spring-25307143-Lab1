/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';
import { CartItem, CartMode } from '../common/CartManager';
import { FavoriteService } from '../services/FavoriteService';
import { CartService } from '../services/CartService';
import { FavoriteRecord } from '../models/FavoriteModel';

// 商品详情数据接口
interface ProductDetail {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sales: number;
  shopName: string;
  description: string;
  shippingAddress: string;
  stock: number;
  category: string;
}

@Entry
@Component
struct ProductDetailPage {
  @State productDetail: ProductDetail | null = null;
  @State isLoading: boolean = true;
  @State selectedQuantity: number = 1;
  @State currentMode: CartMode = 'shopping'; // 当前购物车模式
  @State isFavorited: boolean = false; // 是否已收藏

  aboutToAppear() {
    // 获取路由传递的参数
    const params = router.getParams() as Record<string, Object>;
    if (params && params['productData']) {
      this.productDetail = params['productData'] as ProductDetail;
    }
    // 获取当前模式参数
    if (params && params['mode']) {
      this.currentMode = params['mode'] as CartMode;
    }
    // 检查是否已收藏
    if (this.productDetail) {
      this.isFavorited = FavoriteService.getInstance().isFavorite(this.productDetail.id);
    }
    this.isLoading = false;
  }

  // 切换收藏状态
  toggleFavorite() {
    if (!this.productDetail) {
      return;
    }
    const record: FavoriteRecord = {
      productId: this.productDetail.id,
      name: this.productDetail.name,
      price: this.productDetail.price,
      imageUrl: this.productDetail.imageUrl,
      shopName: this.productDetail.shopName,
      description: this.productDetail.description,
      addedTime: new Date().toLocaleString('zh-CN')
    };
    FavoriteService.getInstance().toggleFavorite(record).then((isFav: boolean) => {
      this.isFavorited = isFav;
    });
  }

  // 构建商品图片区域
  @Builder
  ProductImageBuilder() {
    Column() {
      if (this.productDetail) {
        Image(this.productDetail.imageUrl)
          .width('100%')
          .height(350)
          .objectFit(ImageFit.Cover)
      }
    }
    .width('100%')
  }

  // 构建商品信息区域
  @Builder
  ProductInfoBuilder() {
    if (this.productDetail) {
      Column() {
        // 价格
        Row() {
          Text('¥')
            .fontSize(16)
            .fontColor('#FF5722')
            .fontWeight(FontWeight.Bold)
          
          Text(`${this.productDetail.price}`)
            .fontSize(28)
            .fontColor('#FF5722')
            .fontWeight(FontWeight.Bold)
        }
        .alignItems(VerticalAlign.Bottom)
        .margin({ bottom: 12 })

        // 商品名称
        Text(this.productDetail.name)
          .fontSize(18)
          .fontColor('#333333')
          .fontWeight(FontWeight.Medium)
          .maxLines(3)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .width('100%')
          .margin({ bottom: 16 })

        // 销量和库存
        Row() {
          Text(`已售 ${this.productDetail.sales} 件`)
            .fontSize(14)
            .fontColor('#999999')
          
          Blank()
          
          Text(`库存 ${this.productDetail.stock} 件`)
            .fontSize(14)
            .fontColor('#999999')
        }
        .width('100%')
        .margin({ bottom: 16 })

        // 分割线
        Divider()
          .color('#E5E5E5')
          .margin({ bottom: 16 })

        // 发货地
        Row() {
          Text('发货地：')
            .fontSize(14)
            .fontColor('#666666')
          
          Text(this.productDetail.shippingAddress)
            .fontSize(14)
            .fontColor('#333333')
        }
        .width('100%')
        .margin({ bottom: 12 })

        // 商品分类
        Row() {
          Text('分类：')
            .fontSize(14)
            .fontColor('#666666')
          
          Text(this.productDetail.category)
            .fontSize(14)
            .fontColor('#333333')
        }
        .width('100%')
        .margin({ bottom: 16 })

        // 分割线
        Divider()
          .color('#E5E5E5')
          .margin({ bottom: 16 })

        // 商品详情标题
        Text('商品详情')
          .fontSize(16)
          .fontColor('#333333')
          .fontWeight(FontWeight.Medium)
          .width('100%')
          .margin({ bottom: 12 })

        // 商品描述
        Text(this.productDetail.description)
          .fontSize(14)
          .fontColor('#666666')
          .lineHeight(22)
          .width('100%')
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .borderRadius({ topLeft: 16, topRight: 16 })
      .margin({ top: -16 })
    }
  }

  // 构建店铺信息
  @Builder
  ShopInfoBuilder() {
    if (this.productDetail) {
      Column() {
        Row() {
          // 店铺图标
          Column() {
            Text(this.productDetail.shopName.charAt(0))
              .fontSize(24)
              .fontColor(Color.White)
              .fontWeight(FontWeight.Bold)
          }
          .width(50)
          .height(50)
          .backgroundColor('#FF5722')
          .borderRadius(25)
          .justifyContent(FlexAlign.Center)

          // 店铺名称
          Column() {
            Text(this.productDetail.shopName)
              .fontSize(16)
              .fontColor('#333333')
              .fontWeight(FontWeight.Medium)
            
            Text('进店看看 >')
              .fontSize(12)
              .fontColor('#999999')
              .margin({ top: 4 })
          }
          .alignItems(HorizontalAlign.Start)
          .margin({ left: 12 })
          .layoutWeight(1)
        }
        .width('100%')
        .alignItems(VerticalAlign.Center)
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Color.White)
      .margin({ top: 12 })
    }
  }

  // 构建底部操作栏
  @Builder
  BottomActionBar() {
    Row() {
      // 客服
      Column() {
        Text('客服')
          .fontSize(12)
          .fontColor('#666666')
      }
      .layoutWeight(1)
      .padding(8)

      // 购物车
      Column() {
        Text('购物车')
          .fontSize(12)
          .fontColor('#666666')
      }
      .layoutWeight(1)
      .padding(8)
      .onClick(() => {
        // 跳转到购物车页面（切换底部Tab）
        AppStorage.setOrCreate('switchToPage', 'ShoppingCartPage');
        router.pushUrl({ url: 'pages/Index' });
      })

      // 加入购物车
      Button('加入购物车')
        .fontSize(14)
        .fontColor('#FF5722')
        .backgroundColor('#FFE0B2')
        .borderRadius(20)
        .layoutWeight(2)
        .height(40)
        .onClick(() => {
          // 加入购物车
          if (this.productDetail) {
            const cartItem: CartItem = {
              id: this.productDetail.id,
              name: this.productDetail.name,
              price: this.productDetail.price,
              imageUrl: this.productDetail.imageUrl,
              quantity: this.selectedQuantity,
              shopName: this.productDetail.shopName,
              selected: true
            };
            CartService.getInstance().addToCart(cartItem, this.currentMode).then(() => {
              // 提示用户
              AlertDialog.show({
                title: '成功',
                message: `商品已加入${this.currentMode === 'shopping' ? '购物车' : '市集购物车'}`,
                autoCancel: true,
                alignment: DialogAlignment.Center
              });
            });
          }
        })

      // 立即购买
      Button('立即购买')
        .fontSize(14)
        .fontColor(Color.White)
        .backgroundColor('#FF5722')
        .borderRadius(20)
        .layoutWeight(2)
        .height(40)
        .margin({ left: 8 })
        .onClick(() => {
          // 立即购买，跳转到创建订单页面
          if (this.productDetail) {
            router.pushUrl({
              url: 'pages/CreateOrderPage',
              params: {
                productData: this.productDetail,
                quantity: this.selectedQuantity
              }
            });
          }
        })
    }
    .width('100%')
    .height(60)
    .backgroundColor(Color.White)
    .padding({ left: 16, right: 16 })
    .border({ width: { top: 1 }, color: '#E5E5E5' })
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        // 返回按钮
        Button() {
          Row() {
            Text('←')
              .fontSize(20)
              .fontColor(Color.White)
          }
        }
        .width(40)
        .height(40)
        .backgroundColor(Color.Transparent)
        .onClick(() => {
          router.back();
        })

        Blank()

        Text('商品详情')
          .fontSize(18)
          .fontColor(Color.White)
          .fontWeight(FontWeight.Medium)

        Blank()

        // 收藏按钮
        Text(this.isFavorited ? '❤️' : '🤍')
          .fontSize(22)
          .width(40)
          .height(40)
          .onClick(() => {
            this.toggleFavorite();
          })
      }
      .width('100%')
      .height(56)
      .backgroundColor('#FF5722')
      .padding({ left: 8, right: 8 })

      if (this.isLoading) {
        // 加载状态
        Column() {
          LoadingProgress()
            .width(50)
            .height(50)
            .color('#FF5722')
          
          Text('加载中...')
            .fontSize(14)
            .fontColor('#999999')
            .margin({ top: 10 })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      } else if (this.productDetail) {
        // 商品详情内容
        Scroll() {
          Column() {
            // 商品图片
            this.ProductImageBuilder()

            // 商品信息
            this.ProductInfoBuilder()

            // 店铺信息
            this.ShopInfoBuilder()
          }
          .width('100%')
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Off)
        .edgeEffect(EdgeEffect.Spring)

        // 底部操作栏
        this.BottomActionBar()
      } else {
        // 错误状态
        Column() {
          Text('商品信息加载失败')
            .fontSize(16)
            .fontColor('#999999')
          
          Button('返回')
            .fontSize(14)
            .backgroundColor('#FF5722')
            .margin({ top: 20 })
            .onClick(() => {
              router.back();
            })
        }
        .width('100%')
        .layoutWeight(1)
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}
