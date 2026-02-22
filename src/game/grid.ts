/** Arrow Escape - Grid (Block-based occupancy) */

import type { ArrowBlock, Position } from './types';

export const GRID_SIZE = 6;

/** Blok tarafından işgal edilen hücreleri hesapla */
export function getOccupiedCells(block: ArrowBlock): Position[] {
    const cells: Position[] = [];
    for (let i = 0; i < block.len; i++) {
        let row = block.row;
        let col = block.col;
        if (block.dir === 'up') row -= i;
        else if (block.dir === 'down') row += i;
        else if (block.dir === 'left') col -= i;
        else if (block.dir === 'right') col += i;
        cells.push({ row, col });
    }
    return cells;
}

/** Grid sınırları içinde mi? */
export function inBounds(pos: Position, width = GRID_SIZE, height = GRID_SIZE): boolean {
    return pos.row >= 0 && pos.row < height && pos.col >= 0 && pos.col < width;
}

/** İki blok çakışıyor mu? */
export function blocksCollide(a: ArrowBlock, b: ArrowBlock): boolean {
    const cellsA = getOccupiedCells(a);
    const cellsB = getOccupiedCells(b);
    return cellsA.some(ca => cellsB.some(cb => ca.row === cb.row && ca.col === cb.col));
}
