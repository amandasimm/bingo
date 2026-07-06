import { useEffect, useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
// @ts-ignore: CSS module declarations are handled outside this file
import './styles.css';
import BingoGrid from './components/BingoGrid';
import EditControls from './components/EditControls';
import MonthTabs from './components/MonthTabs';
import ProgressBar from './components/ProgressBar';
import { createSeedBoard, getDefaultPalette } from './data/seed';
import { loadActiveBoardId, loadBoards, saveActiveBoardId, saveBoards } from './storage';
import type { Board, CellColor } from './types';
import { assignBoardColors } from './utils/colorAssignment';
import { getCompletedCount, getCompletedLines } from './utils/bingoDetection';
import { shuffleItems } from './utils/shuffleItems';

type ColorGrid = (CellColor | null)[];

function buildBoardFromTemplate(sourceBoard: Board, month: string, colorGrid: ColorGrid): Board {
  const colorValues = colorGrid.filter((_, index) => index !== 12) as CellColor[];
  const baseItems = sourceBoard.items.map((item) => ({ label: item.label, emoji: item.emoji }));
  const shuffledItems = shuffleItems(baseItems).map((item, index) => ({
    id: `${month.toLowerCase()}-${index + 1}`,
    label: item.label,
    emoji: item.emoji,
    colorVariant: colorValues[index] ?? '#D1D161',
    completed: false,
  }));

  return {
    id: `${month.toLowerCase()}-${Date.now()}`,
    month,
    createdAt: new Date().toISOString(),
    items: shuffledItems,
    freeSpaceLabel: sourceBoard.freeSpaceLabel,
    celebratedLines: [],
    fullHouseCelebrated: false,
  };
}

function App() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [celebration, setCelebration] = useState<string | null>(null);

  const activeBoard = useMemo(() => boards.find((board) => board.id === activeBoardId) ?? null, [boards, activeBoardId]);

  useEffect(() => {
    const existingBoards = loadBoards();
    const activeId = loadActiveBoardId();

    if (existingBoards.length === 0) {
      const colors = assignBoardColors(getDefaultPalette());
      const initialBoard = createSeedBoard('July', colors);
      const nextBoards = [initialBoard];
      setBoards(nextBoards);
      setActiveBoardId(initialBoard.id);
      saveBoards(nextBoards);
      saveActiveBoardId(initialBoard.id);
      return;
    }

    setBoards(existingBoards);
    if (activeId) {
      setActiveBoardId(activeId);
    } else if (existingBoards[0]) {
      setActiveBoardId(existingBoards[0].id);
    }
  }, []);

  useEffect(() => {
    if (activeBoard) {
      saveBoards(boards);
      saveActiveBoardId(activeBoard.id);
    }
  }, [activeBoard, boards]);

  useEffect(() => {
    if (!celebration) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setCelebration(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [celebration]);

  const handleToggleItem = (id: string) => {
    if (!activeBoard) {
      return;
    }

    setBoards((currentBoards) =>
      currentBoards.map((board) => {
        if (board.id !== activeBoard.id) {
          return board;
        }

        const currentItem = board.items.find((item) => item.id === id);
        if (!currentItem) {
          return board;
        }

        const nextCompleted = !currentItem.completed;
        const nextItems = board.items.map((item) => (item.id === id ? { ...item, completed: nextCompleted } : item));
        const previousLines = getCompletedLines(board.items);
        const previousLineKeys = new Set(previousLines.map((line) => line.join('-')));
        const nextLines = getCompletedLines(nextItems);
        const nextLineKeys = new Set(nextLines.map((line) => line.join('-')));
        const newlyCompletedLines = [...nextLineKeys].filter(
          (lineKey) => !previousLineKeys.has(lineKey) && !(board.celebratedLines ?? []).includes(lineKey),
        );
        const completedCount = getCompletedCount(nextItems);
        const shouldCelebrateFullHouse = completedCount === 24 && !(board.fullHouseCelebrated ?? false);

        if (nextCompleted) {
          confetti({ particleCount: 24, spread: 40, origin: { y: 0.6 } });
        }

        if (newlyCompletedLines.length > 0) {
          confetti({ particleCount: 72, spread: 70, origin: { y: 0.2 } });
          setCelebration('Bingo!');
        }

        if (shouldCelebrateFullHouse) {
          confetti({ particleCount: 180, spread: 100, origin: { y: 0.2 }, ticks: 300 });
          setCelebration('Full House!');
        }

        return {
          ...board,
          items: nextItems,
          celebratedLines: [...(board.celebratedLines ?? []), ...newlyCompletedLines],
          fullHouseCelebrated: board.fullHouseCelebrated || shouldCelebrateFullHouse,
        };
      }),
    );
  };

  const handleLabelChange = (id: string, label: string) => {
    if (!activeBoard) {
      return;
    }

    setBoards((currentBoards) =>
      currentBoards.map((board) => {
        if (board.id !== activeBoard.id) {
          return board;
        }

        return {
          ...board,
          items: board.items.map((item) => (item.id === id ? { ...item, label } : item)),
        };
      }),
    );
  };

  const handleEmojiChange = (id: string, emoji: string) => {
    if (!activeBoard) {
      return;
    }

    setBoards((currentBoards) =>
      currentBoards.map((board) => {
        if (board.id !== activeBoard.id) {
          return board;
        }

        return {
          ...board,
          items: board.items.map((item) => (item.id === id ? { ...item, emoji } : item)),
        };
      }),
    );
  };

  const handleCreateBoard = () => {
    const monthLabel = window.prompt('Enter a month name', 'August');
    if (!monthLabel) {
      return;
    }

    const sourceBoard = boards[boards.length - 1] ?? activeBoard;
    if (!sourceBoard) {
      return;
    }

    const colorGrid = assignBoardColors(getDefaultPalette());
    const nextBoard = buildBoardFromTemplate(sourceBoard, monthLabel, colorGrid);
    const nextBoards = [...boards, nextBoard];

    setBoards(nextBoards);
    setActiveBoardId(nextBoard.id);
    saveBoards(nextBoards);
    saveActiveBoardId(nextBoard.id);
    setEditing(false);
  };

  const completedCount = activeBoard ? getCompletedCount(activeBoard.items) : 0;

  return (
    <div className="app-shell">
      <header className="app-header">
        <img src="/bingo-wordmark.png" alt="Bingo" className="wordmark" />
      </header>

      {celebration ? <div className="celebration-banner">{celebration}</div> : null}

      <section className="toolbar">
        <MonthTabs
          months={boards.map((board) => board.month)}
          activeMonth={activeBoard?.month ?? ''}
          onSelect={(month) => {
            const board = boards.find((entry) => entry.month === month);
            if (board) {
              setActiveBoardId(board.id);
            }
          }}
          onCreate={handleCreateBoard}
        />
        <EditControls editing={editing} onToggle={() => setEditing((value) => !value)} />
      </section>

      <ProgressBar completed={completedCount} total={24} />

      {activeBoard ? (
        <BingoGrid
          items={activeBoard.items}
          freeSpaceLabel={activeBoard.freeSpaceLabel}
          editable={editing}
          onToggle={handleToggleItem}
          onLabelChange={handleLabelChange}
          onEmojiChange={handleEmojiChange}
        />
      ) : null}
    </div>
  );
}

export default App;
