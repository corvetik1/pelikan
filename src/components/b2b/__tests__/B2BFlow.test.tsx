import { render, screen, waitFor, act } from "@testing-library/react";

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { addItem, removeItem, setPrices } from '@/redux/b2bCalculatorSlice';
import { b2bPrices } from '@/data/b2bPrices';
import B2BCalculator from "../B2BCalculator";




function renderWithProvider() {
  return render(
    <Provider store={store}>
      <B2BCalculator />
    </Provider>
  );
}

// preload prices to avoid async fetch
store.dispatch(setPrices(Object.fromEntries(b2bPrices.map(p=>[p.id,p.price]))));
// give enough time for async UI updates
jest.setTimeout(10000);

describe("B2B calculator flow (redux-level)", () => {
  it("updates total when item added and removed", async () => {
    // userEvent setup removed (not used)
    renderWithProvider();

    // add item via redux
    act(() => {
      store.dispatch(addItem({ id: "p1", quantity: 3 }));
    });

    // total should reflect 3 * 1299 = 3 897
    await waitFor(() => {
      expect(screen.getByTestId("gross-price").textContent).toMatch(/4.?676/);
    });

    // remove item via redux
    act(() => {
      store.dispatch(removeItem("p1"));
    });

    // total resets
    await waitFor(() => {
      expect(screen.getByTestId("gross-price").textContent).not.toMatch(/4.?676/);
    });
  });
});
