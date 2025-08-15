import { rest } from 'msw';
import type { HeroSlide } from '@/types/hero';
import type { HeroCreateInput } from '@/lib/validation/heroSchema';

export const sampleHeroSlides: HeroSlide[] = [
  {
    id: 'hero-slide-1',
    title: 'От океана к вашему столу',
    subtitle: 'Премиальные морепродукты напрямую от «Бухты пеликанов»',
    img: '/hero/slide1.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hero-slide-2',
    title: '15 лет экспертизы',
    subtitle: 'Современное производство полного цикла',
    img: '/hero/slide2.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let slides: HeroSlide[] = [...sampleHeroSlides];

export const resetHero = (): void => {
  slides = [...sampleHeroSlides];
};

export const setHeroSlides = (list: ReadonlyArray<HeroSlide>): void => {
  slides = list.map((s) => ({ ...s }));
};

// Universal patterns to match both Node (http://localhost) and browser
const listPattern = '*://*/api/hero';
const createPattern = '*://*/api/admin/hero';
const itemPattern = '*://*/api/admin/hero/:id';

export const handlers = [
  // Public GET /api/hero
  rest.get(listPattern, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(slides));
  }),

  // Admin POST /api/admin/hero (max 3)
  rest.post(createPattern, async (req, res, ctx) => {
    if (slides.length >= 3) {
      return res(ctx.status(400), ctx.json({ error: 'Лимит слайдов достигнут (макс. 3)' }));
    }
    const body = (await req.json()) as HeroCreateInput;
    const nowIso = new Date().toISOString();
    const newSlide: HeroSlide = {
      id: `hs_${Date.now()}`,
      title: body.title,
      subtitle: body.subtitle ?? '',
      img: body.img,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    slides.push(newSlide);
    return res(ctx.status(201), ctx.json(newSlide));
  }),

  // Admin PATCH /api/admin/hero/:id
  rest.patch(itemPattern, async (req, res, ctx) => {
    const id = (req.params as Record<string, string>).id;
    const patch = (await req.json()) as Partial<Pick<HeroSlide, 'title' | 'subtitle' | 'img'>>;
    const idx = slides.findIndex((s) => s.id === id);
    if (idx === -1) return res(ctx.status(404));
    const nowIso = new Date().toISOString();
    slides[idx] = { ...slides[idx], ...patch, updatedAt: nowIso };
    // Server route returns { ok: true }
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),

  // Admin DELETE /api/admin/hero/:id
  rest.delete(itemPattern, (req, res, ctx) => {
    const id = (req.params as Record<string, string>).id;
    slides = slides.filter((s) => s.id !== id);
    return res(ctx.status(200), ctx.json({ ok: true }));
  }),
];
