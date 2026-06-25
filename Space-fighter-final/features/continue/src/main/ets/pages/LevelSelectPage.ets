/*
 * Copyright (c) 2026
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { GameDataSync } from '../utils/GameDataSync';
import { common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import {
  isBossLevel, getLevelTheme,
  getLevelObjectives, SpecialObjective,
  ELITE_MIN_LEVEL
} from '../configs/GameConfig';

const DOMAIN = 0x0000;
const TAG = 'LevelSelectPage';
const TOTAL_LEVELS = 50;
const COLS = 5;
const CHAPTER_SIZE = 10;
const MAX_CHAPTER = Math.ceil(TOTAL_LEVELS / CHAPTER_SIZE);

interface LevelCompletionData {
  stars: number;
  completed: boolean;
  bestScore: number;
}

interface LevelProgressData {
  levels: Record<number, LevelCompletionData>;
  totalStars: number;
}

interface LevelCellData {
  level: number;
  stars: number;
  completed: boolean;
  unlocked: boolean;
  isBoss: boolean;
  bestScore: number;
}

@Component
export struct LevelSelectPage {
  @Consume navPathStack: NavPathStack;
  private context: common.UIAbilityContext | null = null;
  private dataSync: GameDataSync | null = null;

  @State private levelData: LevelCellData[] = [];
  @State private totalStars: number = 0;
  @State private currentChapter: number = 1;
  @State private dataLoaded: boolean = false;

  // Preview panel state
  @State private showPreview: boolean = false;
  @State private previewLevel: number = 1;
  @State private previewStars: number = 0;
  @State private previewBestScore: number = 0;
  @State private previewObjectives: SpecialObjective[] = [];
  // Chapter celebration
  @State private showChapterCelebration: boolean = false;
  @State private celebrationChapter: number = 1;

  private chapterCelebrationTimer: number = -1;

  aboutToDisappear() {
    if (this.chapterCelebrationTimer !== -1) {
      clearTimeout(this.chapterCelebrationTimer);
      this.chapterCelebrationTimer = -1;
    }
  }

  /**
   * Called every time this page becomes visible.
   * Refreshes level data after returning from GamePage.
   */
  onPageShow(): void {
    if (this.dataSync) {
      this.loadLevelData();
    }
  }

  aboutToAppear() {
    this.context = this.getUIContext().getHostContext() as common.UIAbilityContext;
    if (this.context) {
      this.dataSync = new GameDataSync(this.context);
      this.dataSync.initKVStore().then(() => {
        this.loadLevelData();
      });
    } else {
      this.loadLevelDataFallback();
    }
  }

  private async loadLevelData(): Promise<void> {
    if (!this.dataSync) {
      this.loadLevelDataFallback();
      return;
    }
    try {
      const record = await this.dataSync.loadGameRecord();
      const progress = this.parseProgress(record.levelProgressJson);
      this.totalStars = progress.totalStars;

      const cells: LevelCellData[] = [];
      for (let lvl = 1; lvl <= TOTAL_LEVELS; lvl++) {
        const completion = progress.levels[lvl];
        const unlocked = await this.dataSync.isLevelUnlocked(lvl);
        cells.push({
          level: lvl,
          stars: completion !== undefined ? completion.stars : 0,
          completed: completion !== undefined ? completion.completed : false,
          unlocked: unlocked,
          isBoss: isBossLevel(lvl),
          bestScore: completion !== undefined ? completion.bestScore : 0
        });
      }
      this.levelData = cells;
      this.dataLoaded = true;
      // Check for completed chapters
      this.checkChapterCompletion();
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'Failed to load level data: %{public}s', JSON.stringify(err));
      this.loadLevelDataFallback();
    }
  }

  private loadLevelDataFallback(): void {
    const cells: LevelCellData[] = [];
    for (let lvl = 1; lvl <= TOTAL_LEVELS; lvl++) {
      cells.push({
        level: lvl,
        stars: 0,
        completed: false,
        unlocked: lvl <= 1,
        isBoss: isBossLevel(lvl),
        bestScore: 0
      });
    }
    this.levelData = cells;
    this.dataLoaded = true;
  }

  private parseProgress(json: string): LevelProgressData {
    if (!json) {
      return { levels: {} as Record<number, LevelCompletionData>, totalStars: 0 };
    }
    try {
      const rawObj: Object = JSON.parse(json) as Object;
      const parsed: LevelProgressData = rawObj as LevelProgressData;
      if (parsed !== null && parsed.levels !== undefined && parsed.totalStars !== undefined) {
        return parsed;
      }
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'Parse progress failed: %{public}s', JSON.stringify(err));
    }
    return { levels: {} as Record<number, LevelCompletionData>, totalStars: 0 };
  }

  private getChapterLevels(): LevelCellData[] {
    const start = (this.currentChapter - 1) * CHAPTER_SIZE + 1;
    const end = Math.min(start + CHAPTER_SIZE - 1, TOTAL_LEVELS);
    const result: LevelCellData[] = [];
    for (let i = start; i <= end; i++) {
      if (this.levelData[i - 1] !== undefined) {
        result.push(this.levelData[i - 1]);
      }
    }
    return result;
  }

  /**
   * Check if the current chapter is fully completed and show celebration.
   */
  private checkChapterCompletion(): void {
    const chapter = this.currentChapter;
    const start = (chapter - 1) * CHAPTER_SIZE + 1;
    const end = Math.min(chapter * CHAPTER_SIZE, TOTAL_LEVELS);
    let allCompleted = true;
    for (let i = start; i <= end; i++) {
      const cell = this.levelData[i - 1];
      if (cell === undefined || !cell.completed) {
        allCompleted = false;
        break;
      }
    }
    if (allCompleted && chapter >= 1) {
      this.celebrationChapter = chapter;
      this.showChapterCelebration = true;
      if (this.chapterCelebrationTimer !== -1) {
        clearTimeout(this.chapterCelebrationTimer);
      }
      this.chapterCelebrationTimer = setTimeout(() => {
        this.showChapterCelebration = false;
        this.chapterCelebrationTimer = -1;
      }, 3000);
    }
  }

  private getChapterStars(): number {
    const start = (this.currentChapter - 1) * CHAPTER_SIZE + 1;
    const end = Math.min(start + CHAPTER_SIZE - 1, TOTAL_LEVELS);
    let s = 0;
    for (let i = start; i <= end; i++) {
      if (this.levelData[i - 1] !== undefined) {
        s += this.levelData[i - 1].stars;
      }
    }
    return s;
  }

  private prevChapter(): void {
    if (this.currentChapter > 1) {
      this.currentChapter--;
      this.checkChapterCompletion();
    }
  }

  private nextChapter(): void {
    if (this.currentChapter < MAX_CHAPTER) {
      this.currentChapter++;
      this.checkChapterCompletion();
    }
  }

  private onLevelClick(lvl: number): void {
    const cell = this.levelData[lvl - 1];
    if (!cell) return;
    if (!cell.unlocked) return;

    this.previewLevel = lvl;
    this.previewStars = cell.stars;
    this.previewBestScore = cell.bestScore;
    this.previewObjectives = getLevelObjectives(lvl);
    this.showPreview = true;
  }

  private startLevel(): void {
    this.showPreview = false;
    const lvl = this.previewLevel;
    AppStorage.setOrCreate('gameMode', 'level');
    AppStorage.setOrCreate('gameScore', 0);
    AppStorage.setOrCreate('gamePlayerHP', 5);
    AppStorage.setOrCreate('gamePlayerX', 0);
    AppStorage.setOrCreate('gamePlayerY', 0);
    AppStorage.setOrCreate('gameEnemies', '[]');
    AppStorage.setOrCreate('gameBullets', '[]');
    AppStorage.setOrCreate('gameStatus', 'playing');
    AppStorage.setOrCreate('gameCurrentLevel', lvl);
    AppStorage.setOrCreate('gameCurrentWave', 1);
    AppStorage.setOrCreate('gameLevelKills', 0);
    AppStorage.setOrCreate('gameLevelTarget', 8);
    AppStorage.setOrCreate('gameInvincible', false);
    AppStorage.setOrCreate('gameIsBossLevel', false);
    AppStorage.setOrCreate('gamePowerUps', '[]');
    AppStorage.setOrCreate('gameActiveBuffs', '[]');
    AppStorage.setOrCreate('gameLaunchedFromMenu', true);
    AppStorage.delete('gameSavedLevel');
    AppStorage.delete('gameSavedScore');
    this.navPathStack.pushPath({ name: 'gamePage' });
  }

  private dismissPreview(): void {
    this.showPreview = false;
  }

  build() {
    NavDestination() {
      Stack() {
        Column() {
          // ---- Header ----
          Column() {
            Text('🎯 关卡选择')
              .fontSize(28)
              .fontWeight(FontWeight.Bold)
              .fontColor(Color.White)
              .margin({ bottom: 4 })

            Text('已有 ' + this.totalStars + ' / ' + (TOTAL_LEVELS * 3) + ' 颗星')
              .fontSize(14)
              .fontColor('#FFD740')
              .margin({ bottom: 8 })

            // Chapter navigation
            Row() {
              Button() {
                Text('◀')
                  .fontSize(18)
                  .fontColor(Color.White)
              }
              .width(36)
              .height(36)
              .backgroundColor('rgba(255,255,255,0.1)')
              .borderRadius(18)
              .onClick(() => { this.prevChapter(); })

              Blank()

              Column() {
                Text('第 ' + this.currentChapter + ' 章')
                  .fontSize(20)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(Color.White)
                Text('章节星星: ' + this.getChapterStars() + ' / ' + (CHAPTER_SIZE * 3))
                  .fontSize(12)
                  .fontColor('rgba(255,255,255,0.5)')
              }
              .layoutWeight(1)
              .alignItems(HorizontalAlign.Center)

              Blank()

              Button() {
                Text('▶')
                  .fontSize(18)
                  .fontColor(Color.White)
              }
              .width(36)
              .height(36)
              .backgroundColor('rgba(255,255,255,0.1)')
              .borderRadius(18)
              .onClick(() => { this.nextChapter(); })
            }
            .width('100%')
            .padding({ left: 16, right: 16 })
          }
          .width('100%')
          .padding({ top: 20, bottom: 8 })

          // ---- Level Grid ----
          if (this.dataLoaded) {
            Scroll() {
              Column() {
                // Build grid rows: groups of COLS levels
                ForEach(this.buildLevelRows(), (rowCells: LevelCellData[]) => {
                  Row() {
                    ForEach(rowCells, (cell: LevelCellData) => {
                      this.LevelCellBuilder(cell)
                    }, (cell: LevelCellData) => String(cell.level))
                  }
                  .width('100%')
                  .justifyContent(FlexAlign.SpaceEvenly)
                  .alignItems(VerticalAlign.Center)
                  .margin({ bottom: 8 })
                }, (rowCells: LevelCellData[]) => {
                  if (rowCells.length > 0) {
                    return 'row_' + rowCells[0].level;
                  }
                  return 'row_empty';
                })
              }
              .width('100%')
              .padding({ left: 8, right: 8, top: 8 })
            }
            .layoutWeight(1)
          } else {
            Column() {
              Text('加载中...')
                .fontSize(16)
                .fontColor('rgba(255,255,255,0.5)')
            }
            .layoutWeight(1)
            .justifyContent(FlexAlign.Center)
            .alignItems(HorizontalAlign.Center)
          }

          // Bottom hint
          Text('累计 ' + this.totalStars + ' 颗星星可解锁更多章节')
            .fontSize(12)
            .fontColor('rgba(255,255,255,0.3)')
            .margin({ bottom: 16 })
        }
        .width('100%')
        .height('100%')
        .background('linear-gradient(180deg, #0a0a2e 0%, #1a1a4e 100%)')

        // ---- Level Preview Overlay ----
        if (this.showPreview) {
          this.LevelPreviewPanel()
        }

        // ---- Chapter Celebration Overlay ----
        if (this.showChapterCelebration) {
          Column() {
            Text('🎉')
              .fontSize(64)
              .margin({ bottom: 16 })

            Text('第 ' + this.celebrationChapter + ' 章 完成！')
              .fontSize(32)
              .fontWeight(FontWeight.Bold)
              .fontColor(Color.White)
              .margin({ bottom: 8 })

            Text('所有关卡已通关')
              .fontSize(18)
              .fontColor('rgba(255,255,255,0.7)')
              .margin({ bottom: 4 })

            Text('🏆 获得章节奖励 +' + this.getChapterCelebrationBonus() + ' 分')
              .fontSize(16)
              .fontColor('#FFD740')
              .margin({ top: 8 })
          }
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.8)')
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
          .zIndex(30)
        }
      }
      .width('100%')
      .height('100%')
    }
    .title('')
    .backgroundColor('#0a0a2e')
    .onBackPressed(() => {
      if (this.showPreview) {
        this.showPreview = false;
        return true;
      }
      if (this.showChapterCelebration) {
        this.showChapterCelebration = false;
        return true;
      }
      this.navPathStack.pop();
      return true;
    })
  }

  /**
   * Build grid rows from current chapter levels.
   * Groups levels into rows of COLS items each.
   */
  private buildLevelRows(): LevelCellData[][] {
    const levels = this.getChapterLevels();
    const rows: LevelCellData[][] = [];
    let row: LevelCellData[] = [];
    for (let i = 0; i < levels.length; i++) {
      row.push(levels[i]);
      if (row.length === COLS) {
        rows.push(row);
        row = [];
      }
    }
    if (row.length > 0) {
      rows.push(row);
    }
    return rows;
  }

  // ---- Level Cell Builder ----
  @Builder
  LevelCellBuilder(cell: LevelCellData) {
    Column() {
      if (cell.unlocked) {
        Text(String(cell.level))
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
      } else {
        Text('🔒')
          .fontSize(24)
      }

      if (cell.isBoss && cell.unlocked) {
        Text('👑')
          .fontSize(16)
          .margin({ top: 2 })
      }

      if (cell.completed && cell.stars > 0) {
        Row() {
          Text(this.getStarsText(cell.stars))
            .fontSize(12)
            .fontColor('#FFD740')
        }
        .margin({ top: 4 })
      }
    }
    .width(64)
    .height(64)
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor(cell.unlocked
      ? (cell.isBoss ? 'rgba(244,67,54,0.2)' : 'rgba(33,150,243,0.15)')
      : 'rgba(255,255,255,0.05)')
    .borderRadius(12)
    .border({
      width: cell.unlocked ? 1 : 0,
      color: this.getBorderColor(cell)
    })
    .opacity(cell.unlocked ? 1.0 : 0.4)
    .margin({ left: 6, right: 6, bottom: 12 })
    .onClick(() => {
      this.onLevelClick(cell.level);
    })
  }

  private getBorderColor(cell: LevelCellData): string {
    if (!cell.unlocked) return 'transparent';
    if (cell.isBoss) return 'rgba(244,67,54,0.5)';
    return 'rgba(33,150,243,0.3)';
  }

  private getStarsText(stars: number): string {
    if (stars >= 3) return '★★★';
    if (stars === 2) return '★★';
    return '★';
  }

  // ---- Level Preview Panel ----
  @Builder
  LevelPreviewPanel() {
    Column() {
      Column() {
        Text('第 ' + this.previewLevel + ' 关')
          .fontSize(28)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
          .margin({ top: 20 })

        Text(this.getLevelThemeName(this.previewLevel))
          .fontSize(16)
          .fontColor(this.getLevelAccentColor(this.previewLevel))
          .margin({ top: 4 })

        // Difficulty
        Row() {
          Text(this.getDifficultyText(this.previewLevel))
            .fontSize(18)
            .fontColor('#FF9800')
          Text(' 难度')
            .fontSize(14)
            .fontColor('rgba(255,255,255,0.5)')
        }
        .margin({ top: 12 })

        // Boss warning
        if (isBossLevel(this.previewLevel)) {
          Row() {
            Text('👑 BOSS 关卡')
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FF5252')
          }
          .padding({ top: 4, bottom: 4, left: 16, right: 16 })
          .backgroundColor('rgba(244,67,54,0.15)')
          .borderRadius(16)
          .margin({ top: 8 })
        }

        Row()
          .width('80%')
          .height(1)
          .backgroundColor('rgba(255,255,255,0.1)')
          .margin({ top: 16, bottom: 16 })

        // Special objectives
        Text('🎯 特殊目标')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
          .margin({ bottom: 8 })

        ForEach(this.previewObjectives, (obj: SpecialObjective) => {
          Row() {
            Text(obj.icon)
              .fontSize(16)
              .margin({ right: 8 })
            Text(obj.description)
              .fontSize(14)
              .fontColor('rgba(255,255,255,0.7)')
          }
          .width('100%')
          .margin({ bottom: 6 })
        }, (obj: SpecialObjective) => obj.id)

        // Best score
        if (this.previewBestScore > 0) {
          Row() {
            Text('🏆 最佳成绩')
              .fontSize(14)
              .fontColor('rgba(255,255,255,0.5)')
            Blank()
            Text('⭐ ' + this.previewBestScore)
              .fontSize(14)
              .fontColor('#FFD740')
              .fontWeight(FontWeight.Bold)
          }
          .width('100%')
          .margin({ top: 16 })
        }

        // Star display for previously completed levels
        if (this.previewStars > 0) {
          Row() {
            Text('评级: ' + this.getStarsText(this.previewStars))
              .fontSize(14)
              .fontColor('#FFD740')
          }
          .width('100%')
          .margin({ top: 8 })
        }

        // Buttons
        Row() {
          Button() {
            Text('返回')
              .fontSize(16)
              .fontColor(Color.White)
          }
          .width(120)
          .height(48)
          .backgroundColor('rgba(255,255,255,0.15)')
          .borderRadius(24)
          .onClick(() => {
            this.dismissPreview();
          })

          Blank()

          Button() {
            Text('🎮 开始挑战')
              .fontSize(16)
              .fontColor(Color.White)
          }
          .width(160)
          .height(48)
          .backgroundColor('#2196F3')
          .borderRadius(24)
          .onClick(() => {
            this.startLevel();
          })
        }
        .width('100%')
        .margin({ top: 20, bottom: 20 })
      }
      .width('85%')
      .padding({ left: 24, right: 24 })
      .backgroundColor('rgba(10,10,46,0.97)')
      .borderRadius(20)
      .border({ width: 1, color: 'rgba(33,150,243,0.3)' })
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('rgba(0,0,0,0.6)')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
  }

  private getLevelThemeName(level: number): string {
    return getLevelTheme(level).name;
  }

  private getLevelAccentColor(level: number): string {
    return getLevelTheme(level).accentColor;
  }

  private getDifficultyText(level: number): string {
    // 1-5 stars difficulty
    const stars = Math.min(5, Math.max(1, Math.ceil(level / 6)));
    let text = '';
    for (let i = 0; i < stars; i++) {
      text += '★';
    }
    return text;
  }

  private getChapterCelebrationBonus(): string {
    const bonus = 1000 + (this.celebrationChapter - 1) * 500;
    return String(bonus);
  }
}
