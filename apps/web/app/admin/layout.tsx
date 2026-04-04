import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RentRayda Admin',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#2B51E3' }}>RentRayda</span>
          <span style={{ fontSize: 14, color: '#6B7280' }}>Admin Dashboard</span>
        </div>
        <nav style={{ display: 'flex', gap: 24 }}>
          <a href="/admin/dashboard" style={{ fontSize: 14, color: '#1A1A2E', textDecoration: 'none' }}>
            Dashboard
          </a>
          <a href="/admin/verifications" style={{ fontSize: 14, color: '#1A1A2E', textDecoration: 'none' }}>
            Verifications
          </a>
          <a href="/admin/reports" style={{ fontSize: 14, color: '#1A1A2E', textDecoration: 'none' }}>
            Reports
          </a>
        </nav>
      </header>
      <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
