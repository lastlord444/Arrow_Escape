/** Arrow Escape - Level Loader (Block format) */

import type { LevelDefinition } from './types';

// Block-based level examples
export const LEVEL_1: LevelDefinition = {
    id: 'level-1',
    gridWidth: 6,
    gridHeight: 6,
    blocks: [
        { id: 'b1', len: 2, dir: 'up', row: 5, col: 2 },
        { id: 'b2', len: 1, dir: 'up', row: 5, col: 4 },
    ],
    meta: { name: 'Tutorial' },
};

export const LEVEL_2: LevelDefinition = {
    id: 'level-2',
    gridWidth: 6,
    gridHeight: 6,
    blocks: [
        { id: 'b1', len: 3, dir: 'up', row: 4, col: 1 },
        { id: 'b2', len: 2, dir: 'left', row: 3, col: 4 },
        { id: 'b3', len: 1, dir: 'up', row: 5, col: 3 },
    ],
    meta: { name: 'S-Curve' },
};

export const LEVEL_3: LevelDefinition = {
    id: 'level-3',
    gridWidth: 6,
    gridHeight: 6,
    blocks: [
        { id: 'b1', len: 2, dir: 'up', row: 5, col: 1 },
        { id: 'b2', len: 2, dir: 'right', row: 4, col: 0 },
        { id: 'b3', len: 3, dir: 'up', row: 5, col: 4 },
        { id: 'b4', len: 1, dir: 'left', row: 3, col: 5 },
    ],
    meta: { name: 'Crossfire' },
};

export const LEVEL_4: LevelDefinition = {
    id: 'level-4',
    gridWidth: 6,
    gridHeight: 6,
    blocks: [
        { id: 'b1', len: 3, dir: 'up', row: 5, col: 0 },
        { id: 'b2', len: 2, dir: 'down', row: 1, col: 1 },
        { id: 'b3', len: 4, dir: 'right', row: 2, col: 0 },
        { id: 'b4', len: 2, dir: 'up', row: 5, col: 4 },
    ],
    meta: { name: 'Traffic Jam' },
};

export const LEVEL_5: LevelDefinition = {
    id: 'level-5',
    gridWidth: 6,
    gridHeight: 6,
    blocks: [
        { id: 'b1', len: 4, dir: 'up', row: 5, col: 1 },
        { id: 'b2', len: 3, dir: 'right', row: 3, col: 0 },
        { id: 'b3', len: 2, dir: 'left', row: 4, col: 5 },
        { id: 'b4', len: 2, dir: 'down', row: 0, col: 2 },
        { id: 'b5', len: 1, dir: 'up', row: 5, col: 4 },
    ],
    meta: { name: 'Final Test' },
};

export const ALL_LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5];

export function getLevelById(id: string): LevelDefinition | undefined {
    return ALL_LEVELS.find(l => l.id === id);
}

export function getAllLevels(): LevelDefinition[] {
    return ALL_LEVELS;
}
