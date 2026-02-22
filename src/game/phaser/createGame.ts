/** Arrow Escape - Phaser Game Factory (Responsive) */

import Phaser from 'phaser';
import { ArrowEscapeScene } from './ArrowEscapeScene';
import type { LevelDefinition } from '../types';

/**
 * Phaser game instance oluştur (responsive).
 * @param domParent DOM elementi (Phaser canvas'ı buraya yerleşir)
 * @param level Level tanımı
 */
export interface CreateGameResult {
    game: Phaser.Game;
    renderer: 'webgl' | 'canvas';
}

export type PhaserGame = Phaser.Game; // Legacy compatibility

export function createArrowEscapeGame(
    domParent: HTMLElement,
    level: LevelDefinition
): CreateGameResult {
    const parentWidth = domParent.clientWidth || 360;
    const parentHeight = domParent.clientHeight || 640;

    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: domParent,
        width: parentWidth,
        height: parentHeight,
        backgroundColor: '#1a1f36',
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: ArrowEscapeScene,
    };

    let game: Phaser.Game;
    try {
        game = new Phaser.Game(config);
    } catch (e) {
        // WebGL failed, fallback to Canvas
        console.warn('WebGL not supported, falling back to Canvas', e);
        config.type = Phaser.CANVAS;
        game = new Phaser.Game(config);
    }

    // Level'ı scene'e geçir
    game.scene.start('ArrowEscape', { level });

    // Detect renderer type (immediate fallback if events not ready)
    const detectedRenderer = game.renderer?.type === Phaser.WEBGL ? 'webgl' : 'canvas';

    return { game, renderer: detectedRenderer };
}
