import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminNewsPage from '../page';
import type { GridColDef } from '@mui/x-data-grid';
import type { ReactNode } from 'react';

type ActionColDef = GridColDef & {
  getActions?: ({ id }: { id: string }) => ReactNode[];
};
import type { AdminNews } from '@/types/admin';

afterEach(() => {
  jest.resetAllMocks();
});

const sample: AdminNews[] = [
  { id: '1', title: 'News', excerpt: 'Some', date: '2025-01-01', category: 'general' },
];

// Mock MUI DataGrid to simplify DOM
jest.mock('@mui/x-data-grid', () => {
  const GridActionsCellItem = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button type="button" onClick={onClick} aria-label={label.toLowerCase()}>{label}</button>
  );
  const GridRowModes = { Edit: 'Edit', View: 'View' } as const;
  return {
    DataGrid: ({ columns, rows }: { columns: ActionColDef[]; rows: AdminNews[] }) => (
      <div data-testid="grid">
        {rows.map((row) => (
          <div key={row.id}>
            {columns
              .filter((c) => c.field === 'actions')
              .map((c) => (
                <span key={c.field}>{c.getActions?.({ id: row.id })}</span>
              ))}
            <span>{row.title}</span>
          </div>
        ))}
      </div>
    ),
    GridActionsCellItem,
    GridRowModes,
  } as unknown as typeof import('@mui/x-data-grid');
});

// Mock RTK Query hooks
const refetch = jest.fn();
const createNews = jest.fn();
const updateNews = jest.fn();
const deleteNews = jest.fn();

jest.mock('@/redux/api', () => ({
  useGetAdminNewsQuery: () => ({ data: sample, isLoading: false, isError: false, refetch }),
  useCreateNewsMutation: () => [createNews],
  useUpdateNewsMutation: () => [updateNews],
  useDeleteNewsMutation: () => [deleteNews],
}));

// --------- tests ------------

describe('AdminNewsPage', () => {
  it('renders news and deletes on click', async () => {
    const user = userEvent.setup();
    render(<AdminNewsPage />);

    expect(screen.getByText('News')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /delete/i }));
    // Confirm dialog should appear – click "Удалить" to proceed
    await user.click(screen.getByRole('button', { name: /удалить/i }));
    await waitFor(() => expect(deleteNews).toHaveBeenCalledWith('1'));
  });

  it('opens dialog and creates news', async () => {
    const user = userEvent.setup();
    render(<AdminNewsPage />);

    await user.click(screen.getByTestId('add-news-btn'));
    await user.type(screen.getByLabelText(/Заголовок/i), 'New Title');
    await user.click(screen.getByRole('button', { name: /сохранить/i }));

    expect(createNews).toHaveBeenCalled();
  });
});
