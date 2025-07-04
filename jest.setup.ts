import '@testing-library/jest-dom';
// Polyfill TextEncoder/TextDecoder for Node < 21 (required by @mswjs/interceptors)
import { TextEncoder, TextDecoder } from 'util';
if (!(global as any).TextEncoder) {
  (global as any).TextEncoder = TextEncoder;
}
if (!(global as any).TextDecoder) {
  (global as any).TextDecoder = TextDecoder;
}
import 'cross-fetch/polyfill';

// MSW
import { server, resetMocks } from './tests/msw/server';

beforeAll(() => server.listen());


afterEach(() => {
  server.resetHandlers();
  resetMocks();
});
afterAll(() => server.close());
