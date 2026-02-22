/** Arrow Escape - Tip Tanımları (Arrow Out) */

/** Ok yönleri */
export type ArrowDirection = 'up' | 'down' | 'left' | 'right';

/** Arrow Blok (1×N) */
export interface ArrowBlock {
    id: string;
    len: number;           // 1..6 (blok uzunluğu)
    dir: ArrowDirection;  // Yön
    row: number;          // Başlangıç satır
    col: number;          // Başlangıç sütun
}

/** Oyun durumu */
export interface GameState {
    blocks: ArrowBlock[];
    moves: number;
    isWon: boolean;
}

/** Slide hareketi sonucu */
export interface SlideResult {
    state: GameState;
    removed: boolean;     // Edge'den çıktı mı?
}

/** Level tanımı (yeni format) */
export interface LevelDefinition {
    id: string;
    blocks: ArrowBlock[];
    gridWidth: number;
    gridHeight: number;
    meta?: {
        name?: string;
    };
}

/** Konum */
export interface Position {
    row: number;
    col: number;
}
