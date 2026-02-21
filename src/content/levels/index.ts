/**
 * Level Loader
 * Tum level JSON'larini import eder ve LEVELS array'i olarak dondurur.
 */

import type { LevelDefinition } from '../../game';
import level1 from './level-1.json';
import level2 from './level-2.json';
import level3 from './level-3.json';
import level4 from './level-4.json';
import level5 from './level-5.json';

/** Tum seviyeler */
export const LEVELS: LevelDefinition[] = [
    level1,
    level2,
    level3,
    level4,
    level5,
];

/**
 * ID'ye gore level bulur.
 * @param id Level ID (orn: 'level-1')
 * @returns LevelDefinition veya undefined
 */
export function getLevelById(id: string): LevelDefinition | undefined {
    return LEVELS.find(level => level.id === id);
}

/**
 * Tum level'leri dondurur.
 * @returns LEVELS array'inin kopyasi
 */
export function getAllLevels(): LevelDefinition[] {
    return [...LEVELS];
}
