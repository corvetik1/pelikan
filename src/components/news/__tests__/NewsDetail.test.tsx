import { render, screen } from '@testing-library/react';
import Providers from '@/providers/Providers';
import NewsDetail from '../NewsDetail';
import { news } from '@/data/mock';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

// Stub react-markdown (ESM) for Jest (CommonJS) environment
import React from 'react';
jest.mock('react-markdown', () => {
  return { __esModule: true, default: ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children) };
});
// Stub remark-gfm and rehype-sanitize (ESM) for Jest
jest.mock('remark-gfm', () => () => null);
jest.mock('rehype-sanitize', () => () => null);
// Mock next/image to keep Jest happy
jest.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      return React.createElement('img', { ...props, alt: props.alt ?? 'image' });
    },
  };
});

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
    expect(
      screen.getByText((content, node) => node?.textContent?.startsWith(formattedDate) ?? false)
    ).toBeInTheDocument();

    // контентные абзацы
    sample.content.forEach((p) => {
      const firstWord = p.split(' ')[0];
      expect(screen.getByText((c) => c.includes(firstWord))).toBeInTheDocument();
    });
  });
});
