import '@testing-library/jest-dom';
import 'cross-fetch/polyfill';

// MSW
import { server } from './tests/msw/server';

beforeAll(() => server.listen());
import { resetRoles } from './tests/msw/handlers_roles';

afterEach(() => {
  server.resetHandlers();
  resetRoles();
});
afterAll(() => server.close());
