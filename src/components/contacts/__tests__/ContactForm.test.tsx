import { render, screen } from '@testing-library/react';

// Increase default timeout for this test suite (animations/user typing may be slow in CI)
jest.setTimeout(15000);
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

describe('ContactForm', () => {
  it('validates required fields and shows success alert', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    // submit empty
    await user.click(screen.getByRole('button', { name: /отправить/i }));

    expect(await screen.findByText('Укажите имя')).toBeInTheDocument();
    expect(await screen.findByText('Укажите email')).toBeInTheDocument();
    expect(await screen.findByText('Введите сообщение')).toBeInTheDocument();

    // fill with valid data
    await user.type(screen.getByLabelText('Имя'), 'Иван');
    await user.type(screen.getByLabelText('Email'), 'ivan@example.com');
    await user.type(screen.getByLabelText('Сообщение'), 'Привет!');

    await user.click(screen.getByRole('button', { name: /отправить/i }));

    expect(await screen.findByText('Сообщение отправлено!')).toBeInTheDocument();
  });
});
