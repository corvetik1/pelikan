import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../ProductCard';
import ProductQuickView from '../ProductQuickView';
import ProductsFilters, { ProductsFilterState } from '../ProductsFilters';
import type { Product } from '@/data/mock';
import React from 'react';

// Mock next/image for Jest
jest.mock('next/image', () => {
  // eslint-disable-next-line react/display-name
  return ({ src, alt, ...rest }: { src: string; alt: string; }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  );
});

describe('Product components', () => {
  const mockProduct: Product = {
    id: 'test',
    name: 'Тестовый продукт',
    price: 1000,
    img: '/test.jpg',
    category: 'new',
    description: 'Описание',
    weight: '100 г',
    isNew: true,
  };

  it('ProductCard renders name and NEW badge', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('opens ProductQuickView dialog on click', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);
    await user.click(screen.getByRole('button'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
  });

  it('ProductQuickView renders details when open', () => {
    render(<ProductQuickView product={mockProduct} open onClose={() => {}} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(/Вес:/i)).toHaveTextContent(mockProduct.weight);
  });

  it('ProductsFilters calls onChange with updated state', async () => {
    const user = userEvent.setup();
    const defaultState: ProductsFilterState = { sort: 'default', onlyNew: false };
    const handleChange = jest.fn();
    render(<ProductsFilters value={defaultState} onChange={handleChange} />);

    // open select and choose Цена ↑
    await user.click(screen.getByLabelText(/Сортировка/i));
    await user.click(screen.getByRole('option', { name: 'Цена ↑' }));

    expect(handleChange).toHaveBeenNthCalledWith(1, { sort: 'priceAsc', onlyNew: false });

    // toggle onlyNew checkbox
    await user.click(screen.getByLabelText(/Только новинки/i));
    expect(handleChange).toHaveBeenNthCalledWith(2, { sort: 'default', onlyNew: true });
  });
});
