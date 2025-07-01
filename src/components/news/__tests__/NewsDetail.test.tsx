import { render, screen } from '@testing-library/react';
import Providers from '@/providers/Providers';
import NewsDetail from '../NewsDetail';
import { news } from '@/data/mock';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const sample = news[0];

describe('NewsDetail', () => {
  it('renders date and paragraphs', () => {
    render(
      <Providers>
        <NewsDetail article={sample} />
      </Providers>
    );

    // дата
    const formattedDate = dayjs(sample.date).format('D MMMM YYYY');
    expect(screen.getByText(formattedDate)).toBeInTheDocument();

    // контентные абзацы
    sample.content.forEach((p) => {
      expect(screen.getByText(p)).toBeInTheDocument();
    });
  });
});
