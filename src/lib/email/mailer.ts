export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

const RESEND_API_URL = 'https://api.resend.com/emails';

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = getEnv('RESEND_API_KEY');
  const from = getEnv('RESEND_FROM');

  const body = JSON.stringify({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Email send failed: ${res.status} ${text}`);
  }
}
