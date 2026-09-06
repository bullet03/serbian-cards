export type CardType = 'translation' | 'description';

export interface Card {
  id: string;
  serbian: string;
  russian: string;
  type: CardType;
  createdAt: number;
  box: number; // 1 (new) .. 5 (well known)
  dueDate: number; // timestamp, ms
}

export interface AppData {
  version: number;
  cards: Card[];
}

export function emptyAppData(): AppData {
  return { version: 2, cards: [] };
}
