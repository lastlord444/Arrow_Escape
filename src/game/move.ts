/** Arrow Escape - Slide Logic (Arrow Out) */

import type { GameState, ArrowBlock, SlideResult, Position } from './types';
import { checkWin } from './rules';
import { inBounds, getOccupiedCells } from './grid';

const DIR_DELTAS: Record<ArrowBlock['dir'], Position> = {
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 },
};

/**
 * Bloğu kaydır (slide until blocked/exit).
 * - Blok yönünde gider.
 * - Başka blok veya grid kenarı varsa durur.
 * - Grid kenarından tamamen çıkarsa silinir.
 * - moves++ sadece hareket olursa.
 */
export function slideBlock(state: GameState, blockId: string): SlideResult {
    const block = state.blocks.find(b => b.id === blockId);
    if (!block) return { state, removed: false };

    // Hedef pozisyon hesapla (1 adım)
    const delta = DIR_DELTAS[block.dir];
    const targetRow = block.row + delta.row;
    const targetCol = block.col + delta.col;

    // Out-of-bounds kontrolü (tüm blok için)
    const cells = getOccupiedCells(block);
    const allOutOfBounds = cells.every(c => !inBounds({ ...c, row: c.row + delta.row, col: c.col + delta.col }));

    if (allOutOfBounds) {
        // Tamamen çıkar, sil
        const newBlocks = state.blocks.filter(b => b.id !== blockId);
        const newState: GameState = {
            blocks: newBlocks,
            moves: state.moves + 1,
            isWon: checkWin({ blocks: newBlocks, moves: state.moves + 1, isWon: false }),
        };
        return { state: newState, removed: true };
    }

    // Başka blokla çakışma kontrolü
    const movedBlock: ArrowBlock = { ...block, row: targetRow, col: targetCol };
    const collides = state.blocks.some(b => b.id !== blockId && (
        (b.row === targetRow && b.col === targetCol) ||
        getOccupiedCells(movedBlock).some(c =>
            getOccupiedCells(b).some(cb => c.row === cb.row && c.col === cb.col)
        )
    ));

    if (collides) {
        return { state, removed: false };
    }

    // Hareket et
    const newBlocks = state.blocks.map(b => b.id === blockId ? movedBlock : b);
    const newState: GameState = {
        blocks: newBlocks,
        moves: state.moves + 1,
        isWon: checkWin({ blocks: newBlocks, moves: state.moves + 1, isWon: false }),
    };
    return { state: newState, removed: false };
}
