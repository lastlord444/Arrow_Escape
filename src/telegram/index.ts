/**
 * Telegram Module - TMA.js Wrapper
 *
 * Güvenlik UYARISI:
 * - initDataUnsafe ASLA güvenilir değil
 * - initData sadece sunucuda HMAC-SHA256 doğrulaması sonrası güvenilir
 * - Detay: https://core.telegram.org/bots/webapps
 */

/**
 * Telegram WebApp'ten güvenli initData okuma
 * NOT: Bu fonksiyon sadece client-side okuma yapar.
 * Sunucu doğrulaması şarttır!
 */
export function getInitData(): string | undefined {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        return (window as any).Telegram.WebApp.initData;
    }
    return undefined;
}

/**
 * Telegram Share Link oluşturma
 */
export function createShareLink(levelId: number, score: number): string {
    const baseUrl = 'https://t.me/your_bot/app';
    const params = new URLSearchParams({
        startapp: `level_${levelId}_${score}`,
    });
    return `${baseUrl}?${params.toString()}`;
}
