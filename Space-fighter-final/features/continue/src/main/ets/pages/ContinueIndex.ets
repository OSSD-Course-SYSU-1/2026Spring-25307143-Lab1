/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { GameModePage } from './GameModePage';
import { GamePage } from './GamePage';
import { LevelSelectPage } from './LevelSelectPage';

@Component
export struct ContinueIndex {
  @Provide navPathStack: NavPathStack = new NavPathStack();
  @State private isRestoring: boolean = false;

  @Builder
  pageMap(name: string) {
    if (name === 'gameModePage') {
      GameModePage()
    } else if (name === 'gamePage') {
      GamePage()
    } else if (name === 'levelSelectPage') {
      LevelSelectPage()
    }
  }

  aboutToAppear() {
    // Check if this is a continuation restore
    const savedScore = AppStorage.get<number>('gameScore');
    if (savedScore !== undefined && savedScore > 0) {
      // Show loading animation, then jump directly into game
      this.isRestoring = true;
      setTimeout(() => {
        this.isRestoring = false;
        this.navPathStack.pushPath({ name: 'gamePage' });
      }, 1200);
    } else {
      // Fresh start - push game mode selection
      this.navPathStack.pushPath({ name: 'gameModePage' });
    }
  }

  build() {
    Navigation(this.navPathStack) {
      if (this.isRestoring) {
        // Continuation loading screen
        Column() {
          // Animated pulse ring
          Column() {
            // Outer ring
            Circle()
              .width(100)
              .height(100)
              .fill('rgba(33,150,243,0)')
              .stroke('#2196F3')
              .strokeWidth(3)
              .opacity(0.6)

            // Inner icon
            Text('🔄')
              .fontSize(48)
              .opacity(0.9)
              .transition(TransitionEffect.OPACITY.animation({ duration: 600, curve: Curve.EaseInOut }))
          }
          .width(120)
          .height(120)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
          .margin({ bottom: 24 })

          Text('正在恢复游戏...')
            .fontSize(20)
            .fontColor('rgba(255,255,255,0.8)')
            .fontWeight(FontWeight.Medium)
            .margin({ bottom: 8 })

          Text('跨设备接续中')
            .fontSize(14)
            .fontColor('rgba(255,255,255,0.4)')

          // Loading bar
          Stack() {
            Row()
              .width(160)
              .height(4)
              .backgroundColor('rgba(255,255,255,0.1)')
              .borderRadius(2)
            Row()
              .width('30%')
              .height(4)
              .backgroundColor('#2196F3')
              .borderRadius(2)
          }
          .width(160)
          .height(4)
          .margin({ top: 24 })
        }
        .width('100%')
        .height('100%')
        .backgroundColor('#0a0a2e')
        .justifyContent(FlexAlign.Center)
        .alignItems(HorizontalAlign.Center)
      } else {
        // Normal navigation content (empty container, pages pushed via navPathStack)
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('#0a0a2e')
      }
    }
    .mode(NavigationMode.Stack)
    .hideTitleBar(true)
    .hideToolBar(true)
    .navDestination(this.pageMap)
  }
}
