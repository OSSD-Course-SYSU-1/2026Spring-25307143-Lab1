/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';

@Builder
function GoodsItemBuilder(item: ProductItem, index: number, mode: string) {
  Column() {
    // 商品图片
    Image(item.imageUrl)
      .width('100%')
      .height(120)
      .objectFit(ImageFit.Cover)
      .borderRadius({ topLeft: 8, topRight: 8 })

    // 商品信息
    Column() {
      // 商品名称
      Text(item.name)
        .fontSize(14)
        .fontColor('#333333')
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .margin({ top: 8, bottom: 4 })

      // 价格和销量
      Row() {
        Text(`¥${item.price}`)
          .fontSize(16)
          .fontColor('#FF5722')
          .fontWeight(FontWeight.Bold)

        Blank()

        Text(`${item.sales}人付款`)
          .fontSize(12)
          .fontColor('#999999')
      }
      .width('100%')
      .margin({ bottom: 4 })

      // 店铺信息
      Text(item.shopName)
        .fontSize(12)
        .fontColor('#666666')
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
    }
    .padding(8)
    .alignItems(HorizontalAlign.Start)
  }
  .width('100%')
  .backgroundColor(Color.White)
  .borderRadius(8)
  .shadow({ radius: 2, color: '#1A000000', offsetX: 0, offsetY: 1 })
  .onClick(() => {
    // 跳转到商品详情页
    router.pushUrl({
      url: 'pages/ProductDetailPage',
      params: {
        productData: item,
        mode: mode
      }
    });
  })
}

// 商品数据接口
interface ProductItem {
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
export struct HomePage {
  @Prop mainBoxPadding: number = 0;
  @Prop currentMode: string = 'shopping';
  @State message: string = 'Hello World';
  @State currentCategory: string = 'comprehensive'; // 当前分类
  @State productList: ProductItem[] = []; // 商品列表
  @State isLoading: boolean = false;
  @State searchKeyword: string = ''; // 搜索关键词

  // 跳转到搜索结果页
  navigateToSearch() {
    router.pushUrl({
      url: 'pages/SearchResultPage',
      params: {
        keyword: this.searchKeyword,
        category: this.currentCategory,
        currentMode: this.currentMode
      }
    });
  }

  // 分类列表
  private categories: string[] = ['comprehensive', 'baby', 'sports', 'beauty', 'outdoor', 'digital'];
  private categoryNames: Record<string, string> = {
    'comprehensive': '综合',
    'baby': '母婴',
    'sports': '运动',
    'beauty': '美妆',
    'outdoor': '户外',
    'digital': '数码'
  };

  aboutToAppear() {
    // 加载商品数据
    this.loadProducts();
  }

  // 加载商品数据
  loadProducts() {
    this.isLoading = true;
    // 模拟加载延迟
    setTimeout(() => {
      this.productList = this.generateMockProducts();
      this.isLoading = false;
    }, 500);
  }

  // 生成模拟商品数据
  generateMockProducts(): ProductItem[] {
    const products: ProductItem[] = [];
    
    // 淘宝真实商品数据
    const taobaoProducts: ProductItem[] = [
      {
        id: 'product_1',
        name: '树莓派人形机器人AI视觉大模型TonyPi仿生双足具身智能Python编程',
        price: 3699,
        imageUrl: 'https://img.alicdn.com/imgextra/i1/2201505950941/O1CN01b9Yn2f1Ip1lBcepD3_!!2201505950941.png_760x760q30.jpg_.webp',
        sales: 128,
        shopName: '幻尔旗舰店',
        description: '树莓派人形机器人TonyPi是一款具备AI视觉大模型能力的仿生双足机器人，支持Python编程，适合STEM教育和人工智能学习。具备自主导航、语音交互、视觉识别等功能，是学习机器人和AI技术的理想平台。',
        shippingAddress: '广东省深圳市',
        stock: 50,
        category: '数码'
      },
      {
        id: 'product_2',
        name: '【618立即抢购】毛戈平鱼子酱面膜涂抹熬夜救星舒缓修护抗皱紧致',
        price: 299,
        imageUrl: 'https://img.alicdn.com/imgextra/i2/839895996/O1CN01cqDCSd1uADugGJQZV_!!839895996.jpg_760x760q30.jpg_.webp',
        sales: 5623,
        shopName: 'MAOGEPING毛戈平官方旗舰店',
        description: '毛戈平鱼子酱面膜，富含深海鱼子酱精华，能够深层滋养肌肤，舒缓修护，抗皱紧致。适合熬夜肌肤使用，快速恢复肌肤弹性与光泽，让肌肤重现年轻状态。',
        shippingAddress: '上海市',
        stock: 200,
        category: '美妆'
      },
      {
        id: 'product_3',
        name: '苏泊尔电烤箱家用大容量蒸烤炸一体多功能智能调控长效预约烘焙箱',
        price: 599,
        imageUrl: 'https://img.alicdn.com/imgextra/i3/2219155702334/O1CN01nMjc3X1T71RStDyKK_!!2219155702334.jpg_760x760q30.jpg_.webp',
        sales: 892,
        shopName: '苏泊尔智能阳台旗舰店',
        description: '苏泊尔电烤箱，大容量设计，支持蒸、烤、炸多种烹饪方式。智能温控系统，长效预约功能，让烹饪更轻松。适合家庭使用，满足各种烘焙需求。',
        shippingAddress: '浙江省杭州市',
        stock: 150,
        category: '综合'
      },
      {
        id: 'product_4',
        name: '灵动创想初音未来马尾甩甩毛绒玩偶周边挂件fufu公仔娃娃生日礼物',
        price: 89,
        imageUrl: 'https://img.alicdn.com/imgextra//8b/56/TB1bRlZQpXXXXbZXpXXSutbFXXX.jpg_760x760q30.jpg_.webp',
        sales: 3456,
        shopName: '灵动创想旗舰店',
        description: '初音未来官方授权毛绒玩偶，采用优质毛绒材质，手感柔软舒适。可爱的马尾甩甩造型，适合作为挂件或摆件，是初音未来粉丝的必备收藏品。',
        shippingAddress: '北京市',
        stock: 300,
        category: '综合'
      }
    ];
    
    // 根据当前模式返回不同数据
    if (this.currentMode === 'shopping') {
      // 购物模式：返回淘宝真实数据
      return taobaoProducts;
    } else {
      // 市集模式：返回模拟二手数据
      for (let i = 1; i <= 10; i++) {
        products.push({
          id: `market_product_${i}`,
          name: `二手${this.categoryNames[this.currentCategory]}商品${i} - 成色良好`,
          price: Math.floor(Math.random() * 300) + 50,
          imageUrl: `https://via.placeholder.com/200x200?text=二手商品${i}`,
          sales: Math.floor(Math.random() * 100),
          shopName: '个人卖家',
          description: `这是二手${this.categoryNames[this.currentCategory]}商品，成色良好，使用时间不长，功能完好，价格实惠。欢迎咨询购买。`,
          shippingAddress: '全国包邮',
          stock: 1,
          category: this.categoryNames[this.currentCategory]
        });
      }
      return products;
    }
  }

  build() {
    Column() {
      // 顶部搜索栏
      Row() {
        // 搜索输入框
        TextInput({ placeholder: '搜索商品', text: this.searchKeyword })
          .layoutWeight(1)
          .height(36)
          .backgroundColor('#FFFFFF')
          .borderRadius(18)
          .placeholderColor('#999999')
          .placeholderFont({ size: 14 })
          .fontColor('#333333')
          .fontSize(14)
          .padding({ left: 16, right: 16 })
          .onChange((value: string) => {
            this.searchKeyword = value;
          })
          .onSubmit(() => {
            this.navigateToSearch();
          })

        // 搜索按钮
        Button('搜索')
          .fontSize(14)
          .fontColor('#FFFFFF')
          .backgroundColor('#FF5722')
          .borderRadius(18)
          .height(36)
          .width(60)
          .margin({ left: 8, right: 12 })
          .onClick(() => {
            this.navigateToSearch();
          })
      }
      .width('100%')
      .height(56)
      .backgroundColor('#FF5722')
      .alignItems(VerticalAlign.Center)
      .padding({ left: 12, right: 0 })

      // 分类标签
      Scroll() {
        Row() {
          ForEach(this.categories, (category: string) => {
            Text(this.categoryNames[category])
              .fontSize(14)
              .fontColor(this.currentCategory === category ? '#FF5722' : '#666666')
              .padding({ left: 12, right: 12, top: 6, bottom: 6 })
              .backgroundColor(this.currentCategory === category ? '#FFE0B2' : '#FFFFFF')
              .borderRadius(15)
              .margin({ right: 8 })
              .onClick(() => {
                this.currentCategory = category;
                this.loadProducts();
              })
          })
        }
        .width('100%')
      }
      .scrollable(ScrollDirection.Horizontal)
      .width('100%')
      .padding({ left: 10, right: 10, top: 10, bottom: 10 })
      .backgroundColor('#F5F5F5')

      // 商品列表
      if (this.isLoading) {
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
        .height('100%')
        .justifyContent(FlexAlign.Center)
      } else {
        Grid() {
          ForEach(this.productList, (item: ProductItem, index: number) => {
            GridItem() {
              GoodsItemBuilder(item, index, this.currentMode)
            }
          })
        }
        .columnsTemplate('1fr 1fr')
        .rowsGap(10)
        .columnsGap(10)
        .padding(10)
        .width('100%')
        .layoutWeight(1)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}
