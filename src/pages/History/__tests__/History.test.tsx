import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { type HistoryItem, useHistoryStore } from '../historyStore';
import History from '../History';


vi.mock('../historyStore', () => {
  const mockHistory: HistoryItem[] = [
    {
      id: '1',
      filename: 'test.csv',
      date: new Date('2024-06-01T12:00:00Z'),
      success: true,
      result: {
        total_spend_galactic: 1000,
        rows_affected: 10,
        less_spent_at: 100,
        big_spent_at: 1000,
        less_spent_value: 100,
        big_spent_value: 1000,
        average_spend_galactic: 100,
        big_spent_civ: 'TestCiv1',
        less_spent_civ: 'TestCiv2',
      },
    },
  ];

  const store = {
    history: mockHistory,
    addHistoryItem: vi.fn(),
    removeHistoryItem: vi.fn(),
    clearHistory: vi.fn(),
  };

  const useHistoryStore = (selector: any) => selector(store);
  useHistoryStore.getState = () => store;

  return { useHistoryStore };
});


describe('История', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('отображает запись из стора', () => {
    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );
    expect(screen.getByText('test.csv')).toBeInTheDocument();
    expect(screen.getByText(new Date('2024-06-01T12:00:00Z').toLocaleDateString())).toBeInTheDocument();
  });


  it('при нажатии на кнопку удаления вызывается removeHistoryItem', async () => {
    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );
    const deleteButton = screen.getByAltText('delete');
    await userEvent.click(deleteButton);
    expect(useHistoryStore.getState().removeHistoryItem).toHaveBeenCalledWith('1');
  });

  it('при нажатии на запись открывается модальное окно', async () => {
    render(
      <MemoryRouter>
        <History />
      </MemoryRouter>
    );

    const historyItem = screen.getByText('test.csv');
    await userEvent.click(historyItem);
    expect(await screen.findByText('TestCiv2')).toBeInTheDocument();
  });

  it('переходит на страницу генерации при нажатии на "Сгенерировать больше"', async () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <Routes>
          <Route path="/history" element={<History />} />
          <Route path="/generate" element={<div>Generate Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    const button = screen.getByText('Сгенерировать больше');
    await userEvent.click(button);

    expect(screen.getByText('Generate Page')).toBeInTheDocument();
  });
});
