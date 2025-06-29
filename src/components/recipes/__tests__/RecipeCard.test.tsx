import { render, screen } from '@testing-library/react';
import RecipeCard from '../RecipeCard';
import { recipes } from '@/data/mock';

const sample = recipes[0];

describe('RecipeCard', () => {
  it('renders title, image and link', () => {
    render(<RecipeCard recipe={sample} />);

    expect(screen.getByRole('img', { name: sample.title })).toBeInTheDocument();
    expect(screen.getByText(sample.title)).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/recipes/${sample.slug}`);
  });

  it('shows cooking time chip', () => {
    render(<RecipeCard recipe={sample} />);
    expect(screen.getByText(new RegExp(`${sample.cookingTime}`))).toBeInTheDocument();
  });
});
