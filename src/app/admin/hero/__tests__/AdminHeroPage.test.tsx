// Stub socket usage in tests to avoid open handles/retries
jest.mock('@/hooks/useSocket', () => ({ __esModule: true, default: () => null }));
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Providers from '@/providers/Providers';
import AdminHeroPage from '../page';
import { setHeroSlides } from '@/../tests/msw/server';

// Эти тесты проверяют базовые сценарии: рендер, лимит 3, удаление

describe('AdminHeroPage', () => {
  it('показывает текущее количество слайдов и запрещает добавление при 3', async () => {
    setHeroSlides([
      {
        id: 's1',
        title: 'A',
        subtitle: '',
        img: '/1.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 's2',
        title: 'B',
        subtitle: '',
        img: '/2.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 's3',
        title: 'C',
        subtitle: '',
        img: '/3.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    render(
      <Providers>
        <AdminHeroPage />
      </Providers>
    );

    expect(await screen.findByText(/Максимум 3 слайда. Сейчас: 3\./i)).toBeInTheDocument();

    const addBtn = screen.getByRole('button', { name: /Добавить слайд/i });
    expect(addBtn).toBeDisabled();
    expect(addBtn).toHaveAttribute('title', 'Достигнут лимит 3 слайда');
  });

  it('удаляет слайд', async () => {
    // 2 слайда, чтобы кнопка добавления была активна — но тут проверим удаление
    setHeroSlides([
      {
        id: 's1',
        title: 'A',
        subtitle: 'sub',
        img: '/1.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 's2',
        title: 'B',
        subtitle: 'sub',
        img: '/2.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    // mock window.confirm => true
    const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);

    render(
      <Providers>
        <AdminHeroPage />
      </Providers>
    );

    // Найдём карточку второго слайда и нажмём Удалить
    const deleteButtons = await screen.findAllByRole('button', { name: /Удалить/i });
    expect(deleteButtons.length).toBeGreaterThan(0);

    // Кликаем по кнопке удаления второго слайда ("B")
    fireEvent.click(deleteButtons[1]);

    // UI должен обновиться — один из заголовков исчезнет
    await waitFor(() => {
      expect(screen.queryByText('B')).not.toBeInTheDocument();
    });

    confirmSpy.mockRestore();
  });
});
