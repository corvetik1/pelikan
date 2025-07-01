import { render } from '@testing-library/react';
import AdminProductsPage from '../page';
import React, { useEffect } from 'react';
import type { Product } from '@/data/mock';

// -------- mocks ----------

const sample: Product[] = [
  { id: '1', name: 'Old', price: 10, weight: '100 г', category: 'new', img: '', description: '', isNew: false },
];

const updateProduct = jest.fn();

jest.mock('@/redux/adminApi', () => ({
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
    render(<AdminProductsPage />);
    expect(updateProduct).toHaveBeenCalledWith({ id: '1', patch: { name: 'New' } });
  });
});
