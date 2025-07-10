import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { AdminProduct } from '@/types/admin';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

// --------------- mocks helpers ----------------

jest.mock('@mui/x-data-grid', () => ({
  DataGrid: ({ rows = [], columns = [] }: { rows: AdminProduct[]; columns: GridColDef[] }) => (
    <div data-testid="grid">
      {rows.map((row: AdminProduct) => (
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
  useGetAdminProductsQuery: () => mockUseGet(),
  useCreateProductMutation: () => [mockCreate],
  useUpdateAdminProductMutation: () => [mockUpdate],
  useDeleteProductMutation: () => [mockDelete],
}));

import AdminProductsPage from '../page';

// --------------- scenarios --------------------

describe('AdminProductsPage edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders placeholder grid when no products', () => {
    mockUseGet.mockReturnValue({ data: [] as AdminProduct[], isLoading: false, isError: false, refetch: jest.fn() });

    

    render(<AdminProductsPage />);
    expect(screen.getByTestId('grid')).toBeInTheDocument();
  });

  it('shows error fallback and retry button on API error', async () => {
    const refetch = jest.fn();
    mockUseGet.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch });
    

    const user = userEvent.setup();
    render(<AdminProductsPage />);

    expect(screen.getByText(/Ошибка загрузки товаров/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /повторить/i }));

    expect(refetch).toHaveBeenCalled();
  });

  it('does not call deleteProduct if confirm cancelled', async () => {
    mockUseGet.mockReturnValue({
      data: [{ id: '1', name: 'Sample', slug: 'sample', price: 10, weight: '1 кг', category: 'new', img: '', createdAt: new Date().toISOString() }],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
    mockDelete.mockClear();
    
    

    jest.spyOn(window, 'confirm').mockReturnValueOnce(false);
    const user = userEvent.setup();
    render(<AdminProductsPage />);

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
