import {
  VerificationDemo,
  BrowseListingsDemo,
  ConnectionDemo,
  CrossPlatformDemo,
  HowItWorksAnimated,
} from '../components/AnimatedSections';
import InteractiveHero from '../components/InteractiveHero';
import TrustStats from '../components/TrustStats';
import StickyNav from '../components/StickyNav';

export default async function LandingPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', overflowX: 'hidden' }}>

      <StickyNav />

      {/* ═══════════ HERO ═══════════ */}
      <InteractiveHero />

      {/* ═══════════ BOLD STATEMENT — white ═══════════ */}
      <section style={{ padding: '96px 24px 64px', backgroundColor: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* House + verified icon */}
          <div style={{ marginBottom: 24 }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <rect x="10" y="22" width="36" height="24" rx="3" fill="#DBEAFE" stroke="#2B51E3" strokeWidth="1.5"/>
              <polygon points="28,8 6,25 50,25" fill="#2B51E3"/>
              <rect x="22" y="32" width="12" height="14" rx="2" fill="#2B51E3"/>
              <circle cx="44" cy="18" r="9" fill="#16A34A"/>
              <path d="M40 18l3 3 5-5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{
            fontFamily: 'Ralgine', fontSize: 'clamp(28px, 5vw, 48px)', color: '#050505',
            lineHeight: 1.25, margin: '0 0 16px', letterSpacing: 0.5,
          }}>
            You Don&apos;t Need Connections in Manila.
          </h2>
          <p style={{
            fontFamily: 'NotoSansOsage', fontSize: 17, color: '#65676B',
            margin: '0 auto', maxWidth: 480, lineHeight: 1.65,
          }}>
            We verify landlords AND tenants before revealing phone numbers.
            The scam stops here.
          </p>
        </div>
      </section>

      {/* ═══════════ TRUST STATS — light blue-gray ═══════════ */}
      <TrustStats />

      {/* ═══════════ HOW IT WORKS — white ═══════════ */}
      <div id="how">
        <HowItWorksAnimated />
      </div>

      {/* ═══════════ VERIFICATION — light gray ═══════════ */}
      <div style={{ backgroundColor: '#F5F7FA' }}>
        <VerificationDemo />
      </div>

      {/* ═══════════ BROWSE — white ═══════════ */}
      <BrowseListingsDemo />

      {/* ═══════════ CONNECTION — light gray ═══════════ */}
      <div style={{ backgroundColor: '#F5F7FA' }}>
        <ConnectionDemo />
      </div>

      {/* ═══════════ ANTI-SCAM — dark ═══════════ */}
      <section style={{
        padding: '96px 24px', backgroundColor: '#0B0F1A', color: '#FFFFFF',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 500px 400px at 50% 30%, rgba(43,81,227,0.12) 0%, transparent 70%)
          `,
        }} />

        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{
            fontSize: 13, fontFamily: 'NotoSansOsage', color: '#60A5FA',
            fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 16px',
          }}>
            Why RentRayda
          </p>
          <h2 style={{
            fontFamily: 'Ralgine', fontSize: 'clamp(26px, 4.5vw, 44px)', lineHeight: 1.25,
            margin: '0 0 20px', letterSpacing: 0.5,
          }}>
            We Are Not Lamudi.<br />We Are Not Rentpad.
          </h2>
          <p style={{
            fontFamily: 'NotoSansOsage', fontSize: 16, color: '#9CA3AF',
            lineHeight: 1.7, margin: '0 auto 36px', maxWidth: 500,
          }}>
            Everyone is verified before you connect. No fake listings.
            No scam agents. No money through the app.
          </p>

          {/* Comparison — what's broken */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
            {[
              'Facebook Groups — no verification',
              'Lamudi — 100% negative reviews',
              'Agents — hidden fees & deposits',
            ].map((text, i) => (
              <div key={i} style={{
                padding: '8px 18px', borderRadius: 8,
                border: '1px solid rgba(228,30,63,0.25)',
                backgroundColor: 'rgba(228,30,63,0.06)',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ color: '#F87171', fontSize: 12 }}>✕</span>
                <span style={{ fontFamily: 'NotoSansOsage', fontSize: 13, color: '#D1D5DB' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* What we do */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', borderRadius: 8,
            border: '1px solid rgba(22,163,74,0.35)',
            backgroundColor: 'rgba(22,163,74,0.08)',
          }}>
            <span style={{ color: '#4ADE80', fontSize: 14 }}>✓</span>
            <span style={{ fontFamily: 'NotoSansOsage', fontSize: 14, color: '#FFFFFF' }}>
              RentRayda — both sides verified, always free
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════ CROSS-PLATFORM — white ═══════════ */}
      <CrossPlatformDemo />

      {/* ═══════════ FINAL CTA — brand blue ═══════════ */}
      <section style={{
        padding: '88px 24px', backgroundColor: '#2B51E3', color: '#FFFFFF',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 500px 350px at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
          backgroundImage: 'radial-gradient(circle, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'Ralgine', fontSize: 'clamp(28px, 5vw, 44px)',
            margin: '0 0 12px', letterSpacing: 0.5, lineHeight: 1.25,
          }}>
            Find your place.
          </h2>
          <p style={{
            fontFamily: 'NotoSansOsage', fontSize: 16, opacity: 0.85,
            margin: '0 0 32px', lineHeight: 1.6,
          }}>
            Download the app. Get verified. Connect with a real landlord today.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            style={{
              display: 'inline-block', padding: '14px 40px', fontSize: 15,
              fontFamily: 'NotoSansOsage', fontWeight: 600,
              backgroundColor: '#FFFFFF', color: '#2B51E3', borderRadius: 10,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            Get RentRayda free
          </a>
          <p style={{
            fontFamily: 'NotoSansOsage', fontSize: 12, marginTop: 14, opacity: 0.45,
          }}>
            Android and iOS. No fees. No credit card.
          </p>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer style={{
        backgroundColor: '#FAFAFA', padding: '40px 24px',
        borderTop: '1px solid #E5E7EB',
      }}>
        <div style={{
          maxWidth: 960, margin: '0 auto',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 20,
        }}>
          <span style={{ fontFamily: 'TANNimbus', fontSize: 17, color: '#050505', letterSpacing: 1.5 }}>
            rent rayda
          </span>
          <div style={{ display: 'flex', gap: 28 }}>
            <a href="/privacy" style={{ fontFamily: 'NotoSansOsage', color: '#65676B', textDecoration: 'none', fontSize: 13 }}>Privacy</a>
            <a href="/terms" style={{ fontFamily: 'NotoSansOsage', color: '#65676B', textDecoration: 'none', fontSize: 13 }}>Terms</a>
            <a href="mailto:hello@rentrayda.ph" style={{ fontFamily: 'NotoSansOsage', color: '#65676B', textDecoration: 'none', fontSize: 13 }}>Contact</a>
          </div>
          <span style={{ fontFamily: 'NotoSansOsage', fontSize: 12, color: '#9CA3AF' }}>
            Built in the Philippines
          </span>
        </div>
      </footer>
    </div>
  );
}
