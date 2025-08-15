import { formatDate, statusChipColor } from '../../../src/app/admin/subscribers/utils';
import type { SubscriptionStatus } from '../../../src/types/subscriber';

describe('subscribers utils', () => {
  test('formatDate returns RU formatted date', () => {
    const iso = '2025-01-02T03:04:00.000Z';
    const out = formatDate(iso);
    // Expect DD.MM.YYYY, HH:MM or DD.MM.YYYY HH:MM in ru-RU locale
    expect(out).toMatch(/^\d{2}\.\d{2}\.\d{4},?\s\d{2}:\d{2}$/);
  });

  test('statusChipColor maps statuses', () => {
    const cases: Array<{ s: SubscriptionStatus; c: 'default' | 'success' | 'warning' }> = [
      { s: 'subscribed', c: 'success' },
      { s: 'unsubscribed', c: 'default' },
      { s: 'bounced', c: 'warning' },
    ];
    for (const { s, c } of cases) {
      expect(statusChipColor(s)).toBe(c);
    }
  });
});
