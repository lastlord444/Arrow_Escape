/** Telegram Share Tests */

// @ts-expect-error vitest globals
const _share = await import('../telegram/share');
const { buildShareLinkPure } = _share;

describe('Telegram Share', () => {
    it('buildShareLinkPure starts with t.me/share/url', () => {
        const link = buildShareLinkPure('https://example.com', 'level-1', 3, 2);
        expect(link.startsWith('https://t.me/share/url?url=')).toBe(true);
    });

    it('buildShareLinkPure encodes url and text', () => {
        const link = buildShareLinkPure('https://example.com', 'level-1', 3, 2);
        expect(link).toContain(encodeURIComponent('https://example.com/#/play/level-1'));
        expect(link).toContain('text=');
    });

    it('buildShareLinkPure includes moves and stars', () => {
        const link = buildShareLinkPure('https://example.com', 'level-1', 5, 3);
        const decoded = decodeURIComponent(link);
        expect(decoded).toContain('5 moves');
        expect(decoded).toContain('⭐⭐⭐');
    });
});
