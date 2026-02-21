/** Arrow Escape - Phaser Game Factory */

import Phaser from 'phaser';
import { ArrowEscapeScene } from './ArrowEscapeScene';
import type { LevelDefinition } from '../types';

/**
 * Phaser game instance oluştur.
 * @param domParent DOM elementi (Phaser canvas'ı buraya yerleşir)
 * @param level Level tanımı
 */
export function createArrowEscapeGame(
    domParent: HTMLElement,
    level: LevelDefinition
): Phaser.Game {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: domParent,
        width: 360,
        height: 400,
        backgroundColor: '#e0e0e0',
        scene: ArrowEscapeScene,
    };

    const game = new Phaser.Game(config);

    // Level'ı scene'e geçir
    game.scene.start('ArrowEscape', { level });

    return game;
}
