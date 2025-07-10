import { rest } from 'msw';
import { factory, primaryKey } from '@mswjs/data';
import type { B2BPrice } from '@/data/b2bPrices';

/*
 * In-memory mock DB for B2B price-list and quote generation.
 * Uses @mswjs/data so that tests can mutate/inspect data and call reset() between suites if required.
 */

// -------- db & seed helpers --------
const db = factory({
  price: {
    id: primaryKey(String),
    price: Number,
  },
});

const defaultPrices: B2BPrice[] = [
  { id: 'p1', price: 1299 },
  { id: 'p2', price: 899 },
  { id: 'p3', price: 699 },
  { id: 'p4', price: 499 },
  { id: 'p5', price: 1199 },
  { id: 'p6', price: 1050 },
];

function seedPrices(): void {
  defaultPrices.forEach((p) => {
    // ignore if already exists (re-run)
    if (!db.price.findFirst({ where: { id: { equals: p.id } } })) {
      db.price.create(p);
    }
  });
}

seedPrices();

export const resetPrices = (): void => {
  db.price.deleteMany({ where: {} });
  seedPrices();
};

// -------- request handlers --------
const listPattern = '*://*/api/b2b/prices';
const quotePattern = '*://*/api/quotes';

export const handlers = [
  // GET /api/b2b/prices
  rest.get(listPattern, (_req, res, ctx) => {
    const prices = db.price.getAll();
    return res(ctx.status(200), ctx.json(prices));
  }),

  // POST /api/b2b/quote – simulate quote generation; always succeeds.
  rest.post(quotePattern, async (_req, res, ctx) => {
    // In real backend we would validate items; here we just return dummy URL.
    return res(ctx.status(200), ctx.json({ id: 'mock-quote-id' }));
  }),
];
