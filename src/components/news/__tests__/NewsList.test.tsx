import { render, screen } from '@testing-library/react';
import NewsList from '../NewsList';
import { news as mockNews } from '@/data/mock';
import type { AdminNews } from '@/types/admin';

const articles: AdminNews[] = mockNews.map((n) => ({
  id: n.id,
  slug: n.slug,
  title: n.title,
  excerpt: n.excerpt,
  content: n.content.join('\n\n'),
  date: n.date,
  img: n.img,
}));

describe('NewsList', () => {
  it('renders all news cards', () => {
    render(<NewsList articles={articles} />);

    articles.forEach((n) => {
      if (n.img) {
        expect(screen.getByRole('img', { name: n.title })).toBeInTheDocument();
      }
    });
  });
});
