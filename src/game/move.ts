/** Arrow Escape - Ok Hareket Mantığı */

import type { GameState, Position, ArrowDirection, SlideResult } from './types';
import { cloneGrid, inBounds } from './grid';
import { checkWin } from './rules';

/** Arrow yönüne göre pozisyon değişikliği */
const DIRECTION_DELTAS: Record<ArrowDirection, Position> = {
    up: { row: -1, col: 0 },
    down: { row: 1, col: 0 },
    left: { row: 0, col: -1 },
    right: { row: 0, col: 1 },
};

/**
 * Oku hareket ettirmeye çalış.
 * KURALLAR:
 * - Seçilen hücre arrow değilse state değişmeden döner.
 * - Ok sadece kendi yönünde hareket edebilir.
 * - 1 adım: hedef hücre empty ise swap.
 * - Hedef hücre exit ise arrow silinir (from empty olur, exit kalır).
 * - Hedef hücre animal veya arrow ise hareket yok.
 * - Out-of-bounds'a doğru hareket ediyorsa arrow silinir.
 * - moves++ sadece hareket olursa.
 * - Her move sonrası isWon = checkWin(grid)
 */
export function tryMoveArrow(state: GameState, from: Position): GameState {
    const grid = cloneGrid(state.grid);
    const cell = grid[from.row][from.col];

    // Ok değilse hareket yok
    if (cell.type !== 'arrow' || !cell.direction) {
        return state;
    }

    const delta = DIRECTION_DELTAS[cell.direction];
    const target: Position = {
        row: from.row + delta.row,
        col: from.col + delta.col,
    };

    // Out-of-bounds → ok silinir
    if (!inBounds(target)) {
        grid[from.row][from.col] = { type: 'empty' };
        return {
            grid,
            moves: state.moves + 1,
            isWon: checkWin(grid),
        };
    }

    const targetCell = grid[target.row][target.col];

    // Hedef empty ise swap
    if (targetCell.type === 'empty') {
        grid[target.row][target.col] = { ...cell };
        grid[from.row][from.col] = { type: 'empty' };
        return {
            grid,
            moves: state.moves + 1,
            isWon: checkWin(grid),
        };
    }

    // Hedef exit ise ok silinir (exit kalır)
    if (targetCell.type === 'exit') {
        grid[from.row][from.col] = { type: 'empty' };
        return {
            grid,
            moves: state.moves + 1,
            isWon: checkWin(grid),
        };
    }

    // Hedef animal veya arrow ise hareket yok
    return state;
}

/**
 * Oku kaydır (multi-cell slide, video hissi).
 * Ok kendi yönünde boş hücreler boyunca gider.
 * - Exit'e girerse silinir.
 * - Out-of-bounds'a çıkarsa silinir.
 * - Animal/arrow'a çarparsa son boşta durur.
 * - moves++ sadece hareket olursa.
 */
export function trySlideArrow(state: GameState, from: Position): SlideResult {
    const grid = cloneGrid(state.grid);
    const cell = grid[from.row][from.col];

    // Ok değilse hareket yok
    if (cell.type !== 'arrow' || !cell.direction) {
        return { state, path: [], removed: false };
    }

    const delta = DIRECTION_DELTAS[cell.direction];
    const path: Position[] = [from];
    let current = from;
    let removed = false;

    while (true) {
        const next: Position = {
            row: current.row + delta.row,
            col: current.col + delta.col,
        };

        // Out-of-bounds → silinir
        if (!inBounds(next)) {
            grid[from.row][from.col] = { type: 'empty' };
            removed = true;
            break;
        }

        const nextCell = grid[next.row][next.col];

        // Exit → silinir
        if (nextCell.type === 'exit') {
            grid[from.row][from.col] = { type: 'empty' };
            path.push(next);
            removed = true;
            break;
        }

        // Empty → devam et
        if (nextCell.type === 'empty') {
            path.push(next);
            current = next;
            continue;
        }

        // Animal veya arrow → dur
        break;
    }

    // Hareket varsa oku son pozisyona taşı
    const moved = removed || path.length > 1;

    if (moved) {
        const last = path[path.length - 1];
        // Eğer removed ise (exit/out-of-bounds), from'u boşalttık zaten
        // Değilse, oku son konuma taşı
        if (!removed) {
            grid[last.row][last.col] = { ...cell };
            grid[from.row][from.col] = { type: 'empty' };
        }
    }

    const newState: GameState = {
        grid,
        moves: moved ? state.moves + 1 : state.moves,
        isWon: checkWin(grid),
    };

    return { state: newState, path, removed };
}
