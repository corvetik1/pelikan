import type { SubscriptionStatus } from '@/types/subscriber';

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function statusChipColor(status: SubscriptionStatus): 'default' | 'success' | 'warning' {
  switch (status) {
    case 'subscribed':
      return 'success';
    case 'unsubscribed':
      return 'default';
    case 'bounced':
      return 'warning';
    default:
      return 'default';
  }
}
