export interface Review {
  id: string;
  productId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  author?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string; // ISO date string
}

export interface CreateReviewInput {
  productId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  author?: string;
}
