import { z } from 'zod';

export const SubscriptionStatusEnum = z.enum(['subscribed', 'unsubscribed', 'bounced']);

export const SubscriberSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  status: SubscriptionStatusEnum,
  createdAt: z.string().datetime(), // RFC 3339 / ISO string
  confirmedAt: z.string().datetime().nullable().optional(),
});

export const SubscriberListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
  sort: z
    .string()
    .regex(/^(email|status|createdAt),(asc|desc)$/)
    .optional(),
  status: SubscriptionStatusEnum.optional(),
});

export const SubscriberListResponseSchema = z.object({
  items: z.array(SubscriberSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
});

export const SubscriberPatchSchema = z.object({
  status: SubscriptionStatusEnum,
});

export type SubscriberListQuery = z.infer<typeof SubscriberListQuerySchema>;
export type SubscriberPatchInput = z.infer<typeof SubscriberPatchSchema>;
