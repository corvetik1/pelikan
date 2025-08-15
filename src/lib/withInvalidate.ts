import { broadcastInvalidate } from '@/server/socket';
import type { InvalidateTags } from '@/types/realtime';

/**
 * Wraps a route handler and broadcasts an `invalidate` event via Socket.IO
 * AFTER the wrapped handler succeeds.
 *
 * Usage:
 * ```ts
 * export const POST = withLogger(
 *   withInvalidate([{ type: 'AdminNews', id: 'LIST' }], 'Новость создана')(
 *     async (req: Request) => {
 *       // create item
 *       return NextResponse.json(created, { status: 201 });
 *     },
 *   ),
 * );
 * ```
 *
 * The helper does NOT swallow errors – it simply proxies the original handler
 * and triggers `broadcastInvalidate` if the resulting Response has an OK (2xx)
 * status code.
 */
// Перегрузки: без ctx и с ctx
export function withInvalidate(tags: InvalidateTags, message?: string): {
  (handler: (req: Request) => Response | Promise<Response>): (req: Request) => Promise<Response>;
  <C>(handler: (req: Request, ctx: C) => Response | Promise<Response>): (req: Request, ctx: C) => Promise<Response>;
};

export function withInvalidate(tags: InvalidateTags, message?: string) {
  function wrap(handler: (req: Request) => Response | Promise<Response>): (req: Request) => Promise<Response>;
  function wrap<C>(
    handler: (req: Request, ctx: C) => Response | Promise<Response>,
  ): (req: Request, ctx: C) => Promise<Response>;
  function wrap(
    handler: (req: Request, ctx?: object) => Response | Promise<Response>,
  ) {
    return async (
      req: Request,
      ctx?: object,
    ): Promise<Response> => {
      const res = await handler(req, ctx);
      if (res.ok) {
        broadcastInvalidate(tags, message);
      }
      return res;
    };
  }
  return wrap;
}

export type WithInvalidate = typeof withInvalidate;
