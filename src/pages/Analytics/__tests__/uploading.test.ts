import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from 'react';

const mockAddHistoryItem = vi.fn();

vi.mock('../../History/historyStore', () => ({
  useHistoryStore: {
    getState: vi.fn(() => ({
      addHistoryItem: mockAddHistoryItem,
    })),
  },
}));

import { useCurrentFileStore, uploadFile } from '../uploading';
import {
  mockNetworkErrorFetch,
  mockHttpErrorFetch,
  mockMultipleResultsFetch,
  mockProcessingResults,
} from './mocks';


describe('Загрузка файла', () => {
  beforeEach(() => {
    useCurrentFileStore.getState().clearFile();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('setFile обновляет состояние стора', () => {
    const store = useCurrentFileStore.getState();

    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });
    act(() => {
      store.setFile(file);
    });

    const updatedStore = useCurrentFileStore.getState();

    expect(updatedStore.file).toBe(file);
    expect(updatedStore.name).toBe('test.csv');
    expect(updatedStore.status).toBe('selected');
  });


  it('uploadFile отражает частичные и финальный результаты в store', async () => {
    const store = useCurrentFileStore.getState();
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });

    const setResultSpy = vi.spyOn(store, 'setResult');
    const setStatusSpy = vi.spyOn(store, 'setStatus');

    const mockFetch = mockMultipleResultsFetch();

    await act(async () => {
      await uploadFile(file, store);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/aggregate?rows=1000',
      {
        method: 'POST',
        body: expect.any(FormData),
      }
    );

    expect(setStatusSpy).toHaveBeenCalledTimes(2);
    expect(setStatusSpy).toHaveBeenNthCalledWith(1, 'processing');
    expect(setStatusSpy).toHaveBeenNthCalledWith(2, 'completed');

    expect(setResultSpy).toHaveBeenCalledTimes(2);
    expect(setResultSpy).toHaveBeenNthCalledWith(1, mockProcessingResults[0]);
    expect(setResultSpy).toHaveBeenNthCalledWith(2, mockProcessingResults[1]);

    const updatedStore = useCurrentFileStore.getState();
    expect(updatedStore.status).toBe('completed');
    expect(updatedStore.result).toEqual(mockProcessingResults[1]);
  });


  it('uploadFile обрабатывает ошибку сети', async () => {
    const store = useCurrentFileStore.getState();
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });

    mockNetworkErrorFetch();

    await act(async () => {
      await uploadFile(file, store);
    });

    const updatedStore = useCurrentFileStore.getState();

    expect(updatedStore.status).toBe('error');
    expect(updatedStore.result).toBeNull();
  });


  it('uploadFile обрабатывает HTTP ошибку', async () => {
    const store = useCurrentFileStore.getState();
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });

    mockHttpErrorFetch(400, 'Bad Request');

    await act(async () => {
      await uploadFile(file, store);
    });

    const updatedStore = useCurrentFileStore.getState();

    expect(updatedStore.status).toBe('error');
    expect(updatedStore.result).toBeNull();
  });


  it('uploadFile отправляет положительный результат в историю', async () => {
    const store = useCurrentFileStore.getState();
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });

    mockMultipleResultsFetch();

    await act(async () => {
      await uploadFile(file, store);
    });

    expect(mockAddHistoryItem).toHaveBeenCalledWith(
      file.name,
      true,
      mockProcessingResults[1],
    );
  });

  it('uploadFile отправляет неудачный результат в историю при ошибке сети', async () => {
    const store = useCurrentFileStore.getState();
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });

    mockNetworkErrorFetch();

    await act(async () => {
      await uploadFile(file, store);
    });

    expect(mockAddHistoryItem).toHaveBeenCalledWith(
      file.name,
      false,
      null,
    );
  });

  it('uploadFile отправляет неудачный результат в историю при HTTP ошибке', async () => {
    const store = useCurrentFileStore.getState();
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });

    mockHttpErrorFetch(400, 'Bad Request');

    await act(async () => {
      await uploadFile(file, store);
    });

    expect(mockAddHistoryItem).toHaveBeenCalledWith(
      file.name,
      false,
      null,
    );
  });
});