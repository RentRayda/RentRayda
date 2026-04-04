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
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #2B51E3 0%, #1a3a9e 100%)', color: '#FFFFFF', padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <img
            src="/logo.png"
            alt="RentRayda"
            width={80}
            height={80}
            style={{ borderRadius: 20, marginBottom: 24 }}
          />
          <h1 style={{ fontSize: 48, fontWeight: 700, margin: '0 0 16px', lineHeight: 1.1 }}>
            RentRayda
          </h1>
          <p style={{ fontSize: 24, fontWeight: 400, margin: '0 0 8px', opacity: 0.9 }}>
            Find verified rentals. No scams. No agents.
          </p>
          <p style={{ fontSize: 16, margin: '0 0 40px', opacity: 0.7 }}>
            Both landlords and tenants are verified before connecting.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            style={{
              display: 'inline-block', padding: '16px 40px', fontSize: 18, fontWeight: 600,
              backgroundColor: '#FFFFFF', color: '#2B51E3', borderRadius: 12,
              textDecoration: 'none',
            }}
          >
            Download the App
          </a>
        </div>
      </section>

      {/* Trust Counter */}
      {metrics && (
        <section style={{ backgroundColor: '#EBF0FC', padding: '24px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: '#2B51E3', fontWeight: 500, margin: 0 }}>
            {metrics.verifiedLandlords} verified landlords and {metrics.verifiedTenants} verified tenants in Pasig
          </p>
        </section>
      )}

      {/* How It Works */}
      <section style={{ padding: '80px 20px', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 48 }}>
          How It Works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
          {[
            { icon: '📱', title: 'Sign Up', desc: 'Register with your phone number. Takes 1 minute.' },
            { icon: '🛡️', title: 'Get Verified', desc: 'Upload your ID and proof. Our team reviews in 24-48 hours.' },
            { icon: '🤝', title: 'Connect', desc: 'Once both sides are verified, phone numbers are revealed. No middleman.' },
          ].map((step, i) => (
            <div key={i} style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{step.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px' }}>{step.title}</h3>
              <p style={{ fontSize: 16, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Anti-Scam Block */}
      <section style={{ backgroundColor: '#FAFAFA', padding: '64px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
            We are not Lamudi. We are not Rentpad.
          </h2>
          <p style={{ fontSize: 18, color: '#6B7280', lineHeight: 1.6, margin: '0 0 24px' }}>
            Here, everyone is verified — before you connect, we check first.
            No fake listings. No scam agents. No money through the app.
            Just verified landlords and verified tenants, connecting directly.
          </p>
          <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.6 }}>
            Built for BPO workers in Pasig who need a safe way to find a room without knowing anyone in Manila.
          </p>
        </div>
      </section>

      {/* Browse Listings CTA */}
      <section style={{ padding: '64px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
          Browse Verified Listings
        </h2>
        <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 32 }}>
          See what's available in Pasig and Mandaluyong right now.
        </p>
        <a
          href="/listings"
          style={{
            display: 'inline-block', padding: '14px 32px', fontSize: 16, fontWeight: 600,
            backgroundColor: '#2B51E3', color: '#FFFFFF', borderRadius: 8,
            textDecoration: 'none',
          }}
        >
          View Listings
        </a>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1A1A2E', color: '#9CA3AF', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#FFFFFF', margin: '0 0 16px' }}>RentRayda</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
            <a href="/privacy" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: 14 }}>Privacy Policy</a>
            <a href="/terms" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: 14 }}>Terms of Service</a>
            <a href="mailto:hello@rentrayda.ph" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: 14 }}>Contact</a>
          </div>
          <p style={{ fontSize: 14, margin: 0 }}>Built in the Philippines 🇵🇭</p>
        </div>
      </footer>
    </div>
  );
}
