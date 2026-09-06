import { useState, type FormEvent } from 'react';
import type { Card, CardType } from '../types';
import { newCard } from '../srs';

interface Props {
  onAdd: (card: Card) => void;
}

export default function AddCardView({ onAdd }: Props) {
  const [serbian, setSerbian] = useState('');
  const [russian, setRussian] = useState('');
  const [type, setType] = useState<CardType>('translation');
  const [justAdded, setJustAdded] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!serbian.trim() || !russian.trim()) return;
    onAdd(newCard({ serbian: serbian.trim(), russian: russian.trim(), type }));
    setSerbian('');
    setRussian('');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <form className="add-card-form" onSubmit={submit}>
      <label>
        Сербское слово
        <input value={serbian} onChange={(e) => setSerbian(e.target.value)} autoFocus />
      </label>
      <label>
        {type === 'translation' ? 'Перевод на русский' : 'Описание на русском'}
        <input value={russian} onChange={(e) => setRussian(e.target.value)} />
      </label>
      <fieldset>
        <legend>Тип карточки</legend>
        <label className="radio">
          <input
            type="radio"
            checked={type === 'translation'}
            onChange={() => setType('translation')}
          />
          Перевод
        </label>
        <label className="radio">
          <input
            type="radio"
            checked={type === 'description'}
            onChange={() => setType('description')}
          />
          Описание
        </label>
      </fieldset>
      <button type="submit">Добавить карточку</button>
      {justAdded && <span className="added-confirm">Добавлено ✓</span>}
    </form>
  );
}
