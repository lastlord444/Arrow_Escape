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
 * 5 Örnek Level (MVP0)
 * Grid sembolleri:
 * - .: boş
 * - ^: ok (yukarı)
 * - v: ok (aşağı)
 * - <: ok (sol)
 * - >: ok (sağ)
 * - A: hayvan (animal)
 * - E: çıkış (exit)
 */
export const LEVELS: Level[] = [
    {
        id: 1,
        name: 'İlk Kurtuluş',
        animalId: 'cat_01',
        levelDef: {
            id: 'level-1',
            grid: [
                '>....',
                '..v..',
                'A.>..',
                '.....',
                '....E.',
                '.....',
            ],
            meta: { name: 'İlk Kurtuluş' },
        },
        targetMoves: 5,
    },
    // Diğer 4 level sonraki PR'da eklenecek
];

export const RESCUE_CARDS = [
    { id: 'cat_01', name: 'Sokak Kedisi', rarity: 'common' as const },
    { id: 'dog_01', name: 'Köpek', rarity: 'common' as const },
    { id: 'bird_01', name: 'Kuş', rarity: 'rare' as const },
];
