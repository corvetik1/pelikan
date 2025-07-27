import { render } from '@testing-library/react';
import AdminProductsPage from '../page';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import React, { useEffect } from 'react';
import type { AdminProduct } from '@/types/admin';

// -------- mocks ----------

const sample: AdminProduct[] = [
  {
    id: '1',
    name: 'Old',
    slug: 'old',
    price: 10,
    weight: '100 г',
    category: 'new',
    img: '',
    createdAt: new Date().toISOString(),
  },
];

const updateProduct = jest.fn();

jest.mock('@/redux/adminApi', () => ({
  useImportProductsMutation: () => [jest.fn()],
  useGetAdminProductsQuery: () => ({ data: sample, isLoading: false, isError: false, refetch: jest.fn() }),
  useCreateProductMutation: () => [jest.fn()],
  useUpdateAdminProductMutation: () => [updateProduct],
  useDeleteProductMutation: () => [jest.fn()],
}));

jest.mock('@mui/x-data-grid', () => {
  const Actual = jest.requireActual('@mui/x-data-grid');
  const DataGrid = ({ onCellEditStop }: { onCellEditStop: (p: { id: string; field: string; value: string }) => void }) => {
    // simulate inline edit once mounted
    useEffect(() => {
      onCellEditStop({ id: '1', field: 'name', value: 'New' });
    }, [onCellEditStop]);
    return <div data-testid="grid" />;
  };
  return { ...Actual, DataGrid };
});

// -------- tests ----------

describe('AdminProductsPage inline edit', () => {
  it('calls updateProduct mutation on inline cell edit', () => {
    render(
      <Provider store={store}>
        <AdminProductsPage />
      </Provider>,
    );
    expect(updateProduct).toHaveBeenCalledWith({ id: '1', patch: { name: 'New' } });
  });
});
