import { newCard } from './srs';
import type { Card } from './types';

const SEED_WORDS: Array<[serbian: string, russian: string]> = [
  ['umivati se', 'умываться'],
  ['obrisati', 'протереть'],
  ['udariti', 'ударить'],
  ['dosegnuti', 'дотянуться'],
  ['zevati', 'зевать'],
  ['kihnuti', 'чихнуть'],
  ['trepnuti', 'моргнуть'],
  ['protegnuti se', 'потянуться'],
  ['spotaknuti se', 'споткнуться'],
  ['uzdahnuti', 'вздохнуть'],
];

export function seedCards(): Card[] {
  return SEED_WORDS.map(([serbian, russian]) =>
    newCard({ serbian, russian, type: 'translation' }),
  );
}
