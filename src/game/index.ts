/** Arrow Escape - Game Engine Public API */

export { GRID_SIZE } from './grid';
export { parseLevel } from './level';
export { checkWin } from './rules';
export { tryMoveArrow } from './move';
export { createArrowEscapeGame } from './phaser/createGame';

export type {
    ArrowDirection,
    CellType,
    GridCell,
    GameState,
    Position,
    LevelDefinition,
} from './types';

export { charToCell, cellToChar } from './types';
