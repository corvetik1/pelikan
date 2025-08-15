export function siteOrigin(): string {
  const raw: string | undefined = process.env.NEXT_PUBLIC_SITE_URL;
  if (typeof raw === 'string' && raw.length > 0) {
    return raw.replace(/\/$/, '');
  }
  // Fallback for local dev when env not set (only used in server contexts if needed)
  return 'http://localhost:3000';
}
