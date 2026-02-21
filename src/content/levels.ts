/**
 * Content Module - Level Data ve Rescue Cards
 */

import type { GridCell } from '../game';

export interface Level {
    id: number;
    name: string;
    grid: GridCell[][];
    animalId: string;
    targetMoves?: number;
}

/**
 * 5 Örnek Level (MVP0)
 * Grid sembolleri:
 * - .: boş
 * - ↑↓←→: oklar
 * - A: hayvan (animal)
 * - E: çıkış (exit)
 */
export const LEVELS: Level[] = [
    {
        id: 1,
        name: 'İlk Kurtuluş',
        animalId: 'cat_01',
        grid: [
            [
                { type: 'arrow', direction: 'right' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
            ],
            [
                { type: 'empty' },
                { type: 'empty' },
                { type: 'arrow', direction: 'down' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
            ],
            [
                { type: 'animal', animalId: 'cat_01' },
                { type: 'empty' },
                { type: 'arrow', direction: 'right' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
            ],
            [
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
            ],
            [
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'exit' },
                { type: 'empty' },
            ],
            [
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
                { type: 'empty' },
            ],
        ],
        targetMoves: 5,
    },
    // Diğer 4 level sonraki PR'da eklenecek
];

export const RESUCE_CARDS = [
    { id: 'cat_01', name: 'Sokak Kedisi', rarity: 'common' as const },
    { id: 'dog_01', name: 'Köpek', rarity: 'common' as const },
    { id: 'bird_01', name: 'Kuş', rarity: 'rare' as const },
];
