import DashboardView from '@/components/admin/DashboardView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin – Дашборд',
};

export default async function AdminDashboardPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/admin/dashboard`, { cache: 'no-store' });
  const data = await res.json();

  return <DashboardView data={data} />;
}
