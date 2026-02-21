/** Levels Data Tests - globals mode */

import { LEVELS, getLevelById, getAllLevels } from '../content/levels/index';
import { parseLevel } from '../game/level';
import { checkWin } from '../game/rules';
import { findCell, countArrowsBetween } from '../game/grid';

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

    it('all levels are solvable: A and E on same row or col', () => {
        LEVELS.forEach(level => {
            const grid = parseLevel(level);
            const animal = findCell(grid, 'animal');
            const exit = findCell(grid, 'exit');
            expect(animal).toBeDefined();
            expect(exit).toBeDefined();

            const sameRow = animal!.row === exit!.row;
            const sameCol = animal!.col === exit!.col;
            expect(sameRow || sameCol).toBe(true);
        });
    });

    it('all levels are not initially won (checkWin false)', () => {
        LEVELS.forEach(level => {
            const grid = parseLevel(level);
            expect(checkWin(grid)).toBe(false);
        });
    });

    it('all levels have at least 1 arrow between A and E (no trivial win)', () => {
        LEVELS.forEach(level => {
            const grid = parseLevel(level);
            const animal = findCell(grid, 'animal')!;
            const exit = findCell(grid, 'exit')!;
            const arrowsBetween = countArrowsBetween(grid, animal, exit);
            expect(arrowsBetween).toBeGreaterThanOrEqual(1);
        });
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
        expect(copy).not.toBe(LEVELS);
    });
});
