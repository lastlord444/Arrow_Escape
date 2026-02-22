import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getLevelById, getAllLevels } from '@/content/levels/index';
import { createArrowEscapeGame } from '@/game';
import { Page } from '@/components/Page';
import { Hud } from '@/ui/components/Hud';
import { PowerBar } from '@/ui/components/PowerBar';
import { LevelCompleteModal } from '@/ui/components/LevelCompleteModal';
import { updateLevelCompleted, unlockNextLevel, getStarsForLevel } from '@/ui/storage/progress';

export function GamePage() {
    const { id } = useParams<{ id: string }>();
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<{ game: any; renderer: 'webgl' | 'canvas' } | null>(null);
    const [moves, setMoves] = useState(0);
    const [isWon, setIsWon] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [stars, setStars] = useState<0 | 1 | 2 | 3>(0);
    const [renderer, setRenderer] = useState<'webgl' | 'canvas'>('webgl');

    const levelId = id || '';
    const levelDef = getLevelById(levelId);
    const allLevels = getAllLevels();
    const levelIndex = allLevels.findIndex(l => l.id === levelId);
    const nextLevel = allLevels[levelIndex + 1];

    const handleWin = useCallback((winData: { levelId: string; moves: number }) => {
        if (isWon) return;
        setIsWon(true);
        const calcStars = getStarsForLevel(winData.moves);
        setStars(calcStars);
        setShowModal(true);
        setMoves(winData.moves);
        // Save progress
        updateLevelCompleted(levelId, winData.moves);
        unlockNextLevel(levelId, allLevels.map(l => l.id));
    }, [levelId, allLevels, isWon]);

    const handleRestart = useCallback(() => {
        if (gameRef.current) {
            gameRef.current.game.destroy(true);
            gameRef.current = null;
        }
        setMoves(0);
        setIsWon(false);
        setShowModal(false);
        if (levelDef && containerRef.current) {
            const result = createArrowEscapeGame(containerRef.current, levelDef);
            gameRef.current = result;
            setRenderer(result.renderer);
        }
    }, [levelDef]);

    useEffect(() => {
        if (!levelDef || !containerRef.current) return;

        // Reset state
        setIsWon(false);
        setMoves(0);
        setShowModal(false);

        // Create game
        const result = createArrowEscapeGame(containerRef.current, levelDef);
        gameRef.current = result;
        setRenderer(result.renderer);

        // Listen for WIN event from Phaser
        const winHandler = (winData: any) => handleWin(winData);
        result.game.events.on('WIN', winHandler);

        // Poll moves from Phaser scene (keep for moves counter)
        const interval = setInterval(() => {
            const scene = result.game.scene.getScene('ArrowEscape');
            if (scene && (scene as any).state) {
                setMoves((scene as any).state.moves);
            }
        }, 300);

        return () => {
            clearInterval(interval);
            result.game.events.off('WIN', winHandler);
            result.game.destroy(true);
            gameRef.current = null;
        };
    }, [levelId, levelDef, handleWin]);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!levelDef) {
        return (
            <Page>
                <div style={{ padding: '20px', color: '#e2e8f0' }}>Level not found</div>
            </Page>
        );
    }

    return (
        <Page back={false}>
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#1a1f36',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <Hud levelNumber={levelIndex + 1} />

                <div
                    ref={containerRef}
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                    }}
                />

                <PowerBar onRestart={handleRestart} undoDisabled={true} />

                {renderer === 'canvas' && (
                    <div style={{
                        position: 'absolute',
                        bottom: 70,
                        left: 10,
                        backgroundColor: 'rgba(255,165,0,0.8)',
                        color: '#000',
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                    }}>
                        Canvas Mode (WebGL unsupported)
                    </div>
                )}

                {showModal && (
                    <LevelCompleteModal
                        levelId={levelId}
                        levelName={levelDef.meta?.name || `Level ${levelIndex + 1}`}
                        stars={stars}
                        moves={moves}
                        coinReward={10 + stars * 5}
                        nextLevelId={nextLevel?.id}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </Page>
    );
}
