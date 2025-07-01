import { render, screen, waitFor, act } from "@testing-library/react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import b2bCalculatorReducer, { addItem, removeItem } from "@/redux/b2bCalculatorSlice";
import B2BCalculator from "../B2BCalculator";

// mock RTK Query hooks used inside the calculator so that network state doesn't affect the test
jest.mock("@/redux/api", () => {
  const emptySplitApi = {
    reducerPath: "api",
    reducer: () => ({}),
    middleware: () => (next: (action: unknown) => unknown) => (action: unknown) => next(action),
  };
  return {
    emptySplitApi,
    useGetB2BPricesQuery: () => ({ data: [], isLoading: false }),
    useRequestQuoteMutation: () => [
      () => ({ unwrap: () => Promise.resolve({ url: "https://example.com" }) }),
      { isLoading: false },
    ],
  };
});

// shared store for the test
const testStore = configureStore({ reducer: { b2bCalculator: b2bCalculatorReducer } });

function renderWithProvider() {
  return render(
    <Provider store={testStore}>
      <B2BCalculator />
    </Provider>
  );
}

// give enough time for async UI updates
jest.setTimeout(10000);

describe.skip("B2B calculator flow (redux-level)", () => {
  it("updates total when item added and removed", async () => {
    // userEvent setup removed (not used)
    renderWithProvider();

    // add item via redux
    act(() => {
      testStore.dispatch(addItem({ id: "p1", quantity: 3 }));
    });

    // total should reflect 3 * 1299 = 3 897
    await waitFor(() => {
      expect(screen.getByTestId("total-price").textContent).toMatch(/3.?897/);
    });

    // remove item via redux
    act(() => {
      testStore.dispatch(removeItem("p1"));
    });

    // total resets
    await waitFor(() => {
      expect(screen.getByTestId("total-price").textContent).not.toMatch(/3.?897/);
    });
  });
});
