import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

import type { AdminRole } from "@/types/admin";

// Simplified column type used in mocks
interface Column {
  field: string;
  renderCell?: (params: { id: string; row: AdminRole }) => ReactNode;
}

const sample: AdminRole[] = [
  { id: "r1", name: "Role1", description: "desc", permissions: ["read"] },
  { id: "r2", name: "Role2", description: "desc2", permissions: ["write"] },
];

// ---- mocks ----

// Simplify DataGrid UI for test reliability
jest.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ columns, rows, checkboxSelection }: { columns: Column[]; rows: AdminRole[]; checkboxSelection: boolean }) => (
    <div data-testid="grid" data-selection={checkboxSelection ? "on" : "off"}>
      {rows.map((row) => (
        <div key={row.id}>
          {columns
            .filter((c) => c.field === "actions")
            .map((c) => (
              <span key={c.field}>{c.renderCell?.({ id: row.id, row })}</span>
            ))}
          <span>{row.name}</span>
        </div>
      ))}
    </div>
  ),
}));



// ---- imports after mocks ----
import AdminRolesPage from "../page";
import { waitForRequest } from "../../../../../tests/msw/server";

// ---- tests ----

jest.setTimeout(15000);

afterEach(() => jest.clearAllMocks());

describe("AdminRolesPage", () => {
  
  it("renders roles and handles delete", async () => {
    jest.spyOn(window, "confirm").mockReturnValueOnce(true);

    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <AdminRolesPage />
      </Provider>,
    );

    // wait until data is loaded from MSW
    expect(await screen.findByText("Role1")).toBeInTheDocument();

    // Click first delete button
    await user.click(screen.getAllByRole("button", { name: /delete/i })[0]);
    
    await waitFor(() => expect(screen.queryByText("Role1")).not.toBeInTheDocument(), { timeout: 15000 });
  });

  it("adds a role", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <AdminRolesPage />
      </Provider>,
    );

    await user.click(screen.getByTestId("add-role"));
    // fill name field
    await user.type(screen.getByLabelText(/название/i), "NewRole");
    await user.click(screen.getByRole("button", { name: /создать/i }));
    expect(await screen.findByText("NewRole")).toBeInTheDocument();
  });
});
