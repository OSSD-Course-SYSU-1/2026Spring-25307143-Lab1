/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */
import { router } from '@kit.ArkUI';

// 商品分类类型
type CategoryType = 'comprehensive' | 'baby' | 'sports' | 'beauty' | 'outdoor' | 'digital';

// 分类配置
interface CategoryConfig {
  id: CategoryType;
  name: string;
}

@Entry
@Component
struct SearchPage {
  @State searchText: string = '';
  @State currentCategory: CategoryType = 'comprehensive';
  @State currentMode: 'shopping' | 'market' = 'shopping';
  @State searchHistory: string[] = ['手机', '电脑', '衣服', '鞋子'];
  @State hotSearchWords: string[] = ['华为手机', '运动鞋', '美妆套装', '户外背包', '母婴用品', '数码相机'];
  
  // 分类列表
  private categories: CategoryConfig[] = [
    { id: 'comprehensive', name: '综合' },
    { id: 'baby', name: '母婴' },
    { id: 'sports', name: '运动' },
    { id: 'beauty', name: '美妆' },
    { id: 'outdoor', name: '户外' },
    { id: 'digital', name: '数码' }
  ];

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
  }

  // 执行搜索
  performSearch() {
    if (this.searchText.trim()) {
      // 添加到搜索历史
      if (!this.searchHistory.includes(this.searchText.trim())) {
        this.searchHistory.unshift(this.searchText.trim());
        if (this.searchHistory.length > 10) {
          this.searchHistory.pop();
        }
      }

      // 跳转到搜索结果页面
      router.pushUrl({
        url: 'pages/SearchResultPage',
        params: {
          keyword: this.searchText.trim(),
          category: this.currentCategory,
          currentMode: this.currentMode
        }
      });
    }
  }

  // 清空搜索历史
  clearHistory() {
    this.searchHistory = [];
  }

  build() {
    Column() {
      // 搜索栏
      Row() {
        Button('←')
          .width(40)
          .height(40)
          .fontSize(20)
          .backgroundColor(Color.Transparent)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .onClick(() => {
            router.back();
          })

        Row() {
          Text('🔍')
            .fontSize(16)
            .margin({ right: 8 })

          TextInput({ placeholder: '搜索商品', text: this.searchText })
            .layoutWeight(1)
            .height(40)
            .fontSize(14)
            .fontColor($r('sys.color.ohos_id_color_text_primary'))
            .backgroundColor(Color.Transparent)
            .onChange((value: string) => {
              this.searchText = value;
            })
            .onSubmit(() => {
              this.performSearch();
            })

          if (this.searchText) {
            Text('✕')
              .fontSize(16)
              .fontColor($r('sys.color.ohos_id_color_text_secondary'))
              .onClick(() => {
                this.searchText = '';
              })
          }
        }
        .layoutWeight(1)
        .height(40)
        .padding({ left: 12, right: 12 })
        .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
        .borderRadius(20)

        Button('搜索')
          .height(40)
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor($r('app.color.activity_color'))
          .borderRadius(20)
          .margin({ left: 8 })
          .onClick(() => {
            this.performSearch();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 8, bottom: 8 })

      // 分类筛选
      Scroll() {
        Row() {
          ForEach(this.categories, (category: CategoryConfig) => {
            Column() {
              Text(category.name)
                .fontSize(14)
                .fontColor(this.currentCategory === category.id ? 
                  $r('app.color.activity_color') : 
                  $r('sys.color.ohos_id_color_text_primary'))
                .fontWeight(this.currentCategory === category.id ? FontWeight.Bold : FontWeight.Normal)
            }
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            .onClick(() => {
              this.currentCategory = category.id;
            })
          }, (category: CategoryConfig) => category.id)
        }
        .width('100%')
      }
      .scrollable(ScrollDirection.Horizontal)
      .scrollBar(BarState.Off)
      .width('100%')
      .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
      .margin({ top: 8 })

      Scroll() {
        Column() {
          // 搜索历史
          if (this.searchHistory.length > 0) {
            Column() {
              Row() {
                Text('搜索历史')
                  .fontSize(16)
                  .fontColor($r('sys.color.ohos_id_color_text_primary'))
                  .fontWeight(FontWeight.Medium)

                Blank()

                Text('清空')
                  .fontSize(14)
                  .fontColor($r('sys.color.ohos_id_color_text_secondary'))
                  .onClick(() => {
                    this.clearHistory();
                  })
              }
              .width('100%')
              .margin({ bottom: 16 })

              Flex({ wrap: FlexWrap.Wrap }) {
                ForEach(this.searchHistory, (keyword: string) => {
                  Text(keyword)
                    .fontSize(14)
                    .fontColor($r('sys.color.ohos_id_color_text_primary'))
                    .padding({ left: 12, right: 12, top: 8, bottom: 8 })
                    .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
                    .borderRadius(16)
                    .margin({ right: 8, bottom: 8 })
                    .onClick(() => {
                      this.searchText = keyword;
                      this.performSearch();
                    })
                }, (keyword: string) => keyword)
              }
              .width('100%')
            }
            .width('100%')
            .padding(16)
            .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
            .borderRadius(12)
            .margin({ top: 16, bottom: 16 })
          }

          // 热门搜索
          Column() {
            Text('热门搜索')
              .fontSize(16)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .fontWeight(FontWeight.Medium)
              .margin({ bottom: 16 })

            Flex({ wrap: FlexWrap.Wrap }) {
              ForEach(this.hotSearchWords, (keyword: string, index: number) => {
                Row() {
                  Text(`${index + 1}`)
                    .fontSize(12)
                    .fontColor(index < 3 ? $r('app.color.activity_color') : $r('sys.color.ohos_id_color_text_secondary'))
                    .fontWeight(FontWeight.Bold)
                    .margin({ right: 8 })

                  Text(keyword)
                    .fontSize(14)
                    .fontColor($r('sys.color.ohos_id_color_text_primary'))
                }
                .padding({ left: 12, right: 12, top: 8, bottom: 8 })
                .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
                .borderRadius(16)
                .margin({ right: 8, bottom: 8 })
                .onClick(() => {
                  this.searchText = keyword;
                  this.performSearch();
                })
              }, (keyword: string) => keyword)
            }
            .width('100%')
          }
          .width('100%')
          .padding(16)
          .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
          .borderRadius(12)
          .margin({ bottom: 16 })

          // 推荐商品
          Column() {
            Text('推荐商品')
              .fontSize(16)
              .fontColor($r('sys.color.ohos_id_color_text_primary'))
              .fontWeight(FontWeight.Medium)
              .margin({ bottom: 16 })

            ForEach([1, 2, 3], (item: number) => {
              this.ProductItem(item);
            }, (item: number) => item.toString())
          }
          .width('100%')
          .padding(16)
          .backgroundColor($r('sys.color.ohos_id_color_card_bg'))
          .borderRadius(12)
        }
        .width('100%')
        .padding({ left: 16, right: 16 })
      }
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('sys.color.ohos_id_color_panel_bg'))
  }

  @Builder
  ProductItem(index: number) {
    Row() {
      Image($r('app.media.ic_cart'))
        .width(80)
        .height(80)
        .borderRadius(8)
        .backgroundColor($r('sys.color.ohos_id_color_panel_bg'))

      Column() {
        Text(`推荐商品${index}`)
          .fontSize(16)
          .fontColor($r('sys.color.ohos_id_color_text_primary'))
          .fontWeight(FontWeight.Medium)
          .margin({ bottom: 8 })

        Text(`¥${(index * 99.9).toFixed(2)}`)
          .fontSize(14)
          .fontColor($r('app.color.activity_color'))
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: 4 })

        Text(`${this.getCategoryName(this.currentCategory)}分类`)
          .fontSize(12)
          .fontColor($r('sys.color.ohos_id_color_text_secondary'))
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .margin({ left: 12 })
    }
    .width('100%')
    .padding(12)
    .backgroundColor($r('sys.color.ohos_id_color_panel_bg'))
    .borderRadius(8)
    .margin({ bottom: 12 })
  }

  // 获取分类名称
  private getCategoryName(category: CategoryType): string {
    const categoryConfig = this.categories.find(c => c.id === category);
    return categoryConfig ? categoryConfig.name : '综合';
  }
}
