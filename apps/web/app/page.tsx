import {
  VerificationDemo,
  BrowseListingsDemo,
  ConnectionDemo,
  CrossPlatformDemo,
  HowItWorksAnimated,
} from '../components/AnimatedSections';

export default async function LandingPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>

      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <span style={{ fontFamily: 'BerlinSansFB', fontSize: 22, color: '#050505' }}>RentRayda</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="/listings" style={{ fontFamily: 'AlteHaasGrotesk', fontSize: 15, color: '#050505', textDecoration: 'none' }}>Listings</a>
          <a href="#how" style={{ fontFamily: 'AlteHaasGrotesk', fontSize: 15, color: '#050505', textDecoration: 'none' }}>How it works</a>
          <a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            style={{
              fontFamily: 'AlteHaasGroteskBold', fontSize: 14, color: '#FFFFFF',
              backgroundColor: '#050505', padding: '10px 24px', borderRadius: 100,
              textDecoration: 'none',
            }}
          >
            Get the app
          </a>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#2563EB', color: '#FFFFFF',
        padding: '120px 24px 80px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow effect behind logo */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
          <img
            src="/logo.png"
            alt="RentRayda"
            width={96}
            height={96}
            style={{ borderRadius: 24, marginBottom: 40, opacity: 0.95 }}
          />

          <h1 style={{
            fontFamily: 'BerlinSansFB', fontSize: 96, lineHeight: 0.95,
            margin: '0 0 24px', letterSpacing: -2,
          }}>
            RENT<br />RAYDA
          </h1>

          <p style={{
            fontFamily: 'AlteHaasGrotesk', fontSize: 20, margin: '0 0 48px',
            opacity: 0.8, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto',
            lineHeight: 1.5,
          }}>
            Verified rentals in Pasig. No scams. No agents. No fees. Both sides verified before you connect.
          </p>

          <a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            style={{
              display: 'inline-block', padding: '18px 48px', fontSize: 17,
              fontFamily: 'AlteHaasGroteskBold',
              backgroundColor: '#FFFFFF', color: '#2563EB', borderRadius: 100,
              textDecoration: 'none',
            }}
          >
            Start browsing
          </a>

          <p style={{
            fontFamily: 'AlteHaasGrotesk', fontSize: 14, marginTop: 16, opacity: 0.5,
          }}>
            Free forever. Available on Android and iOS.
          </p>
        </div>
      </section>

      {/* ── Bold statement ────────────────────────────────────────── */}
      <section style={{ padding: '120px 24px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
        <h2 style={{
          fontFamily: 'BerlinSansFB', fontSize: 64, color: '#050505',
          lineHeight: 1.0, margin: '0 auto', maxWidth: 700, letterSpacing: -1,
        }}>
          YOU DON'T NEED CONNECTIONS IN MANILA.
        </h2>
        <p style={{
          fontFamily: 'AlteHaasGrotesk', fontSize: 18, color: '#65676B',
          margin: '24px auto 0', maxWidth: 500, lineHeight: 1.6,
        }}>
          We verify landlords AND tenants before revealing phone numbers. The scam stops here.
        </p>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <div id="how">
        <HowItWorksAnimated />
      </div>

      {/* ── Feature demos ─────────────────────────────────────────── */}
      <VerificationDemo />
      <BrowseListingsDemo />
      <ConnectionDemo />

      {/* ── Anti-Scam Block (Wise-style bold) ─────────────────────── */}
      <section style={{ padding: '120px 24px', backgroundColor: '#050505', color: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'BerlinSansFB', fontSize: 56, lineHeight: 1.0,
            margin: '0 0 32px', letterSpacing: -1,
          }}>
            WE ARE NOT LAMUDI.<br />WE ARE NOT RENTPAD.
          </h2>
          <p style={{
            fontFamily: 'AlteHaasGrotesk', fontSize: 18, color: '#9CA3AF',
            lineHeight: 1.7, margin: '0 auto', maxWidth: 540,
          }}>
            Here, everyone is verified before you connect. No fake listings. No scam agents. No money through the app. Just real landlords and real tenants, talking directly.
          </p>
          <div style={{
            marginTop: 48, display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '12px 24px', borderRadius: 100,
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <span style={{ fontFamily: 'AlteHaasGrotesk', fontSize: 14, color: '#9CA3AF' }}>
              Built for BPO workers who need housing in Metro Manila
            </span>
          </div>
        </div>
      </section>

      {/* ── Cross-Platform + Stats ─────────────────────────────── */}
      <CrossPlatformDemo />

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section style={{ padding: '120px 24px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
        <h2 style={{
          fontFamily: 'BerlinSansFB', fontSize: 48, color: '#050505',
          margin: '0 0 16px', letterSpacing: -1,
        }}>
          Ready?
        </h2>
        <p style={{
          fontFamily: 'AlteHaasGrotesk', fontSize: 18, color: '#65676B',
          margin: '0 0 40px',
        }}>
          Download the app. Get verified. Find your place.
        </p>
        <a
          href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
          style={{
            display: 'inline-block', padding: '18px 48px', fontSize: 17,
            fontFamily: 'AlteHaasGroteskBold',
            backgroundColor: '#050505', color: '#FFFFFF', borderRadius: 100,
            textDecoration: 'none',
          }}
        >
          Get RentRayda free
        </a>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{
        backgroundColor: '#FAFAFA', padding: '48px 24px',
        borderTop: '1px solid #E5E7EB',
      }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 24,
        }}>
          <span style={{ fontFamily: 'BerlinSansFB', fontSize: 18, color: '#050505' }}>RentRayda</span>
          <div style={{ display: 'flex', gap: 32 }}>
            <a href="/privacy" style={{ fontFamily: 'AlteHaasGrotesk', color: '#65676B', textDecoration: 'none', fontSize: 14 }}>Privacy</a>
            <a href="/terms" style={{ fontFamily: 'AlteHaasGrotesk', color: '#65676B', textDecoration: 'none', fontSize: 14 }}>Terms</a>
            <a href="mailto:hello@rentrayda.ph" style={{ fontFamily: 'AlteHaasGrotesk', color: '#65676B', textDecoration: 'none', fontSize: 14 }}>Contact</a>
          </div>
          <span style={{ fontFamily: 'AlteHaasGrotesk', fontSize: 13, color: '#9CA3AF' }}>Built in the Philippines</span>
        </div>
      </footer>
    </div>
  );
}
