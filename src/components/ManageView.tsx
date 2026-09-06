import { useMemo, useState } from 'react';
import type { Card } from '../types';

interface Props {
  cards: Card[];
  onUpdate: (card: Card) => void;
  onDelete: (id: string) => void;
}

const TYPE_LABELS: Record<Card['type'], string> = {
  translation: 'перевод',
  description: 'описание',
};

export default function ManageView({ cards, onUpdate, onDelete }: Props) {
  const [query, setQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ serbian: string; russian: string }>({
    serbian: '',
    russian: '',
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? cards.filter(
          (c) => c.serbian.toLowerCase().includes(q) || c.russian.toLowerCase().includes(q),
        )
      : cards;
    return [...list].sort((a, b) => a.serbian.localeCompare(b.serbian));
  }, [cards, query]);

  const startEdit = (card: Card) => {
    setEditingId(card.id);
    setDraft({ serbian: card.serbian, russian: card.russian });
  };

  const saveEdit = (card: Card) => {
    onUpdate({
      ...card,
      serbian: draft.serbian.trim(),
      russian: draft.russian.trim(),
    });
    setEditingId(null);
  };

  return (
    <div className="manage-view">
      <input
        className="search-box"
        placeholder="Поиск карточек..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {cards.length === 0 && <div className="empty-state">Пока нет карточек.</div>}
      <table className="card-table">
        <thead>
          <tr>
            <th>Сербский</th>
            <th>Русский</th>
            <th>Тип</th>
            <th>Срок</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((card) => (
            <tr key={card.id}>
              {editingId === card.id ? (
                <>
                  <td>
                    <input
                      value={draft.serbian}
                      onChange={(e) => setDraft((d) => ({ ...d, serbian: e.target.value }))}
                    />
                  </td>
                  <td>
                    <input
                      value={draft.russian}
                      onChange={(e) => setDraft((d) => ({ ...d, russian: e.target.value }))}
                    />
                  </td>
                  <td>{TYPE_LABELS[card.type]}</td>
                  <td>{new Date(card.dueDate).toLocaleDateString('ru-RU')}</td>
                  <td className="row-actions">
                    <button onClick={() => saveEdit(card)}>Сохранить</button>
                    <button onClick={() => setEditingId(null)}>Отмена</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{card.serbian}</td>
                  <td>{card.russian}</td>
                  <td>{TYPE_LABELS[card.type]}</td>
                  <td>{new Date(card.dueDate).toLocaleDateString('ru-RU')}</td>
                  <td className="row-actions">
                    <button onClick={() => startEdit(card)}>Изменить</button>
                    <button onClick={() => onDelete(card.id)}>Удалить</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
