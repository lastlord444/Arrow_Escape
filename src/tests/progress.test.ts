/** Progress Storage Tests - globals mode */

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// @ts-expect-error vitest globals
const _progress = await import('../ui/storage/progress');

const { loadProgress, saveProgress, getStarsForLevel, unlockNextLevel, updateLevelCompleted } = _progress;

describe('Progress Storage', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('loadProgress returns default when empty', () => {
        const progress = loadProgress();
        expect(progress.unlockedLevelIds).toEqual(['level-1']);
        expect(progress.coins).toBe(0);
    });

    it('saveProgress persists data', () => {
        const progress = loadProgress();
        progress.coins = 100;
        saveProgress(progress);
        const loaded = loadProgress();
        expect(loaded.coins).toBe(100);
    });

    it('getStarsForLevel calc with par', () => {
        expect(getStarsForLevel(2, 2)).toBe(3);
        expect(getStarsForLevel(3, 2)).toBe(2);
        expect(getStarsForLevel(5, 2)).toBe(1);
    });

    it('getStarsForLevel heuristic without par', () => {
        expect(getStarsForLevel(2)).toBe(3);
        expect(getStarsForLevel(3)).toBe(2);
        expect(getStarsForLevel(5)).toBe(1);
    });

    it('unlockNextLevel unlocks next', () => {
        const allLevelIds = ['level-1', 'level-2', 'level-3'];
        const unlocked = unlockNextLevel('level-1', allLevelIds);
        expect(unlocked).toContain('level-2');
    });

    it('updateLevelCompleted updates stars and coins', () => {
        updateLevelCompleted('level-1', 2, 2);
        const progress = loadProgress();
        expect(progress.starsByLevel['level-1']).toBe(3);
        expect(progress.coins).toBeGreaterThan(0);
    });
});
