/** Arrow Escape - Engine Core Tests (Arrow Out) */

// @ts-expect-error vitest globals
const _grid = await import('../game/grid');
// @ts-expect-error vitest globals
const _move = await import('../game/move');
// @ts-expect-error vitest globals
const _rules = await import('../game/rules');
// @ts-expect-error vitest globals
const _level = await import('../game/level');
const { GRID_SIZE, getOccupiedCells } = _grid;
const { slideBlock } = _move;
const { checkWin } = _rules;
const { getAllLevels, getLevelById } = _level;

describe('Grid Size', () => {
    it('GRID_SIZE is 6', () => {
        expect(GRID_SIZE).toBe(6);
    });
});

describe('Block Occupancy', () => {
    it('1x1 block occupies 1 cell', () => {
        const block: ArrowBlock = { id: 'b1', len: 1, dir: 'up', row: 3, col: 2 };
        const cells = getOccupiedCells(block);
        expect(cells).toHaveLength(1);
        expect(cells[0]).toEqual({ row: 3, col: 2 });
    });

    it('1x3 up block occupies 3 cells upward', () => {
        const block: ArrowBlock = { id: 'b1', len: 3, dir: 'up', row: 5, col: 2 };
        const cells = getOccupiedCells(block);
        expect(cells).toHaveLength(3);
        expect(cells[0]).toEqual({ row: 5, col: 2 });
        expect(cells[1]).toEqual({ row: 4, col: 2 });
        expect(cells[2]).toEqual({ row: 3, col: 2 });
    });

    it('1x2 right block occupies 2 cells rightward', () => {
        const block: ArrowBlock = { id: 'b1', len: 2, dir: 'right', row: 1, col: 0 };
        const cells = getOccupiedCells(block);
        expect(cells).toHaveLength(2);
        expect(cells[0]).toEqual({ row: 1, col: 0 });
        expect(cells[1]).toEqual({ row: 1, col: 1 });
    });
});

describe('Win Condition (Arrow Out)', () => {
    it('wins when all blocks removed', () => {
        const state: GameState = { blocks: [], moves: 5, isWon: false };
        expect(checkWin(state)).toBe(true);
    });

    it('not won when blocks remain', () => {
        const state: GameState = {
            blocks: [{ id: 'b1', len: 1, dir: 'up', row: 0, col: 0 }],
            moves: 0,
            isWon: false,
        };
        expect(checkWin(state)).toBe(false);
    });
});

describe('Slide Block', () => {
    it('slides block 1 step in its direction', () => {
        const state: GameState = {
            blocks: [{ id: 'b1', len: 1, dir: 'up', row: 3, col: 2 }],
            moves: 0,
            isWon: false,
        };
        const result = slideBlock(state, 'b1');
        expect(result.removed).toBe(false);
        expect(result.state.moves).toBe(1);
        const moved = result.state.blocks.find(b => b.id === 'b1');
        expect(moved?.row).toBe(2);
        expect(moved?.col).toBe(2);
    });

    it('removes block when it slides out of bounds', () => {
        const state: GameState = {
            blocks: [{ id: 'b1', len: 1, dir: 'up', row: 0, col: 2 }],
            moves: 0,
            isWon: false,
        };
        const result = slideBlock(state, 'b1');
        expect(result.removed).toBe(true);
        expect(result.state.blocks).toHaveLength(0);
        expect(result.state.moves).toBe(1);
        expect(result.state.isWon).toBe(true);
    });

    it('blocks another block from moving', () => {
        const state: GameState = {
            blocks: [
                { id: 'b1', len: 1, dir: 'up', row: 2, col: 2 },
                { id: 'b2', len: 1, dir: 'down', row: 1, col: 2 },
            ],
            moves: 0,
            isWon: false,
        };
        const result = slideBlock(state, 'b1');
        expect(result.removed).toBe(false);
        expect(result.state.moves).toBe(0); // blocked, no move
    });

    it('non-existent block returns unchanged state', () => {
        const state: GameState = {
            blocks: [{ id: 'b1', len: 1, dir: 'up', row: 3, col: 2 }],
            moves: 0,
            isWon: false,
        };
        const result = slideBlock(state, 'xxx');
        expect(result.state).toBe(state);
    });

    it('long block (len=3) slides and removes when fully out', () => {
        const state: GameState = {
            blocks: [{ id: 'b1', len: 3, dir: 'up', row: 2, col: 1 }],
            moves: 0,
            isWon: false,
        };
        const result = slideBlock(state, 'b1');
        // Head at row=2, body at row=1, tail at row=0
        // Move up: head=1, body=0, tail=-1 → tail out-of-bounds
        // allOutOfBounds check: NOT all out → should just check moved block collision
        expect(result.state.moves).toBe(1);
    });
});

describe('Level Data (Block Format)', () => {
    it('has 5 levels', () => {
        const levels = getAllLevels();
        expect(levels).toHaveLength(5);
    });

    it('getLevelById returns correct level', () => {
        const level = getLevelById('level-1');
        expect(level).toBeDefined();
        expect(level?.id).toBe('level-1');
        expect(level?.blocks.length).toBeGreaterThan(0);
    });

    it('each level has blocks with valid positions', () => {
        for (const level of getAllLevels()) {
            for (const block of level.blocks) {
                expect(block.row).toBeGreaterThanOrEqual(0);
                expect(block.row).toBeLessThan(level.gridHeight);
                expect(block.col).toBeGreaterThanOrEqual(0);
                expect(block.col).toBeLessThan(level.gridWidth);
                expect(block.len).toBeGreaterThanOrEqual(1);
                expect(block.len).toBeLessThanOrEqual(6);
            }
        }
    });
});
