/*
 * Copyright (c) 2026
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

// ---------- Player constants ----------
export const PLAYER_SIZE = 40;
export const PLAYER_HP = 5;
export const PLAYER_ATK = 1;

// ---------- Bullet constants ----------
export const BULLET_SIZE = 6;
export const BULLET_SPEED = 8;

// ---------- Movement constants ----------
export const PLAYER_SPEED = 6;
export const BASE_ENEMY_SPEED = 1.5;

// ---------- Timing constants ----------
export const INVINCIBLE_DURATION = 1000; // ms
export const FIRE_COOLDOWN = 300; // ms
export const GAME_LOOP_INTERVAL = 16; // ~60fps
export const BASE_SPAWN_INTERVAL = 1500; // ms

// ---------- Enemy definitions ----------
export interface EnemyDef {
  type: 'low' | 'mid' | 'high';
  hp: number;
  atk: number;
  size: number;
  baseWeight: number;
  color: number;
  score: number;
}

export const ENEMY_DEFS: EnemyDef[] = [
  { type: 'low', hp: 1, atk: 1, size: 20, baseWeight: 6, color: 0xFF4CAF50, score: 1 },
  { type: 'mid', hp: 2, atk: 1, size: 28, baseWeight: 3, color: 0xFFFFEB3B, score: 2 },
  { type: 'high', hp: 3, atk: 2, size: 36, baseWeight: 1, color: 0xFFF44336, score: 3 }
];

// ---------- Power-up constants ----------
export type PowerUpType = 'shield' | 'speed' | 'clear' | 'health' | 'multishot' | 'laser' | 'attackUp' | 'doubleScore' | 'lifeSteal' | 'timeWarp';

export interface PowerUpDef {
  color: number;
  duration: number;
  label: string;
}

export const POWERUP_SIZE = 24;
export const POWERUP_DROP_CHANCE = 0.3;
export const POWERUP_KILL_INTERVAL = 8;
export const POWERUP_SPEED = 1.5;

// ---------- Shield charge constants ----------
/** Maximum shield charges in level mode */
export const MAX_SHIELD_CHARGES_LEVEL = 3;
/** Maximum shield charges in endless mode */
export const MAX_SHIELD_CHARGES_ENDLESS = 5;

export interface PowerUpDefMap {
  shield: PowerUpDef;
  speed: PowerUpDef;
  clear: PowerUpDef;
  health: PowerUpDef;
  multishot: PowerUpDef;
  laser: PowerUpDef;
  attackUp: PowerUpDef;
  doubleScore: PowerUpDef;
  lifeSteal: PowerUpDef;
  timeWarp: PowerUpDef;
}

const shieldDef: PowerUpDef = { color: 0xFFFFD740, duration: 0, label: '🛡' };
const speedDef: PowerUpDef = { color: 0xFFFFEB3B, duration: 5000, label: '⚡' };
const clearDef: PowerUpDef = { color: 0xFFFF5252, duration: 0, label: '💥' };
const healthDef: PowerUpDef = { color: 0xFF4CAF50, duration: 0, label: '❤️' };
const multishotDef: PowerUpDef = { color: 0x00E5FF, duration: 6000, label: '🔱' };
const laserDef: PowerUpDef = { color: 0xFF4081, duration: 4000, label: '🌐' };
const attackUpDef: PowerUpDef = { color: 0xAB47BC, duration: 0, label: '💎' };
const doubleScoreDef: PowerUpDef = { color: 0xFFD740, duration: 6000, label: '✨' };
const lifeStealDef: PowerUpDef = { color: 0xFF1744, duration: 8000, label: '🧛' };
const timeWarpDef: PowerUpDef = { color: 0x7C4DFF, duration: 5000, label: '⏱' };

export const POWERUP_DEFS: PowerUpDefMap = {
  shield: shieldDef,
  speed: speedDef,
  clear: clearDef,
  health: healthDef,
  multishot: multishotDef,
  laser: laserDef,
  attackUp: attackUpDef,
  doubleScore: doubleScoreDef,
  lifeSteal: lifeStealDef,
  timeWarp: timeWarpDef
};

/**
 * Get power-up definition by type.
 * Use this instead of indexed access which is not supported in ArkTS.
 */
export function getPowerUpDef(type: PowerUpType): PowerUpDef {
  switch (type) {
    case 'shield': return shieldDef;
    case 'speed': return speedDef;
    case 'clear': return clearDef;
    case 'health': return healthDef;
    case 'multishot': return multishotDef;
    case 'laser': return laserDef;
    case 'attackUp': return attackUpDef;
    case 'doubleScore': return doubleScoreDef;
    case 'lifeSteal': return lifeStealDef;
    case 'timeWarp': return timeWarpDef;
  }
}

/** Laser constants */
export const LASER_BEAM_WIDTH = 8;
export const LASER_DAMAGE_INTERVAL = 100;
export const LASER_DAMAGE_PER_TICK = 1;

// ---------- Boss constants ----------
export const BOSS_BASE_HP = 15;
export const BOSS_BASE_ATK = 1;
export const BOSS_SIZE = 60;
export const BOSS_SCORE = 20;
export const BOSS_MOVE_SPEED = 1.5;
export const BOSS_MOVE_SPEED_PHASE2 = 2.5;
export const BOSS_FIRE_INTERVAL = 1200; // ms
export const BOSS_FIRE_INTERVAL_PHASE2 = 900; // ms (faster in phase 2)
export const BOSS_SUMMON_INTERVAL = 4000; // ms
export const BOSS_SUMMON_INTERVAL_PHASE2 = 3000; // ms
export const BOSS_SPECIAL_INTERVAL = 5000; // ms between special attacks
export const BOSS_APPEAR_LEVELS = [3, 6, 9, 10];
export const BOSS_PHASE2_HP_RATIO = 0.5; // Enter phase 2 at 50% HP

/**
 * Check if a level is a boss level.
 * Boss appears at levels 3, 6, 9, 10 in each 10-level cycle.
 */
export function isBossLevel(level: number): boolean {
  const mod = level % 10;
  return BOSS_APPEAR_LEVELS.includes(mod) || (mod === 0);
}

/**
 * Get the boss iteration number (how many times boss has been fought).
 */
export function getBossIteration(level: number): number {
  return Math.ceil(level / 10);
}

// ---------- Level theme system ----------
export interface LevelTheme {
  bgTop: string;
  bgBottom: string;
  starColor: string;
  accentColor: string;
  name: string;
}

const THEMES: LevelTheme[] = [
  { bgTop: '#0a0a2e', bgBottom: '#1a1a4e', starColor: 'rgb', accentColor: '#2196F3', name: '星云' },       // 1-2
  { bgTop: '#2e0a0a', bgBottom: '#4e1a1a', starColor: 'rgb', accentColor: '#FF7043', name: '日冕' },       // 3-4
  { bgTop: '#0a001a', bgBottom: '#1a0033', starColor: 'rgb', accentColor: '#AB47BC', name: '深渊' },       // 5-6
  { bgTop: '#001a1a', bgBottom: '#003333', starColor: 'rgb', accentColor: '#26C6DA', name: '冰域' },       // 7-8
  { bgTop: '#1a0a00', bgBottom: '#331a00', starColor: 'rgb', accentColor: '#FFD740', name: '炼狱' },       // 9-10
];

/**
 * Get level theme based on current level (cycles every 10 levels).
 */
export function getLevelTheme(level: number): LevelTheme {
  const idx = ((level - 1) % 10);
  if (idx < 2) return THEMES[0];   // 1-2
  if (idx < 4) return THEMES[1];   // 3-4
  if (idx < 6) return THEMES[2];   // 5-6
  if (idx < 8) return THEMES[3];   // 7-8
  return THEMES[4];                // 9-10
}

// ---------- Difficulty curve (level mode) ----------
/** Spawn interval: faster pace */
export function getLevelSpawnInterval(level: number): number {
  return Math.max(600, 2200 - level * 120);
}

/** Enemy speed: smoother scaling */
export function getLevelEnemySpeed(level: number): number {
  return BASE_ENEMY_SPEED * (1 + level * 0.12);
}

/** Kills needed per level: fewer but harder enemies */
export function getLevelKillTarget(level: number): number {
  return 4 + level * 2;
}

// ---------- Elite enemy (appears from level 5) ----------
export const ELITE_HP = 4;
export const ELITE_ATK = 2;
export const ELITE_SIZE = 32;
export const ELITE_COLOR = 0xFF7B1FA2;
export const ELITE_SCORE = 5;
export const ELITE_SPEED = 1.2;
export const ELITE_MIN_LEVEL = 5;
export const ELITE_FIRE_INTERVAL = 2000; // ms

// ---------- Sniper enemy (appears from level 8, shoots at player) ----------
export const SNIPER_HP = 2;
export const SNIPER_ATK = 1;
export const SNIPER_SIZE = 24;
export const SNIPER_COLOR = 0xFF00BCD4;
export const SNIPER_SCORE = 4;
export const SNIPER_SPEED = 0.8;
export const SNIPER_MIN_LEVEL = 8;
export const SNIPER_FIRE_INTERVAL = 2500; // ms
export const SNIPER_BULLET_SPEED = 4;

// ---------- Suicide enemy (appears from level 6, rushes player) ----------
export const SUICIDE_HP = 1;
export const SUICIDE_ATK = 2;
export const SUICIDE_SIZE = 28;
export const SUICIDE_COLOR = 0xFFFF5722;
export const SUICIDE_SCORE = 3;
export const SUICIDE_SPEED = 3.5;
export const SUICIDE_MIN_LEVEL = 6;
export const SUICIDE_EXPLOSION_RADIUS = 60; // area damage radius

// ========== Endless Mode Difficulty System ==========
/** Score thresholds for endless mode difficulty tiers */
export const ENDLESS_DIFFICULTY_THRESHOLDS = [0, 15, 40, 80, 140, 220, 330, 480, 680, 960];

/**
 * Get endless difficulty tier index (0-based) based on current score.
 * Higher tier = harder enemies, faster spawns, more variety.
 */
export function getEndlessDifficultyTier(score: number): number {
  let tier = 0;
  for (let i = ENDLESS_DIFFICULTY_THRESHOLDS.length - 1; i >= 0; i--) {
    if (score >= ENDLESS_DIFFICULTY_THRESHOLDS[i]) {
      tier = i;
      break;
    }
  }
  return tier;
}

/** Endless mode difficulty tier name */
export function getEndlessTierName(tier: number): string {
  const names = ['安全区', '前哨战', '挑战区', '危险区', '炼狱',
    '深渊', '混沌域', '虚空', '湮灭', '终焉'];
  return names[Math.min(tier, names.length - 1)];
}

/** Endless mode spawn interval: decreases with score */
export function getEndlessSpawnInterval(score: number): number {
  const tier = getEndlessDifficultyTier(score);
  return Math.max(400, 1400 - tier * 110);
}

/** Endless mode enemy speed: increases with score */
export function getEndlessEnemySpeed(score: number): number {
  const tier = getEndlessDifficultyTier(score);
  return BASE_ENEMY_SPEED * (1 + tier * 0.25);
}

/** Whether elite enemies can spawn at this score */
export function canEndlessSpawnElite(score: number): boolean {
  return score >= 30;
}

/** Chance of elite enemy spawn in endless mode (0-1) */
export function getEndlessEliteChance(score: number): number {
  if (score < 30) return 0;
  return Math.min(0.35, 0.05 + (score - 30) * 0.002);
}

/** Score milestones for boss encounters in endless mode */
export const ENDLESS_BOSS_MILESTONES = [50, 120, 220, 360, 550, 800, 1100];

/** Check if current score triggers a boss encounter (only once per milestone) */
export function isEndlessBossScore(score: number, defeatedMilestones: number[]): boolean {
  for (const ms of ENDLESS_BOSS_MILESTONES) {
    if (score >= ms && !defeatedMilestones.includes(ms)) {
      return true;
    }
  }
  return false;
}

/** Get the next boss milestone to spawn */
export function getNextBossMilestone(score: number, defeatedMilestones: number[]): number | null {
  for (const ms of ENDLESS_BOSS_MILESTONES) {
    if (score >= ms && !defeatedMilestones.includes(ms)) {
      return ms;
    }
  }
  return null;
}

/** Endless boss HP scaling based on milestone index */
export function getEndlessBossHp(milestoneIndex: number): number {
  return BOSS_BASE_HP + milestoneIndex * 8;
}

// ========== Special Objective System ==========
export type ObjectiveType = 'noDamage' | 'timeLimit' | 'comboKills' | 'collectPowerUps' | 'killAllElite' | 'noBossHit';

export interface SpecialObjective {
  id: string;
  description: string;
  type: ObjectiveType;
  parameter: number;  // e.g., time limit in ms, combo count
  icon: string;
}

/**
 * Get special objectives for a given level.
 * Returns 1-2 objectives that scale with difficulty.
 */
export function getLevelObjectives(level: number): SpecialObjective[] {
  const objectives: SpecialObjective[] = [];
  const cyclePos = (level - 1) % 10; // 0-based position in 10-level cycle

  // Primary objective based on level cycle position
  if (cyclePos === 0 || cyclePos === 5) {
    objectives.push({
      id: 'noDamage_' + level,
      description: '无伤通关',
      type: 'noDamage',
      parameter: 0,
      icon: '🛡️'
    });
  } else if (cyclePos === 1 || cyclePos === 6) {
    const timeLimit = 30000 + level * 1000;
    objectives.push({
      id: 'timeLimit_' + level,
      description: '限时' + Math.floor(timeLimit / 1000) + '秒内通关',
      type: 'timeLimit',
      parameter: timeLimit,
      icon: '⏱️'
    });
  } else if (cyclePos === 2 || cyclePos === 7) {
    const comboCount = 5 + Math.floor(level / 3);
    objectives.push({
      id: 'comboKills_' + level,
      description: '连续击杀' + comboCount + '个敌人',
      type: 'comboKills',
      parameter: comboCount,
      icon: '🔥'
    });
  } else if (cyclePos === 3 || cyclePos === 8) {
    objectives.push({
      id: 'collectPowerUps_' + level,
      description: '收集3个道具',
      type: 'collectPowerUps',
      parameter: 3,
      icon: '✨'
    });
  } else {
    // cyclePos === 4 || cyclePos === 9
    objectives.push({
      id: 'killAllElite_' + level,
      description: '击毁所有精英敌人',
      type: 'killAllElite',
      parameter: 0,
      icon: '💀'
    });
  }

  // Boss levels get an additional objective
  if (isBossLevel(level)) {
    objectives.push({
      id: 'noBossHit_' + level,
      description: '无伤击败Boss',
      type: 'noBossHit',
      parameter: 0,
      icon: '👑'
    });
  }

  return objectives;
}

// ========== Star Rating System ==========
export interface StarRatingResult {
  stars: number;
  details: string[];
}

/**
 * Calculate star rating for a level completion.
 * 3 stars: near-perfect performance
 * 2 stars: good performance  
 * 1 star:  level cleared
 */
export function calculateLevelStars(
  level: number,
  hpRemaining: number,
  maxHp: number,
  timeMs: number,
  objectivesCompleted: string[]
): StarRatingResult {
  const details: string[] = [];
  let stars = 1; // Base: 1 star for completing the level

  const hpPercent = hpRemaining / maxHp;
  const baseTime = 20000 + level * 5000; // Base expected time

  // HP check (+1 star if >= 50% health remaining)
  if (hpPercent >= 0.8) {
    stars += 1;
    details.push('高血量通关 ✓');
  } else if (hpPercent >= 0.5) {
    details.push('血量尚可');
  } else {
    details.push('血量偏低');
  }

  // Time check (+1 star if fast enough)
  if (timeMs <= baseTime * 1.2) {
    stars += 1;
    details.push('速通完成 ✓');
  } else if (timeMs <= baseTime * 1.5) {
    details.push('用时适中');
  } else {
    details.push('用时较长');
  }

  // Cap at 3
  stars = Math.min(3, Math.max(1, stars));

  // Check special objectives completed (bonus mentions in details)
  if (objectivesCompleted.length > 0) {
    details.push('完成 ' + objectivesCompleted.length + ' 个特殊目标');
  }

  return { stars, details };
}

/**
 * Get the kill target for calculating level score target.
 */
export function getLevelBaseKills(level: number): number {
  return getLevelKillTarget(level);
}

// ========== Reward System ==========

/**
 * Star reward: bonus score earned from star rating.
 */
export function getStarScoreBonus(stars: number): number {
  if (stars >= 3) return 500;
  if (stars === 2) return 250;
  return 100;
}

/**
 * Special objective reward: bonus per completed objective.
 */
export function getObjectiveScoreBonus(objectivesCompleted: number): number {
  return objectivesCompleted * 50;
}

/**
 * Level completion bonus: base score based on level difficulty.
 */
export function getLevelCompletionBonus(level: number): number {
  return 50 + level * 10;
}

/**
 * Chapter completion bonus: awarded when all levels in a chapter are completed.
 */
export function getChapterCompletionBonus(chapter: number): number {
  return 1000 + (chapter - 1) * 500;
}

/**
 * Chapter extra stars for full completion.
 */
export function getChapterExtraStars(): number {
  return 5;
}

/**
 * Calculate total reward for a level completion.
 */
export interface LevelReward {
  starBonus: number;
  objectiveBonus: number;
  completionBonus: number;
  totalReward: number;
  extraStarsAwarded: number;  // chapter completion extra stars
}

export function calculateLevelReward(
  level: number,
  stars: number,
  objectivesCompleted: number,
  chapterCompleted: boolean
): LevelReward {
  const starBonus = getStarScoreBonus(stars);
  const objectiveBonus = getObjectiveScoreBonus(objectivesCompleted);
  const completionBonus = getLevelCompletionBonus(level);
  let total = starBonus + objectiveBonus + completionBonus;
  let extraStars = 0;
  if (chapterCompleted) {
    total += getChapterCompletionBonus(Math.ceil(level / 10));
    extraStars = getChapterExtraStars();
  }
  return {
    starBonus: starBonus,
    objectiveBonus: objectiveBonus,
    completionBonus: completionBonus,
    totalReward: total,
    extraStarsAwarded: extraStars
  };
}

/**
 * Format a number for display (e.g., 1500 -> "1,500").
 */
export function formatScore(score: number): string {
  const str = String(score);
  let result = '';
  let count = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      result = ',' + result;
    }
    result = str[i] + result;
    count++;
  }
  return result;
}
