import type { CellColor } from '../types';

export const DEFAULT_COLOR_PALETTE: CellColor[] = ['#D1D161', '#FF7D59', '#FDBFE8', '#FFDD93', '#99B0ED'];

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function assignBoardColors(palette: CellColor[] = DEFAULT_COLOR_PALETTE): (CellColor | null)[] {
  const grid: (CellColor | null)[] = Array(25).fill(null);
  const rowSets = Array.from({ length: 5 }, () => new Set<CellColor>());
  const colSets = Array.from({ length: 5 }, () => new Set<CellColor>());
  const positions = shuffleArray(Array.from({ length: 25 }, (_, index) => index).filter((index) => index !== 12));

  const placeColor = (index: number): boolean => {
    if (index === positions.length) {
      return true;
    }

    const position = positions[index];
    const row = Math.floor(position / 5);
    const col = position % 5;
    const availableColors = shuffleArray(
      palette.filter((color) => !rowSets[row].has(color) && !colSets[col].has(color)),
    );

    for (const color of availableColors) {
      rowSets[row].add(color);
      colSets[col].add(color);
      grid[position] = color;

      if (placeColor(index + 1)) {
        return true;
      }

      rowSets[row].delete(color);
      colSets[col].delete(color);
      grid[position] = null;
    }

    return false;
  };

  if (!placeColor(0)) {
    return assignBoardColors(palette);
  }

  grid[12] = null;
  return grid;
}
