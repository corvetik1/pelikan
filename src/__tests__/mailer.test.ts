// jest globals available via @types/jest

// mock nodemailer before importing mailer
jest.mock('nodemailer', () => {
  const createTransport = jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  });
  return { __esModule: true, default: { createTransport } };
});

import nodemailer from 'nodemailer';
import { sendQuoteReadyEmail } from '@/lib/mailer';

describe('mailer', () => {
  beforeEach(() => {
    // сброс кеша синглтона, чтобы createTransport вызывался каждый тест
    (globalThis as { __mailer?: unknown }).__mailer = undefined;
    process.env.SMTP_HOST = 'smtp.test';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user@test';
    process.env.SMTP_PASS = 'pass';
    process.env.SMTP_SECURE = 'false';
    process.env.FROM_EMAIL = 'noreply@test';
    process.env.BASE_URL = 'http://localhost:3000';
  });

  it('should send email with correct params', async () => {
    const createTransport = (nodemailer as unknown as { createTransport: jest.Mock }).createTransport;

    await sendQuoteReadyEmail('client@example.com', 'quote123');
    const transport = createTransport.mock.results[0]?.value as { sendMail: jest.Mock };

    expect(createTransport).toHaveBeenCalledWith({
      host: 'smtp.test',
      port: 587,
      secure: false,
      auth: { user: 'user@test', pass: 'pass' },
    });

    expect(transport.sendMail).toHaveBeenCalled();
    const callArgs = transport.sendMail.mock.calls[0][0];
    expect(callArgs.to).toBe('client@example.com');
    expect(callArgs.subject).toContain('коммерческое');
    expect(callArgs.html).toContain('quote123');
  });
});
