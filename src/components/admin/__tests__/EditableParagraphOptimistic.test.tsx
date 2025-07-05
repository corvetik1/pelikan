import { render, screen, waitFor } from "@testing-library/react";

// allow async state updates
jest.setTimeout(10000);
import userEvent from "@testing-library/user-event";
import EditableParagraph from "../EditableParagraph";

jest.mock("@/context/AuthContext", () => ({
  useIsAdmin: () => true,
}));

jest.mock("@/hooks/useLocalSnackbar", () => {
  return jest.fn(() => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
    snackbar: null,
  }));
});

describe("EditableParagraph optimistic UI", () => {
  it("optimistically updates and keeps value on success", async () => {
    const onSave = jest.fn(() => Promise.resolve());
    const user = userEvent.setup();
    render(<EditableParagraph value="Hello" onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /редактировать параграф/i }));
    const textbox = screen.getByRole("textbox");
    await user.clear(textbox);
    await user.type(textbox, "World");

    await user.click(screen.getByRole("button", { name: /сохранить параграф/i }));

    await waitFor(() => expect(screen.getByText("World")).toBeInTheDocument());
    expect(onSave).toHaveBeenCalledWith("World");
  });

  it("rolls back on error", async () => {
    const onSave = jest.fn(() => Promise.reject(new Error("fail")));
    const user = userEvent.setup();
    render(<EditableParagraph value="First" onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /редактировать параграф/i }));
    const textbox = screen.getByRole("textbox");
    await user.clear(textbox);
    await user.type(textbox, "Temp");

    await user.click(screen.getByRole("button", { name: /сохранить параграф/i }));

    await waitFor(() => expect(screen.getByText("Temp")).toBeInTheDocument());

    await waitFor(() => expect(screen.getByText("First")).toBeInTheDocument());
  });
});
