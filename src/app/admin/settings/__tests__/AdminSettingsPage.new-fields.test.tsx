import { renderWithProvider } from '../../../../../tests/testUtils';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import AdminSettingsPage from '../page';
import { rest } from 'msw';
import { server } from '../../../../../tests/msw/server';

type SettingsDTO = {
  activeThemeSlug: string;
  logoUrl: string | null;
  heroSpeedMs: number;
  socials: Array<{ id: string; name: string; url: string; icon?: string }>;
  contacts: Array<{ id: string; type: 'phone' | 'email' | 'address' | 'link'; label?: string; value: string }>;
  priceListUrl?: string | null;
  ctaTitle?: string | null;
  ctaSubtitle?: string | null;
  homeNewsTitle?: string | null;
  homeRecipesTitle?: string | null;
};

// Increase timeout for slower environments (Windows/CI)
jest.setTimeout(60000);

describe('AdminSettingsPage new fields UI', () => {
  it('renders new fields and validates URL', async () => {
    // Stable defaults for initial data
    const initial: SettingsDTO = {
      activeThemeSlug: 'default',
      logoUrl: null,
      heroSpeedMs: 5000,
      socials: [],
      contacts: [],
      priceListUrl: '',
      ctaTitle: '',
      ctaSubtitle: '',
      homeNewsTitle: '',
      homeRecipesTitle: '',
    };
    server.use(
      rest.get('*://*/api/settings', (_req, res, ctx) => res(ctx.json(initial))),
      rest.get('*://*/api/admin/themes', (_req, res, ctx) => res(ctx.json([{ slug: 'default', name: 'Default' }]))),
    );
    renderWithProvider(<AdminSettingsPage />);

    // Inputs exist
    const priceUrl = screen.getByLabelText(/URL прайс-листа/i);
    screen.getByLabelText(/CTA заголовок/i);
    screen.getByLabelText(/CTA подзаголовок/i);
    screen.getByLabelText(/Заголовок новостей на главной/i);
    screen.getByLabelText(/Заголовок рецептов на главной/i);

    // URL validation (invalid): error prop should set aria-invalid
    fireEvent.change(priceUrl, { target: { value: 'not-a-url' } });
    await waitFor(() => expect(priceUrl).toHaveAttribute('aria-invalid', 'true'));

  });

  it('sends new fields in PATCH body', async () => {
    const initial: SettingsDTO = {
      activeThemeSlug: 'default',
      logoUrl: null,
      heroSpeedMs: 5000,
      socials: [],
      contacts: [],
    };
    server.use(
      rest.get('*://*/api/settings', (_req, res, ctx) => res(ctx.json(initial))),
      rest.get('*://*/api/admin/themes', (_req, res, ctx) => res(ctx.json([{ slug: 'default', name: 'Default' }]))),
    );

    let seenBody: Partial<SettingsDTO> | undefined;
    server.use(
      rest.patch('*://*/api/settings', async (req, res, ctx) => {
        const body = (await req.json()) as Partial<SettingsDTO>;
        seenBody = body;
        return res(ctx.json({ ...initial, ...body } satisfies SettingsDTO));
      }),
    );

    renderWithProvider(<AdminSettingsPage />);

    // Fill new fields
    fireEvent.change(screen.getByLabelText(/URL прайс-листа/i), { target: { value: 'https://example.com/prices.pdf' } });
    fireEvent.change(screen.getByLabelText(/CTA заголовок/i), { target: { value: 'Buy now' } });
    fireEvent.change(screen.getByLabelText(/CTA подзаголовок/i), { target: { value: 'Best fish' } });
    fireEvent.change(screen.getByLabelText(/Заголовок новостей на главной/i), { target: { value: 'Новости' } });
    fireEvent.change(screen.getByLabelText(/Заголовок рецептов на главной/i), { target: { value: 'Рецепты' } });

    const saveBtn = screen.getByRole('button', { name: 'Сохранить' });
    fireEvent.click(saveBtn);

    await waitFor(() => expect(seenBody).toBeDefined());
    const body = seenBody as Partial<SettingsDTO>;
    // Ensure new fields are present with provided values
    expect(body).toHaveProperty('activeThemeSlug');
    expect(body).toHaveProperty('logoUrl');
    expect(body).toHaveProperty('heroSpeedMs');
    expect(body).toHaveProperty('socials');
    expect(body).toHaveProperty('contacts');
    expect(body).toHaveProperty('priceListUrl', 'https://example.com/prices.pdf');
    expect(body).toHaveProperty('ctaTitle', 'Buy now');
    expect(body).toHaveProperty('ctaSubtitle', 'Best fish');
    expect(body).toHaveProperty('homeNewsTitle', 'Новости');
    expect(body).toHaveProperty('homeRecipesTitle', 'Рецепты');
  });
});
