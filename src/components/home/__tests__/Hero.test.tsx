import { render, screen } from '@testing-library/react';
import Hero from '../Hero';

jest.mock('../Hero', () => {
  const Actual = jest.requireActual('../Hero');
  return {
    __esModule: true,
    default: Actual.default,
  };
});

describe('Hero component', () => {
  it('renders first slide heading', () => {
    render(<Hero />);
    const heading = screen.getByRole('heading', {
      name: /от океана к вашему столу/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
