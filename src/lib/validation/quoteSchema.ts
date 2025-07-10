import { z } from 'zod';

export const QuoteItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const QuoteCreateSchema = z.object({
  userEmail: z.string().email(),
  items: z.array(QuoteItemSchema).nonempty(),
});

export const QuotePricesSchema = z.record(z.string().uuid(), z.number().int().nonnegative());

export const QuoteUpdatePricesSchema = z.object({
  prices: QuotePricesSchema,
});

export type QuoteCreatePayload = z.infer<typeof QuoteCreateSchema>;
export type QuoteUpdatePricesPayload = z.infer<typeof QuoteUpdatePricesSchema>;
