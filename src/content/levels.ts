/**
 * Content Module - Level Data ve Rescue Cards
 */

import type { LevelDefinition } from '../game';

export interface Level {
    id: number;
    name: string;
    levelDef: LevelDefinition;
    animalId: string;
    targetMoves?: number;
}

/**
 * Level (MVP0)
 * Grid sembolleri:
 * - .: bos
 * - ^: ok (yukari)
 * - v: ok (asagi)
 * - <: ok (sol)
 * - >: ok (sag)
 * - A: hayvan (animal)
 * - E: cikis (exit)
 *
 * Her satir tam 6 karakter olmali!
 */
export const LEVELS: Level[] = [
    {
        id: 1,
        name: 'Ilk Kurtulus',
        animalId: 'cat_01',
        levelDef: {
            id: 'level-1',
            grid: [
                '>.....',
                '..v...',
                'A.>...',
                '......',
                '....E.',
                '......',
            ],
            meta: { name: 'Ilk Kurtulus' },
        },
        targetMoves: 5,
    },
    // Diger 4 level sonraki PR'da eklenecek
];

export const RESCUE_CARDS = [
    { id: 'cat_01', name: 'Sokak Kedisi', rarity: 'common' as const },
    { id: 'dog_01', name: 'Kopek', rarity: 'common' as const },
    { id: 'bird_01', name: 'Kus', rarity: 'rare' as const },
];
