import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RentRayda — Verified Rentals in Pasig',
  description: 'Find verified rentals in Pasig and Mandaluyong. No scams. No agents. Both landlords and tenants are verified before connecting.',
  openGraph: {
    title: 'RentRayda — Verified Rentals in Pasig',
    description: 'Find verified rentals. No scams. No agents. Everyone is verified.',
    siteName: 'RentRayda',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#1A1A2E', backgroundColor: '#FFFFFF' }}>
        {children}
      </body>
    </html>
  );
}
