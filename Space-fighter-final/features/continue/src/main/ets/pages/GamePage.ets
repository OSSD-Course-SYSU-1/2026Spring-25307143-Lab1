/*
 * Copyright (c) 2026
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

import { GameDataSync, GameRecord } from '../utils/GameDataSync';
import { SoundManager } from '../utils/SoundManager';
import {
  PLAYER_SIZE, PLAYER_HP, PLAYER_ATK,
  BULLET_SIZE, BULLET_SPEED,
  BASE_ENEMY_SPEED,
  INVINCIBLE_DURATION, FIRE_COOLDOWN, GAME_LOOP_INTERVAL, BASE_SPAWN_INTERVAL,
  ENEMY_DEFS, EnemyDef,
  POWERUP_SIZE, POWERUP_DROP_CHANCE, POWERUP_KILL_INTERVAL, POWERUP_SPEED,
  POWERUP_DEFS, PowerUpType, getPowerUpDef,
  MAX_SHIELD_CHARGES_LEVEL, MAX_SHIELD_CHARGES_ENDLESS,
  BOSS_BASE_HP, BOSS_BASE_ATK, BOSS_SIZE, BOSS_SCORE,
  BOSS_MOVE_SPEED, BOSS_MOVE_SPEED_PHASE2, BOSS_FIRE_INTERVAL, BOSS_FIRE_INTERVAL_PHASE2,
  BOSS_SUMMON_INTERVAL, BOSS_SUMMON_INTERVAL_PHASE2, BOSS_SPECIAL_INTERVAL,
  BOSS_APPEAR_LEVELS, BOSS_PHASE2_HP_RATIO,
  isBossLevel, getBossIteration,
  getLevelTheme, getLevelSpawnInterval, getLevelEnemySpeed, LevelTheme,
  ELITE_HP, ELITE_ATK, ELITE_SIZE, ELITE_COLOR, ELITE_SCORE, ELITE_SPEED, ELITE_MIN_LEVEL, ELITE_FIRE_INTERVAL,
  SNIPER_HP, SNIPER_ATK, SNIPER_SIZE, SNIPER_COLOR, SNIPER_SCORE, SNIPER_SPEED, SNIPER_MIN_LEVEL, SNIPER_FIRE_INTERVAL, SNIPER_BULLET_SPEED,
  SUICIDE_HP, SUICIDE_ATK, SUICIDE_SIZE, SUICIDE_COLOR, SUICIDE_SCORE, SUICIDE_SPEED, SUICIDE_MIN_LEVEL, SUICIDE_EXPLOSION_RADIUS,
  getEndlessSpawnInterval, getEndlessEnemySpeed, getEndlessDifficultyTier,
  getEndlessTierName, canEndlessSpawnElite, getEndlessEliteChance,
  getNextBossMilestone, getEndlessBossHp,
  ENDLESS_DIFFICULTY_THRESHOLDS,
  LASER_BEAM_WIDTH, LASER_DAMAGE_INTERVAL, LASER_DAMAGE_PER_TICK,
  calculateLevelStars, StarRatingResult,
  getLevelObjectives, SpecialObjective,
  calculateLevelReward, LevelReward,
  formatScore, getChapterCompletionBonus
} from '../configs/GameConfig';
import { common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const DOMAIN = 0x0000;
const TAG = 'GamePage';

interface Bullet {
  x: number;
  y: number;
  active: boolean;
  angle?: number;
}

interface Enemy {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  atk: number;
  size: number;
  type: 'low' | 'mid' | 'high' | 'elite' | 'sniper' | 'suicide';
  color: number;
  speed: number;
  score: number;
  active: boolean;
  moveTick: number;      // for sine/diagonal movement
  startX: number;        // spawn X for sine movement
  startY: number;        // spawn Y for sniper side entry
  lastFireTime: number;  // for elite/sniper shooting
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: number;
  size: number;
}

interface EnemyWeights {
  low: number;
  mid: number;
  high: number;
  elite: number;
  sniper: number;
  suicide: number;
}

interface EnemyData {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  atk: number;
  size: number;
  type: 'low' | 'mid' | 'high' | 'elite' | 'sniper' | 'suicide';
  color: number;
  speed: number;
  score: number;
  active: boolean;
  moveTick: number;
  startX: number;
  lastFireTime: number;
}

interface BulletData {
  x: number;
  y: number;
  active: boolean;
  angle?: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: PowerUpType;
  size: number;
  active: boolean;
  color: number;
}

interface ActiveBuff {
  type: PowerUpType;
  endTime: number;
}

interface PowerUpData {
  x: number;
  y: number;
  type: PowerUpType;
  size: number;
  active: boolean;
  color: number;
}

interface BossEntity {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  atk: number;
  size: number;
  active: boolean;
  color: number;
  phaseColor: number;
  dir: number; // movement direction: 1 or -1
  lastFireTime: number;
  lastSummonTime: number;
  score: number;
  level: number; // boss iteration for scaling
  phase: number; // 1 = first phase, 2 = second phase (50% HP)
  phaseChanged: boolean; // true when phase just changed (for animation)
  attackPattern: number; // 0=fan, 1=aimed, 2=spiral, 3=shield
  lastSpecialAttack: number; // timestamp of last special attack
  moveSpeed: number; // horizontal movement speed
  fireInterval: number; // ms between attacks
  phaseChangeTime: number; // timestamp when phase changed
}

interface BossBullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  size: number;
}

// ---------- Wave system ----------
const WAVE_COUNT = 3;
const WAVE_PAUSE_MS = 1500;

@Component
export struct GamePage {
  @StorageLink('gameMode') gameMode: string = 'endless';
  @StorageLink('gameScore') gameScore: number = 0;
  @StorageLink('gamePlayerHP') gamePlayerHP: number = PLAYER_HP;
  @StorageLink('gamePlayerX') gamePlayerX: number = 0;
  @StorageLink('gamePlayerY') gamePlayerY: number = 0;
  @StorageLink('gameEnemies') gameEnemies: string = '[]';
  @StorageLink('gameBullets') gameBullets: string = '[]';
  @StorageLink('gameStatus') gameStatus: string = 'playing';
  @StorageLink('gameCurrentLevel') gameCurrentLevel: number = 1;
  @StorageLink('gameLevelKills') gameLevelKills: number = 0;
  @StorageLink('gameLevelTarget') gameLevelTarget: number = 8;
  @StorageLink('gameInvincible') gameInvincible: boolean = false;
  @StorageLink('gamePowerUps') gamePowerUps: string = '[]';
  @StorageLink('gameActiveBuffs') gameActiveBuffs: string = '[]';
  @StorageLink('gameIsBossLevel') gameIsBossLevel: boolean = false;
  @StorageLink('gameCurrentWave') gameCurrentWave: number = 1;
  @StorageLink('gameShieldCharges') gameShieldCharges: number = 0;

  // Non-storage state
  private shieldCharges: number = 0;
  private settings: Record<string, string | number | boolean> = {};
  private canvasSettings: RenderingContextSettings = new RenderingContextSettings(true);
  private canvasCtx: CanvasRenderingContext2D = new CanvasRenderingContext2D(this.canvasSettings);
  private gameTimer: number = -1;
  private invincibleTimer: number = -1;
  private lastFireTime: number = 0;
  private lastSpawnTime: number = 0;
  private playerX: number = 0;
  private playerY: number = 0;
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;
  private bullets: Bullet[] = [];
  private enemies: Enemy[] = [];
  private particles: Particle[] = [];
  @State isPaused: boolean = false;
  @State isGameOver: boolean = false;
  private levelClearShown: boolean = false;
  private levelClearTimer: number = -1;
  @State isNewRecord: boolean = false;
  private dataSync: GameDataSync | null = null;
  private context: common.UIAbilityContext | null = null;
  private soundMgr: SoundManager = SoundManager.getInstance();
  private powerUps: PowerUp[] = [];
  private activeBuffs: ActiveBuff[] = [];
  private killCountSincePowerUp: number = 0;
  private boss: BossEntity | null = null;
  private bossBullets: BossBullet[] = [];
  private bossSpawned: boolean = false;
  private wavePauseTimer: number = -1;
  private waveTransition: boolean = false;
  private eliteBullets: Bullet[] = [];
  // Endless mode tracking
  private endlessBossDefeatedMilestones: number[] = [];
  private endlessDifficultyTier: number = 0;
  private endlessBossSpawned: boolean = false;
  private endlessBossScore: number = 0;
  // Level result tracking
  private levelStartTime: number = 0;
  private levelScore: number = 0;
  private killsLow: number = 0;
  private killsMid: number = 0;
  private killsHigh: number = 0;
  private killsElite: number = 0;
  private killsBoss: number = 0;
  private playerAtk: number = PLAYER_ATK;
  private lastLaserDamageTime: number = 0;
  private lifeStealAccumulator: number = 0;
  @State showLevelResult: boolean = false;
  @State levelPassed: boolean = false;
  // Level mode: special objective tracking
  private levelObjectives: SpecialObjective[] = [];
  private comboKillCount: number = 0;
  private maxComboKills: number = 0;
  private powerUpsCollected: number = 0;
  private playerWasHit: boolean = false;
  private bossHitPlayer: boolean = false;
  private eliteEnemiesOnLevel: number = 0;
  private eliteEnemiesKilled: number = 0;
  private starResult: StarRatingResult = { stars: 0, details: [] };
  private levelReward: LevelReward = { starBonus: 0, objectiveBonus: 0, completionBonus: 0, totalReward: 0, extraStarsAwarded: 0 };
  private chapterCompleted: boolean = false;
  // Level transition animation
  @State showLevelTransition: boolean = false;
  @State transitionLevel: number = 1;
  private transitionTimer: number = -1;

  aboutToAppear() {
    const hostContext = this.getUIContext().getHostContext();
    if (hostContext !== null) {
      this.context = hostContext as common.UIAbilityContext;
    }
    // Init data sync service
    if (this.context) {
      this.dataSync = new GameDataSync(this.context);
      this.dataSync?.initKVStore();
    }
    // Init sound manager
    this.soundMgr.init();

    // Check if launched from menu (fresh/continue) vs system continuation
    const fromMenu = AppStorage.get<boolean>('gameLaunchedFromMenu');
    if (fromMenu === true) {
      // Launched from menu (fresh start or continue) — keep AppStorage values
      AppStorage.delete('gameLaunchedFromMenu');
      this.playerX = this.gamePlayerX || 0;
      this.playerY = this.gamePlayerY || 0;
      this.levelStartTime = Date.now();
      this.levelScore = 0;
      this.killsLow = 0; this.killsMid = 0; this.killsHigh = 0;
      this.killsElite = 0; this.killsBoss = 0;
      this.showLevelResult = false;
      this.levelPassed = false;
      this.isPaused = false;
      this.isGameOver = false;
      // Init level mode tracking
      this.levelObjectives = getLevelObjectives(this.gameCurrentLevel);
      this.comboKillCount = 0;
      this.maxComboKills = 0;
      this.powerUpsCollected = 0;
      this.playerWasHit = false;
      this.bossHitPlayer = false;
      this.eliteEnemiesKilled = 0;
      this.starResult = { stars: 0, details: [] };
      this.levelReward = { starBonus: 0, objectiveBonus: 0, completionBonus: 0, totalReward: 0, extraStarsAwarded: 0 };
      this.chapterCompleted = false;
      this.showLevelTransition = false;
      // Reset endless mode state
      this.endlessBossDefeatedMilestones = [];
      this.endlessDifficultyTier = 0;
      this.endlessBossSpawned = false;
      this.endlessBossScore = 0;
      // Init new power-up state
      this.playerAtk = PLAYER_ATK;
      this.lastLaserDamageTime = 0;
      this.lifeStealAccumulator = 0;
      this.shieldCharges = 0;
    } else {
      // Check if state is being restored from system continuation
      const savedScore = AppStorage.get<number>('gameScore');
      if (savedScore !== undefined && savedScore > 0) {
        // System continuation restore - parse stored arrays
        this.bullets = this.parseBullets(this.gameBullets);
        this.enemies = this.parseEnemies(this.gameEnemies);
        this.powerUps = this.parsePowerUps(this.gamePowerUps);
        this.activeBuffs = this.parseActiveBuffs(this.gameActiveBuffs);
        this.playerX = this.gamePlayerX;
        this.playerY = this.gamePlayerY;
        this.shieldCharges = this.gameShieldCharges || 0;
        this.bossSpawned = this.gameIsBossLevel;
        this.isPaused = false;
        this.isGameOver = false;
        this.gameStatus = 'playing';
      } else {
        // Fresh start - init game state
        this.gameScore = 0;
        this.gamePlayerHP = PLAYER_HP;
        this.gameCurrentLevel = 1;
        this.gameLevelKills = 0;
        this.gameStatus = 'playing';
        this.gameCurrentWave = 1;
        this.waveTransition = false;
        this.levelClearShown = false;
        this.isGameOver = false;
        this.isPaused = false;
        this.bullets = [];
        this.enemies = [];
        this.particles = [];
        this.powerUps = [];
        this.activeBuffs = [];
        this.killCountSincePowerUp = 0;
        this.eliteBullets = [];
        this.isNewRecord = false;
        this.shieldCharges = 0;
      }
      this.levelStartTime = Date.now();
      this.levelScore = 0;
      this.killsLow = 0; this.killsMid = 0; this.killsHigh = 0;
      this.killsElite = 0; this.killsBoss = 0;
      this.showLevelResult = false;
      this.levelPassed = false;
      // Init level mode tracking (all code paths)
      this.levelObjectives = getLevelObjectives(this.gameCurrentLevel);
      this.comboKillCount = 0;
      this.maxComboKills = 0;
      this.powerUpsCollected = 0;
      this.playerWasHit = false;
      this.bossHitPlayer = false;
      this.eliteEnemiesKilled = 0;
      this.starResult = { stars: 0, details: [] };
      this.levelReward = { starBonus: 0, objectiveBonus: 0, completionBonus: 0, totalReward: 0, extraStarsAwarded: 0 };
      this.chapterCompleted = false;
      this.showLevelTransition = false;
    }
  }

  aboutToDisappear() {
    this.stopGameLoop();
    if (this.invincibleTimer !== -1) {
      clearTimeout(this.invincibleTimer);
      this.invincibleTimer = -1;
    }
    if (this.levelClearTimer !== -1) {
      clearTimeout(this.levelClearTimer);
      this.levelClearTimer = -1;
    }
    if (this.wavePauseTimer !== -1) {
      clearTimeout(this.wavePauseTimer);
      this.wavePauseTimer = -1;
    }
    // Save record to distributed KV if game was played
    if (this.gameScore > 0 && this.dataSync) {
      // Load current record and merge
      this.dataSync!.loadGameRecord().then((currentRecord) => {
        const record: GameRecord = {
          highScore: Math.max(currentRecord.highScore, this.gameScore),
          highestLevel: Math.max(currentRecord.highestLevel, this.gameCurrentLevel),
          totalKills: currentRecord.totalKills + this.gameScore,
          totalKillsLow: currentRecord.totalKillsLow + this.killsLow,
          totalKillsMid: currentRecord.totalKillsMid + this.killsMid,
          totalKillsHigh: currentRecord.totalKillsHigh + this.killsHigh,
          endlessBestScore: this.gameMode === 'endless'
            ? Math.max(currentRecord.endlessBestScore, this.gameScore)
            : currentRecord.endlessBestScore,
          levelProgressJson: currentRecord.levelProgressJson
        };
        this.dataSync!.saveGameRecord(record);
      });
    }
    // Persist arrays to AppStorage before leaving
    this.syncToStorage();
  }

  private calcTotalKills(): number {
    // Simplified - return score since we don't track per-type in migration
    return this.gameScore;
  }

  // ---- Canvas lifecycle ----
  private onCanvasReady(): void {
    // Called when Canvas mounts - handled by onAreaChange
  }

  private onCanvasAreaChange(oldVal: Area, newVal: Area): void {
    this.canvasWidth = newVal.width as number;
    this.canvasHeight = newVal.height as number;
    if (this.playerX === 0 && this.playerY === 0) {
      this.playerX = this.canvasWidth / 2;
      this.playerY = this.canvasHeight - 80;
      this.gamePlayerX = this.playerX;
      this.gamePlayerY = this.playerY;
    }
    this.startGameLoop();
  }

  // ---- Game Loop ----
  private startGameLoop(): void {
    if (this.gameTimer !== -1) return;
    this.gameTimer = setInterval(() => {
      if (this.isPaused || this.isGameOver) return;
      this.update();
      this.draw();
    }, GAME_LOOP_INTERVAL);
  }

  private stopGameLoop(): void {
    if (this.gameTimer !== -1) {
      clearInterval(this.gameTimer);
      this.gameTimer = -1;
    }
  }

  // ---- Update Logic ----
  private update(): void {
    // Skip game logic during level transition animation
    if (this.showLevelTransition) {
      this.draw();
      return;
    }
    const now = Date.now();
    const level = this.gameCurrentLevel;

    // ---- Wave system (level mode, score-based) ----
    if (this.gameMode === 'level') {
      const isBoss = isBossLevel(level);
      const waveTarget = this.getWaveScoreTarget(level, this.gameCurrentWave, isBoss);
      const cumulativeTarget = this.getWaveCumulativeTarget(level, this.gameCurrentWave, isBoss);

      // Check wave completion
      if (this.gameCurrentWave < WAVE_COUNT && this.levelScore >= cumulativeTarget &&
          !this.waveTransition && !this.isPaused && !this.showLevelResult) {
        // Wave complete → transition
        this.waveTransition = true;
        this.gameStatus = 'wavePause';
        this.clearWaveEnemies(true);
        this.wavePauseTimer = setTimeout(() => {
          this.gameCurrentWave += 1;
          this.waveTransition = false;
          this.gameStatus = 'playing';
          this.lastSpawnTime = 0;
          // If boss level wave 3, spawn boss
          if (isBoss && this.gameCurrentWave === WAVE_COUNT) {
            this.spawnBoss();
          }
        }, WAVE_PAUSE_MS);
      }

      // Check level clear (last wave score target reached)
      if (this.gameCurrentWave === WAVE_COUNT && !this.waveTransition && !this.showLevelResult) {
        if (isBoss) {
          // Boss level: clear when boss is defeated (handled in boss update)
        } else {
          // Normal level: clear when last wave score target is reached
          if (this.levelScore >= cumulativeTarget) {
            this.stopGameLoop();
            this.soundMgr.levelClear();
            this.showLevelResult = true;
            this.levelPassed = true;
            this.gameStatus = 'levelResult';
          }
        }
      }

      // Spawn enemies (skip during transition / boss wave 3 / result)
      if (!this.waveTransition && !this.showLevelResult) {
        if (isBoss && this.gameCurrentWave === WAVE_COUNT) {
          // Boss wave: boss handles its own spawning, no regular enemies
        } else {
          const spawnInterval = this.getWaveSpawnInterval();
          if (now - this.lastSpawnTime > spawnInterval) {
            this.spawnWaveEnemy(isBoss);
            this.lastSpawnTime = now;
          }
        }
      }
    } else if (this.gameMode === 'endless') {
      // Endless mode: difficulty-scaled continuous spawning
      // Update difficulty tier based on score
      this.endlessDifficultyTier = getEndlessDifficultyTier(this.gameScore);

      // Check for boss encounter at score milestones
      if (!this.endlessBossSpawned && !this.boss?.active) {
        const nextMilestone = getNextBossMilestone(this.gameScore, this.endlessBossDefeatedMilestones);
        if (nextMilestone !== null) {
          this.endlessBossSpawned = true;
          this.endlessBossScore = nextMilestone;
          this.spawnEndlessBoss();
        }
      }

      // If boss is active, don't spawn regular enemies
      if (!this.boss?.active) {
        const spawnInterval = getEndlessSpawnInterval(this.gameScore);
        if (now - this.lastSpawnTime > spawnInterval) {
          this.spawnEnemy();
          this.lastSpawnTime = now;
        }
      }

      // Check if boss was just defeated in endless mode
      if (this.endlessBossSpawned && this.boss && !this.boss.active) {
        this.endlessBossDefeatedMilestones.push(this.endlessBossScore);
        this.endlessBossSpawned = false;
        this.endlessBossScore = 0;
        this.bossSpawned = false;
        this.gameIsBossLevel = false;
        // Small celebration explosion
        for (let i = 0; i < 8; i++) {
          this.spawnExplosion(
            this.canvasWidth / 2 + (Math.random() - 0.5) * 200,
            this.canvasHeight / 2 + (Math.random() - 0.5) * 200,
            0xFFFFD740
          );
        }
      }
    }

    // Update bullets (with speed buff & angle support)
    const bulletSpeed = this.hasBuff('speed') ? BULLET_SPEED * 2 : BULLET_SPEED;
    for (let b of this.bullets) {
      if (b.active) {
        if (b.angle !== undefined) {
          b.x += Math.sin(b.angle) * bulletSpeed * 0.6;
          b.y -= Math.cos(b.angle) * bulletSpeed;
        } else {
          b.y -= bulletSpeed;
        }
        if (b.y < -10 || b.x < -20 || b.x > this.canvasWidth + 20) b.active = false;
      }
    }

    // Update elite & sniper bullets
    const eliteBulletSpeed = 2.5 * this.getTimeWarpFactor();
    for (let eb of this.eliteBullets) {
      if (eb.active) {
        if (eb.angle !== undefined) {
          // Sniper aimed bullet
          eb.x += Math.sin(eb.angle) * SNIPER_BULLET_SPEED * this.getTimeWarpFactor();
          eb.y += Math.cos(eb.angle) * SNIPER_BULLET_SPEED * this.getTimeWarpFactor();
        } else {
          // Simple down bullet
          eb.y += eliteBulletSpeed;
        }
        if (eb.y > this.canvasHeight + 10 || eb.x < -20 || eb.x > this.canvasWidth + 20) {
          eb.active = false;
        }
      }
    }

    // Update enemies with movement patterns (clamped to screen)
    const enemySpeed = this.getEnemySpeed() * this.getTimeWarpFactor();
    const halfSize = PLAYER_SIZE / 2;
    for (let e of this.enemies) {
      if (!e.active) continue;
      e.moveTick++;
      switch (e.type) {
        case 'low':
          // Sine wave horizontal movement, clamped to screen
          e.x = e.startX + Math.sin(e.moveTick * 0.05) * 30;
          e.y += enemySpeed;
          break;
        case 'mid':
          // Diagonal movement (fixed offset, not cumulative)
          e.y += enemySpeed * 0.8;
          e.x = e.startX + Math.sin(e.moveTick * 0.03) * 25;
          break;
        case 'high':
          // Straight down
          e.y += enemySpeed;
          break;
        case 'elite':
          // Slow + sine + shoots, clamped to screen
          e.y += enemySpeed * 0.7;
          e.x = e.startX + Math.sin(e.moveTick * 0.04) * 35;
          if (now - e.lastFireTime > ELITE_FIRE_INTERVAL) {
            e.lastFireTime = now;
            this.eliteBullets.push({
              x: e.x, y: e.y + e.size / 2,
              active: true
            } as Bullet);
          }
          break;
        case 'sniper':
          // Moves slowly downward from side edge, fires aimed at player
          e.y += enemySpeed * 0.3;
          // Horizontal sine wave but stays near spawn column
          e.x = e.startX + Math.sin(e.moveTick * 0.02) * 20;
          if (now - e.lastFireTime > SNIPER_FIRE_INTERVAL) {
            e.lastFireTime = now;
            // Aim toward player
            const sx = this.playerX - e.x;
            const sy = this.playerY - e.y;
            const sDist = Math.sqrt(sx * sx + sy * sy);
            if (sDist > 1) {
              this.eliteBullets.push({
                x: e.x, y: e.y + e.size / 2,
                active: true,
                angle: Math.atan2(sx, sy) // use angle for rendering direction
              } as Bullet);
            }
          }
          break;
        case 'suicide':
          // Rush toward player (accelerating)
          const sx2 = this.playerX - e.x;
          const sy2 = this.playerY - e.y;
          const sDist2 = Math.sqrt(sx2 * sx2 + sy2 * sy2);
          if (sDist2 > 1) {
            const rushSpeed = SUICIDE_SPEED * this.getTimeWarpFactor();
            e.x += (sx2 / sDist2) * rushSpeed;
            e.y += (sy2 / sDist2) * rushSpeed;
          }
          break;
      }
      // Clamp x position within screen bounds (accounting for enemy half-size)
      const eHalf = e.size / 2;
      if (e.x < eHalf) e.x = eHalf;
      if (e.x > this.canvasWidth - eHalf) e.x = this.canvasWidth - eHalf;
      // Enemies escaping off bottom deal damage (mid+ only, half atk)
      if (e.y > this.canvasHeight + 50) {
        e.active = false;
        if ((e.type === 'mid' || e.type === 'high' || e.type === 'elite' || e.type === 'sniper') && !this.gameInvincible) {
          const escapeDmg = Math.max(1, Math.floor(e.atk / 2));
          this.soundMgr.hit();
          this.spawnExplosion(e.x, this.canvasHeight, 0xFFFF5252);
          this.applyDamageToPlayer(escapeDmg);
          if (this.isGameOver) { return; }
        }
      }
    }

    // Elite bullet - Player collision
    if (!this.gameInvincible) {
      for (let eb of this.eliteBullets) {
        if (!eb.active) continue;
        if (this.checkCollision(this.playerX, this.playerY, PLAYER_SIZE, eb.x, eb.y, 5)) {
          eb.active = false;
          this.spawnExplosion(eb.x, eb.y, 0xFFFF5252);
          this.soundMgr.hit();
          this.applyDamageToPlayer(1);
          if (this.isGameOver) { return; }
          break;
        }
      }
    }

    // Update power-ups (fall down)
    for (let p of this.powerUps) {
      if (p.active) {
        p.y += POWERUP_SPEED;
        if (p.y > this.canvasHeight + 50) p.active = false;
      }
    }

    // Bullet-Enemy collision
    for (let b of this.bullets) {
      if (!b.active) continue;
      for (let e of this.enemies) {
        if (!e.active) continue;
        if (this.checkCollision(b.x, b.y, BULLET_SIZE, e.x, e.y, e.size)) {
          b.active = false;
          e.hp -= this.playerAtk;
          if (e.hp <= 0) {
            e.active = false;
            const scoreMultiplier = this.hasBuff('doubleScore') ? 2 : 1;
            this.gameScore += e.score * scoreMultiplier;
            if (this.gameMode === 'level') {
              this.levelScore += e.score * scoreMultiplier;
              this.gameLevelKills += 1;
              switch (e.type) {
                case 'low': this.killsLow++; break;
                case 'mid': this.killsMid++; break;
                case 'high': this.killsHigh++; break;
                case 'elite': this.killsElite++; break;
              }
              // Track combo kills in level mode
              this.comboKillCount++;
              if (this.comboKillCount > this.maxComboKills) {
                this.maxComboKills = this.comboKillCount;
              }
              // Track elite kills
              if (e.type === 'elite') {
                this.eliteEnemiesKilled++;
              }
            }
            // Suicide enemy: big explosion (area effect)
            if (e.type === 'suicide') {
              for (let ei = 0; ei < 8; ei++) {
                this.spawnExplosion(
                  e.x + (Math.random() - 0.5) * SUICIDE_EXPLOSION_RADIUS,
                  e.y + (Math.random() - 0.5) * SUICIDE_EXPLOSION_RADIUS,
                  0xFFFF5722
                );
              }
            } else {
              this.spawnExplosion(e.x, e.y, e.color);
            }
            this.soundMgr.explosion();
            this.trySpawnPowerUp(e.x, e.y);
            this.applyLifeSteal();
          }
          break;
        }
      }
    }

    // Laser damage: continuous beam hurts enemies in its path
    if (this.hasBuff('laser') && !this.isPaused && !this.isGameOver) {
      const laserNow = Date.now();
      if (laserNow - this.lastLaserDamageTime > LASER_DAMAGE_INTERVAL) {
        this.lastLaserDamageTime = laserNow;
        const beamX = this.playerX;
        for (let e of this.enemies) {
          if (!e.active) continue;
          if (Math.abs(e.x - beamX) < LASER_BEAM_WIDTH + e.size * 0.4) {
            e.hp -= LASER_DAMAGE_PER_TICK;
            this.spawnExplosion(e.x, e.y - e.size / 2, 0xFFFF4081);
            if (e.hp <= 0) {
              e.active = false;
              const scoreMult = this.hasBuff('doubleScore') ? 2 : 1;
              this.gameScore += e.score * scoreMult;
              if (this.gameMode === 'level') {
                this.levelScore += e.score * scoreMult;
                this.gameLevelKills += 1;
                // Track combo for laser kills
                this.comboKillCount++;
                if (this.comboKillCount > this.maxComboKills) {
                  this.maxComboKills = this.comboKillCount;
                }
                if (e.type === 'elite') {
                  this.eliteEnemiesKilled++;
                }
              }
              this.soundMgr.explosion();
              this.trySpawnPowerUp(e.x, e.y);
              this.applyLifeSteal();
            }
          }
        }
        // Laser damage boss
        if (this.boss?.active && Math.abs(this.boss.x - beamX) < LASER_BEAM_WIDTH + this.boss.size * 0.3) {
          this.boss.hp -= LASER_DAMAGE_PER_TICK;
          this.spawnExplosion(this.boss.x, this.boss.y + this.boss.size / 2, 0xFFFF4081);
          this.soundMgr.bossHit();
          if (this.boss.hp <= 0) {
            this.onBossDefeated(this.boss);
          }
        }
      }
    }

    // Enemy-Player collision
    if (!this.gameInvincible) {
      for (let e of this.enemies) {
        if (!e.active) continue;
        if (this.checkCollision(this.playerX, this.playerY, PLAYER_SIZE, e.x, e.y, e.size)) {
          const dmg = e.type === 'suicide' ? e.atk * 2 : e.atk;
          e.active = false;
          // Suicide enemy: big explosion
          if (e.type === 'suicide') {
            for (let ei = 0; ei < 8; ei++) {
              this.spawnExplosion(
                e.x + (Math.random() - 0.5) * SUICIDE_EXPLOSION_RADIUS,
                e.y + (Math.random() - 0.5) * SUICIDE_EXPLOSION_RADIUS,
                0xFFFF5722
              );
            }
          } else {
            this.spawnExplosion(e.x, e.y, e.color);
          }
          this.soundMgr.hit();
          this.applyDamageToPlayer(dmg);
          if (this.isGameOver) { return; }
          break;
        }
      }
    }

    // Power-Up collision with player
    for (let p of this.powerUps) {
      if (!p.active) continue;
      if (this.checkCollision(this.playerX, this.playerY, PLAYER_SIZE, p.x, p.y, POWERUP_SIZE)) {
        p.active = false;
        if (this.gameMode === 'level') {
          this.powerUpsCollected++;
        }
        this.collectPowerUp(p.type);
        this.spawnExplosion(p.x, p.y, p.color);
      }
    }

    // Update active buffs
    this.activeBuffs = this.activeBuffs.filter(b => b.endTime > now);

    // Update boss logic
    if (this.boss?.active) {
      this.updateBoss(now);
    } else if (this.boss && !this.boss.active && this.gameMode === 'level' && isBossLevel(this.gameCurrentLevel)) {
      // Boss defeated → level clear
      this.bossSpawned = false;
      this.gameIsBossLevel = false;
      if (!this.showLevelResult) {
        this.stopGameLoop();
        this.soundMgr.levelClear();
        this.showLevelResult = true;
        this.levelPassed = true;
        this.gameStatus = 'levelResult';
      }
    }

    // Update boss bullets (always runs, even after boss defeated)
    const bossBulletFactor = this.getTimeWarpFactor();
    for (let bb of this.bossBullets) {
      if (bb.active) {
        bb.x += bb.vx * bossBulletFactor;
        bb.y += bb.vy * bossBulletFactor;
        if (bb.y > this.canvasHeight + 20 || bb.x < -20 || bb.x > this.canvasWidth + 20) {
          bb.active = false;
        }
      }
    }

    // Boss bullet - Player collision (always runs, even after boss defeated)
    if (!this.gameInvincible && this.boss) {
      for (let bb of this.bossBullets) {
        if (!bb.active) continue;
        const bossAtk = this.boss.active ? this.boss.atk : 1;
        if (this.checkCollision(this.playerX, this.playerY, PLAYER_SIZE, bb.x, bb.y, bb.size)) {
          bb.active = false;
          this.spawnExplosion(bb.x, bb.y, 0xFFFF5252);
          this.soundMgr.hit();
          this.applyDamageToPlayer(bossAtk);
          if (this.isGameOver) { return; }
          break;
        }
      }
    }

    // Update particles
    for (let p of this.particles) {
      p.x += p.vx; p.y += p.vy; p.life--; p.size *= 0.96;
    }
    this.particles = this.particles.filter(p => p.life > 0);

    // Cleanup
    this.bullets = this.bullets.filter(b => b.active);
    this.enemies = this.enemies.filter(e => e.active);
    this.powerUps = this.powerUps.filter(p => p.active);
    this.bossBullets = this.bossBullets.filter(bb => bb.active);
    this.eliteBullets = this.eliteBullets.filter(eb => eb.active);

    this.syncToStorage();
  }

  private hasBuff(type: PowerUpType): boolean {
    return this.activeBuffs.some(b => b.type === type);
  }

  /**
   * Apply damage to player, with shield absorption.
   * Shield charges block damage first; excess damage reduces HP.
   * Returns the actual HP damage dealt (after shield absorption).
   */
  private applyDamageToPlayer(dmg: number): number {
    if (dmg <= 0) return 0;
    let hpDamage = dmg;
    // Shield absorption
    if (this.shieldCharges > 0) {
      if (this.shieldCharges >= dmg) {
        // Shield fully absorbs all damage
        this.shieldCharges -= dmg;
        hpDamage = 0;
      } else {
        // Shield partially absorbs, remaining passes through
        hpDamage = dmg - this.shieldCharges;
        this.shieldCharges = 0;
      }
    }
    if (hpDamage > 0) {
      this.gamePlayerHP -= hpDamage;
      if (this.gameMode === 'level') {
        this.playerWasHit = true;
        this.comboKillCount = 0;
      }
      if (this.gamePlayerHP <= 0) {
        this.gamePlayerHP = 0;
        this.gameOver();
      } else {
        this.gameInvincible = true;
        if (this.invincibleTimer !== -1) {
          clearTimeout(this.invincibleTimer);
        }
        this.invincibleTimer = setTimeout(() => {
          this.gameInvincible = false;
          this.invincibleTimer = -1;
        }, INVINCIBLE_DURATION);
      }
    } else {
      // Shield fully blocked - weak sparkle effect
      this.spawnExplosion(this.playerX, this.playerY - PLAYER_SIZE / 2, 0xFFFFD740);
    }
    return hpDamage;
  }

  private getTimeWarpFactor(): number {
    return this.hasBuff('timeWarp') ? 0.5 : 1.0;
  }

  private applyLifeSteal(): void {
    if (this.hasBuff('lifeSteal')) {
      this.lifeStealAccumulator += 0.5;
      if (this.lifeStealAccumulator >= 1) {
        this.lifeStealAccumulator -= 1;
        this.gamePlayerHP = Math.min(PLAYER_HP, this.gamePlayerHP + 1);
      }
    }
  }

  private applyBossLifeSteal(): void {
    if (this.hasBuff('lifeSteal')) {
      this.gamePlayerHP = Math.min(PLAYER_HP, this.gamePlayerHP + 2);
    }
  }

  private trySpawnPowerUp(x: number, y: number): void {
    this.killCountSincePowerUp++;
    // Guaranteed spawn every POWERUP_KILL_INTERVAL kills, else random chance
    const shouldSpawn = this.killCountSincePowerUp >= POWERUP_KILL_INTERVAL ||
      Math.random() < POWERUP_DROP_CHANCE;
    if (!shouldSpawn) return;
    this.killCountSincePowerUp = 0;
    this.spawnPowerUp(x, y);
  }

  private spawnPowerUp(x: number, y: number): void {
    const types: PowerUpType[] = ['shield', 'speed', 'clear', 'health', 'multishot', 'laser', 'attackUp', 'doubleScore', 'lifeSteal', 'timeWarp'];
    const type = types[Math.floor(Math.random() * types.length)];
    const def = getPowerUpDef(type);
    this.powerUps.push({
      x: x, y: y,
      type: type,
      size: POWERUP_SIZE,
      active: true,
      color: def.color
    } as PowerUp);
  }

  private collectPowerUp(type: PowerUpType): void {
    const def = getPowerUpDef(type);
    this.soundMgr.powerUp();
    switch (type) {
      case 'shield':
        // Shield: accumulate charges (max depends on game mode)
        {
          const maxShields = this.gameMode === 'endless' ? MAX_SHIELD_CHARGES_ENDLESS : MAX_SHIELD_CHARGES_LEVEL;
          this.shieldCharges = Math.min(maxShields, this.shieldCharges + 1);
        }
        break;
      case 'speed':
        // Speed boost: double fire rate for duration
        this.activeBuffs = this.activeBuffs.filter(b => b.type !== 'speed');
        this.activeBuffs.push({ type: 'speed', endTime: Date.now() + def.duration });
        break;
      case 'clear':
        // Clear screen: destroy all enemies
        this.clearAllEnemies();
        break;
      case 'health':
        // Health restore: +2 HP, capped at PLAYER_HP
        this.gamePlayerHP = Math.min(PLAYER_HP, this.gamePlayerHP + 2);
        break;
      case 'multishot':
        // Multi-shot: 3-way spread for duration
        this.activeBuffs = this.activeBuffs.filter(b => b.type !== 'multishot');
        this.activeBuffs.push({ type: 'multishot', endTime: Date.now() + def.duration });
        break;
      case 'laser':
        // Laser beam: continuous damage beam for duration
        this.activeBuffs = this.activeBuffs.filter(b => b.type !== 'laser');
        this.activeBuffs.push({ type: 'laser', endTime: Date.now() + def.duration });
        this.lastLaserDamageTime = 0;
        break;
      case 'attackUp':
        // Permanent attack boost: +1 damage, stacks
        this.playerAtk += 1;
        break;
      case 'doubleScore':
        // Double score for duration
        this.activeBuffs = this.activeBuffs.filter(b => b.type !== 'doubleScore');
        this.activeBuffs.push({ type: 'doubleScore', endTime: Date.now() + def.duration });
        break;
      case 'lifeSteal':
        // Life steal: heal on kill for duration
        this.activeBuffs = this.activeBuffs.filter(b => b.type !== 'lifeSteal');
        this.activeBuffs.push({ type: 'lifeSteal', endTime: Date.now() + def.duration });
        this.lifeStealAccumulator = 0;
        break;
      case 'timeWarp':
        // Time warp: slow enemies & bullets for duration
        this.activeBuffs = this.activeBuffs.filter(b => b.type !== 'timeWarp');
        this.activeBuffs.push({ type: 'timeWarp', endTime: Date.now() + def.duration });
        break;
    }
  }

  private clearAllEnemies(): void {
    this.soundMgr.powerUp();
    for (let e of this.enemies) {
      if (e.active) {
        e.active = false;
        const clrMult = this.hasBuff('doubleScore') ? 2 : 1;
        this.gameScore += e.score * clrMult;
        if (this.gameMode === 'level') {
          this.levelScore += e.score * clrMult;
        }
        this.spawnExplosion(e.x, e.y, e.color);
      }
    }
    this.enemies = [];
  }

  // ---- Wave score helpers ----
  /** Score target for a specific wave */
  private getWaveScoreTarget(level: number, wave: number, isBoss: boolean): number {
    if (isBoss) {
      const targets = [4 + level * 1, 6 + level * 2];
      return targets[wave - 1] || 0;
    }
    const targets = [5 + level * 2, 8 + level * 3, 12 + level * 4];
    return targets[wave - 1] || 999;
  }

  /** Cumulative score needed to reach/complete a wave */
  private getWaveCumulativeTarget(level: number, wave: number, isBoss: boolean): number {
    let total = 0;
    for (let w = 1; w <= wave; w++) {
      total += this.getWaveScoreTarget(level, w, isBoss);
    }
    return total;
  }

  /** Spawn interval adjusted for last wave (faster) */
  private getWaveSpawnInterval(): number {
    const base = getLevelSpawnInterval(this.gameCurrentLevel);
    if (this.gameCurrentWave === WAVE_COUNT) {
      return Math.max(400, base * 0.7); // Last wave: 30% faster
    }
    return base;
  }

  /** Wave-aware enemy spawn with last-wave boost */
  private spawnWaveEnemy(isBoss: boolean): void {
    const isLastWave = this.gameCurrentWave === WAVE_COUNT;
    this.spawnLevelEnemy(isLastWave);
  }

  private getEnemySpeed(): number {
    if (this.gameMode === 'level') {
      return getLevelEnemySpeed(this.gameCurrentLevel);
    }
    if (this.gameMode === 'endless') {
      return getEndlessEnemySpeed(this.gameScore);
    }
    return BASE_ENEMY_SPEED;
  }

  /** Spawn boss for endless mode at score milestone */
  private spawnEndlessBoss(): void {
    const milestoneIndex = this.endlessBossDefeatedMilestones.length;
    const bossHp = getEndlessBossHp(milestoneIndex);
    const now = Date.now();
    this.boss = {
      x: this.canvasWidth / 2,
      y: BOSS_SIZE,
      hp: bossHp,
      maxHp: bossHp,
      atk: BOSS_BASE_ATK + milestoneIndex,
      size: BOSS_SIZE + milestoneIndex * 4,
      active: true,
      color: 0xFFE53935,
      phaseColor: 0xFFFF9800,
      dir: 1,
      lastFireTime: 0,
      lastSummonTime: 0,
      score: BOSS_SCORE * (milestoneIndex + 1) + milestoneIndex * 5,
      level: milestoneIndex + 1,
      phase: 1,
      phaseChanged: false,
      attackPattern: 0,
      lastSpecialAttack: 0,
      moveSpeed: BOSS_MOVE_SPEED,
      fireInterval: BOSS_FIRE_INTERVAL,
      phaseChangeTime: now
    };
    this.bossBullets = [];
    this.bossSpawned = true;
    this.gameIsBossLevel = true;
    this.soundMgr.bossWarning();
  }

  private spawnBoss(): void {
    const iteration = getBossIteration(this.gameCurrentLevel);
    const hpScale = 1 + (iteration - 1) * 0.5;
    const now = Date.now();
    this.boss = {
      x: this.canvasWidth / 2,
      y: BOSS_SIZE,
      hp: Math.floor(BOSS_BASE_HP * hpScale),
      maxHp: Math.floor(BOSS_BASE_HP * hpScale),
      atk: BOSS_BASE_ATK + iteration - 1,
      size: BOSS_SIZE,
      active: true,
      color: 0xFFE53935,
      phaseColor: 0xFFFF9800,
      dir: 1,
      lastFireTime: 0,
      lastSummonTime: 0,
      score: BOSS_SCORE * iteration,
      level: iteration,
      phase: 1,
      phaseChanged: false,
      attackPattern: 0,
      lastSpecialAttack: 0,
      moveSpeed: BOSS_MOVE_SPEED,
      fireInterval: BOSS_FIRE_INTERVAL,
      phaseChangeTime: now
    };
    this.bossBullets = [];
    this.bossSpawned = true;
    this.gameIsBossLevel = true;
    this.gameLevelTarget = 1; // Boss level: just defeat the boss
    this.soundMgr.bossWarning();
  }

  private updateBoss(now: number): void {
    if (!this.boss || !this.boss.active) return;
    const b = this.boss;

    // ---- Phase transition check ----
    const hpRatio = b.hp / b.maxHp;
    if (b.phase === 1 && hpRatio <= BOSS_PHASE2_HP_RATIO) {
      b.phase = 2;
      b.phaseChanged = true;
      b.phaseChangeTime = now;
      b.moveSpeed = BOSS_MOVE_SPEED_PHASE2;
      b.fireInterval = BOSS_FIRE_INTERVAL_PHASE2;
      // Phase 2 explosion
      for (let i = 0; i < 8; i++) {
        this.spawnExplosion(
          b.x + (Math.random() - 0.5) * b.size,
          b.y + (Math.random() - 0.5) * b.size,
          0xFFFF9800
        );
      }
    }
    // Clear phaseChanged flag after 500ms
    if (b.phaseChanged && now - b.phaseChangeTime > 500) {
      b.phaseChanged = false;
    }

    // ---- Horizontal movement (faster in phase 2) ----
    b.x += b.moveSpeed * b.dir;
    if (b.x > this.canvasWidth - b.size) {
      b.dir = -1;
    } else if (b.x < b.size) {
      b.dir = 1;
    }

    // ---- Periodic attack pattern rotation (phase 2) ----
    if (b.phase === 2 && now - b.lastSpecialAttack > BOSS_SPECIAL_INTERVAL) {
      // Rotate to next attack pattern
      b.attackPattern = (b.attackPattern + 1) % 4;
      b.lastSpecialAttack = now;
    }

    // ---- Boss fires based on current attack pattern ----
    const fireInterval = b.phase === 2 ? b.fireInterval : BOSS_FIRE_INTERVAL;
    if (now - b.lastFireTime > fireInterval) {
      b.lastFireTime = now;
      switch (b.attackPattern) {
        case 0: // Fan spread (3 bullets)
          this.bossAttackFan(b);
          break;
        case 1: // Aimed shot (toward player)
          this.bossAttackAimed(b);
          break;
        case 2: // Spiral burst (6 bullets in circle)
          this.bossAttackSpiral(b);
          break;
        case 3: // Shield + summon
          this.bossAttackShield(b);
          break;
      }
    }

    // ---- Boss summons minions ----
    const summonInterval = b.phase === 2 ? BOSS_SUMMON_INTERVAL_PHASE2 : BOSS_SUMMON_INTERVAL;
    if (now - b.lastSummonTime > summonInterval) {
      b.lastSummonTime = now;
      const count = b.phase === 2 ? 3 : 2;
      for (let i = 0; i < count; i++) {
        const offset = (i - (count - 1) / 2) * 35;
        this.enemies.push({
          x: b.x + offset, y: b.y + b.size / 2,
          hp: 1, maxHp: 1,
          atk: 1, size: 20,
          type: 'low',
          color: b.phase === 2 ? 0xFFFF9800 : 0xFFFF5252,
          speed: b.phase === 2 ? 2.5 : 2,
          score: 1,
          active: true,
          moveTick: 0, startX: b.x + offset, lastFireTime: 0
        } as Enemy);
      }
    }

    // ---- Bullet-Boss collision ----
    for (let bidx = 0; bidx < this.bullets.length; bidx++) {
      const bullet = this.bullets[bidx];
      if (!bullet.active || !b.active) continue;
      if (this.checkCollision(bullet.x, bullet.y, BULLET_SIZE, b.x, b.y, b.size)) {
        bullet.active = false;
        b.hp -= this.playerAtk;
        this.spawnExplosion(bullet.x, bullet.y, b.phase === 2 ? 0xFFFF9800 : 0xFFFFEB3B);
        this.soundMgr.bossHit();
        if (b.hp <= 0) {
          this.onBossDefeated(b);
        }
        break;
      }
    }

    // ---- Boss-Player collision ----
    if (!this.gameInvincible && b.active) {
      if (this.checkCollision(this.playerX, this.playerY, PLAYER_SIZE, b.x, b.y, b.size)) {
        this.spawnExplosion(this.playerX, this.playerY, 0xFFFF5252);
        this.applyDamageToPlayer(b.atk * 2);
      }
    }
  }

  /**
   * Boss attack pattern 0: 3-bullet fan spread (default).
   */
  private bossAttackFan(b: BossEntity): void {
    const count = b.phase === 2 ? 5 : 3;
    const spread = b.phase === 2 ? 0.4 : 0.3;
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * spread;
      const angle = Math.PI / 2 + offset;
      this.bossBullets.push({
        x: b.x,
        y: b.y + b.size / 2,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        active: true,
        size: 5
      } as BossBullet);
    }
  }

  /**
   * Boss attack pattern 1: aimed shot toward player.
   */
  private bossAttackAimed(b: BossEntity): void {
    const dx = this.playerX - b.x;
    const dy = this.playerY - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;
    const speed = b.phase === 2 ? 4 : 3;
    const nx = dx / dist * speed;
    const ny = dy / dist * speed;
    // Fire 2-3 aimed bullets
    const count = b.phase === 2 ? 3 : 2;
    for (let i = 0; i < count; i++) {
      const offset = (i - (count - 1) / 2) * 15;
      this.bossBullets.push({
        x: b.x + offset,
        y: b.y + b.size / 2,
        vx: nx,
        vy: ny,
        active: true,
        size: 6
      } as BossBullet);
    }
  }

  /**
   * Boss attack pattern 2: spiral burst (full circle).
   */
  private bossAttackSpiral(b: BossEntity): void {
    const bulletCount = b.phase === 2 ? 12 : 8;
    const speed = b.phase === 2 ? 2.5 : 2;
    for (let i = 0; i < bulletCount; i++) {
      const angle = (Math.PI * 2 / bulletCount) * i;
      this.bossBullets.push({
        x: b.x,
        y: b.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        active: true,
        size: 4
      } as BossBullet);
    }
  }

  /**
   * Boss attack pattern 3: shield mode + summon more minions.
   */
  private bossAttackShield(b: BossEntity): void {
    // Summon 4 minions in a cross pattern
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI * 2 / 4) * i;
      const dist = 50;
      this.enemies.push({
        x: b.x + Math.cos(angle) * dist,
        y: b.y + Math.sin(angle) * dist,
        hp: 2, maxHp: 2,
        atk: 1, size: 22,
        type: 'mid',
        color: 0xFFFF9800,
        speed: 1.5,
        score: 2,
        active: true,
        moveTick: 0, startX: b.x + Math.cos(angle) * dist, lastFireTime: 0
      } as Enemy);
    }
    // Shield flash effect via particles
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      this.spawnExplosion(
        b.x + Math.cos(angle) * b.size * 0.7,
        b.y + Math.sin(angle) * b.size * 0.7,
        0xFFFFD740
      );
    }
  }

  /**
   * Handle boss defeated: score, explosion, state cleanup.
   */
  private onBossDefeated(b: BossEntity): void {
    b.active = false;
    const bossScoreMult = this.hasBuff('doubleScore') ? 2 : 1;
    this.gameScore += b.score * bossScoreMult;
    if (this.gameMode === 'level') {
      this.levelScore += b.score;
      this.killsBoss++;
      this.gameLevelKills += 1;
    }
    // Big explosion (bigger for phase 2)
    const explosionCount = b.phase === 2 ? 10 : 5;
    for (let i = 0; i < explosionCount; i++) {
      this.spawnExplosion(
        b.x + (Math.random() - 0.5) * b.size,
        b.y + (Math.random() - 0.5) * b.size,
        b.phase === 2 ? 0xFFFF9800 : 0xFFFF5252
      );
    }
    this.bossSpawned = false;
    this.gameIsBossLevel = false;
    this.applyBossLifeSteal();
  }

  private spawnLevelEnemy(isLastWave: boolean = false): void {
    const level = this.gameCurrentLevel;
    const weights = this.calcEnemyWeights(isLastWave);
    const totalWeight = weights.low + weights.mid + weights.high + weights.elite + weights.sniper + weights.suicide;
    const rand = Math.random() * totalWeight;
    let cumul = weights.low;
    let chosenType: 'low' | 'mid' | 'high' | 'elite' | 'sniper' | 'suicide';
    if (rand < cumul) {
      chosenType = 'low';
    } else {
      cumul += weights.mid;
      if (rand < cumul) {
        chosenType = 'mid';
      } else {
        cumul += weights.high;
        if (rand < cumul) {
          chosenType = 'high';
        } else {
          cumul += weights.elite;
          if (rand < cumul) {
            chosenType = 'elite';
          } else {
            cumul += weights.sniper;
            if (rand < cumul) {
              chosenType = 'sniper';
            } else {
              chosenType = 'suicide';
            }
          }
        }
      }
    }

    const isElite = chosenType === 'elite';
    let enemy: Enemy;
    if (chosenType === 'sniper') {
      // Sniper spawns from side edge
      const side = Math.random() > 0.5 ? 1 : -1;
      const sx = side === 1 ? this.canvasWidth + SNIPER_SIZE : -SNIPER_SIZE;
      enemy = {
        x: sx, y: 40 + Math.random() * (this.canvasHeight * 0.3),
        hp: SNIPER_HP, maxHp: SNIPER_HP,
        atk: SNIPER_ATK, size: SNIPER_SIZE,
        type: 'sniper',
        color: SNIPER_COLOR, speed: SNIPER_SPEED,
        score: SNIPER_SCORE, active: true,
        moveTick: 0, startX: sx, startY: 0, lastFireTime: 0
      };
    } else if (chosenType === 'suicide') {
      // Suicide spawns from top, with initial speed toward player
      const sx = Math.random() * (this.canvasWidth - 60) + 30;
      enemy = {
        x: sx, y: -SUICIDE_SIZE,
        hp: SUICIDE_HP, maxHp: SUICIDE_HP,
        atk: SUICIDE_ATK, size: SUICIDE_SIZE,
        type: 'suicide',
        color: SUICIDE_COLOR, speed: SUICIDE_SPEED,
        score: SUICIDE_SCORE, active: true,
        moveTick: 0, startX: sx, startY: 0, lastFireTime: 0
      };
    } else {
      const foundDef = ENEMY_DEFS.find(d => d.type === chosenType);
      const def: EnemyDef = isElite
        ? { type: 'high', hp: ELITE_HP, atk: ELITE_ATK, size: ELITE_SIZE, baseWeight: 0, color: ELITE_COLOR, score: ELITE_SCORE }
        : foundDef !== undefined ? foundDef : ENEMY_DEFS[0];
      const x = Math.random() * (this.canvasWidth - 60) + 30;
      enemy = {
        x: x, y: -def.size,
        hp: def.hp, maxHp: def.hp,
        atk: def.atk, size: def.size,
        type: isElite ? 'elite' : chosenType,
        color: def.color, speed: this.getEnemySpeed(),
        score: def.score, active: true,
        moveTick: 0, startX: x, startY: 0, lastFireTime: 0
      };
    }
    this.enemies.push(enemy);
    // Count elite enemies on this level
    if (isElite) {
      this.eliteEnemiesOnLevel++;
    }
  }

  /** Endless mode enemy spawn (uses original enemy types + elite at higher scores) */
  private spawnEnemy(): void {
    const isEndless = this.gameMode === 'endless';
    // Elite enemy check for endless mode
    if (isEndless && canEndlessSpawnElite(this.gameScore) && Math.random() < getEndlessEliteChance(this.gameScore)) {
      const x = Math.random() * (this.canvasWidth - 60) + 30;
      this.enemies.push({
        x: x, y: -ELITE_SIZE,
        hp: ELITE_HP, maxHp: ELITE_HP,
        atk: ELITE_ATK, size: ELITE_SIZE,
        type: 'elite', color: ELITE_COLOR,
        speed: this.getEnemySpeed() * 0.8,
        score: ELITE_SCORE, active: true,
        moveTick: 0, startX: x, lastFireTime: 0
      } as Enemy);
      return;
    }

    const weights = this.calcEnemyWeights();
    const totalWeight = weights.low + weights.mid + weights.high + weights.sniper + weights.suicide;
    const rand = Math.random() * totalWeight;
    let chosenType: 'low' | 'mid' | 'high';
    if (rand < weights.low) { chosenType = 'low'; }
    else if (rand < weights.low + weights.mid) { chosenType = 'mid'; }
    else if (rand < weights.low + weights.mid + weights.high) { chosenType = 'high'; }
    else if (rand < weights.low + weights.mid + weights.high + weights.sniper) {
      // Spawn sniper
      const side = Math.random() > 0.5 ? 1 : -1;
      const sx = side === 1 ? this.canvasWidth + SNIPER_SIZE : -SNIPER_SIZE;
      this.enemies.push({
        x: sx, y: 40 + Math.random() * (this.canvasHeight * 0.3),
        hp: SNIPER_HP, maxHp: SNIPER_HP,
        atk: SNIPER_ATK, size: SNIPER_SIZE,
        type: 'sniper', color: SNIPER_COLOR,
        speed: SNIPER_SPEED, score: SNIPER_SCORE,
        active: true, moveTick: 0, startX: sx, startY: 0, lastFireTime: 0
      } as Enemy);
      return;
    } else {
      // Spawn suicide
      const sx = Math.random() * (this.canvasWidth - 60) + 30;
      this.enemies.push({
        x: sx, y: -SUICIDE_SIZE,
        hp: SUICIDE_HP, maxHp: SUICIDE_HP,
        atk: SUICIDE_ATK, size: SUICIDE_SIZE,
        type: 'suicide', color: SUICIDE_COLOR,
        speed: SUICIDE_SPEED, score: SUICIDE_SCORE,
        active: true, moveTick: 0, startX: sx, startY: 0, lastFireTime: 0
      } as Enemy);
      return;
    }

    const foundDef = ENEMY_DEFS.find(d => d.type === chosenType);
    const def = foundDef !== undefined ? foundDef : ENEMY_DEFS[0];
    const x = Math.random() * (this.canvasWidth - 60) + 30;
    const enemy: Enemy = {
      x: x, y: -def.size,
      hp: def.hp, maxHp: def.hp,
      atk: def.atk, size: def.size,
      type: def.type, color: def.color,
      speed: this.getEnemySpeed(),
      score: def.score, active: true,
      moveTick: 0, startX: x, startY: 0, lastFireTime: 0
    };
    this.enemies.push(enemy);
  }

  private clearWaveEnemies(_clearAll: boolean): void {
    this.enemies = [];
    this.bullets = [];
  }

  private calcEnemyWeights(isLastWave: boolean = false): EnemyWeights {
    if (this.gameMode === 'endless') {
      // Endless mode: weights based on difficulty tier
      const tier = getEndlessDifficultyTier(this.gameScore);
      let lowW = Math.max(2, 6 - tier * 0.5);
      let midW = Math.min(6, 3 + tier * 0.3);
      let highW = Math.min(5, 1 + tier * 0.4);
      let eliteW = 0;
      let sniperW = 0;
      let suicideW = 0;
      if (tier >= 3) { sniperW = 1; suicideW = 0.5; }
      return { low: lowW, mid: midW, high: highW, elite: eliteW, sniper: sniperW, suicide: suicideW };
    }
    const level = this.gameCurrentLevel;
    let lowW = 6;
    let midW = 3;
    let highW = 1 * (1 + level * 0.3);
    let eliteW = level >= ELITE_MIN_LEVEL ? (level - 4) * 0.5 : 0;
    let sniperW = level >= SNIPER_MIN_LEVEL ? (level - 7) * 0.4 : 0;
    let suicideW = level >= SUICIDE_MIN_LEVEL ? (level - 5) * 0.3 : 0;
    if (isLastWave) {
      // Last wave: boost all higher-tier spawn rates
      lowW = 4;
      midW = 4;
      highW = 2 * (1 + level * 0.3);
      eliteW = level >= ELITE_MIN_LEVEL ? (level - 3) * 0.8 : 0;
      sniperW = level >= SNIPER_MIN_LEVEL ? (level - 6) * 0.6 : 0;
      suicideW = level >= SUICIDE_MIN_LEVEL ? (level - 4) * 0.5 : 0;
    }
    return { low: lowW, mid: midW, high: highW, elite: eliteW, sniper: sniperW, suicide: suicideW };
  }

  /** Circle collision with generous hit area (1.1x for better feel) */
  private checkCollision(x1: number, y1: number, s1: number, x2: number, y2: number, s2: number): boolean {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Use 0.55 factor for slightly larger hitbox than visual
    const threshold = s1 * 0.55 + s2 * 0.55;
    return dist < threshold;
  }

  private spawnExplosion(x: number, y: number, color: number): void {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i;
      const speed = 2 + Math.random() * 3;
      this.particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 20 + Math.random() * 10,
        maxLife: 30,
        color: color,
        size: 4 + Math.random() * 4
      } as Particle);
    }
  }

  private nextLevel(): void {
    this.gameCurrentLevel += 1;
    this.gameLevelKills = 0;
    this.levelClearShown = false;
    this.gameStatus = 'playing';
    this.gameCurrentWave = 1;
    this.waveTransition = false;
    if (this.wavePauseTimer !== -1) { clearTimeout(this.wavePauseTimer); this.wavePauseTimer = -1; }
    // Clear power-ups, buffs, enemies
    this.powerUps = [];
    this.activeBuffs = [];
    this.killCountSincePowerUp = 0;
    this.enemies = [];
    this.eliteBullets = [];
    // Clear boss state
    this.boss = null;
    this.bossBullets = [];
    this.bossSpawned = false;
    this.gameIsBossLevel = false;
    // Reset spawn timer
    this.lastSpawnTime = 0;
    // Reset level mode tracking for next level
    this.levelObjectives = getLevelObjectives(this.gameCurrentLevel);
    this.comboKillCount = 0;
    this.maxComboKills = 0;
    this.powerUpsCollected = 0;
    this.playerWasHit = false;
    this.bossHitPlayer = false;
    this.eliteEnemiesOnLevel = 0;
    this.eliteEnemiesKilled = 0;
    this.starResult = { stars: 0, details: [] };
    this.levelReward = { starBonus: 0, objectiveBonus: 0, completionBonus: 0, totalReward: 0, extraStarsAwarded: 0 };
    this.chapterCompleted = false;
    // Reset player stats to initial state for the new level
    this.playerAtk = PLAYER_ATK;
    this.gamePlayerHP = PLAYER_HP;
    this.lastLaserDamageTime = 0;
    this.lifeStealAccumulator = 0;
    this.shieldCharges = 0;
  }

  private gameOver(): void {
    this.isGameOver = true;
    this.gameStatus = 'gameover';
    this.stopGameLoop();
    this.soundMgr.gameOver();
    // Clear active buffs, elite bullets, wave timer
    this.activeBuffs = [];
    this.powerUps = [];
    this.shieldCharges = 0;
    this.eliteBullets = [];
    if (this.wavePauseTimer !== -1) { clearTimeout(this.wavePauseTimer); this.wavePauseTimer = -1; }
    // Level mode: show result screen + save completion
    if (this.gameMode === 'level') {
      this.showLevelResult = true;
      this.levelPassed = false;
      this.gameStatus = 'levelResult';
      // Save completion data (0 stars for failed attempt, but still save best score)
      this.saveLevelCompletion();
    }
    // Check for new record
    this.checkNewRecord();
    // Save distributed record
    if (this.dataSync) {
      this.dataSync!.loadGameRecord().then((currentRecord) => {
        const record: GameRecord = {
          highScore: Math.max(currentRecord.highScore, this.gameScore),
          highestLevel: Math.max(currentRecord.highestLevel, this.gameCurrentLevel),
          totalKills: currentRecord.totalKills + this.gameScore,
          totalKillsLow: currentRecord.totalKillsLow + this.killsLow,
          totalKillsMid: currentRecord.totalKillsMid + this.killsMid,
          totalKillsHigh: currentRecord.totalKillsHigh + this.killsHigh,
          endlessBestScore: this.gameMode === 'endless'
            ? Math.max(currentRecord.endlessBestScore, this.gameScore)
            : currentRecord.endlessBestScore,
          levelProgressJson: currentRecord.levelProgressJson
        };
        this.dataSync!.saveGameRecord(record);
      });
    }
  }

  private async checkNewRecord(): Promise<void> {
    if (!this.dataSync) return;
    const record = await this.dataSync.loadGameRecord();
    if (this.gameScore > record.highScore) {
      this.isNewRecord = true;
    }
  }

  private restart(): void {
    this.isGameOver = false;
    this.isPaused = false;
    this.isNewRecord = false;
    this.gameScore = 0;
    this.gamePlayerHP = PLAYER_HP;
    this.gameCurrentLevel = 1;
    this.gameLevelKills = 0;
    this.gameStatus = 'playing';
    this.gameCurrentWave = 1;
    this.waveTransition = false;
    this.levelClearShown = false;
    this.playerX = this.canvasWidth / 2;
    this.playerY = this.canvasHeight - 80;
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.powerUps = [];
    this.activeBuffs = [];
    this.killCountSincePowerUp = 0;
    this.boss = null;
    this.bossBullets = [];
    this.bossSpawned = false;
    this.gameIsBossLevel = false;
    this.eliteBullets = [];
    this.gameInvincible = false;
    this.lastSpawnTime = 0;
    // Reset endless mode state
    this.endlessBossDefeatedMilestones = [];
    this.endlessDifficultyTier = 0;
    this.endlessBossSpawned = false;
    this.endlessBossScore = 0;
    // Reset power-up state
    this.playerAtk = PLAYER_ATK;
    this.lastLaserDamageTime = 0;
    this.lifeStealAccumulator = 0;
    this.shieldCharges = 0;
    this.syncToStorage();
    this.startGameLoop();
  }

  /**
   * Calculate and save level completion data (stars, objectives).
   * Should be called when a level is completed or game is over.
   */
  private saveLevelCompletion(): void {
    if (!this.dataSync || this.gameMode !== 'level') return;
    const currentLevel = this.gameCurrentLevel;
    const elapsed = Date.now() - this.levelStartTime;

    // Determine which special objectives were completed
    const completedObjectives: string[] = [];
    for (let i = 0; i < this.levelObjectives.length; i++) {
      const obj = this.levelObjectives[i];
      let completed = false;
      switch (obj.type) {
        case 'noDamage':
          completed = !this.playerWasHit;
          break;
        case 'timeLimit':
          completed = elapsed <= obj.parameter;
          break;
        case 'comboKills':
          completed = this.maxComboKills >= obj.parameter;
          break;
        case 'collectPowerUps':
          completed = this.powerUpsCollected >= obj.parameter;
          break;
        case 'killAllElite':
          completed = this.eliteEnemiesOnLevel > 0 && this.eliteEnemiesKilled >= this.eliteEnemiesOnLevel;
          break;
        case 'noBossHit':
          completed = !this.bossHitPlayer;
          break;
      }
      if (completed) {
        completedObjectives.push(obj.id);
      }
    }

    // Calculate star rating (only meaningful if level was passed)
    if (this.levelPassed) {
      this.starResult = calculateLevelStars(
        currentLevel,
        this.gamePlayerHP,
        PLAYER_HP,
        elapsed,
        completedObjectives
      );

      // Check if this level completion finishes a chapter
      const chapter = Math.ceil(currentLevel / 10);
      const chapterStart = (chapter - 1) * 10 + 1;
      const chapterEnd = Math.min(chapter * 10, 50);
      // Count how many levels in this chapter are now completed (including current)
      let completedInChapter = 0;
      for (let lvl = chapterStart; lvl <= chapterEnd; lvl++) {
        if (lvl === currentLevel) {
          completedInChapter++;
        } else {
          const check = this.dataSync ? null : null;
          // We can't easily check other levels without loading, so do it differently
        }
      }
      // Simple check: if the level is the last of the chapter (10, 20, 30...)
      this.chapterCompleted = (currentLevel % 10 === 0);

      // Calculate rewards
      this.levelReward = calculateLevelReward(
        currentLevel,
        this.starResult.stars,
        completedObjectives.length,
        this.chapterCompleted
      );

      // Award score bonus
      this.gameScore += this.levelReward.totalReward;
    } else {
      // Failed: keep previous stars if any, or 0
      this.starResult = { stars: 0, details: ['关卡失败'] };
      this.levelReward = { starBonus: 0, objectiveBonus: 0, completionBonus: 0, totalReward: 0, extraStarsAwarded: 0 };
      this.chapterCompleted = false;
    }

    // Save to persistent storage
    if (this.levelPassed) {
      this.dataSync.updateLevelCompletion(
        currentLevel,
        this.starResult.stars,
        this.gameScore,
        elapsed,
        completedObjectives
      );
    } else {
      // Failed: only save best score, don't mark as completed
      this.dataSync.updateLevelCompletion(
        currentLevel,
        0,
        this.gameScore,
        0,
        []
      );
    }
    hilog.info(DOMAIN, TAG, 'Level %{public}d saved: stars=%{public}d, score=%{public}d, reward=%{public}d',
      currentLevel, this.starResult.stars, this.gameScore, this.levelReward.totalReward);
  }

  /** Continue to next level after clearing result screen */
  private continueToNextLevel(): void {
    // Save completion for current level before advancing
    this.saveLevelCompletion();
    this.showLevelResult = false;
    this.levelPassed = false;
    this.levelStartTime = Date.now();
    this.levelScore = 0;
    this.killsLow = 0; this.killsMid = 0; this.killsHigh = 0;
    this.killsElite = 0; this.killsBoss = 0;
    this.nextLevel();
    // Trigger level transition animation
    this.showLevelTransition = true;
    this.transitionLevel = this.gameCurrentLevel;
    if (this.transitionTimer !== -1) {
      clearTimeout(this.transitionTimer);
    }
    this.transitionTimer = setTimeout(() => {
      this.showLevelTransition = false;
      this.transitionTimer = -1;
    }, 2000);
    this.startGameLoop();
  }

  /** Save level progress so player can continue later (saves NEXT level) */
  private saveLevelProgress(): void {
    const nextLevel = this.gameCurrentLevel + 1;
    AppStorage.setOrCreate('gameSavedLevel', nextLevel);
    AppStorage.setOrCreate('gameSavedScore', this.gameScore);
    hilog.info(DOMAIN, TAG, 'Level progress saved: nextLevel=%{public}d, score=%{public}d',
      nextLevel, this.gameScore);
  }

  /** Retry current level after failing */
  private retryLevel(): void {
    this.showLevelResult = false;
    this.levelPassed = false;
    this.isGameOver = false;
    this.levelStartTime = Date.now();
    this.levelScore = 0;
    this.killsLow = 0; this.killsMid = 0; this.killsHigh = 0;
    this.killsElite = 0; this.killsBoss = 0;
    this.gamePlayerHP = PLAYER_HP;
    this.gameLevelKills = 0;
    this.gameCurrentWave = 1;
    this.waveTransition = false;
    this.gameStatus = 'playing';
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.powerUps = [];
    this.activeBuffs = [];
    this.killCountSincePowerUp = 0;
    this.eliteBullets = [];
    this.boss = null;
    this.bossBullets = [];
    this.bossSpawned = false;
    this.gameIsBossLevel = false;
    this.gameInvincible = false;
    this.lastSpawnTime = 0;
    // Reset level mode tracking
    this.levelObjectives = getLevelObjectives(this.gameCurrentLevel);
    this.comboKillCount = 0;
    this.maxComboKills = 0;
    this.powerUpsCollected = 0;
    this.playerWasHit = false;
    this.bossHitPlayer = false;
    this.eliteEnemiesOnLevel = 0;
    this.eliteEnemiesKilled = 0;
    this.starResult = { stars: 0, details: [] };
    this.levelReward = { starBonus: 0, objectiveBonus: 0, completionBonus: 0, totalReward: 0, extraStarsAwarded: 0 };
    this.chapterCompleted = false;
    this.shieldCharges = 0;
    this.syncToStorage();
    this.startGameLoop();
  }

  private fire(): void {
    const now = Date.now();
    const cooldown = this.hasBuff('speed') ? FIRE_COOLDOWN / 2 : FIRE_COOLDOWN;
    if (now - this.lastFireTime < cooldown) return;
    this.lastFireTime = now;

    // Laser mode: no bullets, damage handled in update()
    if (this.hasBuff('laser')) {
      this.soundMgr.tap();
      return;
    }

    // Multishot: 3 bullets in fan spread
    if (this.hasBuff('multishot')) {
      const spreadAngle = Math.PI / 12;
      for (let i = -1; i <= 1; i++) {
        this.bullets.push({
          x: this.playerX,
          y: this.playerY - PLAYER_SIZE / 2,
          active: true,
          angle: i * spreadAngle
        } as Bullet);
      }
    } else {
      // Normal single bullet
      this.bullets.push({
        x: this.playerX,
        y: this.playerY - PLAYER_SIZE / 2,
        active: true
      } as Bullet);
    }
    this.soundMgr.tap();
  }

  private syncToStorage(): void {
    this.gamePlayerX = this.playerX;
    this.gamePlayerY = this.playerY;
    this.gameEnemies = JSON.stringify(this.enemies.map(e => ({
      x: e.x, y: e.y, hp: e.hp, maxHp: e.maxHp,
      atk: e.atk, size: e.size, type: e.type,
      color: e.color, speed: e.speed, score: e.score, active: e.active
    } as EnemyData)));
    this.gameBullets = JSON.stringify(this.bullets.map(b => ({
      x: b.x, y: b.y, active: b.active, angle: b.angle
    } as BulletData)));
    this.gamePowerUps = JSON.stringify(this.powerUps.map(p => ({
      x: p.x, y: p.y, type: p.type, size: p.size, active: p.active, color: p.color
    } as PowerUpData)));
    this.gameActiveBuffs = JSON.stringify(this.activeBuffs.map((b: ActiveBuff): ActiveBuff => ({
      type: b.type, endTime: b.endTime
    } as ActiveBuff)));
    this.gameShieldCharges = this.shieldCharges;
  }

  private parseEnemies(json: string): Enemy[] {
    try {
      const rawArr: Object = JSON.parse(json) as Object;
    const arr: EnemyData[] = rawArr as EnemyData[];
      return arr.map((item: EnemyData) => ({
        x: item.x as number, y: item.y as number,
        hp: item.hp as number, maxHp: item.maxHp as number,
        atk: item.atk as number, size: item.size as number,
        type: item.type as 'low' | 'mid' | 'high' | 'elite' | 'sniper' | 'suicide',
        color: item.color as number, speed: item.speed as number,
        score: item.score as number, active: item.active as boolean
      } as Enemy));
    } catch {
      return [];
    }
  }

  private parseBullets(json: string): Bullet[] {
    try {
      const rawArr: Object = JSON.parse(json) as Object;
    const arr: BulletData[] = rawArr as BulletData[];
      return arr.map((item: BulletData) => ({
        x: item.x as number, y: item.y as number,
        active: item.active as boolean,
        angle: item.angle as number | undefined
      } as Bullet));
    } catch {
      return [];
    }
  }

  private parsePowerUps(json: string): PowerUp[] {
    try {
      const rawArr: Object = JSON.parse(json) as Object;
    const arr: PowerUpData[] = rawArr as PowerUpData[];
      return arr.map((item: PowerUpData) => ({
        x: item.x as number, y: item.y as number,
        type: item.type as PowerUpType,
        size: item.size as number,
        active: item.active as boolean,
        color: item.color as number
      } as PowerUp));
    } catch {
      return [];
    }
  }

  private parseActiveBuffs(json: string): ActiveBuff[] {
    try {
      const rawArr: Object = JSON.parse(json) as Object;
    return rawArr as ActiveBuff[];
    } catch {
      return [];
    }
  }

  // ---- Drawing ----
  private draw(): void {
    if (!this.canvasCtx) return;
    const ctx = this.canvasCtx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.drawBackground(ctx);
    this.drawParticles(ctx);
    this.drawPowerUps(ctx);
    this.drawBullets(ctx);
    this.drawEliteBullets(ctx);
    this.drawBossBullets(ctx);
    this.drawPlayer(ctx);
    this.drawLaserBeam(ctx);
    this.drawEnemies(ctx);
    this.drawBoss(ctx);
    this.drawWaveIndicator(ctx);
    this.drawBuffIndicator(ctx);
    this.drawHUD(ctx);

    // Game over overlay (endless mode only; level mode uses result screen)
    if (this.isGameOver && this.gameMode !== 'level') {
      this.drawGameOverOverlay(ctx);
    }
  }

  private drawBackground(ctx: CanvasRenderingContext2D): void {
    // Get theme based on level or endless difficulty tier
    let theme: LevelTheme | null = null;
    if (this.gameMode === 'level') {
      theme = getLevelTheme(this.gameCurrentLevel);
    } else if (this.gameMode === 'endless') {
      // Map endless difficulty tier to a theme index (cycles every 5 tiers)
      const tier = getEndlessDifficultyTier(this.gameScore);
      const themeIdx = tier % 5;
      const endlessThemes: LevelTheme[] = [
        { bgTop: '#0a0a2e', bgBottom: '#1a1a4e', starColor: 'rgb', accentColor: '#2196F3', name: '星云' },
        { bgTop: '#2e0a0a', bgBottom: '#4e1a1a', starColor: 'rgb', accentColor: '#FF7043', name: '日冕' },
        { bgTop: '#0a001a', bgBottom: '#1a0033', starColor: 'rgb', accentColor: '#AB47BC', name: '深渊' },
        { bgTop: '#001a1a', bgBottom: '#003333', starColor: 'rgb', accentColor: '#26C6DA', name: '冰域' },
        { bgTop: '#1a0a00', bgBottom: '#331a00', starColor: 'rgb', accentColor: '#FFD740', name: '炼狱' },
      ];
      theme = endlessThemes[themeIdx];
    }
    const bgTop = theme ? theme.bgTop : '#0a0a2e';
    const bgBottom = theme ? theme.bgBottom : '#1a1a4e';

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
    grad.addColorStop(0, bgTop);
    grad.addColorStop(1, bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Stars with theme-aware color
    const seed = 42;
    for (let i = 0; i < 40; i++) {
      const sx = ((seed * (i + 1) * 137) % this.canvasWidth);
      const sy = ((seed * (i + 1) * 89 + Date.now() * 0.02) % this.canvasHeight);
      const brightness = 100 + ((seed * (i + 1) * 53) % 155);
      if (theme) {
        // Use theme star color
        ctx.fillStyle = `rgba(${brightness},${brightness},255,${0.5 + (i % 3) * 0.2})`;
      } else {
        ctx.fillStyle = `rgb(${brightness},${brightness},255)`;
      }
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + ((seed * (i + 1) * 7) % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D): void {
    if (this.gameInvincible && Math.floor(Date.now() / 100) % 2 === 0) return; // Blinking effect

    const x = this.playerX;
    const y = this.playerY;
    const size = PLAYER_SIZE;

    ctx.save();
    // Body (triangle)
    ctx.fillStyle = '#2196F3';
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);          // Top
    ctx.lineTo(x - size / 2, y + size / 2); // Bottom left
    ctx.lineTo(x - size / 4, y + size / 4);
    ctx.lineTo(x, y + size / 3);           // Bottom center indent
    ctx.lineTo(x + size / 4, y + size / 4);
    ctx.lineTo(x + size / 2, y + size / 2); // Bottom right
    ctx.closePath();
    ctx.fill();
    // Cockpit
    ctx.fillStyle = '#64B5F6';
    ctx.beginPath();
    ctx.arc(x, y - size / 6, size / 6, 0, Math.PI * 2);
    ctx.fill();
    // Wings glow
    ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x - size / 2.5, y + size / 4, size / 4, size / 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + size / 2.5, y + size / 4, size / 4, size / 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawEnemies(ctx: CanvasRenderingContext2D): void {
    for (let e of this.enemies) {
      if (!e.active) continue;
      ctx.save();
      const colorStr = '#' + e.color.toString(16).padStart(6, '0');
      ctx.fillStyle = colorStr;

      if (e.type === 'low') {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(e.x - e.size / 5, e.y - e.size / 6, e.size / 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.x + e.size / 5, e.y - e.size / 6, e.size / 10, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'mid') {
        ctx.beginPath();
        ctx.moveTo(e.x, e.y - e.size / 2);
        ctx.lineTo(e.x + e.size / 2, e.y);
        ctx.lineTo(e.x, e.y + e.size / 2);
        ctx.lineTo(e.x - e.size / 2, e.y);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size / 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'high') {
        ctx.beginPath();
        ctx.moveTo(e.x, e.y - e.size / 2);
        ctx.lineTo(e.x + e.size / 2, e.y + e.size / 2);
        ctx.lineTo(e.x - e.size / 2, e.y + e.size / 2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size / 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'elite') {
        // Hexagon with glow
        ctx.strokeStyle = '#E1BEE7';
        ctx.lineWidth = 2;
        this.drawPolygon(ctx, e.x, e.y, e.size / 2, 6);
        ctx.fill();
        ctx.stroke();
        // Inner core
        ctx.fillStyle = '#E1BEE7';
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size / 5, 0, Math.PI * 2);
        ctx.fill();
        // Cross mark
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(e.x - 4, e.y); ctx.lineTo(e.x + 4, e.y);
        ctx.moveTo(e.x, e.y - 4); ctx.lineTo(e.x, e.y + 4);
        ctx.stroke();
      } else if (e.type === 'sniper') {
        // Diamond shape with crosshair
        ctx.strokeStyle = '#80DEEA';
        ctx.lineWidth = 2;
        this.drawPolygon(ctx, e.x, e.y, e.size / 2, 4);
        ctx.fill();
        ctx.stroke();
        // Crosshair
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(e.x - e.size / 3, e.y); ctx.lineTo(e.x + e.size / 3, e.y);
        ctx.moveTo(e.x, e.y - e.size / 3); ctx.lineTo(e.x, e.y + e.size / 3);
        ctx.stroke();
        // Center dot
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(e.x, e.y, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === 'suicide') {
        // Flaming circle with trail
        const pulse2 = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        ctx.globalAlpha = pulse2;
        ctx.fillStyle = colorStr;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // Warning icon
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💥', e.x, e.y);
      }

      // HP bar
      if (e.hp < e.maxHp) {
        const barWidth = e.size;
        const barHeight = 4;
        const barX = e.x - barWidth / 2;
        const barY = e.y - e.size / 2 - 8;
        ctx.fillStyle = 'rgba(255,0,0,0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(barX, barY, barWidth * (e.hp / e.maxHp), barHeight);
      }
      ctx.restore();
    }
  }

  private drawBullets(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (let b of this.bullets) {
      if (!b.active) continue;
      if (b.angle !== undefined) {
        // Angled bullet (multishot) with cyan trail
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, BULLET_SIZE);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.5, '#00E5FF');
        grad.addColorStop(1, 'rgba(0,229,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, BULLET_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(0, 0, BULLET_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        // Trail
        ctx.fillStyle = 'rgba(0,229,255,0.3)';
        ctx.beginPath();
        ctx.ellipse(0, BULLET_SIZE * 1.2, BULLET_SIZE * 0.4, BULLET_SIZE * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        // Normal bullet
        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, BULLET_SIZE);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.5, '#64B5F6');
        gradient.addColorStop(1, 'rgba(100,181,246,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, BULLET_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(b.x, b.y, BULLET_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D): void {
    for (let p of this.particles) {
      const alpha = p.life / p.maxLife;
      const colorStr = '#' + p.color.toString(16).padStart(6, '0');
      ctx.globalAlpha = alpha;
      ctx.fillStyle = colorStr;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private drawBoss(ctx: CanvasRenderingContext2D): void {
    if (!this.boss?.active) return;
    ctx.save();
    const b = this.boss;
    const isPhase2 = b.phase === 2;
    const mainColor = isPhase2 ? b.phaseColor : b.color;
    const colorStr = '#' + mainColor.toString(16).padStart(6, '0');
    const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 0.9;

    // Phase 2 rage glow (pulsing faster)
    const glowPulse = isPhase2 ? Math.sin(Date.now() * 0.008) * 0.3 + 0.7 : pulse * 0.3;
    ctx.globalAlpha = glowPulse;
    ctx.fillStyle = isPhase2 ? '#FF9800' : colorStr;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size * 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Main body (octagon in phase 1, hexagram in phase 2)
    ctx.globalAlpha = 1;
    ctx.fillStyle = colorStr;
    ctx.strokeStyle = isPhase2 ? '#FFD740' : '#FFD740';
    ctx.lineWidth = isPhase2 ? 4 : 3;
    if (isPhase2) {
      // Hexagram for phase 2
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i - Math.PI / 2;
        const radius = i % 2 === 0 ? b.size / 2 : b.size / 3;
        const px = b.x + radius * Math.cos(angle);
        const py = b.y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      this.drawPolygon(ctx, b.x, b.y, b.size / 2, 8);
      ctx.fill();
      ctx.stroke();
    }

    // Phase indicator
    if (isPhase2) {
      ctx.fillStyle = '#FFD740';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚡狂暴⚡', b.x, b.y - b.size / 2 - 14);
    }

    // Inner core
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size / 6, 0, Math.PI * 2);
    ctx.fill();

    // Eye (red in phase 1, gold in phase 2)
    ctx.fillStyle = isPhase2 ? '#FFD740' : '#FF0000';
    ctx.beginPath();
    ctx.arc(b.x, b.y - 4, b.size / 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isPhase2 ? '🔥' : '👁', b.x, b.y - 4);

    // Attack pattern indicator (phase 2 only)
    if (isPhase2) {
      const patternIcons = ['🔱', '🎯', '🌀', '🛡️'];
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(patternIcons[b.attackPattern], b.x + b.size / 2 + 12, b.y - 10);
    }

    // Boss HP bar (changes color in phase 2)
    const barW = b.size + 20;
    const barH = 6;
    const barX = b.x - barW / 2;
    const barY = b.y + b.size / 2 + 10;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.roundRect(barX, barY, barW, barH, 3);
    ctx.fill();
    ctx.fillStyle = isPhase2 ? '#FF9800' : '#FF5252';
    ctx.roundRect(barX, barY, barW * (b.hp / b.maxHp), barH, 3);
    ctx.fill();
    // HP text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.hp + '/' + b.maxHp, b.x, barY + barH / 2);

    ctx.restore();
  }

  private drawBossBullets(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (let bb of this.bossBullets) {
      if (!bb.active) continue;
      ctx.fillStyle = '#FF5252';
      ctx.beginPath();
      ctx.arc(bb.x, bb.y, bb.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();
      ctx.arc(bb.x, bb.y, bb.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawLaserBeam(ctx: CanvasRenderingContext2D): void {
    if (!this.hasBuff('laser')) return;
    const x = this.playerX;
    const topY = 0;
    const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;

    ctx.save();
    // Outer glow
    const gradient = ctx.createLinearGradient(0, topY, 0, this.playerY);
    gradient.addColorStop(0, 'rgba(255,64,129,0)');
    gradient.addColorStop(0.3, 'rgba(255,64,129,' + (pulse * 0.4) + ')');
    gradient.addColorStop(0.7, 'rgba(255,64,129,' + (pulse * 0.6) + ')');
    gradient.addColorStop(1, 'rgba(255,64,129,' + (pulse * 0.8) + ')');
    ctx.fillStyle = gradient;
    ctx.roundRect(x - LASER_BEAM_WIDTH * 2.5, topY, LASER_BEAM_WIDTH * 5, this.playerY - topY, 4);
    ctx.fill();

    // Main beam
    const beamGrad = ctx.createLinearGradient(0, topY, 0, this.playerY);
    beamGrad.addColorStop(0, 'rgba(255,255,255,0.1)');
    beamGrad.addColorStop(0.4, 'rgba(255,255,255,0.7)');
    beamGrad.addColorStop(0.7, 'rgba(255,255,255,0.9)');
    beamGrad.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.fillStyle = beamGrad;
    ctx.roundRect(x - LASER_BEAM_WIDTH / 2, topY, LASER_BEAM_WIDTH, this.playerY - topY, 3);
    ctx.fill();

    // Core bright center
    ctx.fillStyle = 'rgba(255,255,255,' + pulse + ')';
    ctx.roundRect(x - 2, topY, 4, this.playerY - topY, 2);
    ctx.fill();

    ctx.restore();
  }

  private drawEliteBullets(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    for (let eb of this.eliteBullets) {
      if (!eb.active) continue;
      ctx.fillStyle = '#CE93D8';
      ctx.beginPath();
      ctx.arc(eb.x, eb.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(eb.x, eb.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawWaveIndicator(ctx: CanvasRenderingContext2D): void {
    if (this.gameMode !== 'level') return;

    const level = this.gameCurrentLevel;
    const isBoss = isBossLevel(level);
    const theme = getLevelTheme(level);
    const waveTarget = this.getWaveScoreTarget(level, this.gameCurrentWave, isBoss);
    const cumulativePrev = this.getWaveCumulativeTarget(level, this.gameCurrentWave - 1, isBoss);
    const waveProgress = Math.min(1, (this.levelScore - cumulativePrev) / Math.max(1, waveTarget));

    // Wave indicator only appears from wave 2 onward (wave 1 is the silent starting wave)
    if (this.gameCurrentWave > 1) {
      ctx.save();
      ctx.fillStyle = theme.accentColor;
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'right';
      const waveLabel = isBoss ? '👑 ' : '🌊 ';
      ctx.fillText(waveLabel + this.gameCurrentWave + '/' + WAVE_COUNT, this.canvasWidth - 16, 24);

      // Wave progress bar
      const barX = this.canvasWidth - 120;
      const barY = 30;
      const barW = 104;
      const barH = 4;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.roundRect(barX, barY, barW, barH, 2);
      ctx.fill();
      ctx.fillStyle = isBoss ? '#FF5252' : theme.accentColor;
      ctx.roundRect(barX, barY, barW * waveProgress, barH, 2);
      ctx.fill();
      ctx.restore();
    }

    // Wave transition overlay (shows NEXT wave number)
    if (this.waveTransition) {
      const nextWave = this.gameCurrentWave + 1;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      ctx.fillStyle = theme.accentColor;
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🌊 第 ' + nextWave + '/' + WAVE_COUNT + ' 波', this.canvasWidth / 2, this.canvasHeight / 2 - 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '18px sans-serif';
      ctx.fillText('准备迎战...', this.canvasWidth / 2, this.canvasHeight / 2 + 30);
      ctx.restore();
    }
  }

  private drawPowerUps(ctx: CanvasRenderingContext2D): void {
    for (let p of this.powerUps) {
      if (!p.active) continue;
      ctx.save();
      const colorStr = '#' + p.color.toString(16).padStart(6, '0');
      const pulse = Math.sin(Date.now() * 0.005) * 0.2 + 0.8;

      // Glow effect
      ctx.globalAlpha = pulse * 0.4;
      ctx.fillStyle = colorStr;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Main shape
      ctx.globalAlpha = pulse;
      ctx.fillStyle = colorStr;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;

      switch (p.type) {
        case 'shield':
          // Hexagon
          this.drawPolygon(ctx, p.x, p.y, p.size / 2, 6);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🛡', p.x, p.y);
          break;
        case 'speed':
          // Diamond with lightning
          this.drawPolygon(ctx, p.x, p.y, p.size / 2, 4);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', p.x, p.y);
          break;
        case 'clear':
          // Star shape
          this.drawStar(ctx, p.x, p.y, p.size / 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('💥', p.x, p.y);
          break;
        case 'health':
          // Circle with cross
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('❤️', p.x, p.y);
          break;
        case 'multishot':
          // Diamond
          this.drawPolygon(ctx, p.x, p.y, p.size / 2, 4);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🔱', p.x, p.y);
          break;
        case 'laser':
          // Circle with vertical line
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.size / 3);
          ctx.lineTo(p.x, p.y + p.size / 3);
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🌐', p.x, p.y);
          break;
        case 'attackUp':
          // Star shape for attack boost
          this.drawStar(ctx, p.x, p.y, p.size / 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('💎', p.x, p.y);
          break;
        case 'doubleScore':
          // Double circle with star
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✨', p.x, p.y);
          break;
        case 'lifeSteal':
          // Heart outline with fangs
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🧛', p.x, p.y);
          break;
        case 'timeWarp':
          // Diamond with clock
          this.drawPolygon(ctx, p.x, p.y, p.size / 2, 4);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⏱', p.x, p.y);
          break;
      }
      ctx.restore();
    }
  }

  private drawPolygon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, sides: number): void {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  private drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number): void {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 / 10) * i - Math.PI / 2;
      const radius = i % 2 === 0 ? r : r * 0.5;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  private drawBuffIndicator(ctx: CanvasRenderingContext2D): void {
    if (this.activeBuffs.length === 0) return;
    const now = Date.now();
    ctx.save();
    let x = 16;
    const y = this.canvasHeight - 44;

    const buffNames: Record<string, string> = {
      'speed': '加速',
      'multishot': '散射',
      'laser': '激光',
      'doubleScore': '双倍',
      'lifeSteal': '吸血',
      'timeWarp': '减速'
    };

    for (let buff of this.activeBuffs) {
      const remaining = buff.endTime - now;
      if (remaining <= 0) continue;
      const def = getPowerUpDef(buff.type);
      const colorStr = '#' + def.color.toString(16).padStart(6, '0');
      const pct = remaining / def.duration;
      const secs = (remaining / 1000).toFixed(1);
      const name = buffNames[buff.type] || buff.type;

      // Emoji icon — 使用道具本身的颜色
      ctx.globalAlpha = 0.85;
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = colorStr;
      ctx.fillText(def.label, x, y - 5);

      // Buff name + 剩余秒数
      ctx.font = '17px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText(name + ' ' + secs + 's', x + 30, y - 5);

      // 彩色计时条 — 半透明，不遮挡背景
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = colorStr;
      ctx.roundRect(x, y + 10, 110, 4, 2);
      ctx.fill();

      x += 125;
    }
    ctx.restore();
  }

  private drawHUD(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.font = '18px sans-serif';

    // HP & Shield (bottom-right, larger)
    ctx.textAlign = 'right';
    const rX = this.canvasWidth - 16;
    const rY = this.canvasHeight - 24;

    // HP
    ctx.fillStyle = '#FF5252';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText('❤️ ' + this.gamePlayerHP, rX, rY - 40);

    // Shield (only when > 0)
    if (this.shieldCharges > 0) {
      ctx.fillStyle = '#FFD740';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('🛡 ' + this.shieldCharges, rX, rY);
    }

    // Score
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'right';
    ctx.fillText('⭐ ' + this.gameScore, this.canvasWidth - 16, 36);

    // Level / Difficulty info
    if (this.gameMode === 'level') {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFD740';
      ctx.font = '14px sans-serif';
      ctx.fillText('🎯 第' + this.gameCurrentLevel + '关', 16, 60);

      // Score progress bar
      const level = this.gameCurrentLevel;
      const isBoss = isBossLevel(level);
      const target = this.getWaveCumulativeTarget(level, this.gameCurrentWave, isBoss);
      const prev = this.getWaveCumulativeTarget(level, this.gameCurrentWave - 1, isBoss);
      const waveP = Math.min(1, (this.levelScore - prev) / Math.max(1, target - prev));
      const barX = 16;
      const barY = 70;
      const barW = Math.min(200, this.canvasWidth - 32);
      const barH = 8;
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.roundRect(barX, barY, barW, barH, 4);
      ctx.fill();
      ctx.fillStyle = isBoss ? '#FF5252' : '#FFD740';
      ctx.roundRect(barX, barY, barW * Math.min(1, waveP), barH, 4);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      const waveScore = Math.max(0, this.levelScore - prev);
      const waveTarget = Math.max(1, target - prev);
      ctx.fillText(Math.floor(waveScore) + '/' + Math.floor(waveTarget), barX + 4, barY + barH - 1);

      // Special objective mini-indicator (right side)
      let completedCount = 0;
      for (let i = 0; i < this.levelObjectives.length; i++) {
        const obj = this.levelObjectives[i];
        let done = false;
        switch (obj.type) {
          case 'noDamage': done = !this.playerWasHit; break;
          case 'timeLimit': done = (Date.now() - this.levelStartTime) <= obj.parameter; break;
          case 'comboKills': done = this.maxComboKills >= obj.parameter; break;
          case 'collectPowerUps': done = this.powerUpsCollected >= obj.parameter; break;
          case 'killAllElite': done = this.eliteEnemiesOnLevel > 0 && this.eliteEnemiesKilled >= this.eliteEnemiesOnLevel; break;
          case 'noBossHit': done = !this.bossHitPlayer; break;
        }
        if (done) completedCount++;
      }
      ctx.textAlign = 'right';
      ctx.fillStyle = completedCount === this.levelObjectives.length && this.levelObjectives.length > 0
        ? '#4CAF50' : 'rgba(255,255,255,0.5)';
      ctx.font = '11px sans-serif';
      ctx.fillText('🎯 ' + completedCount + '/' + this.levelObjectives.length, this.canvasWidth - 16, 74);
    } else if (this.gameMode === 'endless') {
      // Endless mode difficulty tier display
      const tier = getEndlessDifficultyTier(this.gameScore);
      const tierName = getEndlessTierName(tier);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFD740';
      ctx.font = '14px sans-serif';

      // Color-coded tier badge
      const tierColors = ['#4CAF50', '#8BC34A', '#FFEB3B', '#FF9800', '#FF5722',
        '#E91E63', '#9C27B0', '#3F51B5', '#1A237E', '#000000'];
      const tierColor = tierColors[Math.min(tier, tierColors.length - 1)];
      ctx.fillStyle = tierColor;
      ctx.fillText('⚔ ' + tierName, 16, 60);

      // Score progress to next tier
      const thresholds = ENDLESS_DIFFICULTY_THRESHOLDS;
      if (tier < thresholds.length - 1) {
        const currentThreshold = thresholds[tier];
        const nextThreshold = thresholds[tier + 1];
        const progress = Math.min(1, (this.gameScore - currentThreshold) / Math.max(1, nextThreshold - currentThreshold));
        const barX = 16;
        const barY = 70;
        const barW = Math.min(160, this.canvasWidth - 32);
        const barH = 4;
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.roundRect(barX, barY, barW, barH, 2);
        ctx.fill();
        ctx.fillStyle = tierColor;
        ctx.roundRect(barX, barY, barW * progress, barH, 2);
        ctx.fill();
      }

      // Boss warning indicator
      if (this.endlessBossSpawned && this.boss?.active) {
        ctx.fillStyle = '#FF5252';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('👑 BOSS', this.canvasWidth - 16, 60);
      }
    }

    ctx.restore();
  }

  private drawGameOverOverlay(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    // Semi-transparent background
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    ctx.textAlign = 'center';
    // Title
    ctx.fillStyle = '#FF5252';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('💥 GAME OVER', this.canvasWidth / 2, this.canvasHeight / 2 - 100);

    // Score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px sans-serif';
    ctx.fillText('最终得分: ' + this.gameScore, this.canvasWidth / 2, this.canvasHeight / 2 - 40);

    // Mode info
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#FFD740';
    if (this.gameMode === 'level') {
      ctx.fillText('到达关卡: 第' + this.gameCurrentLevel + '关', this.canvasWidth / 2, this.canvasHeight / 2);
    } else if (this.gameMode === 'endless') {
      const tier = getEndlessDifficultyTier(this.gameScore);
      const tierName = getEndlessTierName(tier);
      ctx.fillStyle = '#AB47BC';
      ctx.fillText('🏆 难度等级: ' + tierName, this.canvasWidth / 2, this.canvasHeight / 2);
      ctx.fillStyle = '#FFD740';
      ctx.fillText('👑 Boss击败: ' + this.endlessBossDefeatedMilestones.length + '次', this.canvasWidth / 2, this.canvasHeight / 2 + 30);
    }

    // New record badge
    if (this.isNewRecord) {
      ctx.fillStyle = '#FFD740';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('🎉 新纪录！', this.canvasWidth / 2, this.canvasHeight / 2 + 75);
    }

    // Restart hint
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '16px sans-serif';
    ctx.fillText('点击「重新开始」按钮继续', this.canvasWidth / 2, this.canvasHeight / 2 + 120);

    ctx.restore();
  }

  // ---- Touch/Gesture Handlers ----
  private onTouchMove(event: TouchEvent): void {
    if (this.isPaused || this.isGameOver) return;
    const touches = event.touches;
    if (touches.length > 0) {
      const touch = touches[0];
      this.playerX = Math.max(PLAYER_SIZE / 2, Math.min(this.canvasWidth - PLAYER_SIZE / 2, touch.x));
      this.playerY = Math.max(PLAYER_SIZE / 2, Math.min(this.canvasHeight - PLAYER_SIZE / 2, touch.y));
    }
  }

  private onTouchDown(event: TouchEvent): void {
    if (this.isPaused || this.isGameOver) return;
    this.fire();
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
    this.gameStatus = this.isPaused ? 'paused' : 'playing';
  }

  @Consume navPathStack: NavPathStack;

  private exitGame(): void {
    this.stopGameLoop();
    if (this.invincibleTimer !== -1) {
      clearTimeout(this.invincibleTimer);
    }
    if (this.levelClearTimer !== -1) {
      clearTimeout(this.levelClearTimer);
    }
    if (this.wavePauseTimer !== -1) {
      clearTimeout(this.wavePauseTimer);
      this.wavePauseTimer = -1;
    }
    this.navPathStack.pop();
  }

  build() {
    NavDestination() {
      Stack() {
        // Game Canvas
        Canvas(this.canvasCtx)
          .width('100%')
          .height('100%')
          .onReady(() => {
            this.onCanvasReady();
          })
          .onAreaChange((oldVal: Area, newVal: Area) => {
            this.onCanvasAreaChange(oldVal, newVal);
          })
          .onTouch((event: TouchEvent) => {
            if (event.type === TouchType.Move) {
              this.onTouchMove(event);
            } else if (event.type === TouchType.Down) {
              this.onTouchDown(event);
            }
          })

        // Top bar — positioned at top, doesn't block game area
        Row() {
          // Pause button
          Button() {
            Text(this.isPaused ? '▶' : '⏸')
              .fontSize(20)
              .fontColor(Color.White)
          }
          .width(44)
          .height(44)
          .backgroundColor('rgba(0,0,0,0.4)')
          .borderRadius(22)
          .onClick(() => {
            this.togglePause();
          })
        }
        .width('100%')
        .padding({ left: 12, right: 12, top: 8 })
        .position({ x: 0, y: 0 })
        .zIndex(1)

        // Pause overlay — full screen, centered
        if (this.isPaused && !this.isGameOver) {
          Column() {
            Text('⏸ 已暂停')
              .fontSize(36)
              .fontColor(Color.White)
              .fontWeight(FontWeight.Bold)

            Button() {
              Text('继续游戏')
                .fontSize(20)
                .fontColor(Color.White)
            }
            .width(180)
            .height(52)
            .backgroundColor('#2196F3')
            .borderRadius(26)
            .margin({ top: 20 })
            .onClick(() => {
              this.togglePause();
            })

            Button() {
              Text('退出游戏')
                .fontSize(18)
                .fontColor(Color.White)
            }
            .width(160)
            .height(44)
            .backgroundColor('rgba(255,255,255,0.2)')
            .borderRadius(22)
            .margin({ top: 12 })
            .onClick(() => {
              this.exitGame();
            })
          }
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.6)')
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
          .zIndex(10)
        }

        // Game Over buttons (endless mode only)
        if (this.isGameOver && this.gameMode !== 'level') {
          Column() {
            Row() {
              Button() {
                Text('🔄 重新开始')
                  .fontSize(18)
                  .fontColor(Color.White)
              }
              .width(140)
              .height(48)
              .backgroundColor('#4CAF50')
              .borderRadius(24)
              .onClick(() => {
                this.restart();
              })

              Button() {
                Text('🚪 退出')
                  .fontSize(18)
                  .fontColor(Color.White)
              }
              .width(120)
              .height(48)
              .backgroundColor('rgba(255,255,255,0.2)')
              .borderRadius(24)
              .margin({ left: 16 })
              .onClick(() => {
                this.exitGame();
              })
            }
            .margin({ bottom: 60 })
          }
          .width('100%')
          .height('100%')
          .justifyContent(FlexAlign.End)
          .alignItems(HorizontalAlign.Center)
          .zIndex(10)
        }

        // ---- Level Result Screen ----
        if (this.showLevelResult && this.gameMode === 'level') {
          Column() {
            // Title
            Text(this.getResultPassIcon() + ' ' + this.getResultPassText())
              .fontSize(32)
              .fontWeight(FontWeight.Bold)
              .fontColor(Color.White)
              .margin({ top: 40, bottom: 24 })

            // Stats card
            Column() {
              ResultStatRow({ label: '⭐ 本关得分', value: String(this.levelScore) })
              ResultStatRow({ label: '🟢 击毁低级', value: String(this.killsLow) })
              ResultStatRow({ label: '🟡 击毁中级', value: String(this.killsMid) })
              ResultStatRow({ label: '🔴 击毁高级', value: String(this.killsHigh) })
              if (this.killsElite > 0) {
                ResultStatRow({ label: '🟣 击毁精英', value: String(this.killsElite) })
              }
              if (this.killsBoss > 0) {
                ResultStatRow({ label: '👹 击毁BOSS', value: String(this.killsBoss) })
              }
              ResultStatRow({ label: '⏱ 用时', value: this.getResultTimeStr() })

              if (this.isNewRecord) {
                Text('🎉 新纪录！')
                  .fontSize(18)
                  .fontColor('#FFD740')
                  .fontWeight(FontWeight.Bold)
                  .margin({ top: 12 })
              }
            }
            .width('85%')
            .padding(20)
            .backgroundColor('rgba(255,255,255,0.08)')
            .borderRadius(16)
            .margin({ bottom: 32 })

            // Star rating display
            if (this.levelPassed) {
              Row() {
                Text(this.getStarsDisplay(this.starResult.stars))
                  .fontSize(24)
                  .fontColor('#FFD740')
              }
              .margin({ bottom: 8 })

              // Reward card
              Column() {
                Text('🎁 奖励')
                  .fontSize(16)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(Color.White)
                  .margin({ bottom: 8 })

                if (this.levelReward.starBonus > 0) {
                  RewardRow({ label: '⭐ 星级奖励', value: '+' + this.levelReward.starBonus })
                }
                if (this.levelReward.objectiveBonus > 0) {
                  RewardRow({ label: '🎯 目标奖励', value: '+' + this.levelReward.objectiveBonus })
                }
                RewardRow({ label: '🏁 通关奖励', value: '+' + this.levelReward.completionBonus })

                if (this.chapterCompleted) {
                  Row() {
                    Text('🎉 章节完成！')
                      .fontSize(14)
                      .fontWeight(FontWeight.Bold)
                      .fontColor('#FFD740')
                    Blank()
                    Text('+' + this.getChapterBonusStr() + ' +5⭐')
                      .fontSize(14)
                      .fontColor('#FFD740')
                      .fontWeight(FontWeight.Bold)
                  }
                  .width('100%')
                  .margin({ top: 4, bottom: 4 })
                }

                Row()
                  .width('100%')
                  .height(1)
                  .backgroundColor('rgba(255,255,255,0.15)')
                  .margin({ top: 4, bottom: 4 })

                Row() {
                  Text('总计')
                    .fontSize(16)
                    .fontWeight(FontWeight.Bold)
                    .fontColor(Color.White)
                  Blank()
                  Text('+' + formatScore(this.levelReward.totalReward))
                    .fontSize(16)
                    .fontWeight(FontWeight.Bold)
                    .fontColor('#4CAF50')
                }
                .width('100%')
              }
              .width('85%')
              .padding(14)
              .backgroundColor('rgba(76,175,80,0.1)')
              .borderRadius(12)
              .border({ width: 1, color: 'rgba(76,175,80,0.3)' })
              .margin({ bottom: 12 })
            }

            // Special objectives progress
            Row() {
              Column() {
                Text('🎯 目标进度')
                  .fontSize(14)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('rgba(255,255,255,0.7)')
                  .margin({ bottom: 6 })
                ForEach(this.levelObjectives, (obj: SpecialObjective) => {
                  Row() {
                    Text(this.getObjectiveStatus(obj))
                      .fontSize(12)
                      .fontColor(this.getObjectiveColor(obj))
                  }
                  .width('100%')
                  .margin({ bottom: 3 })
                }, (obj: SpecialObjective) => obj.id)
              }
              .width('100%')
            }
            .width('85%')
            .padding(12)
            .backgroundColor('rgba(255,255,255,0.05)')
            .borderRadius(12)
            .margin({ bottom: 16 })

            // Buttons
            Row() {
              // Exit button (save progress when level passed)
              Button() {
                Text('🚪 退出游戏')
                  .fontSize(18)
                  .fontColor(Color.White)
              }
              .width(140)
              .height(50)
              .backgroundColor('rgba(255,255,255,0.2)')
              .borderRadius(25)
              .onClick(() => {
                if (this.levelPassed) {
                  this.saveLevelProgress();
                  this.saveLevelCompletion();
                }
                this.exitGame();
              })

              if (this.levelPassed) {
                // Next level button
                Button() {
                  Text('▶ 挑战下一关')
                    .fontSize(18)
                    .fontColor(Color.White)
                }
                .width(160)
                .height(50)
                .backgroundColor('#2196F3')
                .borderRadius(25)
                .margin({ left: 16 })
                .onClick(() => {
                  this.continueToNextLevel();
                })
              } else {
                // Retry button
                Button() {
                  Text('🔄 重新开始')
                    .fontSize(18)
                    .fontColor(Color.White)
                }
                .width(140)
                .height(50)
                .backgroundColor('#4CAF50')
                .borderRadius(25)
                .margin({ left: 16 })
                .onClick(() => {
                  this.retryLevel();
                })
              }
            }
          }
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.85)')
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
          .zIndex(20)
        }

        // ---- Level Transition Overlay ----
        if (this.showLevelTransition && this.gameMode === 'level') {
          Column() {
            Text('第 ' + this.transitionLevel + ' 关')
              .fontSize(36)
              .fontWeight(FontWeight.Bold)
              .fontColor(Color.White)
              .margin({ bottom: 8 })

            Text(this.getTransitionThemeName() + ' - ' + this.getTransitionDifficulty())
              .fontSize(18)
              .fontColor(this.getTransitionAccentColor())
              .margin({ bottom: 16 })

            Row()
              .width('60%')
              .height(2)
              .backgroundColor('rgba(255,255,255,0.2)')
              .margin({ bottom: 16 })

            Text('🎯 特殊目标')
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor('rgba(255,255,255,0.8)')
              .margin({ bottom: 8 })

            ForEach(this.levelObjectives, (obj: SpecialObjective) => {
              Row() {
                Text(obj.icon + '  ' + obj.description)
                  .fontSize(14)
                  .fontColor('rgba(255,255,255,0.6)')
              }
              .margin({ bottom: 4 })
            }, (obj: SpecialObjective) => obj.id)

            Text('准备迎战...')
              .fontSize(16)
              .fontColor('rgba(255,255,255,0.4)')
              .margin({ top: 24 })
          }
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.85)')
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
          .zIndex(25)
        }
      }
      .width('100%')
      .height('100%')
    }
    .title('')
    .backgroundColor('#0a0a2e')
    .onBackPressed(() => {
      if (this.showLevelResult) {
        this.exitGame();
      } else {
        this.exitGame();
      }
      return true;
    })
  }

  private getResultTimeStr(): string {
    const elapsed = Math.floor((Date.now() - this.levelStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return minutes > 0 ? minutes + '分' + seconds + '秒' : seconds + '秒';
  }

  private getResultPassIcon(): string {
    return this.levelPassed ? '🎉' : '💥';
  }

  private getResultPassText(): string {
    return this.levelPassed ? '第' + this.gameCurrentLevel + '关 通过！' : '第' + this.gameCurrentLevel + '关 失败';
  }

  // ---- Level mode helpers ----

  private getStarsDisplay(stars: number): string {
    if (stars >= 3) return '★★★ 完美！';
    if (stars === 2) return '★★ 不错！';
    return '★ 通关';
  }

  private getObjectiveStatus(obj: SpecialObjective): string {
    let completed = false;
    switch (obj.type) {
      case 'noDamage':
        completed = !this.playerWasHit;
        break;
      case 'timeLimit':
        completed = (Date.now() - this.levelStartTime) <= obj.parameter;
        break;
      case 'comboKills':
        completed = this.maxComboKills >= obj.parameter;
        break;
      case 'collectPowerUps':
        completed = this.powerUpsCollected >= obj.parameter;
        break;
      case 'killAllElite':
        completed = this.eliteEnemiesOnLevel > 0 && this.eliteEnemiesKilled >= this.eliteEnemiesOnLevel;
        break;
      case 'noBossHit':
        completed = !this.bossHitPlayer;
        break;
    }
    const status = completed ? '✓ ' : '✗ ';
    const progress = this.getObjectiveProgress(obj);
    return status + obj.icon + ' ' + obj.description + progress;
  }

  private getObjectiveColor(obj: SpecialObjective): string {
    let completed = false;
    switch (obj.type) {
      case 'noDamage': completed = !this.playerWasHit; break;
      case 'timeLimit': completed = (Date.now() - this.levelStartTime) <= obj.parameter; break;
      case 'comboKills': completed = this.maxComboKills >= obj.parameter; break;
      case 'collectPowerUps': completed = this.powerUpsCollected >= obj.parameter; break;
      case 'killAllElite': completed = this.eliteEnemiesOnLevel > 0 && this.eliteEnemiesKilled >= this.eliteEnemiesOnLevel; break;
      case 'noBossHit': completed = !this.bossHitPlayer; break;
    }
    return completed ? '#4CAF50' : '#FF5252';
  }

  private getObjectiveProgress(obj: SpecialObjective): string {
    switch (obj.type) {
      case 'timeLimit':
        return ' (' + this.formatTime(Math.floor((Date.now() - this.levelStartTime) / 1000)) + ')';
      case 'comboKills':
        return ' (' + this.maxComboKills + '/' + obj.parameter + ')';
      case 'collectPowerUps':
        return ' (' + this.powerUpsCollected + '/' + obj.parameter + ')';
      case 'killAllElite':
        return ' (' + this.eliteEnemiesKilled + '/' + this.eliteEnemiesOnLevel + ')';
      default:
        return '';
    }
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? mins + 'm' + secs + 's' : secs + 's';
  }

  private getTransitionThemeName(): string {
    return getLevelTheme(this.transitionLevel).name;
  }

  private getTransitionDifficulty(): string {
    const difficulty = Math.min(5, Math.max(1, Math.ceil(this.transitionLevel / 6)));
    let text = '';
    for (let i = 0; i < difficulty; i++) {
      text += '★';
    }
    return text;
  }

  private getTransitionAccentColor(): string {
    return getLevelTheme(this.transitionLevel).accentColor;
  }

  private getChapterBonusStr(): string {
    const chapter = Math.ceil(this.transitionLevel / 10);
    return formatScore(getChapterCompletionBonus(chapter));
  }
}

@Component
struct ResultStatRow {
  @Prop label: string = '';
  @Prop value: string = '';

  build() {
    Row() {
      Text(this.label)
        .fontSize(15)
        .fontColor('rgba(255,255,255,0.7)')
      Blank()
      Text(this.value)
        .fontSize(15)
        .fontColor(Color.White)
        .fontWeight(FontWeight.Bold)
    }
    .width('100%')
    .margin({ bottom: 10 })
  }
}

@Component
struct RewardRow {
  @Prop label: string = '';
  @Prop value: string = '';

  build() {
    Row() {
      Text(this.label)
        .fontSize(14)
        .fontColor('rgba(255,255,255,0.6)')
      Blank()
      Text(this.value)
        .fontSize(14)
        .fontColor('#4CAF50')
        .fontWeight(FontWeight.Medium)
    }
    .width('100%')
    .margin({ bottom: 4 })
  }
}
