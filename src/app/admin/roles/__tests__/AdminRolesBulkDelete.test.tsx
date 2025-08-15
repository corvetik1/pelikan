import { screen, waitFor } from "@testing-library/react";
jest.setTimeout(60000);
import userEvent from "@testing-library/user-event";
import { renderWithProvider } from "../../../../../tests/testUtils";
import type { AdminRole } from "@/types/admin";
import type { ReactNode } from "react";
import React from 'react';

// Mock DataGrid to expose checkboxes
interface Column { field: string; renderCell?: (params: { id: string; row: AdminRole }) => ReactNode }

jest.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows, columns, onRowSelectionModelChange }: { rows: AdminRole[]; columns: Column[]; onRowSelectionModelChange?: (m: (string | number)[]) => void }) => (
    <div>
      {rows.map((row) => (
        <div key={row.id}>
          <input
            type="checkbox"
            aria-label={`select-${row.id}`}
            onChange={(e) => {
              if (onRowSelectionModelChange) {
                if (e.currentTarget.checked) onRowSelectionModelChange([row.id]);
                else onRowSelectionModelChange([]);
              }
            }}
          />
          {columns.map((c) => (c.field === "name" ? <span key={c.field}>{row.name}</span> : null))}
        </div>
      ))}
    </div>
  ),
}));

// Bypass RBAC checks so action buttons render
jest.mock('@/components/RBAC/RequirePermission', () => ({
  __esModule: true,
  default: (props: { children: React.ReactNode }) => <>{props.children}</>,
}));

import AdminRolesPage from "../page";

describe("AdminRolesPage bulk delete", () => {
  it("deletes selected rows", async () => {
    const user = userEvent.setup();
    renderWithProvider(<AdminRolesPage />);

    // Wait for data
    expect(await screen.findByText("Role1", undefined, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText("Role2")).toBeInTheDocument();

    // select first row
    await user.click(screen.getByLabelText("select-r1"));
    // ConfirmDialog handles confirmation – no window.confirm
    const bulkBtn = screen.getByTestId("bulk-delete-action");
    await waitFor(() => expect(bulkBtn).not.toBeDisabled());
    await user.click(bulkBtn);
    // confirm dialog
    await user.click(screen.getByRole("button", { name: /удалить/i }));

    // Role1 should disappear
    await waitFor(() => expect(screen.queryByText("Role1")).not.toBeInTheDocument());
  });
});
