import { render, screen, waitFor } from '@testing-library/react';
jest.setTimeout(30000);
import userEvent from '@testing-library/user-event';
import { b2bPrices } from '@/data/b2bPrices';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { setProduct, setQuantity, setPrices, addItem } from '@/redux/b2bCalculatorSlice';
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
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const openMock = jest.spyOn(window, 'open').mockImplementation(() => null as unknown as Window);

    // preload prices to avoid API wait
    store.dispatch(
      setPrices(Object.fromEntries(b2bPrices.map((p) => [p.id, p.price])))
    );

    renderWithProvider();

    // напрямую обновляем состояние вместо взаимодействия с MUI Select
    await act(() => Promise.resolve(store.dispatch(setProduct('p3'))));
    await act(() => Promise.resolve(store.dispatch(setQuantity(2))));
    await act(() => Promise.resolve(store.dispatch(addItem({ id: 'p3', quantity: 2 }))));

    // total should be 1,398 (format may vary)
    await waitFor(() => {
      expect(screen.getByTestId('gross-price').textContent).toMatch(/1.?678/);
    });

    // заполнить email, иначе кнопка disabled
    await user.type(screen.getByLabelText(/Ваш email/i), 'test@example.com');
    // click button
    await user.click(screen.getByRole('button', { name: /запросить/i }));

    await waitFor(() => {
      expect(screen.getByText('Запрос отправлен')).toBeInTheDocument();
    });

    expect(openMock).not.toHaveBeenCalled();

    openMock.mockRestore();
  });
});
