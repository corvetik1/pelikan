import { screen, within } from '@testing-library/react';
import { renderWithProvider } from '@/../tests/testUtils';
import DashboardView from '../DashboardView';
import type { DashboardData } from '@/types/dashboard';
import '@testing-library/jest-dom';

// Mock ResizeObserver used by Recharts ResponsiveContainer
beforeAll(() => {
  (globalThis as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

// Mock RTK Query hook
const mockUseGetDashboardQuery = jest.fn();
jest.mock('@/redux/dashboardApi', () => ({
  useGetDashboardQuery: () => mockUseGetDashboardQuery(),
}));

const mockData: DashboardData = {
  counts: {
    products: 10,
    news: 3,
    recipes: 5,
    reviewsPending: 2,
  },
  revenueSeries: [
    { date: '2025-07-01', value: 1000 },
    { date: '2025-07-02', value: 1100 },
  ],
  topProducts: [
    { name: 'Product A', sales: 50 },
    { name: 'Product B', sales: 30 },
    { name: 'Product C', sales: 20 },
    { name: 'Product D', sales: 15 },
    { name: 'Product E', sales: 10 },
  ],
  recentOrders: [],
  recentReviews: [],
};

describe('DashboardView', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows skeletons while loading', () => {
    mockUseGetDashboardQuery.mockReturnValue({ data: undefined, isLoading: true, isFetching: false });

    renderWithProvider(<DashboardView />);

    // expect at least one skeleton (role="progressbar")
    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders stats and list when data loaded', () => {
    mockUseGetDashboardQuery.mockReturnValue({ data: mockData, isLoading: false, isFetching: false });

    renderWithProvider(<DashboardView />);

    // Статистика: значения ищем внутри соответствующих карточек, чтобы избежать коллизий одинаковых чисел
    const productsCard = screen.getByText('Товары').closest('div');
    expect(productsCard).not.toBeNull();
    expect(within(productsCard!).getByText('10')).toBeInTheDocument();

    const newsCard = screen.getByText('Новости').closest('div');
    expect(newsCard).not.toBeNull();
    expect(within(newsCard!).getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Топ-5 товаров')).toBeInTheDocument();
    expect(screen.getByText('Product A')).toBeInTheDocument();
  });
});
