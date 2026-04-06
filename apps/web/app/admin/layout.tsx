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
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F2F5' }}>
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #CED0D4',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#2563EB', fontFamily: 'BerlinSansFB' }}>RentRayda</span>
          <span style={{ fontSize: 14, color: '#65676B' }}>Admin Dashboard</span>
        </div>
        <nav style={{ display: 'flex', gap: 24 }}>
          <a href="/admin/dashboard" style={{ fontSize: 14, color: '#050505', textDecoration: 'none' }}>
            Dashboard
          </a>
          <a href="/admin/verifications" style={{ fontSize: 14, color: '#050505', textDecoration: 'none' }}>
            Verifications
          </a>
          <a href="/admin/reports" style={{ fontSize: 14, color: '#050505', textDecoration: 'none' }}>
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
