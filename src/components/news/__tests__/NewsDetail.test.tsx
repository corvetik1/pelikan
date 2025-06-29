import { render, screen } from '@testing-library/react';
import NewsDetail from '../NewsDetail';
import { news } from '@/data/mock';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const sample = news[0];

describe('NewsDetail', () => {
  it('renders date and paragraphs', () => {
    render(<NewsDetail article={sample} />);

    // дата
    const formattedDate = dayjs(sample.date).format('D MMMM YYYY');
    expect(screen.getByText(formattedDate)).toBeInTheDocument();

    // контентные абзацы
    sample.content.forEach((p) => {
      expect(screen.getByText(p)).toBeInTheDocument();
    });
  });
});
