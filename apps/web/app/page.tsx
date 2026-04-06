import {
  VerificationDemo,
  BrowseListingsDemo,
  ConnectionDemo,
  CrossPlatformDemo,
  HowItWorksAnimated,
} from '../components/AnimatedSections';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getMetrics() {
  try {
    const res = await fetch(`${API_URL}/api/admin/metrics`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()).data;
  } catch { return null; }
}

export default async function LandingPage() {
  const metrics = await getMetrics();

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1D4ED8 0%, #60A5FA 100%)',
        color: '#FFFFFF', padding: '100px 20px 80px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle animated gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <img
            src="/logo.png"
            alt="RentRayda"
            width={80}
            height={80}
            style={{ borderRadius: 20, marginBottom: 24 }}
          />
          <h1 style={{
            fontSize: 56, fontFamily: 'BerlinSansFB', margin: '0 0 16px',
            lineHeight: 1.1, letterSpacing: -0.5,
          }}>
            RentRayda
          </h1>
          <p style={{
            fontSize: 26, fontFamily: 'BobbyJonesSoft', margin: '0 0 8px', opacity: 0.95,
          }}>
            Find verified rentals. No scams. No agents.
          </p>
          <p style={{ fontSize: 16, fontFamily: 'AlteHaasGrotesk', margin: '0 0 40px', opacity: 0.7 }}>
            Both landlords and tenants are verified before connecting.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
              style={{
                display: 'inline-block', padding: '16px 40px', fontSize: 18,
                fontFamily: 'AlteHaasGroteskBold',
                backgroundColor: '#FFFFFF', color: '#2563EB', borderRadius: 12,
                textDecoration: 'none', transition: 'transform 0.2s ease',
              }}
            >
              Download the App
            </a>
            <a
              href="/listings"
              style={{
                display: 'inline-block', padding: '16px 40px', fontSize: 18,
                fontFamily: 'AlteHaasGroteskBold',
                backgroundColor: 'transparent', color: '#FFFFFF', borderRadius: 12,
                textDecoration: 'none', border: '2px solid rgba(255,255,255,0.4)',
                transition: 'transform 0.2s ease',
              }}
            >
              Browse Listings
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust Counter ──────────────────────────────────────── */}
      {metrics && (
        <section style={{ backgroundColor: '#DBEAFE', padding: '20px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 15, fontFamily: 'AlteHaasGrotesk', color: '#1D4ED8', margin: 0 }}>
            <strong style={{ fontFamily: 'AlteHaasGroteskBold' }}>{metrics.verifiedLandlords}</strong> verified landlords and{' '}
            <strong style={{ fontFamily: 'AlteHaasGroteskBold' }}>{metrics.verifiedTenants}</strong> verified tenants in Pasig
          </p>
        </section>
      )}

      {/* ── How It Works (animated cards) ──────────────────────── */}
      <HowItWorksAnimated />

      {/* ── Feature 1: Verification Demo ───────────────────────── */}
      <VerificationDemo />

      {/* ── Feature 2: Browse Listings Demo ────────────────────── */}
      <BrowseListingsDemo />

      {/* ── Feature 3: Connection Demo ─────────────────────────── */}
      <ConnectionDemo />

      {/* ── Anti-Scam Block ────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F0F2F5', padding: '80px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontFamily: 'BerlinSansFB', marginBottom: 16 }}>
            We are not Lamudi. We are not Rentpad.
          </h2>
          <p style={{ fontSize: 18, fontFamily: 'AlteHaasGrotesk', color: '#65676B', lineHeight: 1.6, margin: '0 0 24px' }}>
            Here, everyone is verified — before you connect, we check first.
            No fake listings. No scam agents. No money through the app.
            Just verified landlords and verified tenants, connecting directly.
          </p>
          <p style={{ fontSize: 16, fontFamily: 'BobbyJonesSoft', color: '#65676B', lineHeight: 1.6 }}>
            Built for BPO workers in Pasig who need a safe way to find a room without knowing anyone in Manila.
          </p>
        </div>
      </section>

      {/* ── Cross-Platform + Stats ─────────────────────────────── */}
      <CrossPlatformDemo />

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#050505', color: '#8A8D91', padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontSize: 20, fontFamily: 'BerlinSansFB', color: '#FFFFFF', margin: '0 0 16px' }}>RentRayda</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
            <a href="/privacy" style={{ color: '#8A8D91', textDecoration: 'none', fontSize: 14, fontFamily: 'AlteHaasGrotesk' }}>Privacy Policy</a>
            <a href="/terms" style={{ color: '#8A8D91', textDecoration: 'none', fontSize: 14, fontFamily: 'AlteHaasGrotesk' }}>Terms of Service</a>
            <a href="mailto:hello@rentrayda.ph" style={{ color: '#8A8D91', textDecoration: 'none', fontSize: 14, fontFamily: 'AlteHaasGrotesk' }}>Contact</a>
          </div>
          <p style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', margin: 0 }}>Built in the Philippines</p>
        </div>
      </footer>
    </div>
  );
}
