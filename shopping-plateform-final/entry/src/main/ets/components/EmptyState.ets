/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */

/**
 * 通用空状态组件
 */

@Component
export struct EmptyState {
  @Prop icon: string = '📦';
  @Prop title: string = '暂无内容';
  @Prop description: string = '';
  @Prop actionText: string = '';
  action?: () => void;

  build() {
    Column() {
      Text(this.icon)
        .fontSize(60)
        .opacity(0.4)
        .margin({ bottom: 16 })

      Text(this.title)
        .fontSize(16)
        .fontColor('#999999')
        .margin({ bottom: this.description ? 8 : 0 })

      if (this.description) {
        Text(this.description)
          .fontSize(14)
          .fontColor('#CCCCCC')
          .margin({ bottom: this.actionText ? 20 : 0 })
      }

      if (this.actionText && this.action) {
        Button(this.actionText)
          .fontSize(14)
          .fontColor(Color.White)
          .backgroundColor('#FF5722')
          .borderRadius(20)
          .width(140)
          .height(40)
          .onClick(() => {
            if (this.action) {
              this.action();
            }
          })
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
