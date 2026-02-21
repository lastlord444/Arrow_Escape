/**
 * Progress Storage - LocalStorage for level unlocks, stars, coins
 */

export interface LevelProgress {
    unlockedLevelIds: string[];
    bestMovesByLevel: Record<string, number>;
    starsByLevel: Record<string, 0 | 1 | 2 | 3>;
    coins: number;
}

const STORAGE_KEY = 'arrow_escape_progress_v1';
const DEFAULT_PROGRESS: LevelProgress = {
    unlockedLevelIds: ['level-1'],
    bestMovesByLevel: {},
    starsByLevel: {},
    coins: 0,
};

export function loadProgress(): LevelProgress {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULT_PROGRESS };
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_PROGRESS, ...parsed };
    } catch {
        return { ...DEFAULT_PROGRESS };
    }
}

export function saveProgress(progress: LevelProgress): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getStarsForLevel(
    moves: number,
    parMoves?: number
): 0 | 1 | 2 | 3 {
    if (parMoves !== undefined) {
        if (moves <= parMoves) return 3;
        if (moves <= parMoves + 2) return 2;
        return 1;
    }
    // Basit heuristic: par yoksa
    if (moves <= 2) return 3;
    if (moves <= 4) return 2;
    return 1;
}

export function unlockNextLevel(currentLevelId: string, allLevelIds: string[]): string[] {
    const progress = loadProgress();
    const idx = allLevelIds.indexOf(currentLevelId);
    if (idx === -1 || idx === allLevelIds.length - 1) return progress.unlockedLevelIds;
    const nextLevelId = allLevelIds[idx + 1];
    if (!progress.unlockedLevelIds.includes(nextLevelId)) {
        progress.unlockedLevelIds.push(nextLevelId);
        saveProgress(progress);
    }
    return progress.unlockedLevelIds;
}

export function updateLevelCompleted(
    levelId: string,
    moves: number,
    parMoves?: number
): void {
    const progress = loadProgress();

    // Update best moves
    const existing = progress.bestMovesByLevel[levelId];
    if (existing === undefined || moves < existing) {
        progress.bestMovesByLevel[levelId] = moves;
    }

    // Update stars
    const newStars = getStarsForLevel(moves, parMoves);
    const oldStars = progress.starsByLevel[levelId] || 0;
    if (newStars > oldStars) {
        progress.starsByLevel[levelId] = newStars;
        // Star upgrade bonus
        progress.coins += (newStars - oldStars) * 5;
    }

    // Completion bonus
    if (oldStars === 0) {
        progress.coins += 10;
    }

    saveProgress(progress);
}

export function resetLevel(levelId: string): void {
    const progress = loadProgress();
    delete progress.bestMovesByLevel[levelId];
    delete progress.starsByLevel[levelId];
    saveProgress(progress);
}
