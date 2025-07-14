import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminStoresPage from '../page';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import type { GridColDef } from '@mui/x-data-grid';
import type { ReactNode } from 'react';

type ActionColDef = GridColDef & {
  getActions?: ({ id }: { id: string }) => ReactNode[];
};
import type { AdminStore } from '@/types/admin';

// ---------- mocks ------------

afterEach(() => {
  jest.resetAllMocks();
});

const sample: AdminStore[] = [
  {
    id: 's1',
    name: 'Store One',
    address: 'Main st',
    region: 'Moscow',
    lat: 55.75,
    lng: 37.61,
    isActive: true,
  },
];

// Mock MUI DataGrid to keep DOM simple
jest.mock('@mui/x-data-grid', () => {
  const GridRowModes = { Edit: 'Edit', View: 'View' } as const;
  const GridActionsCellItem = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button type="button" onClick={onClick} aria-label={label.toLowerCase()}>
      {label}
    </button>
  );
  return {
    DataGrid: ({ columns, rows }: { columns: ActionColDef[]; rows: AdminStore[] }) => (
      <div data-testid="grid">
        {rows.map((row: AdminStore) => (
          <div key={row.id}>
            {columns
              .filter((c: ActionColDef) => c.field === 'actions')
              .map((c: ActionColDef) => (
                // render custom action cell (delete button)
                <span key={c.field}>{c.getActions?.({ id: row.id })}</span>
              ))}
            <span>{row.name}</span>
          </div>
        ))}
      </div>
    ),
    GridRowModes,
    GridActionsCellItem,
  } as unknown as typeof import('@mui/x-data-grid');
});

// Mock RTK Query hooks
const deleteStore = jest.fn(() => ({ unwrap: () => Promise.resolve() }));
const updateStore = jest.fn();
const createStore = jest.fn();

jest.mock('@/redux/api', () => {
  const actual = jest.requireActual('@/redux/api');
  return {
    ...actual,
    useGetAdminStoresQuery: () => ({ data: sample, isLoading: false }),
    useCreateStoreMutation: () => [createStore],
    useUpdateStoreMutation: () => [updateStore],
    useDeleteStoreMutation: () => [deleteStore],
  };
});

// --------- tests --------------

describe('AdminStoresPage', () => {
  it('renders stores and triggers delete', async () => {
    // ConfirmDialog is used instead of window.confirm – no mocking needed
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <AdminStoresPage />
      </Provider>,
    );

    // store visible
    expect(screen.getByText('Store One')).toBeInTheDocument();

    // click delete (first button rendered by mock actions)
    await user.click(screen.getByRole('button', { name: /delete/i }));
    // click confirm in dialog
    await user.click(screen.getByRole('button', { name: /удалить/i }));
    await screen.findByRole('alert', {}, { timeout: 2000 }).catch(() => {});
    expect(deleteStore).toHaveBeenCalledWith('s1');
  });
});
