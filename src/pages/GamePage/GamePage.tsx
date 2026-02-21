import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLevelById } from '@/content/levels/index';
import { createArrowEscapeGame } from '@/game';
import { Page } from '@/components/Page';

export function GamePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<Phaser.Game | null>(null);
    const [isWon, setIsWon] = useState(false);

    useEffect(() => {
        if (!id) return;

        // ID değişince win state reset
        setIsWon(false);

        const levelDef = getLevelById(id);
        if (!levelDef || !containerRef.current) return;

        // Phaser oyununu başlat
        const game = createArrowEscapeGame(containerRef.current, levelDef);
        gameRef.current = game;

        // Win state'i dinle (Phaser scene'den event gelebilir, basitçe poll)
        const checkWinInterval = setInterval(() => {
            const scene = game.scene.getScene('ArrowEscape');
            if (scene && (scene as any).state?.isWon) {
                setIsWon(true);
                clearInterval(checkWinInterval);
            }
        }, 500);

        return () => {
            clearInterval(checkWinInterval);
            game.destroy(true);
            gameRef.current = null;
            setIsWon(false); // cleanup'ta reset
        };
    }, [id]);

    return (
        <Page>
            <div style={{ padding: '20px' }}>
                <h1>Arrow Escape - Oyun</h1>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        marginBottom: '10px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                    }}
                >
                    ← Geri
                </button>

                <div
                    ref={containerRef}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        overflow: 'hidden',
                    }}
                />

                {isWon && (
                    <div
                        style={{
                            marginTop: '20px',
                            padding: '20px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '24px',
                        }}
                    >
                        KAZANDIN! ✅
                    </div>
                )}
            </div>
        </Page>
    );
}
