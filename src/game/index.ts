/** Arrow Escape - Game Engine Public API */

export { GRID_SIZE } from './grid';
export { parseLevel } from './level';
export { checkWin } from './rules';
export { tryMoveArrow, trySlideArrow } from './move';
export { createArrowEscapeGame } from './phaser/createGame';

export type {
    ArrowDirection,
    CellType,
    GridCell,
    GameState,
    Position,
    LevelDefinition,
    SlideResult,
    AnimalRunPath,
} from './types';

export { charToCell, cellToChar } from './types';
