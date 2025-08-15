// Rely on global Jest typings (configured in tsconfig "types").
import { z } from 'zod';
import {
  SubscriptionStatusEnum,
  SubscriberListQuerySchema,
  SubscriberListResponseSchema,
  SubscriberPatchSchema,
} from '@/lib/validation/subscriberSchema';

describe('subscriberSchema Zod', () => {
  it('SubscriptionStatusEnum accepts valid values', () => {
    expect(SubscriptionStatusEnum.parse('subscribed')).toBe('subscribed');
    expect(SubscriptionStatusEnum.parse('unsubscribed')).toBe('unsubscribed');
    expect(SubscriptionStatusEnum.parse('bounced')).toBe('bounced');
  });

  it('SubscriptionStatusEnum rejects invalid value', () => {
    expect(() => SubscriptionStatusEnum.parse('invalid'))
      .toThrow(z.ZodError);
  });

  it('SubscriberListQuerySchema parses defaults and values', () => {
    const parsed = SubscriberListQuerySchema.parse({ page: '2', pageSize: '50', sort: 'email,asc', status: 'subscribed' });
    expect(parsed).toEqual({ page: 2, pageSize: 50, sort: 'email,asc', status: 'subscribed' });

    const withDefaults = SubscriberListQuerySchema.parse({});
    expect(withDefaults.page).toBeGreaterThanOrEqual(1);
    expect(withDefaults.pageSize).toBeGreaterThan(0);
  });

  it('SubscriberListQuerySchema rejects out-of-range', () => {
    expect(() => SubscriberListQuerySchema.parse({ page: '0' })).toThrow(z.ZodError);
    expect(() => SubscriberListQuerySchema.parse({ pageSize: '0' })).toThrow(z.ZodError);
    expect(() => SubscriberListQuerySchema.parse({ sort: 'unknown,asc' })).toThrow(z.ZodError);
    expect(() => SubscriberListQuerySchema.parse({ sort: 'email,wrong' })).toThrow(z.ZodError);
  });

  it('SubscriberListResponseSchema validates shape', () => {
    const payload = {
      items: [
        { id: '550e8400-e29b-41d4-a716-446655440000', email: 'a@a.com', status: 'subscribed', createdAt: '2024-01-01T00:00:00.000Z' },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
    } as const;
    expect(SubscriberListResponseSchema.parse(payload)).toEqual(payload);

    expect(() => SubscriberListResponseSchema.parse({ ...payload, items: [{ ...payload.items[0], createdAt: 'bad' }] }))
      .toThrow(z.ZodError);
  });

  it('SubscriberPatchSchema validates status', () => {
    expect(SubscriberPatchSchema.parse({ status: 'unsubscribed' })).toEqual({ status: 'unsubscribed' });
    expect(() => SubscriberPatchSchema.parse({ status: 'nope' })).toThrow(z.ZodError);
  });
});
