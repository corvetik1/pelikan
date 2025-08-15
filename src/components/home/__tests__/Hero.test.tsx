import { render, screen } from '@testing-library/react';
import HeroClient from '../HeroClient';
import Providers from '@/providers/Providers';

// No need to mock server component; we render client directly with known slides

describe('Hero component', () => {
  it('renders first slide heading', () => {
    render(
      <Providers>
        <HeroClient
          slides={[
            {
              id: 'hero-slide-1',
              title: 'От океана к вашему столу',
              subtitle: 'Премиальные морепродукты напрямую от «Бухты пеликанов»',
              img: '/hero/slide1.jpg',
            },
            {
              id: 'hero-slide-2',
              title: '15 лет экспертизы',
              subtitle: 'Современное производство полного цикла',
              img: '/hero/slide2.jpg',
            },
          ]}
        />
      </Providers>
    );
    const heading = screen.getByRole('heading', {
      name: /от океана к вашему столу/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
