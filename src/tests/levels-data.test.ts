/** Levels Data Tests - globals mode */

// @ts-expect-error vitest globals
const _levels = await import('../content/levels/index');
// @ts-expect-error vitest globals
const _levelParser = await import('../game/level');

const { LEVELS, getLevelById, getAllLevels } = _levels;
const { parseLevel } = _levelParser;

describe('Levels Data', () => {
    it('has exactly 5 levels', () => {
        expect(LEVELS).toHaveLength(5);
    });

    it('all levels are valid (parseLevel throws no error)', () => {
        LEVELS.forEach(level => {
            expect(() => parseLevel(level)).not.toThrow();
        });
    });

    it('all levels have unique IDs', () => {
        const ids = LEVELS.map(l => l.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(5);
    });

    it('getLevelById returns correct level', () => {
        const level1 = getLevelById('level-1');
        expect(level1).toBeDefined();
        expect(level1?.id).toBe('level-1');
    });

    it('getLevelById returns undefined for invalid ID', () => {
        const invalid = getLevelById('level-999');
        expect(invalid).toBeUndefined();
    });

    it('getAllLevels returns a copy of LEVELS', () => {
        const copy = getAllLevels();
        expect(copy).toEqual(LEVELS);
        expect(copy).not.toBe(LEVELS); // reference farkli
    });

    it('level-1 has A and E in correct positions', () => {
        const level1 = getLevelById('level-1');
        const grid = parseLevel(level1!);
        expect(grid[0][0].type).toBe('animal');
        expect(grid[5][5].type).toBe('exit');
    });
});
