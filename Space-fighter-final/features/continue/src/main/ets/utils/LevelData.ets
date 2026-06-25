/*
 * Copyright (c) 2026
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

/**
 * Centralized barrel export for all level-related data types and utilities.
 * Import from here instead of individual files for convenience.
 */

// Re-export from GameDataSync
import { GameRecord, LevelCompletionData, LevelProgressData } from './GameDataSync';
export { GameRecord, LevelCompletionData, LevelProgressData };

// Re-export from GameConfig
import {
  SpecialObjective, ObjectiveType, StarRatingResult,
  getLevelObjectives, calculateLevelStars,
  isBossLevel, getLevelTheme, getLevelKillTarget,
  getLevelSpawnInterval, getLevelEnemySpeed,
  getBossIteration, ELITE_MIN_LEVEL
} from '../configs/GameConfig';

export {
  SpecialObjective, ObjectiveType, StarRatingResult,
  getLevelObjectives, calculateLevelStars,
  isBossLevel, getLevelTheme, getLevelKillTarget,
  getLevelSpawnInterval, getLevelEnemySpeed,
  getBossIteration, ELITE_MIN_LEVEL
};
