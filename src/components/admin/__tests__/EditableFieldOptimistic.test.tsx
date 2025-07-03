import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditableField from "../EditableField";

// mock auth hook so component thinks we are admin
jest.mock("@/context/AuthContext", () => ({
  useIsAdmin: () => true,
}));

// mock useLocalSnackbar to render nothing (avoid MUI internals)
jest.mock("@/hooks/useLocalSnackbar", () => {
  return jest.fn(() => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
    snackbar: null,
  }));
});

describe("EditableField optimistic UI", () => {
  it("shows optimistic value and keeps it on success", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn(() => Promise.resolve());
    render(<EditableField value="Old" onSave={onSave} />);

    // open edit mode
    await user.click(screen.getByRole("button", { name: /редактировать/i }));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "New");

    // save
    await user.click(screen.getByRole("button", { name: /сохранить/i }));

    // optimistic update: new value visible (use waitFor to account for async state flip)
    await waitFor(() => expect(screen.getByText("New")).toBeInTheDocument());
    expect(onSave).toHaveBeenCalledWith("New");
  });

  it("rolls back on error", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn(() => Promise.reject(new Error("fail")));
    render(<EditableField value="Start" onSave={onSave} />);

    // open edit mode
    await user.click(screen.getByRole("button", { name: /редактировать/i }));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "Temp");

    // save (will error)
    await user.click(screen.getByRole("button", { name: /сохранить/i }));

    // optimistic value first
    await waitFor(() => expect(screen.getByText("Temp")).toBeInTheDocument());

    // rollback
    await waitFor(() => expect(screen.getByText("Start")).toBeInTheDocument());
  });
});
