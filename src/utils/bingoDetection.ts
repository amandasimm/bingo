import type { BingoItem } from '../types';

const LINES = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
] as const;

function getItemIndex(position: number): number {
  return position < 12 ? position : position - 1;
}

export function getCompletedLines(items: BingoItem[]): number[][] {
  return LINES.filter((line) => {
    return line.every((position) => {
      if (position === 12) {
        return true;
      }
      return items[getItemIndex(position)].completed;
    });
  }).map((line) => [...line]);
}

export function getCompletedCount(items: BingoItem[]): number {
  return items.filter((item) => item.completed).length;
}
