/** Arrow Escape - Phaser Scene */

import Phaser from 'phaser';
import type { GameState, LevelDefinition, Position } from '../types';
import { parseLevel, cellToChar } from '../level';
import { tryMoveArrow } from '../move';
import { GRID_SIZE } from '../grid';

export class ArrowEscapeScene extends Phaser.Scene {
    private state!: GameState;
    private cellSize = 60;
    private gridGraphics!: Phaser.GameObjects.Graphics;
    private pointerDownPos: Position | null = null;

    constructor() {
        super({ key: 'ArrowEscape' });
    }

    init(data: { level: LevelDefinition }) {
        const grid = parseLevel(data.level);
        this.state = {
            grid,
            moves: 0,
            isWon: false,
        };
    }

    create() {
        this.gridGraphics = this.add.graphics();
        this.renderGrid();

        // Pointer events
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const pos = this.getGridPosition(pointer.x, pointer.y);
            if (pos) {
                this.pointerDownPos = pos;
            }
        });

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            if (!this.pointerDownPos) return;

            const upPos = this.getGridPosition(pointer.x, pointer.y);
            if (!upPos) {
                this.pointerDownPos = null;
                return;
            }

            // Drag yönü tespit
            const dx = upPos.col - this.pointerDownPos.col;
            const dy = upPos.row - this.pointerDownPos.row;

            const cell = this.state.grid[this.pointerDownPos.row][this.pointerDownPos.col];
            if (cell.type === 'arrow' && cell.direction) {
                let swipeDirection = '';
                if (Math.abs(dx) > Math.abs(dy)) {
                    swipeDirection = dx > 0 ? 'right' : 'left';
                } else {
                    swipeDirection = dy > 0 ? 'down' : 'up';
                }

                // Ok yönüyle uyumluysa move
                if (swipeDirection === cell.direction) {
                    this.state = tryMoveArrow(this.state, this.pointerDownPos);
                    this.renderGrid();

                    if (this.state.isWon) {
                        this.showWinMessage();
                    }
                }
            }

            this.pointerDownPos = null;
        });
    }

    private getGridPosition(x: number, y: number): Position | null {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
            return { row, col };
        }
        return null;
    }

    private renderGrid() {
        this.gridGraphics.clear();

        // Grid çizgileri
        this.gridGraphics.lineStyle(2, 0x666666);
        for (let r = 0; r <= GRID_SIZE; r++) {
            const y = r * this.cellSize;
            this.gridGraphics.lineBetween(0, y, GRID_SIZE * this.cellSize, y);
        }
        for (let c = 0; c <= GRID_SIZE; c++) {
            const x = c * this.cellSize;
            this.gridGraphics.lineBetween(x, 0, x, GRID_SIZE * this.cellSize);
        }

        // Hücre içerikleri (basit text)
        this.children.list.forEach(child => {
            if (child.type === 'Text') child.destroy();
        });

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cell = this.state.grid[r][c];
                const ch = cellToChar(cell);
                if (ch !== '.') {
                    const x = c * this.cellSize + this.cellSize / 2;
                    const y = r * this.cellSize + this.cellSize / 2;
                    this.add.text(x, y, ch, {
                        fontSize: '32px',
                        color: '#000',
                    }).setOrigin(0.5);
                }
            }
        }

        // Moves
        const movesText = this.children.list.find(c => c.name === 'movesText') as Phaser.GameObjects.Text;
        if (movesText) {
            movesText.setText(`Moves: ${this.state.moves}`);
        } else {
            this.add.text(10, GRID_SIZE * this.cellSize + 10, `Moves: ${this.state.moves}`, {
                fontSize: '20px',
                color: '#000',
            }).setName('movesText');
        }
    }

    private showWinMessage() {
        this.add.text(GRID_SIZE * this.cellSize / 2, GRID_SIZE * this.cellSize / 2, 'WIN!', {
            fontSize: '48px',
            color: '#00ff00',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5);
    }
}
