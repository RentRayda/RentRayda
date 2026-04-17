import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RentRayda — Verified rentals for provincial migrants in Pasig/Ortigas',
  description: 'Verified rentals in Pasig/Ortigas for BPO new hires, students, fresh grads, and OFW families. Scam-protected. Landlord-safe. Browse free.',
  openGraph: {
    title: 'RentRayda — Verified rentals for provincial migrants in Pasig/Ortigas',
    description: 'Verified rentals in Pasig/Ortigas. Scam-protected. Landlord-safe. Browse free.',
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
