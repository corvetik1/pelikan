export interface QuoteItem {
  productId: string;
  quantity: number;
}

export type QuoteStatus = 'pending' | 'priced' | 'rejected';

export interface Quote {
  id: string;
  items: QuoteItem[];
  prices?: Record<string, number>;
  status: QuoteStatus;
  userEmail: string;
  createdAt: string; // ISO dates from Prisma api
  updatedAt: string;
}
