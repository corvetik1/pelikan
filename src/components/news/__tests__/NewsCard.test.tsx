import { render, screen } from '@testing-library/react';
import NewsCard from '../NewsCard';
import { news } from '@/data/mock';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const sample = news[0];

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
