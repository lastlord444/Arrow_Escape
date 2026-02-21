/** Arrow Escape - Phaser Scene (Smooth Animations + Neon Style) */

import Phaser from 'phaser';
import type { LevelDefinition } from '../types';
import { GRID_SIZE } from '../grid';
import type { GridCell, Position } from '../types';
import { tryMoveArrow } from '../move';
import { checkWin } from '../rules';

const CELL_SIZE_BASE = 60; // Base cell size, scale edilecek

export class ArrowEscapeScene extends Phaser.Scene {
    private grid: GridCell[][] = [];
    private moves = 0;
    private isWonValue = false;
    private cellSize = CELL_SIZE_BASE;
    private gridOffset: Position = { row: 0, col: 0 };
    private selectedArrow: Position | null = null;
    private arrowContainers: Map<string, any> = new Map();
    private startDragPos: Phaser.Math.Vector2 | null = null;

    constructor() {
        super({ key: 'ArrowEscape' });
    }

    create(data: { level: LevelDefinition }) {
        // Grid'i parse et
        this.grid = this.parseLevel(data.level.grid);
        this.moves = 0;
        this.isWonValue = false;

        // Responsive cell size hesapla
        const viewportW = this.scale.width;
        const viewportH = this.scale.height;
        const availableH = viewportH - 110; // HUD (50) + PowerBar (60)
        this.cellSize = Math.min(viewportW, availableH) / GRID_SIZE;

        // Grid ortala
        const gridPixelW = this.cellSize * GRID_SIZE;
        const gridPixelH = this.cellSize * GRID_SIZE;
        this.gridOffset = {
            row: Math.floor((viewportH - gridPixelH - 110) / 2),
            col: Math.floor((viewportW - gridPixelW) / 2),
        };

        // Grid background çiz (dotted pattern)
        this.drawGridBackground();

        // Hücreleri oluştur
        this.createCells();

        // Input setup
        this.setupInput();

        // Win check loop
        this.time.addEvent({
            delay: 500,
            callback: this.checkWinLoop,
            callbackScope: this,
            loop: true,
        });

        // Expose state for React
        this.registry.set('state', {
            get moves() { return this.moves; },
            get isWon() { return this.isWonValue; },
        });
    }

    private parseLevel(grid: string[]): GridCell[][] {
        return grid.map(row => row.split('').map(this.charToCell));
    }

    private charToCell(char: string): GridCell {
        switch (char) {
            case '.': return { type: 'empty' };
            case '^': return { type: 'arrow', direction: 'up' };
            case 'v': return { type: 'arrow', direction: 'down' };
            case '<': return { type: 'arrow', direction: 'left' };
            case '>': return { type: 'arrow', direction: 'right' };
            case 'A': return { type: 'animal' };
            case 'E': return { type: 'exit' };
            default: return { type: 'empty' };
        }
    }

    private drawGridBackground() {
        const graphics = this.add.graphics();
        const darkNavy = 0x1a1f36;
        const lighterDot = 0x3b4d66;

        graphics.fillStyle(darkNavy, 1);
        graphics.fillRect(this.gridOffset.col, this.gridOffset.row, this.cellSize * GRID_SIZE, this.cellSize * GRID_SIZE);

        // Dotted pattern
        graphics.fillStyle(lighterDot, 0.3);
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                graphics.fillCircle(
                    this.gridOffset.col + c * this.cellSize + this.cellSize / 2,
                    this.gridOffset.row + r * this.cellSize + this.cellSize / 2,
                    2
                );
            }
        }
    }

    private createCells() {
        this.arrowContainers.clear();

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cell = this.grid[r][c];
                if (cell.type === 'empty') continue;

                const x = this.gridOffset.col + c * this.cellSize + this.cellSize / 2;
                const y = this.gridOffset.row + r * this.cellSize + this.cellSize / 2;
                const container = this.add.container(x, y);

                // Background rounded rect
                const bg = this.add.rectangle(0, 0, this.cellSize - 4, this.cellSize - 4, 0x2d3748);
                bg.setStrokeStyle(2, 0x4a5568);
                container.add(bg);

                // Icon/content
                if (cell.type === 'arrow') {
                    const arrow = this.createArrowSprite(cell.direction as any);
                    container.add(arrow);
                } else if (cell.type === 'animal') {
                    const text = this.add.text(0, 0, '🐱', { fontSize: this.cellSize * 0.6 });
                    text.setOrigin(0.5);
                    container.add(text);
                } else if (cell.type === 'exit') {
                    const text = this.add.text(0, 0, '🚪', { fontSize: this.cellSize * 0.6 });
                    text.setOrigin(0.5);
                    container.add(text);
                }

                container.setData('row', r);
                container.setData('col', c);
                container.setData('type', cell.type);
                container.setData('direction', cell.direction);

                this.arrowContainers.set(`${r},${c}`, container);
            }
        }
    }

    private createArrowSprite(direction: 'up' | 'down' | 'left' | 'right'): Phaser.GameObjects.Text {
        const arrows: Record<string, string> = { up: '↑', down: '↓', left: '←', right: '→' };
        return this.add.text(0, 0, arrows[direction], {
            fontSize: this.cellSize * 0.5,
            color: '#00d4ff',
            fontStyle: 'bold',
        }).setOrigin(0.5);
    }

    private setupInput() {
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup', this.onPointerUp, this);
    }

    private onPointerDown(pointer: Phaser.Input.Pointer) {
        const { x, y } = pointer;
        const container = this.getContainerAt(x, y);
        if (container && container.getData('type') === 'arrow') {
            this.selectedArrow = {
                row: container.getData('row'),
                col: container.getData('col'),
            };
            this.startDragPos = new Phaser.Math.Vector2(x, y);
            // Glow effect
            (container.getAt(1) as Phaser.GameObjects.Text).setColor('#00ff88');
        }
    }

    private onPointerMove(pointer: Phaser.Input.Pointer) {
        if (!this.selectedArrow || !this.startDragPos) return;

        const { x, y } = pointer;
        const distance = Phaser.Math.Distance.Between(x, y, this.startDragPos.x, this.startDragPos.y);

        // Threshold: 20px
        if (distance < 20) return;

        const direction = this.getDragDirection(x, y);
        if (!direction) return;

        const from = this.selectedArrow;
        const cell = this.grid[from.row][from.col];
        if (cell.type !== 'arrow') return;

        const result = tryMoveArrow({ grid: this.grid, moves: this.moves, isWon: false }, from);

        if (result.moves > this.moves) {
            // Valid move - animasyonla güncelle
            this.moves = result.moves;
            this.grid = result.grid;
            this.animateMove(from, result);
        }

        // Reset selection
        this.selectedArrow = null;
        this.startDragPos = null;

        // Re-render
        this.time.delayedCall(200, () => {
            this.createCells();
        });
    }

    private onPointerUp() {
        this.selectedArrow = null;
        this.startDragPos = null;
    }

    private getContainerAt(x: number, y: number): any | null {
        for (const container of this.arrowContainers.values()) {
            if (container.getBounds().contains(x, y)) return container;
        }
        return null;
    }

    private getDragDirection(x: number, y: number): 'up' | 'down' | 'left' | 'right' | null {
        const dx = x - this.startDragPos!.x;
        const dy = y - this.startDragPos!.y;

        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        } else {
            return dy > 0 ? 'down' : 'up';
        }
    }

    private animateMove(
        from: Position,
        result: { grid: GridCell[][]; moves: number; isWon: boolean }
    ) {
        const container = this.arrowContainers.get(`${from.row},${from.col}`);
        if (!container) return;

        // Hedef pozisyon hesapla (move sonrası)
        const arrowDir = (result.grid[from.row][from.col] as any).direction;
        const targetPos = this.getTargetPosition(from.row, from.col, arrowDir);

        if (targetPos) {
            // Move tween
            this.tweens.add({
                targets: container,
                x: targetPos.x,
                y: targetPos.y,
                duration: 150,
                ease: Phaser.Math.Easing.Quadratic.Out,
            });
        } else {
            // Remove (exit/out-of-bounds) - fade out
            this.tweens.add({
                targets: container,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 120,
                ease: Phaser.Math.Easing.Back.In,
                onComplete: () => container.destroy(),
            });
        }
    }

    private getTargetPosition(row: number, col: number, direction: string): { x: number; y: number } | null {
        let dr = 0, dc = 0;
        if (direction === 'up') dr = -1;
        else if (direction === 'down') dr = 1;
        else if (direction === 'left') dc = -1;
        else if (direction === 'right') dc = 1;

        const newRow = row + dr;
        const newCol = col + dc;

        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) return null;

        return {
            x: this.gridOffset.col + newCol * this.cellSize + this.cellSize / 2,
            y: this.gridOffset.row + newRow * this.cellSize + this.cellSize / 2,
        };
    }

    private checkWinLoop() {
        if (this.isWonValue) return;

        const won = checkWin(this.grid);
        if (won) {
            this.isWonValue = true;
            // Update registry state
            this.registry.set('state', {
                get moves() { return this.moves; },
                get isWon() { return true; },
            });
        }
    }

    public get state() {
        return {
            moves: this.moves,
            isWon: this.isWonValue,
        };
    }
}
