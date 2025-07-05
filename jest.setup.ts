import '@testing-library/jest-dom';

// Increase global test timeout for async-heavy UI tests
jest.setTimeout(15000);
// Polyfill TextEncoder/TextDecoder for Node < 21 (required by @mswjs/interceptors)
import { TextEncoder, TextDecoder } from 'util';
if (!(global as any).TextEncoder) {
  (global as any).TextEncoder = TextEncoder;
}
if (!(global as any).TextDecoder) {
  (global as any).TextDecoder = TextDecoder;
}
import 'cross-fetch/polyfill';

// Suppress React DOM warning for `fill` prop by mocking next/image globally
// Renders <img> tag and drops the `fill` boolean attribute used by next/image
import React from 'react';
// Provide a global mock for `next/image` that renders a standard <img> element.
// MUST avoid JSX here because jest.setup.ts is a `.ts` file (no TSX parsing).
jest.mock('next/image', () => {
  return function NextImageMock({ src, alt, fill, ...rest }: { src: string; alt?: string; fill?: boolean }) {
    // Drop the `fill` prop to silence React warning
    // Note: using React.createElement avoids the need for TSX syntax in .ts file
    return React.createElement('img', { src, alt, ...rest });
  };
});

// MSW
import { server, resetMocks } from './tests/msw/server';

beforeAll(() => server.listen());


afterEach(() => {
  server.resetHandlers();
  resetMocks();
});
afterAll(() => server.close());
