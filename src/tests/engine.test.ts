/** Engine Core Logic Tests - globals mode (no explicit vitest import) */

// Direct imports from game modules (no Phaser)
// @ts-expect-error vitest globals
const _grid = await import('../game/grid');
// @ts-expect-error vitest globals
const _level = await import('../game/level');
// @ts-expect-error vitest globals
const _rules = await import('../game/rules');
// @ts-expect-error vitest globals
const _move = await import('../game/move');

const { GRID_SIZE } = _grid;
const { parseLevel } = _level;
const { checkWin } = _rules;
const { tryMoveArrow } = _move;
import type { Position } from '../game/types';

describe('Grid Size', () => {
    it('GRID_SIZE is 6', () => {
        expect(GRID_SIZE).toBe(6);
    });
});

describe('Level Parse', () => {
    it('parses valid level', () => {
        const grid = [
            'A.....',
            '......',
            '......',
            '......',
            '......',
            '.....E',
        ];
        const result = parseLevel({ id: 'test', grid });
        expect(result).toHaveLength(6);
        expect(result[0][0].type).toBe('animal');
    });
});

describe('Win Condition', () => {
    it('returns true when A and E align with no arrows between', () => {
        const grid = [
            'A....E',
            '......',
            '......',
            '......',
            '......',
            '......',
        ];
        const parsed = parseLevel({ id: 'test', grid });
        expect(checkWin(parsed)).toBe(true);
    });

    it('returns false when arrow blocks path', () => {
        const grid = [
            'A.>..E',
            '......',
            '......',
            '......',
            '......',
            '......',
        ];
        const parsed = parseLevel({ id: 'test', grid });
        expect(checkWin(parsed)).toBe(false);
    });
});

describe('Arrow Move', () => {
    it('arrow moves one step into empty cell', () => {
        const state = {
            grid: parseLevel({
                id: 'test',
                grid: [
                    '>.....',
                    'A.....',
                    '......',
                    '......',
                    '......',
                    '.....E',
                ],
            }),
            moves: 0,
            isWon: false,
        };
        const from: Position = { row: 0, col: 0 };
        const result = tryMoveArrow(state, from);
        expect(result.grid[0][0].type).toBe('empty');
        expect(result.grid[0][1].type).toBe('arrow');
        expect(result.moves).toBe(1);
    });

    it('arrow moves into exit and gets removed', () => {
        const state = {
            grid: parseLevel({
                id: 'test',
                grid: [
                    '...>E.',
                    'A.....',
                    '......',
                    '......',
                    '......',
                    '......',
                ],
            }),
            moves: 0,
            isWon: false,
        };
        const from: Position = { row: 0, col: 3 };
        const result = tryMoveArrow(state, from);
        expect(result.grid[0][3].type).toBe('empty');
        expect(result.grid[0][4].type).toBe('exit');
        expect(result.moves).toBe(1);
    });

    it('arrow blocked by animal does not move', () => {
        const state = {
            grid: parseLevel({
                id: 'test',
                grid: [
                    '>A....',
                    '......',
                    '......',
                    '......',
                    '......',
                    '.....E',
                ],
            }),
            moves: 0,
            isWon: false,
        };
        const from: Position = { row: 0, col: 0 };
        const result = tryMoveArrow(state, from);
        expect(result.moves).toBe(0);
    });

    it('arrow blocked by another arrow does not move', () => {
        const state = {
            grid: parseLevel({
                id: 'test',
                grid: [
                    '>>....',
                    'A.....',
                    '......',
                    '......',
                    '......',
                    '.....E',
                ],
            }),
            moves: 0,
            isWon: false,
        };
        const from: Position = { row: 0, col: 0 };
        const result = tryMoveArrow(state, from);
        expect(result.moves).toBe(0);
    });

    it('arrow moving out-of-bounds gets removed', () => {
        const state = {
            grid: parseLevel({
                id: 'test',
                grid: [
                    '.....>',
                    'A.....',
                    '......',
                    '......',
                    '......',
                    '.....E',
                ],
            }),
            moves: 0,
            isWon: false,
        };
        const from: Position = { row: 0, col: 5 };
        const result = tryMoveArrow(state, from);
        expect(result.grid[0][5].type).toBe('empty');
        expect(result.moves).toBe(1);
    });
});
