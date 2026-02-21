import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLevels } from '@/content/levels/index';
import { Page } from '@/components/Page';
import { loadProgress } from '@/ui/storage/progress';
import { COLORS } from '@/ui/theme/colors';

export function LevelSelectPage() {
    const navigate = useNavigate();
    const levels = getAllLevels();
    const progress = loadProgress();

    const handlePlay = useCallback((id: string) => {
        // Check if unlocked
        if (progress.unlockedLevelIds.includes(id)) {
            navigate(`/play/${id}`);
        }
    }, [navigate, progress.unlockedLevelIds]);

    return (
        <Page back={false}>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundColor: COLORS.bgDark,
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
            >
                <h1 style={{ color: COLORS.neonBlue, marginBottom: '10px' }}>Arrow Escape</h1>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', color: COLORS.neonYellow }}>
                    <span>🪙 {progress.coins}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '400px' }}>
                    {levels.map((level, idx) => {
                        const isUnlocked = progress.unlockedLevelIds.includes(level.id);
                        const stars = progress.starsByLevel[level.id] || 0;

                        return (
                            <div
                                key={level.id}
                                onClick={() => handlePlay(level.id)}
                                style={{
                                    padding: '15px 20px',
                                    backgroundColor: isUnlocked ? COLORS.bgCard : '#1a1f36',
                                    border: isUnlocked ? `1px solid ${COLORS.neonBlue}` : `1px solid ${COLORS.gridLine}`,
                                    borderRadius: '12px',
                                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    opacity: isUnlocked ? 1 : 0.5,
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 'bold', color: COLORS.text, marginBottom: '4px' }}>
                                        {level.meta?.name || `Level ${idx + 1}`}
                                    </div>
                                    <div style={{ fontSize: '12px', color: COLORS.textDim }}>
                                        {isUnlocked ? 'Tap to play' : 'Locked'}
                                    </div>
                                </div>

                                {/* Stars */}
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            style={{
                                                color: i < stars ? COLORS.starFull : COLORS.starEmpty,
                                                fontSize: '18px',
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Page>
    );
}
