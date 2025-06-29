import { render, screen } from '@testing-library/react';
import NewsList from '../NewsList';
import { news } from '@/data/mock';

describe('NewsList', () => {
  it('renders all news cards', () => {
    render(<NewsList articles={news} />);

    news.forEach((n) => {
      expect(screen.getByRole('img', { name: n.title })).toBeInTheDocument();
    });
  });
});
