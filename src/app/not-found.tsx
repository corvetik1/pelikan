



import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 16px' }} role="alert">
      <h1 style={{ fontSize: 48, fontWeight: 600, marginBottom: 24 }}>404&nbsp;</h1>
      <p style={{ fontSize: 20, marginBottom: 32 }}>К сожалению, такой страницы не существует.</p>
      <Link href="/" style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#1976d2',
          color: '#fff',
          borderRadius: 4,
          textDecoration: 'none'
        }}>
        На&nbsp;главную
      </Link>
    </div>
  );
}
