import type { Card } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const MAX_BOX = 5;

// Days to wait before showing the card again, indexed by box number.
const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];

export function newCard(fields: Pick<Card, 'serbian' | 'russian' | 'type'>): Card {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    serbian: fields.serbian,
    russian: fields.russian,
    type: fields.type,
    createdAt: now,
    box: 1,
    dueDate: now,
  };
}

export function isDue(card: Card, now = Date.now()): boolean {
  return card.dueDate <= now;
}

export function gradeCard(card: Card, knew: boolean): Card {
  const now = Date.now();
  if (!knew) {
    return { ...card, box: 1, dueDate: now + 10 * MINUTE_MS };
  }
  const box = Math.min(MAX_BOX, card.box + 1);
  return { ...card, box, dueDate: now + BOX_INTERVAL_DAYS[box] * DAY_MS };
}
