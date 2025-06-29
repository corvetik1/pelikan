import { render, screen } from '@testing-library/react';
import type { Product } from '@/data/mock';
import ProductDetail from '../ProductDetail';
import { products } from '@/data/mock';

// берём первый товар из моков как тестовый образец
const mockProduct: Product = products[0];

describe('ProductDetail', () => {
  it('renders product name, price and characteristics', () => {
    render(<ProductDetail product={mockProduct} />);

    // имя
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(mockProduct.name);

    // цена содержит символ рубля
    expect(screen.getByText(/₽/)).toBeInTheDocument();

    // вес
    expect(screen.getByText(new RegExp(mockProduct.weight))).toBeInTheDocument();
  });

  it('renders all gallery images', () => {
    render(<ProductDetail product={mockProduct} />);

    const images = mockProduct.images ?? [mockProduct.img];
    // next/image renders optimized <img> with same alt
    const rendered = screen.getAllByAltText(mockProduct.name);
    expect(rendered).toHaveLength(images.length);
  });

  it('has CTA button', () => {
    render(<ProductDetail product={mockProduct} />);
    expect(screen.getByRole('button', { name: /Запросить предложение/i })).toBeInTheDocument();
  });
});
