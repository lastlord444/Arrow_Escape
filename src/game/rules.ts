/** Arrow Escape - Win Condition Kontrolü */

import type { GridCell } from './types';
import { findCell, countArrowsBetween } from './grid';

/**
 * Win condition kontrolü:
 * "Hayvan ile çıkış aynı satır veya sütunda ve arada hiç ok kalmadıysa WIN."
 */
export function checkWin(grid: GridCell[][]): boolean {
    const animalPos = findCell(grid, 'animal');
    const exitPos = findCell(grid, 'exit');

    // Animal veya exit yoksa win olamaz
    if (!animalPos || !exitPos) {
        return false;
    }

    // Aynı satır veya sütun değilse kaybet
    if (animalPos.row !== exitPos.row && animalPos.col !== exitPos.col) {
        return false;
    }

    // Arada ok var mı?
    const arrowsBetween = countArrowsBetween(grid, animalPos, exitPos);

    return arrowsBetween === 0;
}
