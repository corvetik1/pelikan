import { render, screen } from '@testing-library/react';
import RecipesList from '../RecipesList';
import { recipes } from '@/data/mock';

describe('RecipesList', () => {
  it('renders all recipe cards', () => {
    render(<RecipesList recipes={recipes} />);
    // количество изображений с alt = title должно равняться количеству рецептов
    const cards = recipes.map((r) => screen.getByRole('img', { name: r.title }));
    expect(cards).toHaveLength(recipes.length);
  });
});
