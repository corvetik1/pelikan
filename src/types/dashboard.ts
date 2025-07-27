export interface DashboardCounts {
  products: number;
  news: number;
  recipes: number;
  reviewsPending: number;
}

export interface RevenueEntry {
  date: string; // YYYY-MM-DD
  value: number;
}

export interface TopProductEntry {
  name: string;
  sales: number;
}

export interface DashboardData {
  counts: DashboardCounts;
  revenueSeries: RevenueEntry[];
  topProducts: TopProductEntry[];
  recentOrders: unknown[]; // to be defined later
  recentReviews: unknown[];
}
