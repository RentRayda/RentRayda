import type { Metadata } from 'next';
import './globals.css';

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
      <body>
        {children}
      </body>
    </html>
  );
}
