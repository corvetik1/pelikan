import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { AdminUser } from '@/types/admin';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

// ---------- mocks helpers -------------

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows = [], columns = [] }: { rows: AdminUser[]; columns: GridColDef[] }) => (
    <div data-testid="grid">
      {rows.map((row: AdminUser) => (
        <div key={row.id}>
          {columns.map((col: GridColDef) =>
            col.renderCell ? (
              <div key={String(col.field)}>{col.renderCell({ id: row.id, row } as unknown as GridRenderCellParams)}</div>
            ) : null
          )}
        </div>
      ))}
    </div>
  ),
}));

// mock redux module
const mockUseGet = jest.fn();
const mockDelete = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();

jest.mock('@/redux/adminApi', () => ({
  useGetAdminUsersQuery: () => mockUseGet(),
  useCreateUserMutation: () => [mockCreate],
  useUpdateAdminUserMutation: () => [mockUpdate],
  useDeleteUserMutation: () => [mockDelete],
}));

import AdminUsersPage from '../page';

// -------------- scenarios --------------

describe('AdminUsersPage edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders placeholder grid when no users', () => {
    mockUseGet.mockReturnValue({ data: [] as AdminUser[], isLoading: false, isError: false, refetch: jest.fn() });

    render(<AdminUsersPage />);
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('shows error fallback and retry button on API error', async () => {
    const refetch = jest.fn();
    mockUseGet.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch });

    const user = userEvent.setup();
    render(<AdminUsersPage />);

    expect(screen.getByText(/Ошибка загрузки пользователей/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /повторить/i }));

    expect(refetch).toHaveBeenCalled();
  });

  it('does not call deleteUser if confirm cancelled', async () => {
    mockUseGet.mockReturnValue({
      data: [{ id: '1', email: 'test@example.com', role: 'viewer', isActive: true, createdAt: new Date().toISOString() }],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });

    mockDelete.mockClear();

    jest.spyOn(window, 'confirm').mockReturnValueOnce(false);
    const user = userEvent.setup();
    render(<AdminUsersPage />);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
