export type SubscriptionStatus = 'subscribed' | 'unsubscribed' | 'bounced';

export interface Subscriber {
  id: string;
  email: string;
  status: SubscriptionStatus;
  createdAt: string; // ISO string
}

export interface SubscriberListResponse {
  items: Subscriber[];
  total: number;
  page: number;
  pageSize: number;
}
