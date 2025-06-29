import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StoreFilters from '../StoreFilters';
import { stores } from '@/data/stores';

describe('StoreFilters', () => {
  it('calls onFilterChange with selected region and query', async () => {
    const user = userEvent.setup();
    const handle = jest.fn();

    render(<StoreFilters stores={stores} onFilterChange={handle} />);

    // select region
    const select = screen.getByLabelText('Регион');
    await user.click(select);
    const option = await screen.findByRole('option', { name: 'Санкт-Петербург' });
    await user.click(option);

    // search input
    const search = screen.getByLabelText('Поиск');
    await user.type(search, 'Океан');

    // expect last call matches
    expect(handle).toHaveBeenLastCalledWith('Санкт-Петербург', 'Океан');
  });
});
