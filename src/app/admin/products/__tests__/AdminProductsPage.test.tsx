import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminProductsPage from '../page';
import type { AdminProduct } from '@/types/admin';
import type { ReactNode } from 'react';

type Column = {
  field: string;
  renderCell?: (params: { id: string; row: AdminProduct }) => ReactNode;
};

// --------- mocks ------------

afterEach(() => {
  jest.resetAllMocks();
});

const sample: AdminProduct[] = [
  {
    id: '1',
    name: 'Sample',
    slug: 'sample',
    price: 100,
    weight: '100 г',
    category: 'new',
    img: '',
    createdAt: new Date().toISOString(),
  },
];

// Mock MUI DataGrid to simplify DOM
jest.mock('@mui/x-data-grid', () => {
  return {
    DataGrid: ({ columns, rows }: { columns: Column[]; rows: AdminProduct[] }) => (
      <div data-testid="grid">
        {rows.map((row) => (
          <div key={row.id}>
            {columns
              .filter((c) => c.field === 'actions')
              .map((c) => (
                <span key={c.field}>{c.renderCell?.({ id: row.id, row })}</span>
              ))}
            <span>{row.name}</span>
          </div>
        ))}
      </div>
    ),
  };
});

// Mock RTK Query hooks
const refetch = jest.fn();
const createProduct = jest.fn();
const updateProduct = jest.fn();
const deleteProduct = jest.fn(() => ({ unwrap: () => Promise.resolve() }));

jest.mock('@/redux/adminApi', () => ({
  useGetAdminProductsQuery: () => ({ data: sample, isLoading: false, isError: false, refetch }),
  useCreateProductMutation: () => [createProduct],
  useUpdateAdminProductMutation: () => [updateProduct],
  useDeleteProductMutation: () => [deleteProduct],
}));

// --------- tests ------------

describe('AdminProductsPage', () => {
  it('renders products and deletes on click', async () => {
    // mock confirm to auto-approve
    jest.spyOn(window, 'confirm').mockReturnValueOnce(true);

    const user = userEvent.setup();
    render(<AdminProductsPage />);

    // product name visible
    expect(screen.getByText('Sample')).toBeInTheDocument();

    // click delete button
    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(deleteProduct).toHaveBeenCalledWith('1');
    expect(refetch).toHaveBeenCalled();
  });
});
