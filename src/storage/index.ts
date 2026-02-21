/**
 * Storage Module - LocalStorage ve CloudStorage Adapter
 */

export interface AlbumCard {
    id: string;
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    unlockedAt: number; // timestamp
}

export interface UserProgress {
    currentLevel: number;
    unlockedCards: AlbumCard[];
    totalStars: number;
}

const STORAGE_KEY = 'arrow_rescue_progress';

/**
 * LocalStorage'dan kullanıcı ilerlemesini okur
 */
export function loadProgress(): UserProgress {
    if (typeof window === 'undefined') {
        return { currentLevel: 1, unlockedCards: [], totalStars: 0 };
    }

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data) as UserProgress;
        }
    } catch (e) {
        console.error('Progress yüklenemedi:', e);
    }

    return { currentLevel: 1, unlockedCards: [], totalStars: 0 };
}

/**
 * Kullanıcı ilerlemesini kaydeder
 */
export function saveProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
        console.error('Progress kaydedilemedi:', e);
    }
}

/**
 * Yeni kilit açılan kartı albüme ekler
 */
export function unlockCard(card: AlbumCard): UserProgress {
    const progress = loadProgress();

    // Kart zaten açılmış mı kontrol et
    if (progress.unlockedCards.some((c) => c.id === card.id)) {
        return progress;
    }

    progress.unlockedCards.push(card);
    saveProgress(progress);

    return progress;
}
