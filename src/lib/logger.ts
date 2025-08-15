import pino from 'pino';

/**
 * Shared application logger.
 *
 * – Log level берётся из переменной окружения `LOG_LEVEL` (по умолчанию `info`).
 * – В development вывод оформляется удобно через `pino-pretty`,
 *   а в production остаётся JSON, пригодным для Loki.
 */
const isDev = process.env.NODE_ENV !== 'production';
const isNext = Boolean(process.env.NEXT_RUNTIME);

export const logger = pino(
  isDev && !isNext
    ? {
        level: process.env.LOG_LEVEL ?? 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
      }
    : {
        level: process.env.LOG_LEVEL ?? 'info',
      },
);


/**
 * Middleware-обёртка для Next.js API/Route Handlers.
 * Пример использования:
 *
 * ```ts
 * import { withLogger } from '@/lib/logger';
 *
 * export const POST = withLogger(async (req: Request) => {
 *   logger.info('Handling POST /api/...');
 *   return NextResponse.json({ ok: true });
 * });
 * ```
 */

export function withLogger(
  handler: (req: Request) => Response | Promise<Response>,
): (req: Request) => Promise<Response>;
export function withLogger<C>(
  handler: (req: Request, ctx: C) => Response | Promise<Response>,
): (req: Request, ctx: C) => Promise<Response>;
export function withLogger(
  handler: (req: Request, ctx?: object) => Response | Promise<Response>,
) {
  async function wrapper(req: Request): Promise<Response>;
  async function wrapper<C>(req: Request, ctx: C): Promise<Response>;
  async function wrapper(req: Request, ctx?: object): Promise<Response> {
    const startedAt = Date.now();
    logger.info({ url: req.url, method: req.method }, 'request');
    const response = (await handler(req, ctx as never)) as Response;
    const ms = Date.now() - startedAt;
    logger.info({ status: response.status, url: req.url, method: req.method, ms }, 'response');
    return response;
  }

  return wrapper;
}
