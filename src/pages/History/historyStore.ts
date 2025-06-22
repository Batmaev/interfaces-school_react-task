import { create } from 'zustand';

export interface ProcessingResult {
  total_spend_galactic: number;
  rows_affected: number;
  less_spent_at: number;
  big_spent_at: number;
  less_spent_value: number;
  big_spent_value: number;
  average_spend_galactic: number;
  big_spent_civ: string;
  less_spent_civ: string;
}

export interface HistoryItem {
  id: string;
  filename: string;
  date: Date;
  success: boolean;
  result: ProcessingResult | null;
}

export interface HistoryStore {
  history: HistoryItem[];
  addHistoryItem: (
    filename: string,
    success: boolean,
    result: ProcessingResult | null
  ) => void;
  removeHistoryItem: (id: string) => void;
  clearHistory: () => void;
}

const loadHistoryFromStorage = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem('file-history');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((item: any) => ({
        ...item,
        date: new Date(item.date),
      }));
    }
  } catch (error) {
    console.error('Failed to load history from localStorage:', error);
  }
  return [];
};

const saveHistoryToStorage = (history: HistoryItem[]) => {
  try {
    localStorage.setItem('file-history', JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history to localStorage:', error);
  }
};

function generateId() {
  return Date.now().toString() + Math.random().toString(36);
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: loadHistoryFromStorage(),

  addHistoryItem: (
    filename: string,
    success: boolean,
    result: ProcessingResult | null
  ) => {
    const newItem: HistoryItem = {
      id: generateId(),
      filename,
      date: new Date(),
      success,
      result,
    };
    const newHistory = [...get().history, newItem];
    set({ history: newHistory });
    saveHistoryToStorage(newHistory);
  },

  removeHistoryItem: (id: string) => {
    const newHistory = get().history.filter(item => item.id !== id);
    set({ history: newHistory });
    saveHistoryToStorage(newHistory);
  },

  clearHistory: () => {
    set({ history: [] });
    saveHistoryToStorage([]);
  },
}));
