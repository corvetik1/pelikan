import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Providers from '@/providers/Providers';
import AdminShell from '../AdminShell';

// Mock useRouter to intercept navigation calls
const pushMock = jest.fn();
const replaceMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
  // In JSDOM we don't have server-side rendering; provide noop to satisfy ThemeRegistry
  useServerInsertedHTML: () => {},
}));

// Simulate admin cookie for AuthContext
beforeEach(() => {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: 'session=admin',
  });
});

afterEach(() => {
  pushMock.mockReset();
  replaceMock.mockReset();
});

describe('AdminShell navigation', () => {
  it('navigates to selected section and closes drawer', async () => {
    render(
      <Providers>
        <AdminShell>
          <div>children</div>
        </AdminShell>
      </Providers>
    );

    // open drawer via menu icon (button has aria-label "open drawer")
    const menuBtn = screen.getByLabelText(/open drawer/i);
    await userEvent.click(menuBtn);

    const newsLink = screen.getByRole('link', { name: /новости/i });
    await userEvent.click(newsLink);

    expect(pushMock).toHaveBeenCalledWith('/admin/news');
  });
});
