import pino from 'pino';
import pinoHttp from 'pino-http';

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
import type { IncomingMessage, ServerResponse } from 'http';

export function withLogger<Rest extends unknown[], R extends Promise<Response> | Response>(
  handler: (req: Request, ...args: Rest) => R,
): (req: Request, ...args: Rest) => Promise<Awaited<R>> {
  const httpLogger = pinoHttp({ logger });

  return (async (req: Request, ...rest: Rest): Promise<Awaited<R>> => {
    // pino-http ожидает Node.js req/res, поэтому используем адаптер
    const resHeaders: Record<string, string> = {};
    const res = {
      headers: resHeaders,
      writeHead: () => res,
      end: () => undefined,
      on: () => undefined,
      once: () => undefined,
    } as unknown as ServerResponse & { headers: Record<string, string> };

    httpLogger(req as unknown as IncomingMessage, res as IncomingMessage & ServerResponse, () => undefined);

    const response = await handler(req, ...rest) as Response;

    logger.info({ status: response.status, url: req.url, method: req.method }, 'response');
    return response as Awaited<R>;
  });
}
