import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import type { ReactElement } from "react";

export const renderWithProvider = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};
