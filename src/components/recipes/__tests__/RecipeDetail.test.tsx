import { render, screen } from '@testing-library/react';
import RecipeDetail from '../RecipeDetail';
import { recipes } from '@/data/mock';

const sample = recipes[0];

describe('RecipeDetail', () => {
  it('renders ingredients and steps', () => {
    render(<RecipeDetail recipe={sample} />);

    // Ингредиенты
    sample.ingredients.forEach((ing) => {
      expect(screen.getByText(ing)).toBeInTheDocument();
    });

    // Шаги приготовления (учитываем префикс "1. ")
    sample.steps.forEach((step) => {
      expect(
        screen.getByText(new RegExp(step, 'i'))
      ).toBeInTheDocument();
    });
  });
});
