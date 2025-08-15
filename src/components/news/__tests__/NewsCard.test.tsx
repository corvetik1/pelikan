import { render, screen } from '@testing-library/react';
import NewsCard from '../NewsCard';
import { news as mockNews } from '@/data/mock';
import type { AdminNews } from '@/types/admin';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const sample: AdminNews = {
  id: mockNews[0].id,
  slug: mockNews[0].slug,
  title: mockNews[0].title,
  excerpt: mockNews[0].excerpt,
  content: mockNews[0].content.join('\n\n'),
  date: mockNews[0].date,
  img: mockNews[0].img,
};

describe('NewsCard', () => {
  it('renders title, image, date and link', () => {
    render(<NewsCard article={sample} />);

    // image
    expect(screen.getByRole('img', { name: sample.title })).toBeInTheDocument();

    // title
    expect(screen.getByText(sample.title)).toBeInTheDocument();

    // date chip
    const formattedDate = dayjs(sample.date).format('D MMMM YYYY');
    expect(screen.getByText(formattedDate)).toBeInTheDocument();

    // link
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/news/${sample.slug}`);
  });
});
