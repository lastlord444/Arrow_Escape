/** Telegram Share Utils */

/**
 * Build a t.me share link for win sharing.
 */
export function buildShareLink(levelId: string, moves: number, stars: number): string {
    const url = `${window.location.origin}/#/play/${levelId}`;
    const text = `Arrow Escape: Level ${levelId} | ${moves} moves | ${'⭐'.repeat(stars)}`;
    return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

/**
 * Build share link (pure function for testing, no window dependency).
 */
export function buildShareLinkPure(
    baseUrl: string,
    levelId: string,
    moves: number,
    stars: number
): string {
    const url = `${baseUrl}/#/play/${levelId}`;
    const text = `Arrow Escape: Level ${levelId} | ${moves} moves | ${'⭐'.repeat(stars)}`;
    return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

/**
 * Share win result via Telegram or fallback to browser.
 */
export function shareWin(levelId: string, moves: number, stars: number): void {
    const shareLink = buildShareLink(levelId, moves, stars);

    // Check if Telegram WebApp is available
    const tg = (window as any).Telegram?.WebApp;

    if (tg?.openTelegramLink) {
        try {
            tg.openTelegramLink(shareLink);
            // Haptic feedback
            if (tg.HapticFeedback?.notificationOccurred) {
                tg.HapticFeedback.notificationOccurred('success');
            }
        } catch {
            // Fallback
            window.open(shareLink, '_blank', 'noopener,noreferrer');
        }
    } else {
        // Browser fallback
        window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
}
