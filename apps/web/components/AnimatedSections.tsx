'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── Premium easing (Igloo-inspired) ── */
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, delay, ease: EASE },
});

/* ── Section layout wrapper — responsive two-column ── */
function FeatureSection({
  tag, heading, body, children, phoneContent, reversed = false, bg = 'bg-surface',
}: {
  tag: string; heading: ReactNode; body: string;
  children?: ReactNode; phoneContent: ReactNode;
  reversed?: boolean; bg?: string;
}) {
  return (
    <section className={`section-padding ${bg}`}>
      <div className={`max-w-[var(--max-width)] mx-auto flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 md:gap-24`}>
        {/* Text column */}
        <div className="flex-1 max-w-[480px]">
          <motion.p {...fadeUp()} className="text-sm font-semibold text-brand tracking-[0.15em] uppercase mb-4">
            {tag}
          </motion.p>
          <motion.h2 {...fadeUp(0.08)} className="font-display font-bold text-fluid-headline text-text-primary mb-5">
            {heading}
          </motion.h2>
          <motion.p {...fadeUp(0.16)} className="text-fluid-body-lg text-text-secondary mb-10">
            {body}
          </motion.p>
          {children && <motion.div {...fadeUp(0.24)}>{children}</motion.div>}
        </div>

        {/* Phone column */}
        <motion.div {...fadeUp(0.15)} className="flex-shrink-0">
          <PhoneMockup>{phoneContent}</PhoneMockup>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Phone Mockup — realistic frame ── */
function PhoneMockup({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[272px] h-[556px] rounded-[40px] border-[3px] border-[#1A1A2E] bg-surface overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12),0_8px_20px_rgba(0,0,0,0.08)]">
      {/* Dynamic Island */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[90px] h-[24px] bg-[#1A1A2E] rounded-full z-10" />
      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-[#1A1A2E]/20 rounded-full z-10" />
      {/* Screen */}
      <div className="w-full h-full overflow-hidden rounded-[37px]">
        {children}
      </div>
    </div>
  );
}

/* ── Feature 1: Verification Flow ── */
export function VerificationDemo() {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 3000),
      setTimeout(() => setStep(4), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  const steps = [
    { label: 'Upload your ID', done: step >= 1 },
    { label: 'Take a quick selfie', done: step >= 2 },
    { label: 'Get verified in 24-48hrs', done: step >= 3 },
  ];

  return (
    <div ref={ref}>
      <FeatureSection
        tag="Trust First"
        heading={<>Verify once,<br />connect safely</>}
        body="Upload your government ID and a selfie. Our team reviews it in 24-48 hours. Once verified, landlords know you are real. And you know they are too."
        phoneContent={
          <div className="pt-9 h-full bg-background">
            <div className="px-5 py-3 bg-surface border-b border-divider">
              <span className="text-sm font-medium text-text-primary">Verify your ID</span>
            </div>
            <div className="p-5">
              {/* Progress bar */}
              <div className="h-1 bg-input rounded-full mb-5 overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(step, 3) * 33.3}%` }}
                />
              </div>

              {/* ID area */}
              <div className={`w-full h-[110px] rounded-xl mb-4 flex items-center justify-center transition-all duration-500 ${
                step >= 1 ? 'bg-brand-light border-2 border-brand' : 'bg-input border-2 border-dashed border-border'
              }`}>
                <span className={`text-sm transition-all ${step >= 1 ? 'text-brand-dark' : 'text-text-tertiary text-2xl'}`}>
                  {step >= 1 ? '✓ ID captured' : '+'}
                </span>
              </div>

              {/* Selfie area */}
              <div className={`w-[76px] h-[76px] rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-500 ${
                step >= 2 ? 'bg-brand-light border-2 border-brand' : 'bg-input border-2 border-dashed border-border'
              }`}>
                <span className={`transition-all ${step >= 2 ? 'text-xs text-brand-dark' : 'text-lg text-text-tertiary'}`}>
                  {step >= 2 ? '✓' : '📷'}
                </span>
              </div>

              {/* Submit button */}
              <div className={`w-full h-11 rounded-xl flex items-center justify-center transition-all duration-500 ${
                step >= 3 ? 'bg-verified' : 'bg-brand'
              } ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                <span className="text-sm text-white font-medium">
                  {step >= 3 ? '✓ SUBMITTED' : 'SUBMIT FOR REVIEW'}
                </span>
              </div>

              {/* Verified badge */}
              {step >= 4 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="mt-5 flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-verified-light border border-verified-border"
                >
                  <span className="text-sm text-verified font-medium">✓ Verified</span>
                </motion.div>
              )}
            </div>
          </div>
        }
      >
        {/* Step checklist */}
        <div className="flex flex-col gap-3">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                s.done ? 'bg-brand-light translate-x-1' : 'bg-background'
              }`}
            >
              <span className="text-lg">{['🪪', '🤳', '✅'][i]}</span>
              <span className={`text-sm ${s.done ? 'text-brand-dark' : 'text-text-secondary'}`}>{s.label}</span>
              {s.done && <span className="ml-auto text-verified text-sm">✓</span>}
            </div>
          ))}
        </div>
      </FeatureSection>
    </div>
  );
}

/* ── Feature 2: Browse Listings ── */
export function BrowseListingsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers = Array.from({ length: 6 }, (_, i) =>
      setTimeout(() => setVisible(i + 1), 300 + i * 200)
    );
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  const listings = [
    { price: '₱5,500', type: 'Room', area: 'Ugong', bg: 'bg-brand-light' },
    { price: '₱3,800', type: 'Bedspace', area: 'Kapitolyo', bg: 'bg-warning-light' },
    { price: '₱12,000', type: 'Apt', area: 'Oranbo', bg: 'bg-verified-light' },
    { price: '₱4,200', type: 'Room', area: 'San Antonio', bg: 'bg-[#EDE9FE]' },
    { price: '₱3,000', type: 'Bedspace', area: 'Shaw', bg: 'bg-[#FCE7F3]' },
    { price: '₱8,500', type: 'Apt', area: 'Boni', bg: 'bg-[#FFF7ED]' },
  ];

  return (
    <div ref={ref}>
      <FeatureSection
        tag="Browse"
        heading={<>Find your next place<br />in seconds</>}
        body="Browse verified listings in a familiar grid layout. Filter by barangay, unit type, and budget. Every listing is from a verified landlord."
        reversed
        bg="bg-background"
        phoneContent={
          <div className="pt-9 h-full bg-surface">
            {/* Search bar */}
            <div className="px-3 py-2">
              <div className="h-9 rounded-full bg-input flex items-center px-3 gap-2">
                <span className="text-sm text-text-tertiary">🔍</span>
                <span className="text-xs text-text-tertiary">Where? (barangay)</span>
              </div>
            </div>
            {/* Grid */}
            <div className="grid grid-cols-2 gap-1 px-2">
              {listings.map((item, i) => (
                <div
                  key={i}
                  className="transition-all duration-400"
                  style={{
                    opacity: visible > i ? 1 : 0,
                    transform: visible > i ? 'translateY(0)' : 'translateY(16px)',
                    transitionDelay: `${i * 50}ms`,
                  }}
                >
                  <div className={`w-full aspect-square ${item.bg} rounded-lg`} />
                  <div className="px-0.5 py-1">
                    <p className="text-xs font-medium text-text-primary">{item.price}</p>
                    <p className="text-[10px] text-text-tertiary">{item.type} · {item.area}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className="flex gap-2 flex-wrap">
          {['Bedspace', 'Room', 'Apartment'].map((t) => (
            <span
              key={t}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                t === 'Room'
                  ? 'bg-brand-light border-brand text-brand'
                  : 'bg-background border-transparent text-text-secondary'
              }`}
            >
              {t}
            </span>
          ))}
        </div>
      </FeatureSection>
    </div>
  );
}

/* ── Feature 3: Connection Reveal ── */
export function ConnectionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div ref={ref}>
      <FeatureSection
        tag="Connect"
        heading={<>No middleman.<br />Direct connection.</>}
        body="When a landlord accepts your request, both phone numbers are revealed instantly. Call or text directly. No agents, no fees, no platform taking a cut."
        phoneContent={
          <div className="pt-10 h-full bg-background flex flex-col items-center justify-center px-5">
            {/* Two avatars */}
            <div className="flex items-center mb-6 transition-all duration-1000" style={{ gap: phase >= 2 ? 0 : 40 }}>
              {/* Tenant */}
              <div className="text-center">
                <div className={`w-14 h-14 rounded-full bg-brand-light flex items-center justify-center border-[3px] transition-colors duration-500 ${
                  phase >= 1 ? 'border-verified' : 'border-border'
                }`}>
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-[10px] text-text-tertiary mt-1">Tenant</p>
                {phase >= 1 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[9px] text-verified font-medium">
                    ✓ Verified
                  </motion.span>
                )}
              </div>

              {/* Connection line */}
              <div className="h-0.5 bg-brand rounded-full transition-all duration-700" style={{ width: phase >= 2 ? 40 : 0 }} />

              {/* Landlord */}
              <div className="text-center">
                <div className={`w-14 h-14 rounded-full bg-warning-light flex items-center justify-center border-[3px] transition-colors duration-500 delay-300 ${
                  phase >= 1 ? 'border-verified' : 'border-border'
                }`}>
                  <span className="text-2xl">🏠</span>
                </div>
                <p className="text-[10px] text-text-tertiary mt-1">Landlord</p>
                {phase >= 1 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="text-[9px] text-verified font-medium">
                    ✓ Verified
                  </motion.span>
                )}
              </div>
            </div>

            {/* Connected card */}
            {phase >= 3 && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-full p-4 rounded-2xl bg-brand-light text-center mb-3"
              >
                <p className="text-xs text-brand font-medium mb-1">Connected!</p>
                <p className="font-display text-xl text-brand-dark tracking-wider mb-1">+63 917 *** 4589</p>
                <p className="text-[11px] text-text-secondary">Phone number revealed</p>
              </motion.div>
            )}

            {/* Call/Text buttons */}
            {phase >= 4 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex gap-2 w-full">
                <div className="flex-1 h-10 rounded-xl bg-brand flex items-center justify-center gap-1.5">
                  <span className="text-sm">📞</span>
                  <span className="text-xs text-white font-medium">Call</span>
                </div>
                <div className="flex-1 h-10 rounded-xl border border-brand flex items-center justify-center gap-1.5">
                  <span className="text-sm">💬</span>
                  <span className="text-xs text-brand font-medium">Text</span>
                </div>
              </motion.div>
            )}

            {/* Status text */}
            {phase < 3 && (
              <p className="text-xs text-text-tertiary mt-2">
                {phase < 1 ? 'Verifying identities...' : phase < 2 ? 'Both verified!' : 'Connecting...'}
              </p>
            )}
          </div>
        }
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center">
            <span className="text-xl">📞</span>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Zero fees. Always.</p>
            <p className="text-sm text-text-secondary">No money moves through the app. Ever.</p>
          </div>
        </div>
      </FeatureSection>
    </div>
  );
}

/* ── Feature 4: Cross-platform ── */
export function CrossPlatformDemo() {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-[var(--max-width-narrow)] mx-auto text-center">
        <motion.p {...fadeUp()} className="text-sm font-semibold text-brand tracking-[0.15em] uppercase mb-4">
          Everywhere
        </motion.p>
        <motion.h2 {...fadeUp(0.08)} className="font-display font-bold text-fluid-headline text-text-primary mb-5">
          One app. Android and iOS.
        </motion.h2>
        <motion.p {...fadeUp(0.16)} className="text-fluid-body-lg text-text-secondary mb-16 max-w-[500px] mx-auto">
          Works on any phone. Same experience whether you are on a budget Android or an iPhone.
        </motion.p>

        {/* Store buttons */}
        <motion.div {...fadeUp(0.24)} className="flex justify-center gap-4 flex-wrap mb-16">
          {[
            { label: 'Google Play', sub: 'GET IT ON', href: 'https://play.google.com/store/apps/details?id=ph.rentrayda.app', icon: '▶' },
            { label: 'App Store', sub: 'Download on the', href: '#', icon: '' },
          ].map((store) => (
            <motion.a
              key={store.label}
              href={store.href}
              whileHover={{ y: -3 }}
              className="inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-text-primary text-white no-underline hover:bg-text-primary/90 transition-colors"
            >
              <span className="text-2xl">{store.icon}</span>
              <span>
                <span className="block text-[11px] opacity-70">{store.sub}</span>
                <span className="font-display text-lg">{store.label}</span>
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div {...fadeUp(0.32)} className="flex justify-center gap-12 md:gap-16 flex-wrap">
          {[
            { value: '100%', label: 'Free forever' },
            { value: '₱0', label: 'Fees charged' },
            { value: '<48hr', label: 'Verification time' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-4xl text-brand mb-1">{stat.value}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── How It Works ── */
export function HowItWorksAnimated() {
  const steps = [
    { icon: '📱', title: 'Sign Up', desc: 'Register with your phone number. Takes 1 minute. No email needed.' },
    { icon: '🛡️', title: 'Get Verified', desc: 'Upload your ID and proof. Our team reviews in 24-48 hours.' },
    { icon: '🤝', title: 'Connect', desc: 'Both sides verified? Phone numbers revealed. Call directly.' },
  ];

  return (
    <section className="section-padding bg-surface">
      <div className="max-w-[var(--max-width)] mx-auto">
        <motion.h2 {...fadeUp()} className="font-display font-bold text-fluid-headline text-center text-text-primary mb-5">
          How It Works
        </motion.h2>
        <motion.p {...fadeUp(0.08)} className="text-fluid-body-lg text-center text-text-secondary mb-16 max-w-[480px] mx-auto">
          Three steps. No complicated forms. No waiting forever.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.12 * (i + 1) }}
              whileHover={{ y: -6 }}
              className="text-center p-8 rounded-2xl bg-background border border-border hover:shadow-lg transition-shadow cursor-default"
            >
              {/* Icon circle */}
              <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-5 text-3xl">
                {step.icon}
              </div>
              {/* Step number */}
              <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-medium flex items-center justify-center mx-auto -mt-8 mb-4 relative z-[1] border-[3px] border-surface">
                {i + 1}
              </div>
              <h3 className="font-display text-xl text-text-primary mb-2">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
