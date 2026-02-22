/** Arrow Escape - Phaser Scene (Arrow Out: 1×N Blocks) */

import Phaser from 'phaser';
import type { LevelDefinition, ArrowBlock, GameState, ArrowDirection, SlideResult } from '../types';
import { GRID_SIZE } from '../grid';
import { slideBlock } from '../move';
import { checkWin } from '../rules';

const CELL_SIZE_BASE = 60;

export class ArrowEscapeScene extends Phaser.Scene {
    private blocks: ArrowBlock[] = [];
    private moves = 0;
    private isWonValue = false;
    private cellSize = CELL_SIZE_BASE;
    private gridOffset: { row: number; col: number } = { row: 0, col: 0 };
    private selectedBlock: ArrowBlock | null = null;
    private blockContainers: Map<string, Phaser.GameObjects.Container> = new Map();
    private startDragPos: Phaser.Math.Vector2 | null = null;
    private levelId: string = '';

    constructor() {
        super({ key: 'ArrowEscape' });
    }

    create(data: { level: LevelDefinition }) {
        this.levelId = data.level.id;
        this.blocks = [...data.level.blocks];
        this.moves = 0;
        this.isWonValue = false;

        // Responsive cell size
        const viewportW = this.scale.width;
        const viewportH = this.scale.height;
        const availableH = viewportH - 110;
        this.cellSize = Math.min(viewportW, availableH) / GRID_SIZE;

        // Center grid
        const gridPixelW = this.cellSize * GRID_SIZE;
        const gridPixelH = this.cellSize * GRID_SIZE;
        this.gridOffset = {
            row: Math.floor((viewportH - gridPixelH - 110) / 2),
            col: Math.floor((viewportW - gridPixelW) / 2),
        };

        this.drawGridBackground();
        this.createBlocks();
        this.setupInput();
    }

    private drawGridBackground() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x1a1f36, 1);
        graphics.fillRect(
            this.gridOffset.col,
            this.gridOffset.row,
            this.cellSize * GRID_SIZE,
            this.cellSize * GRID_SIZE
        );

        // Dotted pattern
        graphics.fillStyle(0x3b4d66, 0.3);
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

    private createBlocks() {
        this.blockContainers.clear();

        for (const block of this.blocks) {
            const container = this.createBlockContainer(block);
            this.blockContainers.set(block.id, container);
        }
    }

    private createBlockContainer(block: ArrowBlock): Phaser.GameObjects.Container {
        const { width, height } = this.getBlockDimensions(block);
        const { x, y } = this.getBlockPixelPosition(block);

        const container = this.add.container(x, y);

        // Background (long rectangle)
        const bg = this.add.rectangle(0, 0, width, height, 0x2d3748);
        bg.setStrokeStyle(2, 0x00d4ff);
        container.add(bg);

        // Arrow indicator at head
        const arrow = this.createArrowSprite(block.dir);
        arrow.setPosition(-width / 2 + arrow.width / 2 + 4, 0);
        container.add(arrow);

        // Length indicator (small text)
        if (block.len > 1) {
            const lenText = this.add.text(width / 2 - 8, 0, `${block.len}`, {
                fontSize: '12px',
                color: '#00d4ff',
            });
            lenText.setOrigin(1, 0.5);
            container.add(lenText);
        }

        container.setData('block', block);
        container.setSize(width, height);
        container.setInteractive({ useHandCursor: true });

        return container;
    }

    private getBlockDimensions(block: ArrowBlock): { width: number; height: number } {
        const isHorizontal = block.dir === 'left' || block.dir === 'right';
        const length = this.cellSize * block.len;
        const thickness = this.cellSize * 0.8;
        return isHorizontal
            ? { width: length, height: thickness }
            : { width: thickness, height: length };
    }

    private getBlockPixelPosition(block: ArrowBlock): { x: number; y: number } {
        const { width, height } = this.getBlockDimensions(block);
        return {
            x: this.gridOffset.col + block.col * this.cellSize + width / 2,
            y: this.gridOffset.row + block.row * this.cellSize + height / 2,
        };
    }

    private createArrowSprite(dir: ArrowDirection): Phaser.GameObjects.Text {
        const arrows = { up: '↑', down: '↓', left: '←', right: '→' };
        return this.add.text(0, 0, arrows[dir], {
            fontSize: this.cellSize * 0.5,
            color: '#00d4ff',
            fontStyle: 'bold',
        }).setOrigin(0.5);
    }

    private setupInput() {
        this.input.on('pointerdown', this.onPointerDown, this);
        this.input.on('pointerup', this.onPointerUp, this);
    }

    private onPointerDown(pointer: Phaser.Input.Pointer) {
        const { x, y } = pointer;
        for (const container of this.blockContainers.values()) {
            if (container.getBounds().contains(x, y)) {
                const block = container.getData('block') as ArrowBlock;
                this.selectedBlock = block;
                this.startDragPos = new Phaser.Math.Vector2(x, y);
                // Glow
                (container.getAt(0) as Phaser.GameObjects.Rectangle).setStrokeStyle(3, 0x00ff88);
                break;
            }
        }
    }

    private onPointerUp(pointer: Phaser.Input.Pointer) {
        if (!this.selectedBlock || !this.startDragPos) return;

        const { x, y } = pointer;
        const dist = Phaser.Math.Distance.Between(x, y, this.startDragPos.x, this.startDragPos.y);

        // Click or drag in same direction
        if (dist < 12) {
            this.applySlide(this.selectedBlock);
        } else {
            const dragDir = this.getDragDirection(x, y);
            if (dragDir === this.selectedBlock.dir) {
                this.applySlide(this.selectedBlock);
            } else {
                this.invalidMove(this.selectedBlock);
            }
        }

        // Reset selection glow
        for (const container of this.blockContainers.values()) {
            (container.getAt(0) as Phaser.GameObjects.Rectangle).setStrokeStyle(2, 0x00d4ff);
        }

        this.selectedBlock = null;
        this.startDragPos = null;
    }

    private getDragDirection(x: number, y: number): ArrowDirection | null {
        const dx = x - this.startDragPos!.x;
        const dy = y - this.startDragPos!.y;
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        } else {
            return dy > 0 ? 'down' : 'up';
        }
    }

    private applySlide(block: ArrowBlock) {
        const currentState: GameState = { blocks: this.blocks, moves: this.moves, isWon: false };
        const result = slideBlock(currentState, block.id);

        if (result.state.moves === this.moves) {
            // No movement
            this.invalidMove(block);
            return;
        }

        // Update state
        this.moves = result.state.moves;
        this.blocks = result.state.blocks;

        // Animate
        this.animateSlide(block, result);
    }

    private invalidMove(block: ArrowBlock) {
        const container = this.blockContainers.get(block.id);
        if (!container) return;
        this.tweens.add({
            targets: container,
            x: container.x + 5,
            duration: 50,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                const pos = this.getBlockPixelPosition(block);
                container.setPosition(pos.x, pos.y);
            },
        });
    }

    private animateSlide(block: ArrowBlock, result: SlideResult) {
        const container = this.blockContainers.get(block.id);
        if (!container) return;

        const movedBlock = result.state.blocks.find((b: ArrowBlock) => b.id === block.id);
        const wasRemoved = result.removed;

        if (wasRemoved) {
            // Slide out then fade
            const dirDelta = this.getDelta(block.dir);
            const outX = container.x + dirDelta.col * this.cellSize * 2;
            const outY = container.y + dirDelta.row * this.cellSize * 2;

            this.tweens.add({
                targets: container,
                x: outX,
                y: outY,
                duration: 200,
                ease: Phaser.Math.Easing.Quadratic.Out,
                onComplete: () => {
                    this.tweens.add({
                        targets: container,
                        scaleX: 0,
                        scaleY: 0,
                        alpha: 0,
                        duration: 100,
                        ease: Phaser.Math.Easing.Back.In,
                        onComplete: () => {
                            container.destroy();
                            this.blockContainers.delete(block.id);
                            this.checkWin();
                        },
                    });
                },
            });
        } else if (movedBlock) {
            // Move to new position
            const newPos = this.getBlockPixelPosition(movedBlock);
            this.tweens.add({
                targets: container,
                x: newPos.x,
                y: newPos.y,
                duration: 180,
                ease: Phaser.Math.Easing.Quadratic.Out,
                onComplete: () => {
                    this.checkWin();
                },
            });
        }
    }

    private getDelta(dir: ArrowDirection): { row: number; col: number } {
        switch (dir) {
            case 'up': return { row: -1, col: 0 };
            case 'down': return { row: 1, col: 0 };
            case 'left': return { row: 0, col: -1 };
            case 'right': return { row: 0, col: 1 };
        }
    }

    private checkWin() {
        const won = checkWin({ blocks: this.blocks, moves: this.moves, isWon: false });
        if (won && !this.isWonValue) {
            this.isWonValue = true;
            this.game.events.emit('WIN', { levelId: this.levelId, moves: this.moves });
        }
    }

    public get state() {
        return { moves: this.moves, isWon: this.isWonValue };
    }
}
