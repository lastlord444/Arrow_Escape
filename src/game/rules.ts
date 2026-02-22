/** Arrow Escape - Win Condition */

import type { GameState } from './types';

/**
 * Win koşulu: Tüm bloklar board'dan çıkarıldı.
 */
export function checkWin(state: GameState): boolean {
    return state.blocks.length === 0;
}
