import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import React from 'react';

import type { AdminRole } from "@/types/admin";

// Simplified column type used in mocks
interface Column {
  field: string;
  renderCell?: (params: { id: string; row: AdminRole }) => ReactNode;
}

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

// Bypass RBAC in tests
jest.mock('@/components/RBAC/RequirePermission', () => ({
  __esModule: true,
  default: (props: { children: React.ReactNode }) => <>{props.children}</>,
}));



// ---- imports after mocks ----
import AdminRolesPage from "../page";


// ---- tests ----

jest.setTimeout(15000);

afterEach(() => jest.clearAllMocks());

describe("AdminRolesPage", () => {
  
  it("renders roles and handles delete", async () => {
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
    // confirm in dialog
    await user.click(screen.getByRole("button", { name: /удалить/i }));
    await waitFor(() => expect(screen.queryByText("Role1")).not.toBeInTheDocument(), { timeout: 15000 });
  });

  it("adds a role", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <AdminRolesPage />
      </Provider>,
    );

    await user.click(screen.getByTestId("create-action"));
    // fill name field
    await user.type(screen.getByLabelText(/название/i), "NewRole");
    await user.click(screen.getByRole("button", { name: /создать/i }));
    expect(await screen.findByText("NewRole")).toBeInTheDocument();
  });
});
