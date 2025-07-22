import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import type { GridColDef } from "@mui/x-data-grid";

import type { NewsCategory } from "@/types/admin";
import AdminNewsCategoriesPage from "../page";

// Simplify DataGrid rendering
type ActionColDef = GridColDef & {
  renderCell?: (params: { id: string; row: NewsCategory }) => ReactNode;
};

jest.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ columns, rows, checkboxSelection }: { columns: ActionColDef[]; rows: NewsCategory[]; checkboxSelection?: boolean }) => (
    <div data-testid="grid" data-selection={checkboxSelection ? "on" : "off"}>
      {rows.map((row) => (
        <div key={row.id}>
          {columns
            .filter((c) => c.field === "actions")
            .map((c) => (
              <span key={c.field}>{c.renderCell?.({ id: row.id, row })}</span>
            ))}
          <span>{row.title}</span>
        </div>
      ))}
    </div>
  ),
}));

// --- RTK Query hooks mocks ---
const sample: NewsCategory[] = [
  { id: "1", title: "Общее", slug: "general", createdAt: new Date().toISOString() },
  { id: "2", title: "Компания", slug: "company", createdAt: new Date().toISOString() },
];

const refetch = jest.fn();
const createCategory = jest.fn();
const updateCategory = jest.fn();
const deleteCategory = jest.fn();

jest.mock("@/redux/api", () => ({
  useGetAdminNewsCategoriesQuery: () => ({ data: sample, isLoading: false, isError: false, refetch }),
  useCreateNewsCategoryMutation: () => [createCategory],
  useUpdateNewsCategoryMutation: () => [updateCategory],
  useDeleteNewsCategoryMutation: () => [deleteCategory],
}));

// disable react-redux actual store usage (any dispatch used is internal, ok)
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

// --- tests ---

afterEach(() => jest.clearAllMocks());

describe("AdminNewsCategoriesPage", () => {
  it("renders categories and deletes selected", async () => {
    const user = userEvent.setup();
    render(<AdminNewsCategoriesPage />);

    expect(screen.getByText("Общее")).toBeInTheDocument();

    // click first delete button (actions cell mocked) - assume renderCell gives a button labelled delete
    await user.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    await user.click(screen.getByRole("button", { name: /удалить/i }));
    await waitFor(() => expect(deleteCategory).toHaveBeenCalled());
  });

  it("adds a new category", async () => {
    const user = userEvent.setup();
    render(<AdminNewsCategoriesPage />);

    await user.click(screen.getByTestId("add-category-btn"));
    await user.type(screen.getByLabelText(/название/i), "Акции");
    await user.click(screen.getByRole("button", { name: /создать/i }));

    expect(createCategory).toHaveBeenCalledWith({ title: "Акции" });
  });
});
