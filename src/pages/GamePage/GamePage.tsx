import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getLevelById, getAllLevels } from '@/content/levels/index';
import { createArrowEscapeGame, type CreateGameResult } from '@/game';
import { Page } from '@/components/Page';
import { Hud } from '@/ui/components/Hud';
import { PowerBar } from '@/ui/components/PowerBar';
import { LevelCompleteModal } from '@/ui/components/LevelCompleteModal';
import { updateLevelCompleted, unlockNextLevel, getStarsForLevel } from '@/ui/storage/progress';

export function GamePage() {
    const { id } = useParams<{ id: string }>();
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<CreateGameResult | null>(null);
    const [moves, setMoves] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [stars, setStars] = useState<0 | 1 | 2 | 3>(0);

    const levelId = id || '';
    const levelDef = getLevelById(levelId);
    const allLevels = getAllLevels();
    const levelIndex = allLevels.findIndex(l => l.id === levelId);
    const nextLevel = allLevels[levelIndex + 1];

    // Restart handler
    const handleRestart = useCallback(() => {
        if (gameRef.current) {
            gameRef.current.game.destroy(true);
            gameRef.current = null;
        }
        setMoves(0);
        setShowModal(false);
        if (levelDef && containerRef.current) {
            const result = createArrowEscapeGame(containerRef.current, levelDef);
            gameRef.current = result;
        }
    }, [levelDef]);

    useEffect(() => {
        if (!levelDef || !containerRef.current) return;

        // Reset state
        setMoves(0);
        setShowModal(false);

        // Create game
        const result = createArrowEscapeGame(containerRef.current, levelDef);
        gameRef.current = result;

        // Poll moves from Phaser scene
        const interval = setInterval(() => {
            const scene = result.game.scene.getScene('ArrowEscape');
            if (scene && (scene as any).state) {
                const state = (scene as any).state;
                setMoves(state.moves);
                if (state.isWon && showModal === false) {
                    const calcStars = getStarsForLevel(state.moves);
                    setStars(calcStars);
                    setShowModal(true);
                    // Save progress
                    updateLevelCompleted(levelId, state.moves);
                    unlockNextLevel(levelId, allLevels.map(l => l.id));
                }
            }
        }, 300);

        return () => {
            clearInterval(interval);
            result.game.destroy(true);
            gameRef.current = null;
        };
    }, [levelId, levelDef, allLevels, showModal]);

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
