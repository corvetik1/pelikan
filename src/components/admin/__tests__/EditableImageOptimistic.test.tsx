import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditableImage from "../EditableImage";

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

// mock next/image for jest DOM
/* eslint-disable @next/next/no-img-element */
import React from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => <img alt={props.alt ?? ''} {...props} />,
}));

describe("EditableImage optimistic UI", () => {
  const defaultProps = {
    src: "old.jpg",
    alt: "img",
    width: 100,
    height: 100,
  } as const;

  it("updates optimistically and keeps value on success", async () => {
    const onSave = jest.fn(() => Promise.resolve());
    const user = userEvent.setup();
    render(<EditableImage {...defaultProps} onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /редактировать изображение/i }));
    const input = screen.getByRole("textbox", { name: /url изображения/i });
    await user.clear(input);
    await user.type(input, "new.jpg");

    await user.click(screen.getByRole("button", { name: /сохранить изображение/i }));

    await waitFor(() => expect(screen.getByRole("img", { name: /img/i })).toHaveAttribute("src", "new.jpg"));
    expect(onSave).toHaveBeenCalledWith("new.jpg");
  });

  it("rolls back on error", async () => {
    const onSave = jest.fn(() => Promise.reject(new Error("fail")));
    const user = userEvent.setup();
    render(<EditableImage {...defaultProps} onSave={onSave} />);

    await user.click(screen.getByRole("button", { name: /редактировать изображение/i }));
    const input = screen.getByRole("textbox", { name: /url изображения/i });
    await user.clear(input);
    await user.type(input, "temp.jpg");

    await user.click(screen.getByRole("button", { name: /сохранить изображение/i }));

    // optimistic
    await waitFor(() => expect(screen.getByRole("img", { name: /img/i })).toHaveAttribute("src", "temp.jpg"));

    // rollback
    await waitFor(() => expect(screen.getByRole("img", { name: /img/i })).toHaveAttribute("src", "old.jpg"));
  });
});
