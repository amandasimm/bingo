import type { Board } from './types';

const BOARDS_STORAGE_KEY = 'bingo-boards';
const ACTIVE_BOARD_STORAGE_KEY = 'bingo-active-board-id';

export function loadBoards(): Board[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(BOARDS_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const boards = JSON.parse(stored) as Board[];
    return boards.map((board) => (board.month === 'June' ? { ...board, month: 'July' } : board));
  } catch {
    return [];
  }
}

export function saveBoards(boards: Board[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(boards));
}

export function loadActiveBoardId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(ACTIVE_BOARD_STORAGE_KEY);
}

export function saveActiveBoardId(id: string | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (id) {
    window.localStorage.setItem(ACTIVE_BOARD_STORAGE_KEY, id);
    return;
  }

  window.localStorage.removeItem(ACTIVE_BOARD_STORAGE_KEY);
}
