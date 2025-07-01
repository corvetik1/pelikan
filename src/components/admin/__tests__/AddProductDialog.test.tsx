import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddProductDialog from '../AddProductDialog';
import { categories } from '@/data/mock';

jest.setTimeout(10000);

describe('AddProductDialog', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onCreate: jest.fn(),
  };

  it('disables create button when form invalid and enables when valid', async () => {
    const user = userEvent.setup();
    render(<AddProductDialog {...defaultProps} />);

    const createBtn = screen.getByRole('button', { name: /создать/i });
    expect(createBtn).toBeDisabled();

    await user.type(screen.getByLabelText(/Название/i), 'Тест');
    await user.type(screen.getByLabelText(/Цена/i), '123');
    await user.type(screen.getByLabelText(/Вес/i), '100 г');

    expect(createBtn).toBeEnabled();
  });

  it('calls onCreate with trimmed/typed data and resets form', async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn();
    render(<AddProductDialog {...defaultProps} onCreate={onCreate} />);

    await user.type(screen.getByLabelText(/Название/i), '  Тестовый  ');
    await user.type(screen.getByLabelText(/Цена/i), '200');
    await user.type(screen.getByLabelText(/Вес/i), '200 г');

    // select different category
    await user.click(screen.getByLabelText(/Категория/i));
    await user.click(screen.getByRole('option', { name: categories[1].title }));

    await user.click(screen.getByRole('button', { name: /создать/i }));

    expect(onCreate).toHaveBeenCalledWith({
      name: 'Тестовый',
      price: 200,
      weight: '200 г',
      category: categories[1].slug,
      img: '',
    });

    // form should be reset – create button disabled again
    expect(screen.getByRole('button', { name: /создать/i })).toBeDisabled();
  });

  it('calls onClose when cancel clicked', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<AddProductDialog {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /отмена/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
