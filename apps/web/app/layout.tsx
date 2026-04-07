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
            font-family: 'BobbyJonesSoft';
            src: url('/fonts/BobbyJonesSoft.otf') format('opentype');
            font-weight: 400;
            font-display: swap;
          }
          @font-face {
            font-family: 'BerlinSansFB';
            src: url('/fonts/BerlinSansFB.ttf') format('truetype');
            font-weight: 400;
            font-display: swap;
          }
          @font-face {
            font-family: 'AlteHaasGrotesk';
            src: url('/fonts/AlteHaasGroteskRegular.ttf') format('truetype');
            font-weight: 400;
            font-display: swap;
          }
          @font-face {
            font-family: 'AlteHaasGrotesk';
            src: url('/fonts/AlteHaasGroteskBold.ttf') format('truetype');
            font-weight: 700;
            font-display: swap;
          }
          @font-face {
            font-family: 'AlteHaasGroteskBold';
            src: url('/fonts/AlteHaasGroteskBold.ttf') format('truetype');
            font-weight: 400;
            font-display: swap;
          }
        ` }} />
      </head>
      <body style={{ margin: 0, fontFamily: 'AlteHaasGrotesk, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#050505', backgroundColor: '#FFFFFF' }}>
        {children}
      </body>
    </html>
  );
}
