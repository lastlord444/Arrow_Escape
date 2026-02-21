/** Rescue Cards - Album Content */

import card1 from './card-level-1.json';
import card2 from './card-level-2.json';
import card3 from './card-level-3.json';
import card4 from './card-level-4.json';
import card5 from './card-level-5.json';

export const RESCUE_CARDS = [card1, card2, card3, card4, card5] as const;

export type RescueCard = typeof RESCUE_CARDS[number];

export function getCardByLevelId(levelId: string): RescueCard | undefined {
    return RESCUE_CARDS.find(c => c.levelId === levelId);
}

export function getAllCards(): RescueCard[] {
    return [...RESCUE_CARDS];
}

export function getCardById(cardId: string): RescueCard | undefined {
    return RESCUE_CARDS.find(c => c.id === cardId);
}
