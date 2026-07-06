import type { Board, CellColor } from '../types';

const emojiPool = ['☕️', '🌞', '🎵', '🧁', '📚', '🌈', '🎨', '🧠', '🍋', '🛋️', '🏖️', '✈️', '🌿', '⚡️', '🪴', '🍓', '🎲', '📷', '🧩', '🌙', '🧺', '🧪', '🎧', '💡'];

const labels = [
  'Morning Brew',
  'Sunny Walk',
  'Studio Session',
  'Treat Break',
  'Reading Time',
  'Color Pop',
  'Creative Flow',
  'Brain Break',
  'Fresh Start',
  'Cozy Corner',
  'Beach Day',
  'Adventure Time',
  'Garden Glow',
  'Spark Moment',
  'Plant Care',
  'Berry Snack',
  'Game Night',
  'Photo Hunt',
  'Puzzle Hour',
  'Moonlight',
  'Organizer Reset',
  'DIY Lab',
  'Music Break',
  'Bright Idea',
];

const palette: CellColor[] = ['#D1D161', '#FF7D59', '#FDBFE8', '#FFDD93', '#99B0ED'];

export function createSeedBoard(month: string, colorLayout: (CellColor | null)[]): Board {
  const colorValues = colorLayout.filter((_, index) => index !== 12) as CellColor[];
  const items = labels.slice(0, 24).map((label, index) => ({
    id: `${month}-${index}`,
    label,
    emoji: emojiPool[index % emojiPool.length],
    colorVariant: colorValues[index] ?? '#D1D161',
    completed: false,
  }));

  return {
    id: `${month.toLowerCase()}-${Date.now()}`,
    month,
    createdAt: new Date().toISOString(),
    items,
    freeSpaceLabel: 'Free Space',
    celebratedLines: [],
    fullHouseCelebrated: false,
  };
}

export function getDefaultPalette(): CellColor[] {
  return [...palette];
}
