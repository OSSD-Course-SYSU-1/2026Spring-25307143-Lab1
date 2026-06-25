/*
 * Copyright (c) 2026
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { distributedKVStore } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const DOMAIN = 0x0000;
const STORE_ID = 'game_data_sync_store';
const TAG = 'GameDataSync';

/**
 * Per-level completion data for level mode.
 */
export interface LevelCompletionData {
  stars: number;         // 0 = not completed, 1-3 = star rating
  bestScore: number;     // best score earned on this level
  bestTime: number;      // fastest completion time in ms
  completed: boolean;    // whether this level has been cleared at least once
  objectivesCompleted: string[];  // IDs of special objectives completed
}

/**
 * Aggregate level progress data.
 */
export interface LevelProgressData {
  levels: Record<number, LevelCompletionData>;
  totalStars: number;
}

export interface GameRecord {
  highScore: number;
  highestLevel: number;
  totalKills: number;
  totalKillsLow: number;
  totalKillsMid: number;
  totalKillsHigh: number;
  endlessBestScore: number;
  levelProgressJson: string;  // serialized LevelProgressData
}

export class GameDataSync {
  private kvStore: distributedKVStore.SingleKVStore | null = null;
  private context: common.UIAbilityContext;

  constructor(context: common.UIAbilityContext) {
    this.context = context;
  }

  async initKVStore(): Promise<void> {
    try {
      const kvManagerConfig: distributedKVStore.KVManagerConfig = {
        context: this.context,
        bundleName: 'com.example.continuesettings'
      };
      const kvManager = distributedKVStore.createKVManager(kvManagerConfig);
      const options: distributedKVStore.Options = {
        createIfMissing: true,
        encrypt: false,
        backup: false,
        autoSync: true,
        kvStoreType: distributedKVStore.KVStoreType.SINGLE_VERSION,
        securityLevel: distributedKVStore.SecurityLevel.S1
      };
      this.kvStore = await kvManager.getKVStore<distributedKVStore.SingleKVStore>(STORE_ID, options);
      hilog.info(DOMAIN, TAG, 'KVStore initialized successfully');
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'Failed to init KVStore: %{public}s', JSON.stringify(err));
    }
  }

  async saveGameRecord(record: GameRecord): Promise<void> {
    if (!this.kvStore) {
      hilog.warn(DOMAIN, TAG, 'KVStore not initialized');
      return;
    }
    try {
      // Merge with existing data: take the max for competitive records
      const existing = await this.loadGameRecord();
      const mergedLevelProgress = this.mergeLevelProgress(
        record.levelProgressJson,
        existing.levelProgressJson
      );
      const merged: GameRecord = {
        highScore: Math.max(record.highScore, existing.highScore),
        highestLevel: Math.max(record.highestLevel, existing.highestLevel),
        totalKills: record.totalKills + existing.totalKills,
        totalKillsLow: record.totalKillsLow + existing.totalKillsLow,
        totalKillsMid: record.totalKillsMid + existing.totalKillsMid,
        totalKillsHigh: record.totalKillsHigh + existing.totalKillsHigh,
        endlessBestScore: Math.max(record.endlessBestScore, existing.endlessBestScore),
        levelProgressJson: mergedLevelProgress
      };
      const dataStr = JSON.stringify(merged);
      await this.kvStore.put('game_record', dataStr);
      hilog.info(DOMAIN, TAG, 'Game record saved: %{public}s', dataStr);
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'Failed to save game record: %{public}s', JSON.stringify(err));
    }
  }

  /**
   * Merge two level progress JSON strings, keeping the best per-level data.
   */
  private mergeLevelProgress(newJson: string, existingJson: string): string {
    try {
      const newData = this.parseLevelProgress(newJson);
      const existingData = this.parseLevelProgress(existingJson);

      // Start with existing data, overlay new data with better scores
      const merged: LevelProgressData = this.cloneLevelProgress(existingData);
      const newKeys = this.getLevelKeys(newData.levels);
      for (let i = 0; i < newKeys.length; i++) {
        const key = newKeys[i];
        const newLvl = newData.levels[key];
        const existingLvl = merged.levels[key];

        if (!existingLvl) {
          // New level entry
          merged.levels[key] = {
            stars: newLvl.stars,
            bestScore: newLvl.bestScore,
            bestTime: newLvl.bestTime,
            completed: newLvl.completed,
            objectivesCompleted: this.cloneStringArray(newLvl.objectivesCompleted)
          };
        } else {
          // Merge step by step: keep the best stats
          const mergedStars = newLvl.stars > existingLvl.stars ? newLvl.stars : existingLvl.stars;
          const mergedScore = newLvl.bestScore > existingLvl.bestScore ? newLvl.bestScore : existingLvl.bestScore;
          const mergedCompleted = newLvl.completed || existingLvl.completed;
          // Best time: lower is better
          let mergedTime = existingLvl.bestTime;
          if (newLvl.bestTime > 0 && (existingLvl.bestTime === 0 || newLvl.bestTime < existingLvl.bestTime)) {
            mergedTime = newLvl.bestTime;
          }
          // Collect unique objective completions
          const mergedObj: string[] = this.cloneStringArray(existingLvl.objectivesCompleted);
          for (let j = 0; j < newLvl.objectivesCompleted.length; j++) {
            const objId = newLvl.objectivesCompleted[j];
            if (!this.arrayContains(mergedObj, objId)) {
              mergedObj.push(objId);
            }
          }

          merged.levels[key] = {
            stars: mergedStars,
            bestScore: mergedScore,
            bestTime: mergedTime,
            completed: mergedCompleted,
            objectivesCompleted: mergedObj
          };
        }
      }

      // Recalculate total stars
      merged.totalStars = 0;
      const allKeys = this.getLevelKeys(merged.levels);
      for (let i = 0; i < allKeys.length; i++) {
        merged.totalStars += merged.levels[allKeys[i]].stars;
      }

      return JSON.stringify(merged);
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'Failed to merge level progress: %{public}s', JSON.stringify(err));
      // If merge fails, return the new data if available, else existing
      if (newJson && newJson.length > 0) {
        return newJson;
      }
      if (existingJson && existingJson.length > 0) {
        return existingJson;
      }
      return '{"levels":{},"totalStars":0}';
    }
  }

  /**
   * Deep clone LevelProgressData without using spread operator.
   */
  private cloneLevelProgress(data: LevelProgressData): LevelProgressData {
    const clonedLevels: Record<number, LevelCompletionData> = {};
    const keys = this.getLevelKeys(data.levels);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const lvl = data.levels[k];
      clonedLevels[k] = {
        stars: lvl.stars,
        bestScore: lvl.bestScore,
        bestTime: lvl.bestTime,
        completed: lvl.completed,
        objectivesCompleted: this.cloneStringArray(lvl.objectivesCompleted)
      };
    }
    return {
      levels: clonedLevels,
      totalStars: data.totalStars
    };
  }

  /**
   * Get numeric keys from a Record as number array.
   */
  private getLevelKeys(levels: Record<number, LevelCompletionData>): number[] {
    const keys: number[] = [];
    // Use a known limit for iteration since Object.keys may not be available in ArkTS
    for (let k = 1; k <= 100; k++) {
      if (levels[k] !== undefined) {
        keys.push(k);
      }
    }
    return keys;
  }

  /**
   * Clone a string array without spread operator.
   */
  private cloneStringArray(arr: string[]): string[] {
    const result: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(arr[i]);
    }
    return result;
  }

  /**
   * Check if string array contains a value (replacement for Array.includes).
   */
  private arrayContains(arr: string[], value: string): boolean {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === value) {
        return true;
      }
    }
    return false;
  }

  /**
   * Parse a LevelProgressData from JSON string, returning a default if invalid.
   */
  private parseLevelProgress(json: string): LevelProgressData {
    if (!json) {
      return { levels: {}, totalStars: 0 };
    }
    try {
      const rawObj: Object = JSON.parse(json) as Object;
      const parsed: LevelProgressData = rawObj as LevelProgressData;
      if (!parsed.levels) {
        return { levels: {}, totalStars: parsed.totalStars || 0 };
      }
      return parsed;
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'Failed to parse level progress: %{public}s', JSON.stringify(err));
      return { levels: {}, totalStars: 0 };
    }
  }

  /**
   * Convenience method to update a single level's completion data.
   * Loads current record, updates the specified level, and saves.
   */
  async updateLevelCompletion(
    level: number,
    stars: number,
    bestScore: number,
    bestTime: number,
    objectivesCompleted: string[]
  ): Promise<void> {
    const record = await this.loadGameRecord();
    const progress = this.parseLevelProgress(record.levelProgressJson);

    const existing: LevelCompletionData | undefined = progress.levels[level];
    const existingStars: number = existing !== undefined ? existing.stars : 0;
    const existingBestScore: number = existing !== undefined ? existing.bestScore : 0;
    const existingBestTime: number = existing !== undefined ? existing.bestTime : 0;

    const mergedTime = (bestTime > 0 && (existingBestTime === 0 || bestTime < existingBestTime))
      ? bestTime : existingBestTime;

    const newCompletion: LevelCompletionData = {
      stars: Math.max(stars, existingStars),
      bestScore: Math.max(bestScore, existingBestScore),
      bestTime: mergedTime,
      completed: stars > 0,
      objectivesCompleted: objectivesCompleted
    };
    progress.levels[level] = newCompletion;

    // Recalculate total stars
    progress.totalStars = 0;
    const keys = this.getLevelKeys(progress.levels);
    for (let i = 0; i < keys.length; i++) {
      progress.totalStars += progress.levels[keys[i]].stars;
    }

    record.levelProgressJson = JSON.stringify(progress);
    await this.saveGameRecord(record);
  }

  /**
   * Get completion data for a specific level.
   */
  async getLevelCompletion(level: number): Promise<LevelCompletionData | null> {
    const record = await this.loadGameRecord();
    const progress = this.parseLevelProgress(record.levelProgressJson);
    if (progress.levels[level] !== undefined) {
      return progress.levels[level];
    }
    return null;
  }

  /**
   * Check if a level is unlocked (previous level completed, or enough stars).
   */
  async isLevelUnlocked(level: number): Promise<boolean> {
    if (level <= 1) return true;
    const record = await this.loadGameRecord();
    const progress = this.parseLevelProgress(record.levelProgressJson);

    // Check if previous level is completed
    const prevLevel = progress.levels[level - 1];
    if (prevLevel !== undefined && prevLevel.completed) return true;

    // Alternative: unlock if total stars reach threshold
    // Every 10-level chapter needs 15 stars to unlock
    let chapter = Math.floor((level + 9) / 10);
    const chapterStarsNeeded = (chapter - 1) * 15;
    return progress.totalStars >= chapterStarsNeeded;
  }

  async loadGameRecord(): Promise<GameRecord> {
    const defaultRecord: GameRecord = {
      highScore: 0,
      highestLevel: 0,
      totalKills: 0,
      totalKillsLow: 0,
      totalKillsMid: 0,
      totalKillsHigh: 0,
      endlessBestScore: 0,
      levelProgressJson: '{"levels":{},"totalStars":0}'
    };
    if (!this.kvStore) {
      return defaultRecord;
    }
    try {
      const dataStr = await this.kvStore.get('game_record');
      if (dataStr) {
        const rawObj: Object = JSON.parse(dataStr as string) as Object;
        const parsed: GameRecord = rawObj as GameRecord;
        return parsed;
      }
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'Failed to load game record: %{public}s', JSON.stringify(err));
    }
    return defaultRecord;
  }
}
