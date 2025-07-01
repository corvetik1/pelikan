import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import b2bCalculatorReducer, { setProduct, setQuantity } from '@/redux/b2bCalculatorSlice';
import { act } from '@testing-library/react';
import B2BCalculator from '../B2BCalculator';

// ---- mocks ----

jest.mock('@/redux/api', () => {
  const emptySplitApi = {
    reducerPath: 'api',
    reducer: () => ({}),
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  };
  return {
    emptySplitApi,
    useGetB2BPricesQuery: () => ({ data: [], isLoading: false }),
    useRequestQuoteMutation: () => [
      () => ({ unwrap: () => Promise.resolve({ url: 'https://example.com' }) }),
      { isLoading: false },
    ],
  };
});

const testStore = configureStore({ reducer: { b2bCalculator: b2bCalculatorReducer } });

function renderWithProvider() {
  return render(
    <Provider store={testStore}>
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
    await act(() => Promise.resolve(testStore.dispatch(setProduct('p3'))));
    await act(() => Promise.resolve(testStore.dispatch(setQuantity(2))));

    // total should be 1,398 (format may vary)
    await waitFor(() => {
      expect(screen.getByTestId('total-price').textContent).toMatch(/1.?398/);
    });

    // click button and expect alert
    await user.click(screen.getByRole('button', { name: /запросить/i }));
    expect(openMock).toHaveBeenCalled();

    openMock.mockRestore();
  });
});
