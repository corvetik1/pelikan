import { render, screen } from '@testing-library/react';
import Providers from '@/providers/Providers';
import type { Product } from '@/types/product';
import ProductDetail from '../ProductDetail';
import { products } from '@/data/mock';

// берём первый товар из моков как тестовый образец
const mockProduct: Product = { ...products[0], slug: 'mock-slug' };

describe('ProductDetail', () => {
  it('renders product name, price and characteristics', () => {
    render(
      <Providers>
        <ProductDetail product={mockProduct} />
      </Providers>
    );

    // имя
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(mockProduct.name);

    // цена содержит символ рубля
    expect(screen.getByText(/₽/)).toBeInTheDocument();

    // вес
    expect(screen.getByText(new RegExp(mockProduct.weight))).toBeInTheDocument();
  });

  it('renders all gallery images', () => {
    render(
      <Providers>
        <ProductDetail product={mockProduct} />
      </Providers>
    );

    const images = mockProduct.images ?? [mockProduct.img];
    // next/image renders optimized <img> with same alt
    const rendered = screen.getAllByAltText(mockProduct.name);
    expect(rendered).toHaveLength(images.length);
  });

  it('has CTA button', () => {
    render(
      <Providers>
        <ProductDetail product={mockProduct} />
      </Providers>
    );
    expect(screen.getByRole('button', { name: /Запросить предложение/i })).toBeInTheDocument();
  });
});
