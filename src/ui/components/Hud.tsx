import { COLORS } from '@/ui/theme/colors';

interface HudProps {
    levelNumber: number;
    moves?: number;
}

export function Hud({ levelNumber }: HudProps) {
    // moves: ileride moves counter için
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '50px',
                backgroundColor: COLORS.hudBg,
                borderBottom: `1px solid ${COLORS.gridLine}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 15px',
                color: COLORS.text,
                fontFamily: 'system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                zIndex: 10,
            }}
        >
            {/* Sol: Level */}
            <div style={{ color: COLORS.neonBlue }}>
                LVL {levelNumber}
            </div>

            {/* Orta: 3 yıldız placeholder */}
            <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map((i) => (
                    <span key={i} style={{ color: COLORS.starEmpty, fontSize: '16px' }}>★</span>
                ))}
            </div>

            {/* Sağ: Coin */}
            <div style={{ color: COLORS.neonYellow }}>
                🪙 {loadProgress().coins}
            </div>
        </div>
    );
}

// Helper to load progress (temporary inline)
function loadProgress() {
    try {
        const raw = localStorage.getItem('arrow_escape_progress_v1');
        if (!raw) return { coins: 0 };
        const parsed = JSON.parse(raw);
        return parsed;
    } catch {
        return { coins: 0 };
    }
}
