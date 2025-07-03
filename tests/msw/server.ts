import { setupServer } from 'msw/node';
import { handlers } from './handlers_roles';

export const server = setupServer(...handlers);

export const waitForRequest = (
  method: string,
  urlStartsWith: string,
  count: number = 1,
): Promise<void> => {
  /*
   * Resolves once MSW emits `request:match` for a request whose method and
   * pathname match the provided criteria. Works reliably in Node.
   */
  return new Promise<void>((resolve) => {
    let seen = 0;
    const listener = (payload: { request?: Request } | Request) => {
      // `payload` shape: { request, handler, parsedResult }
      const req: Request | undefined = (payload as any)?.request ?? (payload as any);
      if (!req || !req.method || !req.url) return;
      const urlPath = typeof req.url === 'string' ? new URL(req.url).pathname : (req.url as URL).pathname;
      if (
        req.method.toLowerCase() === method.toLowerCase() &&
        urlPath.startsWith(urlStartsWith)
      ) {
        if (++seen === count) {
          // @ts-ignore removeListener generic typing
          server.events.removeListener('request:match', listener);
          resolve();
        }
      }
    };
    // @ts-ignore event name typing
    server.events.on('request:match', listener);
  });
};
