import { newCard } from './srs';
import type { Card } from './types';

const SEED_WORDS: Array<[serbian: string, russian: string]> = [
  ['zdravo', 'привет'],
  ['dobar dan', 'добрый день'],
  ['hvala', 'спасибо'],
  ['molim', 'пожалуйста'],
  ['da', 'да'],
  ['ne', 'нет'],
  ['kako si', 'как дела'],
  ['dobro', 'хорошо'],
  ['voda', 'вода'],
  ['hleb', 'хлеб'],
  ['mleko', 'молоко'],
  ['jabuka', 'яблоко'],
  ['kuća', 'дом'],
  ['prijatelj', 'друг'],
  ['porodica', 'семья'],
  ['posao', 'работа'],
  ['škola', 'школа'],
  ['knjiga', 'книга'],
  ['vreme', 'время / погода'],
  ['ljubav', 'любовь'],
];

export function seedCards(): Card[] {
  return SEED_WORDS.map(([serbian, russian]) =>
    newCard({ serbian, russian, type: 'translation' }),
  );
}
