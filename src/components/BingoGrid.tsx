import type { BingoItem } from '../types';
import BingoCell from './BingoCell';

interface BingoGridProps {
  items: BingoItem[];
  freeSpaceLabel: string;
  editable?: boolean;
  onToggle?: (id: string) => void;
  onLabelChange?: (id: string, label: string) => void;
  onEmojiChange?: (id: string, emoji: string) => void;
}

function BingoGrid({
  items,
  freeSpaceLabel,
  editable = false,
  onToggle,
  onLabelChange,
  onEmojiChange,
}: BingoGridProps) {
  const displayItems = [...items];
  const freeSpaceItem: BingoItem = {
    id: 'free-space',
    label: freeSpaceLabel,
    emoji: '⭐️',
    colorVariant: '#99B0ED',
    completed: true,
  };

  return (
    <main className="board-grid" role="grid" aria-label="Bingo board">
      {Array.from({ length: 25 }).map((_, index) => {
        const item = index === 12 ? freeSpaceItem : displayItems.shift();
        if (!item) {
          return null;
        }
        return (
          <BingoCell
            key={item.id}
            item={item}
            isFreeSpace={index === 12}
            onToggle={onToggle}
            editable={editable}
            onLabelChange={onLabelChange}
            onEmojiChange={onEmojiChange}
          />
        );
      })}
    </main>
  );
}

export default BingoGrid;
