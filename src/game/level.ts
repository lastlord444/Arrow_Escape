/** Arrow Escape - Level Parser */

import type { LevelDefinition, GridCell } from './types';
import { charToCell, cellToChar } from './types';
import { GRID_SIZE } from './grid';

export { cellToChar };

/**
 * LevelDefinition'dan GridCell[][] oluştur.
 * Doğrulama kuralları:
 * - Grid tam 6 satır ve her satır 6 karakter olmalı
 * - En az 1 animal (A) olmalı
 * - En az 1 exit (E) olmalı
 * - Birden fazla A veya E olamaz (MVP0)
 */
export function parseLevel(levelDef: LevelDefinition): GridCell[][] {
    const { grid: rows } = levelDef;

    // Satır sayısı kontrolü
    if (rows.length !== GRID_SIZE) {
        throw new Error(
            `Level "${levelDef.id}": Grid ${GRID_SIZE} satır olmalı, ${rows.length} satır verildi.`
        );
    }

    // Her satır 6 karakter mi?
    for (let r = 0; r < GRID_SIZE; r++) {
        if (rows[r].length !== GRID_SIZE) {
            throw new Error(
                `Level "${levelDef.id}": Satır ${r} tam ${GRID_SIZE} karakter olmalı, ${rows[r].length} karakter verildi.`
            );
        }
    }

    // Parse et
    const grid: GridCell[][] = rows.map(row =>
        row.split('').map(ch => charToCell(ch))
    );

    // Animal ve Exit sayısı kontrolü
    let animalCount = 0;
    let exitCount = 0;

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c].type === 'animal') animalCount++;
            if (grid[r][c].type === 'exit') exitCount++;
        }
    }

    if (animalCount === 0) {
        throw new Error(`Level "${levelDef.id}": En az 1 animal (A) olmalı.`);
    }
    if (exitCount === 0) {
        throw new Error(`Level "${levelDef.id}": En az 1 exit (E) olmalı.`);
    }
    if (animalCount > 1) {
        throw new Error(`Level "${levelDef.id}": Birden fazla animal (A) olamaz. Bulunan: ${animalCount}`);
    }
    if (exitCount > 1) {
        throw new Error(`Level "${levelDef.id}": Birden fazla exit (E) olamaz. Bulunan: ${exitCount}`);
    }

    return grid;
}
