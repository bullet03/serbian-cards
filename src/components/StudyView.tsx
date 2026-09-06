import { useMemo, useState } from 'react';
import type { Card } from '../types';
import { gradeCard, isDue } from '../srs';

interface Props {
  cards: Card[];
  onGrade: (card: Card) => void;
}

function computeQueue(cards: Card[]): string[] {
  return cards
    .filter((c) => isDue(c))
    .sort((a, b) => a.dueDate - b.dueDate)
    .map((c) => c.id);
}

function pluralCards(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'карточку';
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'карточки';
  return 'карточек';
}

export default function StudyView({ cards, onGrade }: Props) {
  const [queue, setQueue] = useState<string[]>(() => computeQueue(cards));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  const currentCard = useMemo(
    () => cards.find((c) => c.id === queue[index]),
    [cards, queue, index],
  );

  const remaining = queue.length - index;

  const restart = () => {
    setQueue(computeQueue(cards));
    setIndex(0);
    setFlipped(false);
    setSessionCount(0);
  };

  if (cards.length === 0) {
    return <div className="empty-state">Пока нет карточек. Добавьте их во вкладке «Добавить».</div>;
  }

  if (!currentCard) {
    return (
      <div className="session-done">
        <h2>Всё выучено на сегодня 🎉</h2>
        <p>Вы повторили {sessionCount} {pluralCards(sessionCount)} за эту сессию.</p>
        <button onClick={restart}>Проверить новые карточки</button>
      </div>
    );
  }

  const grade = (knew: boolean) => {
    onGrade(gradeCard(currentCard, knew));
    setSessionCount((n) => n + 1);
    setFlipped(false);

    setQueue((prev) => {
      if (knew) return prev;
      const arr = [...prev];
      const insertAt = Math.min(arr.length, index + 4);
      arr.splice(insertAt, 0, currentCard.id);
      return arr;
    });
    setIndex((i) => i + 1);
  };

  return (
    <div className="study-view">
      <div className="study-progress">К повторению: {remaining}</div>
      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="flashcard-face">
          <div className="flashcard-label">Сербский</div>
          <div className="flashcard-text">{currentCard.serbian}</div>
          {!flipped && <div className="flashcard-hint">Нажмите, чтобы увидеть перевод</div>}
        </div>
        {flipped && (
          <div className="flashcard-answer">
            <div className="flashcard-label">Русский</div>
            <div className="flashcard-text">{currentCard.russian}</div>
          </div>
        )}
      </div>

      {flipped && (
        <div className="grade-buttons">
          <button className="grade-again" onClick={() => grade(false)}>
            Не знал
          </button>
          <button className="grade-good" onClick={() => grade(true)}>
            Знал
          </button>
        </div>
      )}
    </div>
  );
}
