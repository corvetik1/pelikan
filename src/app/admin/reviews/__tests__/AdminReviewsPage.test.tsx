import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminReviewsPage from '../page';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import type { AdminReview } from '@/types/admin';
import type { ReactNode } from 'react';

type Column = {
  field: string;
  renderCell?: (params: { id: string; row: AdminReview }) => ReactNode;
};

// ------- mocks ---------

afterEach(() => {
  jest.resetAllMocks();
});

const sample: AdminReview[] = [
  {
    id: 'r1',
    productId: 'p1',
    productName: 'Товар 1',
    rating: 5,
    body: 'Отлично!',
    status: 'pending',
    author: 'Ivan',
    createdAt: new Date().toISOString(),
  },
];

// Mock MUI DataGrid
jest.mock('@mui/x-data-grid', () => {
  return {
    DataGrid: ({ columns, rows }: { columns: Column[]; rows: AdminReview[] }) => (
      <div data-testid="grid">
        {rows.map((row) => (
          <div key={row.id} data-testid={`row-${row.id}`}>
            {/* render actions */}
            {columns
              .filter((c) => c.field === 'actions')
              .map((c) => (
                <span key={c.field}>{c.renderCell?.({ id: row.id, row })}</span>
              ))}
            <span>{row.body}</span>
          </div>
        ))}
      </div>
    ),
  };
});

// Mock RTK Query hooks
const refetch = jest.fn();
const updateStatus = jest.fn(() => ({ unwrap: () => Promise.resolve() }));

jest.mock('@/redux/adminApi', () => ({
  useGetAdminReviewsQuery: () => ({ data: { items: sample, total: sample.length }, isLoading: false, isError: false, refetch }),
  useUpdateReviewStatusMutation: () => [updateStatus],
  useGetAdminProductsQuery: () => ({ data: [], isLoading: false }),
}));

// -------- tests ----------

describe('AdminReviewsPage', () => {
  it('approves review on click', async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <AdminReviewsPage />
      </Provider>,
    );

    // make sure review body visible
    expect(screen.getByText('Отлично!')).toBeInTheDocument();

    // click approve icon button (first button in row)
    const row = screen.getByTestId('row-r1');
    const approveButton = within(row).getAllByRole('button')[0];
    await user.click(approveButton);

    // expect mutation called
    expect(updateStatus).toHaveBeenCalledWith({ id: 'r1', status: 'approved' });
    expect(refetch).toHaveBeenCalled();
  });
});
