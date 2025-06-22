import { create } from 'zustand';
import { useHistoryStore } from '../History/historyStore';
import type { ProcessingResult } from '../History/historyStore';

interface CurrentFileState {
  file: File | null;
  name: string | null;
  status: 'selected' | 'processing' | 'completed' | 'error' | null;
  error: string | null;
  rows: number;
  result: ProcessingResult | null;

  setFile: (file: File) => void;
  setStatus: (
    status: 'selected' | 'processing' | 'completed' | 'error'
  ) => void;
  setError: (error: string | null) => void;
  setResult: (result: ProcessingResult | null) => void;
  clearFile: () => void;
}

export const useCurrentFileStore = create<CurrentFileState>(set => ({
  file: null,
  name: null,
  status: null,
  error: null,
  rows: 1000,
  result: null,

  setFile: file => set({ file, name: file.name, status: 'selected' }),
  setStatus: status => set({ status }),
  setError: error => set({ error }),
  setResult: result => set({ result }),
  clearFile: () =>
    set({ file: null, name: null, status: null, error: null, result: null }),
}));

export async function uploadFile(file: File, store: CurrentFileState) {
  store.setStatus('processing');

  const formData = new FormData();
  formData.append('file', file);

  const url = 'http://localhost:3000/aggregate?rows=' + store.rows;

  let response;
  try {
    response = await fetch(url, { method: 'POST', body: formData });
  } catch (e) {
    store.setStatus('error');
    useHistoryStore.getState().addHistoryItem(file.name, false, null);
    return;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    store.setStatus('error');
    useHistoryStore.getState().addHistoryItem(file.name, false, null);
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  const decoder = new TextDecoder();
  let buffer = '';

  for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
    buffer += decoder.decode(chunk, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        try {
          const result = JSON.parse(trimmedLine);
          store.setResult(result);
        } catch (e) {
          console.warn('Failed to parse JSON line:', trimmedLine, e);
        }
      }
    }
  }

  // Process any remaining data in buffer
  if (buffer.trim()) {
    try {
      const result = JSON.parse(buffer.trim());
      store.setResult(result);
    } catch (e) {
      console.warn('Failed to parse final buffer:', buffer);
    }
  }

  store.setStatus('completed');

  const result = useCurrentFileStore.getState().result;
  useHistoryStore.getState().addHistoryItem(file.name, true, result);
}
