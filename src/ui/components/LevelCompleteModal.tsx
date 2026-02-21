import { COLORS } from '@/ui/theme/colors';
import { useNavigate } from 'react-router-dom';

interface LevelCompleteModalProps {
    levelId?: string;
    levelName: string;
    stars: 0 | 1 | 2 | 3;
    moves: number;
    coinReward: number;
    nextLevelId?: string;
    onClose: () => void;
}

export function LevelCompleteModal({
    // levelId kullanılmıyor, ileride eklenebilir
    // _levelId,
    levelName,
    stars,
    moves,
    coinReward,
    nextLevelId,
    onClose,
}: LevelCompleteModalProps) {
    const navigate = useNavigate();

    const handleNext = () => {
        if (nextLevelId) {
            navigate(`/play/${nextLevelId}`);
        }
        onClose();
    };

    const handleBack = () => {
        navigate('/');
        onClose();
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(15, 20, 41, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                fontFamily: 'system-ui, sans-serif',
            }}
        >
            {/* Confetti placeholder */}
            <div style={{ marginBottom: '20px', fontSize: '48px' }}>🎉</div>

            <div
                style={{
                    backgroundColor: COLORS.bgCard,
                    border: `2px solid ${COLORS.neonBlue}`,
                    borderRadius: '16px',
                    padding: '30px',
                    textAlign: 'center',
                    maxWidth: '320px',
                    width: '90%',
                    boxShadow: `0 0 30px ${COLORS.neonBlue}40`,
                }}
            >
                <h2 style={{ color: COLORS.neonGreen, margin: '0 0 10px', fontSize: '24px' }}>
                    LEVEL COMPLETED!
                </h2>

                <div style={{ color: COLORS.textDim, marginBottom: '15px', fontSize: '14px' }}>
                    {levelName}
                </div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            style={{
                                color: i < stars ? COLORS.starFull : COLORS.starEmpty,
                                fontSize: '32px',
                            }}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', fontSize: '14px' }}>
                    <div style={{ color: COLORS.text }}>
                        <div>Moves</div>
                        <div style={{ fontWeight: 'bold', color: COLORS.neonBlue }}>{moves}</div>
                    </div>
                    <div style={{ color: COLORS.text }}>
                        <div>Reward</div>
                        <div style={{ fontWeight: 'bold', color: COLORS.neonYellow }}>+{coinReward} 🪙</div>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={handleBack}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: COLORS.buttonBg,
                            border: '1px solid #4a5568',
                            borderRadius: '8px',
                            color: COLORS.text,
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Back
                    </button>
                    {nextLevelId && (
                        <button
                            onClick={handleNext}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: COLORS.neonGreen,
                                border: 'none',
                                borderRadius: '8px',
                                color: '#0f1429',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }}
                        >
                            Next Level →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
