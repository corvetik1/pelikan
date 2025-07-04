import { render, screen, waitFor } from '@testing-library/react';
import { b2bPrices } from '@/data/b2bPrices';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { setProduct, setQuantity } from '@/redux/b2bCalculatorSlice';
import { act } from '@testing-library/react';
import B2BCalculator from '../B2BCalculator';




function renderWithProvider() {
  return render(
    <Provider store={store}>
      <B2BCalculator />
    </Provider>
  );
}

describe('B2BCalculator', () => {
  it('calculates total price when product and quantity selected', async () => {
    const user = userEvent.setup();
    const openMock = jest.spyOn(window, 'open').mockImplementation(() => null as unknown as Window);

    renderWithProvider();

    // напрямую обновляем состояние вместо взаимодействия с MUI Select
    await act(() => Promise.resolve(store.dispatch(setProduct('p3'))));
    await act(() => Promise.resolve(store.dispatch(setQuantity(2))));

    // total should be 1,398 (format may vary)
    await waitFor(() => {
      expect(screen.getByTestId('gross-price').textContent).toMatch(/1.?678/);
    });

    // click button and expect alert
    await user.click(screen.getByRole('button', { name: /запросить/i }));
    expect(openMock).toHaveBeenCalled();

    openMock.mockRestore();
  });
});
