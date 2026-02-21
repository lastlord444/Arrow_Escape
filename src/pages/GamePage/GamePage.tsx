import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getLevelById, getAllLevels } from '@/content/levels/index';
import { createArrowEscapeGame } from '@/game';
import { Page } from '@/components/Page';
import { Hud } from '@/ui/components/Hud';
import { PowerBar } from '@/ui/components/PowerBar';
import { LevelCompleteModal } from '@/ui/components/LevelCompleteModal';
import { updateLevelCompleted, unlockNextLevel, getStarsForLevel } from '@/ui/storage/progress';
import { addCard } from '@/storage/album';

export function GamePage() {
    const { id } = useParams<{ id: string }>();
    // const navigate = useNavigate(); // Restart için gerekmiyor şu an
    const containerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<any>(null);
    const [moves, setMoves] = useState(0);
    const [isWon, setIsWon] = useState(false);
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
            gameRef.current.destroy(true);
            gameRef.current = null;
        }
        setMoves(0);
        setIsWon(false);
        setShowModal(false);
        if (levelDef && containerRef.current) {
            const game = createArrowEscapeGame(containerRef.current, levelDef);
            gameRef.current = game;
        }
    }, [levelDef]);

    useEffect(() => {
        if (!levelDef || !containerRef.current) return;

        // Reset state
        setIsWon(false);
        setMoves(0);
        setShowModal(false);

        // Create game
        const game = createArrowEscapeGame(containerRef.current, levelDef);
        gameRef.current = game;

        // Poll moves from Phaser scene
        const interval = setInterval(() => {
            const scene = game.scene.getScene('ArrowEscape');
            if (scene && (scene as any).state) {
                const state = (scene as any).state;
                setMoves(state.moves);
                if (state.isWon && !isWon) {
                    setIsWon(true);
                    const calcStars = getStarsForLevel(state.moves);
                    setStars(calcStars);
                    setShowModal(true);
                    // Save progress + album
                    updateLevelCompleted(levelId, state.moves);
                    unlockNextLevel(levelId, allLevels.map(l => l.id));
                    addCard(`card-${levelId}`);
                }
            }
        }, 300);

        return () => {
            clearInterval(interval);
            game.destroy(true);
            gameRef.current = null;
        };
    }, [levelId, levelDef, allLevels, isWon]);

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
                    height: '100vh',
                    backgroundColor: '#1a1f36',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Hud levelNumber={levelIndex + 1} />

                <div
                    ref={containerRef}
                    style={{
                        flex: 1,
                        position: 'relative',
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
