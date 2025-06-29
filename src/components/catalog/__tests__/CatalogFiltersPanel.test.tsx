import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import CatalogFiltersPanel from '../CatalogFiltersPanel';
import { resetFilters } from '@/redux/catalogFiltersSlice';

function renderWithProvider(ui: ReactElement) {
  return render(<Provider store={store}>{ui}</Provider>);
}

afterEach(() => {
  // сбрасываем глобальный store между тестами
  store.dispatch(resetFilters());
});

describe('CatalogFiltersPanel', () => {
  it('toggles view mode between grid and list', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CatalogFiltersPanel />);

    const button = screen.getByRole('button', { name: /Список/i });
    expect(store.getState().catalogFilters.viewMode).toBe('grid');

    await user.click(button);
    expect(store.getState().catalogFilters.viewMode).toBe('list');

    await user.click(button);
    expect(store.getState().catalogFilters.viewMode).toBe('grid');
  });

  it('toggles "Только новинки" checkbox', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CatalogFiltersPanel />);
    const checkbox = screen.getByLabelText(/Только новинки/i);
    expect(store.getState().catalogFilters.onlyNew).toBe(false);
    await user.click(checkbox);
    expect(store.getState().catalogFilters.onlyNew).toBe(true);
  });

  it('resets filters via button', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CatalogFiltersPanel />);

    // mutate some state first
    await user.click(screen.getByLabelText(/Только новинки/i));
    expect(store.getState().catalogFilters.onlyNew).toBe(true);

    // click reset button
    await user.click(screen.getByRole('button', { name: /Сбросить фильтры/i }));
    const { price, onlyNew } = store.getState().catalogFilters;
    expect(price.min).toBe(0);
    expect(price.max).toBe(0);
    expect(onlyNew).toBe(false);
  });

  it('adds option in "Обработка" filter on select', async () => {
    const user = userEvent.setup();
    renderWithProvider(<CatalogFiltersPanel />);

    // open the processing multiselect
    const select = screen.getByLabelText(/Обработка/i);
    await user.click(select);

    const option = await screen.findByRole('option', { name: 'fresh' });
    await user.click(option);
    await user.keyboard('{Escape}');

    expect(store.getState().catalogFilters.processing).toContain('fresh');
  });
});
