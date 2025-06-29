import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';

describe('Навигация', () => {
  it('отображает три ссылки', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    expect(screen.getByText('CSV Аналитик')).toBeInTheDocument();
    expect(screen.getByText('CSV Генератор')).toBeInTheDocument();
    expect(screen.getByText('История')).toBeInTheDocument();
  });


  it('переходит на правильную страницу при нажатии на ссылку', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );
    const analyticsLink = screen.getByText('CSV Аналитик');
    const generateLink = screen.getByText('CSV Генератор');
    const historyLink = screen.getByText('История');

    expect(analyticsLink.closest('a')).toHaveAttribute('href', '/');
    expect(generateLink.closest('a')).toHaveAttribute('href', '/generate');
    expect(historyLink.closest('a')).toHaveAttribute('href', '/history');
  });
});