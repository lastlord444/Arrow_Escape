/**
 * Game Module - Phaser Oyun Motoru Entegrasyonu
 *
 * Bu modül Arrow Escape oyununu içerir:
 * - 6x6 grid sistemi
 * - Ok hareket mantığı
 * - Win/Fail state kontrolü
 */

// Export edilecek oyun tipleri ve fonksiyonlar buraya eklenecek
export type ArrowDirection = 'up' | 'down' | 'left' | 'right';

export interface GridCell {
    type: 'empty' | 'arrow' | 'animal' | 'exit';
    direction?: ArrowDirection;
    animalId?: string;
}

export interface GameState {
    grid: GridCell[][];
    moves: number;
    isWon: boolean;
    isLost: boolean;
}

export const GRID_SIZE = 6;
