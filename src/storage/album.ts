/** Album Storage - LocalStorage for unlocked rescue cards */

import type { RescueCard } from '@/content/rescueCards';

const ALBUM_KEY = 'arrow_escape_album_v1';

interface AlbumData {
    unlockedCardIds: string[];
}

const DEFAULT_ALBUM: AlbumData = {
    unlockedCardIds: [],
};

export function loadAlbum(): AlbumData {
    try {
        const raw = localStorage.getItem(ALBUM_KEY);
        if (!raw) return { ...DEFAULT_ALBUM };
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_ALBUM, ...parsed };
    } catch {
        return { ...DEFAULT_ALBUM };
    }
}

export function saveAlbum(data: AlbumData): void {
    localStorage.setItem(ALBUM_KEY, JSON.stringify(data));
}

/**
 * Add a card to the album (idempotent).
 * Returns true if the card was newly unlocked, false if already had it.
 */
export function addCard(cardId: string): boolean {
    const album = loadAlbum();
    if (album.unlockedCardIds.includes(cardId)) {
        return false; // Already unlocked
    }
    album.unlockedCardIds.push(cardId);
    saveAlbum(album);
    return true; // Newly unlocked
}

/**
 * Get all unlocked cards with full card data.
 */
export function getUnlockedCards(allCards: RescueCard[]): RescueCard[] {
    const album = loadAlbum();
    return allCards.filter(c => album.unlockedCardIds.includes(c.id));
}

/**
 * Check if a card is unlocked.
 */
export function hasCard(cardId: string): boolean {
    const album = loadAlbum();
    return album.unlockedCardIds.includes(cardId);
}
