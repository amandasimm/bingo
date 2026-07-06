import type { BingoItem } from '../types';

interface BingoCellProps {
  item: BingoItem;
  isFreeSpace?: boolean;
  onToggle?: (id: string) => void;
  editable?: boolean;
  onLabelChange?: (id: string, label: string) => void;
  onEmojiChange?: (id: string, emoji: string) => void;
}

function hexToRgba(hex: string, opacity: number): string {
  const normalized = hex.replace('#', '');
  const resolved = normalized.length === 3 ? normalized.split('').map((char) => `${char}${char}`).join('') : normalized;
  const value = Number.parseInt(resolved, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function BingoCell({
  item,
  isFreeSpace = false,
  onToggle,
  editable = false,
  onLabelChange,
  onEmojiChange,
}: BingoCellProps) {
  const className = `bingo-cell${isFreeSpace ? ' free-space' : ''}${item.completed ? ' completed' : ''}`;
  const opacity = isFreeSpace ? 0.1 : item.completed ? 0.6 : 0.1;
  const background = isFreeSpace
    ? 'linear-gradient(0deg, rgba(73, 101, 175, 0.10) 0%, rgba(73, 101, 175, 0.10) 100%), #FFF'
    : `linear-gradient(0deg, ${hexToRgba(item.colorVariant, opacity)} 0%, ${hexToRgba(item.colorVariant, opacity)} 100%), #FFF`;
  const style = {
    borderColor: isFreeSpace ? '#4963AF' : item.colorVariant,
    background,
  };

  if (editable) {
    return (
      <div className={className} style={style}>
        <input
          className="cell-input emoji-input"
          value={item.emoji}
          onChange={(event) => onEmojiChange?.(item.id, event.target.value)}
          aria-label={`Emoji for ${item.label}`}
        />
        <input
          className="cell-input label-input"
          value={item.label}
          onChange={(event) => onLabelChange?.(item.id, event.target.value)}
          aria-label={`Label for ${item.label}`}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      onClick={() => {
        if (!isFreeSpace && onToggle) {
          onToggle(item.id);
        }
      }}
      disabled={isFreeSpace}
    >
      <span className="cell-emoji">{item.emoji}</span>
      <span className="cell-label">{item.label}</span>
    </button>
  );
}

export default BingoCell;
