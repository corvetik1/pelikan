import nodemailer from 'nodemailer';

/**
 * Создаёт и возвращает singleton-транспортер Nodemailer, настроенный через env.
 * Переменные окружения, необходимые для работы SMTP:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (optional)
 */
interface GlobalWithMailer {
  __mailer?: nodemailer.Transporter;
}

export function getTransporter() {
  const existing = (globalThis as GlobalWithMailer).__mailer;
  if (existing) return existing;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env as Record<string, string | undefined>;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        console.warn('SMTP env vars are not fully set. Emails will be logged to console.');
    /* Fallback transporter that just prints message */
    const stub = {
      sendMail: async (options: nodemailer.SendMailOptions) => {
                console.log('[MAIL STUB]', options);
      },
    } as nodemailer.Transporter;
    (globalThis as GlobalWithMailer).__mailer = stub;
    return stub;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  (globalThis as GlobalWithMailer).__mailer = transporter;
  return transporter;
}

export async function sendQuoteReadyEmail(to: string, quoteId: string) {
  const transporter = getTransporter();
  const { FROM_EMAIL = 'no-reply@pelicanbay.local' } = process.env;

  const url = `${process.env.BASE_URL ?? 'http://localhost:3000'}/b2b/quote/${quoteId}`;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject: 'Ваше коммерческое предложение готово',
    html: `
      <p>Здравствуйте!</p>
      <p>Мы подготовили расчёт по вашей заявке <strong>${quoteId}</strong>.</p>
      <p>Посмотреть детали предложения можно по ссылке: <a href="${url}">${url}</a></p>
      <p>Спасибо за обращение.</p>
      <hr/>
      <p>С уважением, Бухта пеликанов</p>
    `,
  });
}
