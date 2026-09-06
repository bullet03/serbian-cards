import { useCallback, useEffect, useState } from 'react';
import type { AppData, Card } from './types';
import { emptyAppData } from './types';
import { seedCards } from './seedData';
import { loadFromLocalStorage, saveToLocalStorage } from './storage';
import StudyView from './components/StudyView';
import ManageView from './components/ManageView';
import AddCardView from './components/AddCardView';
import './App.css';

type View = 'study' | 'add' | 'manage';

function loadInitialData(): AppData {
  const stored = loadFromLocalStorage();
  return stored ?? { ...emptyAppData(), cards: seedCards() };
}

export default function App() {
  const [data, setData] = useState<AppData>(loadInitialData);
  const [view, setView] = useState<View>('study');

  useEffect(() => {
    saveToLocalStorage(data);
  }, [data]);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => updater(prev));
  }, []);

  const addCard = useCallback(
    (card: Card) => {
      updateData((prev) => ({ ...prev, cards: [...prev.cards, card] }));
    },
    [updateData],
  );

  const updateCard = useCallback(
    (updated: Card) => {
      updateData((prev) => ({
        ...prev,
        cards: prev.cards.map((c) => (c.id === updated.id ? updated : c)),
      }));
    },
    [updateData],
  );

  const deleteCard = useCallback(
    (id: string) => {
      updateData((prev) => ({ ...prev, cards: prev.cards.filter((c) => c.id !== id) }));
    },
    [updateData],
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Сербские карточки</h1>
        <nav className="tabs">
          <button className={view === 'study' ? 'active' : ''} onClick={() => setView('study')}>
            Учить
          </button>
          <button className={view === 'manage' ? 'active' : ''} onClick={() => setView('manage')}>
            Управление
          </button>
          <button className={view === 'add' ? 'active' : ''} onClick={() => setView('add')}>
            Добавить
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'study' && <StudyView cards={data.cards} onGrade={updateCard} />}
        {view === 'manage' && (
          <ManageView cards={data.cards} onUpdate={updateCard} onDelete={deleteCard} />
        )}
        {view === 'add' && <AddCardView onAdd={addCard} />}
      </main>
    </div>
  );
}
