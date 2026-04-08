import type { Metadata } from 'next';
import AdminNav from './AdminNav';

export const metadata: Metadata = {
  title: 'RentRayda Admin',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="max-w-[1200px] mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
