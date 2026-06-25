/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2024-2025. All rights reserved.
 */

import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';

/**
 * 基于 HarmonyOS Preferences 的 KV 持久化存储工具类
 * 提供购物车/订单/收藏等数据存取
 */
export class StorageService {
  private static instance: StorageService;
  private prefs: preferences.Preferences | null = null;
  private initPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * 初始化 Preferences，必须在首次使用前调用
   */
  async init(context: common.UIAbilityContext): Promise<void> {
    if (this.prefs) {
      return;
    }
    if (this.initPromise) {
      return this.initPromise;
    }
    this.initPromise = new Promise<void>((resolve, reject) => {
      try {
        preferences.getPreferences(context, 'shopping_platform_store', (err: BusinessError, pref: preferences.Preferences) => {
          if (err) {
            console.error('StorageService init failed: ' + JSON.stringify(err));
            reject(err);
            return;
          }
          this.prefs = pref;
          console.info('StorageService init success');
          resolve();
        });
      } catch (error) {
        console.error('StorageService init exception: ' + JSON.stringify(error));
        reject(error);
      }
    });
    return this.initPromise;
  }

  /**
   * 确保已初始化
   */
  private ensureInit(): void {
    if (!this.prefs) {
      console.warn('StorageService not initialized, call init() first');
    }
  }

  /**
   * 保存字符串值
   */
  async save(key: string, value: string): Promise<void> {
    this.ensureInit();
    if (!this.prefs) {
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.prefs!.put(key, value, (err: BusinessError) => {
        if (err) {
          console.error(`StorageService save failed for key ${key}: ${JSON.stringify(err)}`);
          reject(err);
          return;
        }
        this.prefs!.flush((flushErr: BusinessError) => {
          if (flushErr) {
            console.error(`StorageService flush failed: ${JSON.stringify(flushErr)}`);
          }
          resolve();
        });
      });
    });
  }

  /**
   * 读取字符串值
   */
  async load(key: string, defaultValue: string = ''): Promise<string> {
    this.ensureInit();
    if (!this.prefs) {
      return defaultValue;
    }
    return new Promise<string>((resolve) => {
      this.prefs!.get(key, defaultValue, (err: BusinessError, value: preferences.ValueType) => {
        if (err) {
          console.error(`StorageService load failed for key ${key}: ${JSON.stringify(err)}`);
          resolve(defaultValue);
          return;
        }
        resolve(value as string);
      });
    });
  }

  /**
   * 保存对象（JSON 序列化）
   */
  async saveObject(key: string, value: Object): Promise<void> {
    try {
      const jsonStr = JSON.stringify(value);
      await this.save(key, jsonStr);
    } catch (error) {
      console.error(`StorageService saveObject failed for key ${key}: ${JSON.stringify(error)}`);
    }
  }

  /**
   * 读取对象（JSON 反序列化）
   */
  async loadObject<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    try {
      const jsonStr = await this.load(key, '');
      if (!jsonStr) {
        return defaultValue;
      }
      return JSON.parse(jsonStr) as T;
    } catch (error) {
      console.error(`StorageService loadObject failed for key ${key}: ${JSON.stringify(error)}`);
      return defaultValue;
    }
  }

  /**
   * 删除键
   */
  async remove(key: string): Promise<void> {
    this.ensureInit();
    if (!this.prefs) {
      return;
    }
    return new Promise<void>((resolve, reject) => {
      this.prefs!.delete(key, (err: BusinessError) => {
        if (err) {
          console.error(`StorageService remove failed for key ${key}: ${JSON.stringify(err)}`);
          reject(err);
          return;
        }
        this.prefs!.flush(() => {
          resolve();
        });
      });
    });
  }

  /**
   * 检查键是否存在
   */
  async has(key: string): Promise<boolean> {
    this.ensureInit();
    if (!this.prefs) {
      return false;
    }
    return new Promise<boolean>((resolve) => {
      this.prefs!.get(key, '', (err: BusinessError, value: preferences.ValueType) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve(value !== '');
      });
    });
  }
}
