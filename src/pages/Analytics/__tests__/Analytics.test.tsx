import '@testing-library/jest-dom';
import { vi, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileInput from '../FileInput';
import * as uploading from '../uploading';
import type { ProcessingResult } from '../../History/historyStore';
import Highlights from '../Highlights';
import { mockProcessingResults } from './mocks';

const createMockStore = () => ({
  file: null as File | null,
  name: null as string | null,
  status: null as 'selected' | 'processing' | 'completed' | 'error' | null,
  error: null as string | null,
  rows: 1000,
  result: null as ProcessingResult | null,
  setFile: vi.fn(),
  setStatus: vi.fn(),
  setError: vi.fn(),
  setResult: vi.fn(),
  clearFile: vi.fn(),
});

describe('CSV Аналитик', () => {
  it('если выбрать файл через кнопку, то он отправляется в store', async () => {
    const user = userEvent.setup();
    const mockStore = createMockStore();

    vi.spyOn(uploading, 'useCurrentFileStore').mockReturnValue(mockStore);

    render(<FileInput />);
    const fileInput = screen.getByLabelText('Загрузить файл');
    expect(fileInput).toBeInTheDocument();

    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });
    await user.upload(fileInput, file);

    expect(mockStore.setFile).toHaveBeenCalledWith(file);
  });


  it('если выбрать файл через drag&drop, то он отправляется в store', async () => {
    const mockStore = createMockStore();

    vi.spyOn(uploading, 'useCurrentFileStore').mockReturnValue(mockStore);

    render(<FileInput />);
    const dropZone = screen.getByText('или перетащите сюда').parentElement!;
    expect(dropZone).toBeInTheDocument();

    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });
    const data = {
      dataTransfer: {
        files: [file],
        items: [],
        types: ['Files'],
      },
    };

    fireEvent.dragEnter(dropZone, data);
    fireEvent.dragOver(dropZone, data);
    fireEvent.drop(dropZone, data);

    expect(mockStore.setFile).toHaveBeenCalledWith(file);
  });


  it('если файл в статусе processing, то отображается индикатор загрузки', () => {
    const mockStore = createMockStore();
    mockStore.status = 'processing';

    vi.spyOn(uploading, 'useCurrentFileStore').mockReturnValue(mockStore);

    render(<FileInput />);

    const spinner = screen.getByAltText('spinner');
    expect(spinner).toBeInTheDocument();
  });


  it('отображаются результаты обработки, если они есть', () => {

    const mockStore = createMockStore();
    mockStore.status = 'completed';
    mockStore.result = mockProcessingResults[0];
    vi.spyOn(uploading, 'useCurrentFileStore').mockReturnValue(mockStore);

    render(<Highlights />);

    expect(screen.getByText('TestCiv2')).toBeInTheDocument();
  });
});
