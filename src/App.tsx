import { useCallback, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import type { AppData, Card } from './types';
import { emptyAppData } from './types';
import { seedCards } from './seedData';
import { loadFromCloud, saveToCloud } from './storage';
import { auth } from './firebase';
import LoginView from './components/LoginView';
import StudyView from './components/StudyView';
import ManageView from './components/ManageView';
import AddCardView from './components/AddCardView';
import './App.css';

type View = 'study' | 'add' | 'manage';

export default function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [data, setData] = useState<AppData | undefined>(undefined);
  const [view, setView] = useState<View>('study');

  const loadStartedRef = useRef(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setData(undefined);
      loadStartedRef.current = false;
      loadedRef.current = false;
    });
  }, []);

  useEffect(() => {
    if (!user || loadStartedRef.current) return;
    loadStartedRef.current = true;
    (async () => {
      const stored = await loadFromCloud(user.uid);
      const initial = stored ?? { ...emptyAppData(), cards: seedCards() };
      setData(initial);
      loadedRef.current = true;
    })();
  }, [user]);

  useEffect(() => {
    if (!user || !data || !loadedRef.current) return;
    saveToCloud(user.uid, data);
  }, [data, user]);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => (prev ? updater(prev) : prev));
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

  if (user === undefined) {
    return <div className="empty-state">Загрузка...</div>;
  }

  if (user === null) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Сербские карточки</h1>
        </header>
        <main className="app-main">
          <LoginView />
        </main>
      </div>
    );
  }

  if (!data) {
    return <div className="empty-state">Загрузка...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <h1>Сербские карточки</h1>
          <button className="sign-out" onClick={() => signOut(auth)}>
            Выйти
          </button>
        </div>
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
