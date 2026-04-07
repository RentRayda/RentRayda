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
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          @font-face {
            font-family: 'TANNimbus';
            src: url('/fonts/TAN-NIMBUS.ttf') format('truetype');
            font-weight: 400;
            font-display: swap;
          }
          @font-face {
            font-family: 'NotoSansOsage';
            src: url('/fonts/NotoSansOsage-Regular.ttf') format('truetype');
            font-weight: 400;
            font-display: swap;
          }
          @font-face {
            font-family: 'Ralgine';
            src: url('/fonts/Ralgine-9MMJ2.otf') format('opentype');
            font-weight: 400;
            font-display: swap;
          }
        ` }} />
      </head>
      <body style={{ margin: 0, fontFamily: 'NotoSansOsage, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#050505', backgroundColor: '#FFFFFF' }}>
        {children}
      </body>
    </html>
  );
}
