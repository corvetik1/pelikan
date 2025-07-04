import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import B2BCalculator from '../B2BCalculator';
import { rest } from 'msw';
import { server } from '../../../../tests/msw/server';
import { setProduct, setQuantity } from '@/redux/b2bCalculatorSlice';
import { act } from '@testing-library/react';

// Override the quote endpoint to simulate server error
beforeAll(() => {
  server.use(
    rest.post('*://*/api/b2b/quote', (_req, res, ctx) => {
      return res(ctx.status(500));
    }),
  );
});

describe('B2B calculator – quote error handling', () => {
  it('does not open new window or show success snackbar on 500 response', async () => {
    const user = userEvent.setup();
    const openMock = jest.spyOn(window, 'open').mockImplementation(() => null as unknown as Window);

    render(
      <Provider store={store}>
        <B2BCalculator />
      </Provider>,
    );

    // prefill state via redux actions for determinism
    await act(() => Promise.resolve(store.dispatch(setProduct('p1'))));
    await act(() => Promise.resolve(store.dispatch(setQuantity(1))));

    // click request quote
    await user.click(screen.getByRole('button', { name: /запросить/i }));

    // wait a bit for async mutation
    await waitFor(() => {
      // success snackbar should NOT appear
      expect(screen.queryByText('Коммерческое предложение готово')).toBeNull();
      // window.open should not be called
      expect(openMock).not.toHaveBeenCalled();
    });

    openMock.mockRestore();
  });
});
