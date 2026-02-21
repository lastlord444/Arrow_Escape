/** Arrow Escape - Grid Yardımcı Fonksiyonları */

import type { GridCell, Position, CellType } from './types';

/** Grid boyutu (6x6) */
export const GRID_SIZE = 6;

/** Boş bir 6x6 grid oluştur */
export function createEmptyGrid(): GridCell[][] {
    const grid: GridCell[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        const row: GridCell[] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            row.push({ type: 'empty' });
        }
        grid.push(row);
    }
    return grid;
}

/** Grid'in derin kopyasını oluştur */
export function cloneGrid(grid: GridCell[][]): GridCell[][] {
    return grid.map(row =>
        row.map(cell => ({ ...cell }))
    );
}

/** Pozisyon grid sınırları içinde mi? */
export function inBounds(pos: Position): boolean {
    return pos.row >= 0 && pos.row < GRID_SIZE
        && pos.col >= 0 && pos.col < GRID_SIZE;
}

/** Belirli tipteki ilk hücrenin pozisyonunu bul */
export function findCell(grid: GridCell[][], type: CellType): Position | null {
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c].type === type) {
                return { row: r, col: c };
            }
        }
    }
    return null;
}

/**
 * İki pozisyon aynı satır veya sütundaysa aradaki ok sayısını say.
 * Aynı satır/sütunda değilse -1 döndürür.
 */
export function countArrowsBetween(grid: GridCell[][], a: Position, b: Position): number {
    if (a.row !== b.row && a.col !== b.col) {
        return -1;
    }

    let count = 0;

    if (a.row === b.row) {
        // Aynı satır
        const minCol = Math.min(a.col, b.col);
        const maxCol = Math.max(a.col, b.col);
        for (let c = minCol + 1; c < maxCol; c++) {
            if (grid[a.row][c].type === 'arrow') {
                count++;
            }
        }
    } else {
        // Aynı sütun
        const minRow = Math.min(a.row, b.row);
        const maxRow = Math.max(a.row, b.row);
        for (let r = minRow + 1; r < maxRow; r++) {
            if (grid[r][a.col].type === 'arrow') {
                count++;
            }
        }
    }

    return count;
}
