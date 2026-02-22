/** Arrow Escape - Phaser Scene (Video Flow: Slide + Click + Rescue Animation) */

import Phaser from 'phaser';
import type { LevelDefinition } from '../types';
import { GRID_SIZE } from '../grid';
import type { GridCell, Position, SlideResult } from '../types';
import { trySlideArrow } from '../move';
import { checkWin } from '../rules';

const CELL_SIZE_BASE = 60; // Base cell size, scale edilecek
const CLICK_THRESHOLD = 12; // px below = click, above = drag

export class ArrowEscapeScene extends Phaser.Scene {
    private grid: GridCell[][] = [];
    private moves = 0;
    private isWonValue = false;
    private cellSize = CELL_SIZE_BASE;
    private gridOffset: Position = { row: 0, col: 0 };
    private selectedArrow: Position | null = null;
    private arrowContainers: Map<string, any> = new Map();
    private startDragPos: Phaser.Math.Vector2 | null = null;
    private levelId: string = '';

    constructor() {
        super({ key: 'ArrowEscape' });
    }

    create(data: { level: LevelDefinition }) {
        // Grid'i parse et
        this.grid = this.parseLevel(data.level.grid);
        this.moves = 0;
        this.isWonValue = false;
        this.levelId = data.level.id;

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

        // Drag threshold check
        if (distance >= CLICK_THRESHOLD * 2) {
            // Intentional drag - check direction match
            const dragDir = this.getDragDirection(x, y);
            const cell = this.grid[this.selectedArrow.row][this.selectedArrow.col];
            if (cell.type === 'arrow' && cell.direction === dragDir) {
                this.applySlide(this.selectedArrow);
            } else {
                this.invalidMove(this.selectedArrow);
            }
            this.selectedArrow = null;
            this.startDragPos = null;
        }
    }

    private onPointerUp(pointer: Phaser.Input.Pointer) {
        if (!this.selectedArrow || !this.startDragPos) return;

        const { x, y } = pointer;
        const distance = Phaser.Math.Distance.Between(x, y, this.startDragPos.x, this.startDragPos.y);

        // Click (short distance) → slide automatically
        if (distance < CLICK_THRESHOLD) {
            this.applySlide(this.selectedArrow);
        }

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

    private applySlide(from: Position) {
        const currentState = { grid: this.grid, moves: this.moves, isWon: false };
        const result: SlideResult = trySlideArrow(currentState, from);

        // No movement
        if (result.path.length <= 1) {
            this.invalidMove(from);
            return;
        }

        // Update state
        this.moves = result.state.moves;
        this.grid = result.state.grid;

        // Animate slide
        this.animateSlide(from, result);
    }

    private invalidMove(from: Position) {
        const container = this.arrowContainers.get(`${from.row},${from.col}`);
        if (!container) return;
        // Shake effect
        this.tweens.add({
            targets: container,
            x: container.x + 5,
            duration: 50,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                container.x = this.gridOffset.col + from.col * this.cellSize + this.cellSize / 2;
            },
        });
        // Haptic (Telegram varsa)
        const tg = (window as any).Telegram?.WebApp;
        if (tg?.HapticFeedback?.notificationOccurred) {
            tg.HapticFeedback.notificationOccurred('error');
        }
    }

    private animateSlide(from: Position, result: SlideResult) {
        const container = this.arrowContainers.get(`${from.row},${from.col}`);
        if (!container) return;

        const path = result.path;
        if (path.length === 0) return;

        // Last position (where arrow ends up or disappears)
        const lastPos = path[path.length - 1];

        if (result.removed) {
            // Exit/out-of-bounds: slide to last then fade out
            const targetX = this.gridOffset.col + lastPos.col * this.cellSize + this.cellSize / 2;
            const targetY = this.gridOffset.row + lastPos.row * this.cellSize + this.cellSize / 2;

            this.tweens.add({
                targets: container,
                x: targetX,
                y: targetY,
                duration: 150,
                ease: Phaser.Math.Easing.Quadratic.Out,
                onComplete: () => {
                    // Fade out
                    this.tweens.add({
                        targets: container,
                        scaleX: 0,
                        scaleY: 0,
                        alpha: 0,
                        duration: 100,
                        ease: Phaser.Math.Easing.Back.In,
                        onComplete: () => {
                            container.destroy();
                            this.checkWinAndEmit();
                        },
                    });
                },
            });
        } else {
            // Stay on board: slide to final position
            const targetX = this.gridOffset.col + lastPos.col * this.cellSize + this.cellSize / 2;
            const targetY = this.gridOffset.row + lastPos.row * this.cellSize + this.cellSize / 2;

            this.tweens.add({
                targets: container,
                x: targetX,
                y: targetY,
                duration: 180,
                ease: Phaser.Math.Easing.Quadratic.Out,
                onComplete: () => {
                    this.checkWinAndEmit();
                },
            });
        }
    }

    private checkWinAndEmit() {
        const won = checkWin(this.grid);
        if (won && !this.isWonValue) {
            this.isWonValue = true;

            // Rescue animation first
            this.playRescueAnimation(() => {
                // Then emit WIN event
                this.game.events.emit('WIN', { levelId: this.levelId, moves: this.moves });
                this.registry.set('state', {
                    get moves() { return this.moves; },
                    get isWon() { return true; },
                });
            });
        }
    }

    private playRescueAnimation(onComplete: () => void) {
        // Find animal and exit positions
        let animalPos: Position | null = null;
        let exitPos: Position | null = null;

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cell = this.grid[r][c];
                if (cell.type === 'animal') animalPos = { row: r, col: c };
                if (cell.type === 'exit') exitPos = { row: r, col: c };
            }
        }

        if (!animalPos || !exitPos) {
            onComplete();
            return;
        }

        const animalCont = this.arrowContainers.get(`${animalPos.row},${animalPos.col}`);
        if (!animalCont) {
            onComplete();
            return;
        }

        const endX = this.gridOffset.col + exitPos.col * this.cellSize + this.cellSize / 2;
        const endY = this.gridOffset.row + exitPos.row * this.cellSize + this.cellSize / 2;

        // Straight line tween
        this.tweens.add({
            targets: animalCont,
            x: endX,
            y: endY,
            duration: 300,
            ease: Phaser.Math.Easing.Quadratic.InOut,
            onComplete: () => {
                // Sparkle at exit
                const sparkle = this.add.text(endX, endY, '✨', { fontSize: this.cellSize * 0.8 });
                sparkle.setOrigin(0.5);
                this.tweens.add({
                    targets: sparkle,
                    scale: 1.5,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        sparkle.destroy();
                        onComplete();
                    },
                });
            },
        });
    }

    // Win check loop kept for safety (won't fire if already won)
    private checkWinLoop() {
        if (this.isWonValue) return;
        const won = checkWin(this.grid);
        if (won) {
            this.isWonValue = true;
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
