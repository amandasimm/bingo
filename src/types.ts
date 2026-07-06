export type CellColor = '#D1D161' | '#FF7D59' | '#FDBFE8' | '#FFDD93' | '#99B0ED';

export interface BingoItem {
  id: string;
  label: string;
  emoji: string;
  colorVariant: CellColor;
  completed: boolean;
}

export interface Board {
  id: string;
  month: string;
  createdAt: string;
  items: BingoItem[];
  freeSpaceLabel: string;
  celebratedLines?: string[];
  fullHouseCelebrated?: boolean;
}
