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
import Wordmark from '../components/Wordmark';
import SectionDivider from '../components/SectionDivider';
import Testimonials from '../components/Testimonials';

export default async function LandingPage() {
  return (
    <div className="bg-surface overflow-x-hidden">

      <StickyNav />

      {/* ═══ HERO ═══ */}
      <InteractiveHero />

      {/* ═══ BOLD STATEMENT — generous Igloo-level spacing ═══ */}
      <section className="section-padding bg-surface text-center relative">
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #2D79BF 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="max-w-[var(--max-width-narrow)] mx-auto relative">
          <div className="mb-8">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="mx-auto">
              <rect x="10" y="22" width="36" height="24" rx="3" fill="#DBEAFE" stroke="#2D79BF" strokeWidth="1.5"/>
              <polygon points="28,8 6,25 50,25" fill="#2D79BF"/>
              <rect x="22" y="32" width="12" height="14" rx="2" fill="#2D79BF"/>
              <circle cx="44" cy="18" r="9" fill="#16A34A"/>
              <path d="M40 18l3 3 5-5" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="font-display font-bold text-fluid-headline text-text-primary mb-6">
            You Don&apos;t Need Connections in Manila.
          </h2>
          <p className="font-heading text-fluid-body-lg text-text-secondary max-w-[520px] mx-auto">
            We verify landlords AND tenants before revealing phone numbers.
            The scam stops here.
          </p>
        </div>
      </section>

      <SectionDivider variant="dots" />

      {/* ═══ TRUST STATS ═══ */}
      <TrustStats />

      <SectionDivider variant="diamonds" />

      {/* ═══ HOW IT WORKS ═══ */}
      <div id="how">
        <HowItWorksAnimated />
      </div>

      <SectionDivider variant="tarsier" />

      {/* ═══ VERIFICATION DEMO ═══ */}
      <div className="bg-background">
        <VerificationDemo />
      </div>

      {/* ═══ BROWSE LISTINGS DEMO ═══ */}
      <BrowseListingsDemo />

      <SectionDivider variant="dots" />

      {/* ═══ CONNECTION DEMO ═══ */}
      <div className="bg-background">
        <ConnectionDemo />
      </div>

      {/* ═══ ANTI-SCAM — dark cinematic section ═══ */}
      <section className="section-padding bg-[#0B0F1A] text-white text-center relative overflow-hidden">
        {/* Brand glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 30%, rgba(45,121,191,0.12) 0%, transparent 70%)' }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* Tarsier watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.025] pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="11" r="8" /><circle cx="8" cy="9" r="3.5" /><circle cx="16" cy="9" r="3.5" />
            <ellipse cx="5" cy="4" rx="2.5" ry="3" /><ellipse cx="19" cy="4" rx="2.5" ry="3" />
          </svg>
        </div>

        <div className="relative z-[1] max-w-[var(--max-width-narrow)] mx-auto">
          <p className="text-sm font-semibold text-brand-bright tracking-[0.2em] uppercase mb-6">
            Why RentRayda
          </p>
          <h2 className="font-display font-bold text-fluid-headline text-white mb-6">
            We Are Not Lamudi.<br />We Are Not Rentpad.
          </h2>
          <p className="font-heading text-fluid-body-lg text-[#9CA3AF] max-w-[500px] mx-auto mb-12">
            Everyone is verified before you connect. No fake listings.
            No scam agents. No money through the app.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[
              'Facebook Groups — no verification',
              'Lamudi — 100% negative reviews',
              'Agents — hidden fees & deposits',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-danger/20 bg-danger/[0.05]">
                <span className="text-xs text-red-400">✕</span>
                <span className="text-sm text-[#D1D5DB]">{text}</span>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-verified/30 bg-verified/[0.06]">
            <span className="text-sm text-[#4ADE80]">✓</span>
            <span className="text-sm text-white font-medium">
              RentRayda — both sides verified, always free
            </span>
          </div>
        </div>
      </section>

      <SectionDivider variant="zigzag" />

      {/* ═══ CROSS-PLATFORM ═══ */}
      <CrossPlatformDemo />

      {/* ═══ TESTIMONIALS ═══ */}
      <Testimonials />

      <SectionDivider variant="dots" />

      {/* ═══ FINAL CTA ═══ */}
      <section className="section-padding bg-brand text-white text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 45% 35% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)' }}
        />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="relative z-[1] max-w-[540px] mx-auto">
          <h2 className="font-display font-bold text-fluid-headline mb-4">
            Find your place.
          </h2>
          <p className="font-heading text-fluid-body-lg opacity-85 mb-12">
            Download the app. Get verified. Connect with a real landlord today.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            className="inline-flex items-center gap-2.5 px-10 py-4 text-base font-semibold bg-white text-brand rounded-2xl no-underline shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-shadow duration-500"
          >
            Get RentRayda free
          </a>
          <p className="text-xs mt-8 opacity-35">
            Android and iOS. No fees. No credit card.
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#FAFAFA] section-padding-sm border-t border-divider">
        <div className="max-w-[var(--max-width)] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <Wordmark />
          <div className="flex gap-8">
            <a href="/privacy" className="text-sm text-text-secondary no-underline hover:text-text-primary transition-colors duration-300">Privacy</a>
            <a href="/terms" className="text-sm text-text-secondary no-underline hover:text-text-primary transition-colors duration-300">Terms</a>
            <a href="mailto:hello@rentrayda.ph" className="text-sm text-text-secondary no-underline hover:text-text-primary transition-colors duration-300">Contact</a>
          </div>
          <span className="text-xs text-text-tertiary">
            Built in the Philippines
          </span>
        </div>
      </footer>
    </div>
  );
}
