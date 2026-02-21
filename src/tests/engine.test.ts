/** Engine Core Logic Tests - globals mode (no explicit vitest import) */

// Direct imports from game modules (no Phaser)
// @ts-expect-error vitest globals
const _grid = await import('../game/grid');
// @ts-expect-error vitest globals
const _level = await import('../game/level');
// @ts-expect-error vitest globals
const _rules = await import('../game/rules');

const { GRID_SIZE } = _grid;
const { parseLevel } = _level;
const { checkWin } = _rules;

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
