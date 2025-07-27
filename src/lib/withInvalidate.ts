import { broadcastInvalidate } from '@/server/socket';

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
export const withInvalidate =
  (tags: Parameters<typeof broadcastInvalidate>[0], message?: string) =>
  <Rest extends unknown[], R extends Promise<Response> | Response>(
    handler: (req: Request, ...args: Rest) => R,
  ) => {
    return async (req: Request, ...args: Rest): Promise<Awaited<R>> => {
      const res = (await handler(req, ...args)) as Response;

      // Trigger only on successful (2xx) responses
      if (res.ok) {
        broadcastInvalidate(tags, message);
      }

      return res as Awaited<R>;
    };
  };

export type WithInvalidate = typeof withInvalidate;
