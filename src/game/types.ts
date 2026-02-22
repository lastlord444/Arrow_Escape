/** Arrow Escape - Tip Tanımları */

/** Ok yönleri */
export type ArrowDirection = 'up' | 'down' | 'left' | 'right';

/** Hücre tipleri */
export type CellType = 'empty' | 'arrow' | 'animal' | 'exit';

/** Grid pozisyonu (row, col) */
export interface Position {
    row: number;
    col: number;
}

/** Tek bir grid hücresi */
export interface GridCell {
    type: CellType;
    direction?: ArrowDirection;
}

/** Oyun durumu */
export interface GameState {
    grid: GridCell[][];
    moves: number;
    isWon: boolean;
}

/** Slide hareketi sonucu */
export interface SlideResult {
    state: GameState;
    path: Position[];      // Okun geçtiği hücreler (animasyon için)
    removed: boolean;      // Exit/out-of-bounds nedeniyle silindi mi?
}

/** Hayvanın kurtarma koşusu için path */
export interface AnimalRunPath {
    animalStart: Position;
    exitPos: Position;
    path: Position[];      // Animal'dan Exit'e düz çizgi
}

/** Level tanımı (JSON formatı) */
export interface LevelDefinition {
    id: string;
    grid: string[];
    meta?: {
        name?: string;
    };
}

/**
 * Grid string encoding:
 * '.' = empty
 * '^' = ok (yukarı)
 * 'v' = ok (aşağı)
 * '<' = ok (sol)
 * '>' = ok (sağ)
 * 'A' = animal (hayvan)
 * 'E' = exit (çıkış)
 */

/** String karakter → hücre dönüşümü */
export function charToCell(ch: string): GridCell {
    switch (ch) {
        case '.': return { type: 'empty' };
        case '^': return { type: 'arrow', direction: 'up' };
        case 'v': return { type: 'arrow', direction: 'down' };
        case '<': return { type: 'arrow', direction: 'left' };
        case '>': return { type: 'arrow', direction: 'right' };
        case 'A': return { type: 'animal' };
        case 'E': return { type: 'exit' };
        default: return { type: 'empty' };
    }
}

/** Hücre → string karakter dönüşümü */
export function cellToChar(cell: GridCell): string {
    switch (cell.type) {
        case 'empty': return '.';
        case 'animal': return 'A';
        case 'exit': return 'E';
        case 'arrow':
            switch (cell.direction) {
                case 'up': return '^';
                case 'down': return 'v';
                case 'left': return '<';
                case 'right': return '>';
                default: return '.';
            }
        default: return '.';
    }
}
