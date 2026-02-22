/** Arrow Escape - Game Engine Public API */

export { GRID_SIZE, inBounds, getOccupiedCells, blocksCollide } from './grid';
export { checkWin } from './rules';
export { slideBlock } from './move';
export { getLevelById, getAllLevels, ALL_LEVELS } from './level';
export { createArrowEscapeGame } from './phaser/createGame';
export type { CreateGameResult } from './phaser/createGame';

export type {
    ArrowDirection,
    ArrowBlock,
    GameState,
    SlideResult,
    LevelDefinition,
    Position,
} from './types';
