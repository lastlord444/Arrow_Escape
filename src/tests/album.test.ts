/** Album Storage Tests - globals mode */

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
const _album = await import('../storage/album');
// @ts-expect-error vitest globals
const _cards = await import('../content/rescueCards');

const { loadAlbum, saveAlbum, addCard, hasCard, getUnlockedCards } = _album;
const { RESCUE_CARDS } = _cards;

describe('Album Storage', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('loadAlbum returns default when empty', () => {
        const album = loadAlbum();
        expect(album.unlockedCardIds).toEqual([]);
    });

    it('saveAlbum persists data', () => {
        saveAlbum({ unlockedCardIds: ['card-1'] });
        const loaded = loadAlbum();
        expect(loaded.unlockedCardIds).toEqual(['card-1']);
    });

    it('addCard adds new card', () => {
        const added = addCard('card-1');
        expect(added).toBe(true);
        const album = loadAlbum();
        expect(album.unlockedCardIds).toContain('card-1');
    });

    it('addCard is idempotent', () => {
        addCard('card-1');
        const added2 = addCard('card-1');
        expect(added2).toBe(false);
        const album = loadAlbum();
        expect(album.unlockedCardIds.filter((id: string) => id === 'card-1').length).toBe(1);
    });

    it('hasCard checks correctly', () => {
        addCard('card-1');
        expect(hasCard('card-1')).toBe(true);
        expect(hasCard('card-2')).toBe(false);
    });

    it('getUnlockedCards returns full card data', () => {
        addCard('card-level-1');
        addCard('card-level-2');
        const unlocked = getUnlockedCards([...RESCUE_CARDS]);
        expect(unlocked.length).toBe(2);
        expect(unlocked[0].emoji).toBeTruthy();
    });
});
