import { z } from 'zod';
import {
  SubscriptionStatusEnum,
  SubscriberSchema,
  SubscriberListQuerySchema,
  SubscriberListResponseSchema,
  SubscriberPatchSchema,
} from '../../../src/lib/validation/subscriberSchema';

describe('subscriber Zod schemas', () => {
  test('valid Subscriber passes', () => {
    const obj = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@example.com',
      status: 'subscribed',
      createdAt: new Date().toISOString(),
      confirmedAt: null,
    };
    expect(() => SubscriberSchema.parse(obj)).not.toThrow();
  });

  test('invalid email fails', () => {
    const obj = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'not-an-email',
      status: 'subscribed',
      createdAt: new Date().toISOString(),
    } as unknown as z.infer<typeof SubscriberSchema>;
    expect(() => SubscriberSchema.parse(obj)).toThrow();
  });

  test('list query defaults and validation', () => {
    const parsed = SubscriberListQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(20);
    const withStatus = SubscriberListQuerySchema.safeParse({ status: 'bounced' });
    expect(withStatus.success).toBe(true);
    const badSort = SubscriberListQuerySchema.safeParse({ sort: 'email,up' });
    expect(badSort.success).toBe(false);
  });

  test('list response validates', () => {
    const payload = {
      items: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'u@e.com',
          status: 'unsubscribed',
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
    };
    expect(() => SubscriberListResponseSchema.parse(payload)).not.toThrow();
  });

  test('patch schema validates status', () => {
    expect(() => SubscriberPatchSchema.parse({ status: 'subscribed' })).not.toThrow();
    expect(SubscriptionStatusEnum.options).toEqual(['subscribed', 'unsubscribed', 'bounced']);
  });
});
