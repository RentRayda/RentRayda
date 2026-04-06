'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

// ─── Scroll-triggered fade-in wrapper ────────────────────────────────
function FadeIn({ children, delay = 0, direction = 'up' }: { children: ReactNode; delay?: number; direction?: 'up' | 'left' | 'right' | 'none' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const translate = direction === 'up' ? 'translateY(40px)' : direction === 'left' ? 'translateX(-40px)' : direction === 'right' ? 'translateX(40px)' : 'none';

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : translate,
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Phone Mockup Frame ──────────────────────────────────────────────
function PhoneMockup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div style={{
      width: 280, height: 560, borderRadius: 36, border: '4px solid #1A1A2E',
      backgroundColor: '#FFFFFF', overflow: 'hidden', position: 'relative',
      boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1)',
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 28, backgroundColor: '#1A1A2E', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: 10,
      }} />
      {/* Screen content */}
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Animated counter ────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Feature 1: Verification Flow Animation ─────────────────────────
export function VerificationDemo() {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1800),
      setTimeout(() => setStep(3), 3000),
      setTimeout(() => setStep(4), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [started]);

  return (
    <section ref={ref} style={{ padding: '100px 20px', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Text */}
        <div style={{ flex: '1 1 360px', maxWidth: 440 }}>
          <FadeIn>
            <p style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#2563EB', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 12px' }}>
              Trust First
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 style={{ fontSize: 36, fontFamily: 'BerlinSansFB', color: '#050505', margin: '0 0 16px', lineHeight: 1.2 }}>
              Verify once,<br />connect safely
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: 18, fontFamily: 'AlteHaasGrotesk', color: '#65676B', lineHeight: 1.6, margin: '0 0 32px' }}>
              Upload your government ID and a selfie. Our team reviews it in 24-48 hours. Once verified, landlords know you are real. And you know they are too.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Upload your ID', icon: '🪪' },
                { label: 'Take a quick selfie', icon: '🤳' },
                { label: 'Get verified in 24-48hrs', icon: '✅' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  borderRadius: 12, backgroundColor: step > i ? '#DBEAFE' : '#F0F2F5',
                  transition: 'all 0.5s ease',
                  transform: step > i ? 'translateX(4px)' : 'none',
                }}>
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ fontSize: 15, fontFamily: 'AlteHaasGrotesk', color: step > i ? '#1D4ED8' : '#65676B' }}>{item.label}</span>
                  {step > i && <span style={{ marginLeft: 'auto', color: '#16A34A', fontSize: 16, fontFamily: 'AlteHaasGroteskBold' }}>✓</span>}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Phone mockup */}
        <FadeIn delay={0.2} direction="right">
          <PhoneMockup>
            <div style={{ paddingTop: 40, height: '100%', backgroundColor: '#F0F2F5' }}>
              {/* Header bar */}
              <div style={{ padding: '12px 20px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E4E6EB' }}>
                <span style={{ fontSize: 15, fontFamily: 'BerlinSansFB', color: '#050505' }}>Verify your ID</span>
              </div>
              <div style={{ padding: 20 }}>
                {/* Progress bar */}
                <div style={{ height: 4, backgroundColor: '#E4E6EB', borderRadius: 2, marginBottom: 20 }}>
                  <div style={{
                    height: 4, backgroundColor: '#2563EB', borderRadius: 2,
                    width: step === 0 ? '0%' : step === 1 ? '33%' : step === 2 ? '66%' : '100%',
                    transition: 'width 0.8s ease',
                  }} />
                </div>

                {/* ID photo area */}
                <div style={{
                  width: '100%', height: 120, borderRadius: 12, marginBottom: 16,
                  backgroundColor: step >= 1 ? '#DBEAFE' : '#E4E6EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.5s ease',
                  border: step >= 1 ? '2px solid #2563EB' : '2px dashed #CED0D4',
                }}>
                  <span style={{ fontSize: step >= 1 ? 14 : 24, color: step >= 1 ? '#1D4ED8' : '#8A8D91', fontFamily: 'AlteHaasGrotesk', transition: 'all 0.3s ease' }}>
                    {step >= 1 ? '✓ ID captured' : '+'}
                  </span>
                </div>

                {/* Selfie area */}
                <div style={{
                  width: 80, height: 80, borderRadius: 40, margin: '0 auto 16px',
                  backgroundColor: step >= 2 ? '#DBEAFE' : '#E4E6EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.5s ease',
                  border: step >= 2 ? '2px solid #2563EB' : '2px dashed #CED0D4',
                }}>
                  <span style={{ fontSize: step >= 2 ? 12 : 20, color: step >= 2 ? '#1D4ED8' : '#8A8D91', fontFamily: 'AlteHaasGrotesk' }}>
                    {step >= 2 ? '✓' : '📷'}
                  </span>
                </div>

                {/* Submit button */}
                <div style={{
                  width: '100%', height: 44, borderRadius: 8,
                  backgroundColor: step >= 3 ? '#16A34A' : '#2563EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: step >= 2 ? 1 : 0.4,
                  transition: 'all 0.5s ease',
                  transform: step >= 3 ? 'scale(1.02)' : 'none',
                }}>
                  <span style={{ color: '#FFFFFF', fontSize: 14, fontFamily: 'AlteHaasGroteskBold' }}>
                    {step >= 3 ? '✓ SUBMITTED' : 'SUBMIT FOR REVIEW'}
                  </span>
                </div>

                {/* Verified badge animation */}
                {step >= 4 && (
                  <div style={{
                    marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 20px', borderRadius: 24,
                    backgroundColor: '#DCFCE7', border: '1px solid #86EFAC',
                    animation: 'badgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}>
                    <span style={{ color: '#16A34A', fontSize: 16, fontFamily: 'AlteHaasGroteskBold' }}>✓</span>
                    <span style={{ fontSize: 13, fontFamily: 'AlteHaasGroteskBold', color: '#16A34A' }}>Verified</span>
                  </div>
                )}
              </div>
            </div>
          </PhoneMockup>
        </FadeIn>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes badgePop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </section>
  );
}

// ─── Feature 2: Browse Listings Animation ────────────────────────────
export function BrowseListingsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [visibleCards, setVisibleCards] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timers = Array.from({ length: 6 }, (_, i) =>
      setTimeout(() => setVisibleCards(i + 1), 300 + i * 200)
    );
    return () => timers.forEach(clearTimeout);
  }, [started]);

  const listings = [
    { price: '5,500', type: 'Room', area: 'Ugong', color: '#DBEAFE' },
    { price: '3,800', type: 'Bedspace', area: 'Kapitolyo', color: '#FEF3C7' },
    { price: '12,000', type: 'Apartment', area: 'Oranbo', color: '#D1FAE5' },
    { price: '4,200', type: 'Room', area: 'San Antonio', color: '#EDE9FE' },
    { price: '3,000', type: 'Bedspace', area: 'Shaw', color: '#FCE7F3' },
    { price: '8,500', type: 'Apartment', area: 'Boni', color: '#FFF7ED' },
  ];

  return (
    <section ref={ref} style={{ padding: '100px 20px', backgroundColor: '#F0F2F5' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap-reverse', justifyContent: 'center' }}>
        {/* Phone mockup */}
        <FadeIn delay={0.1} direction="left">
          <PhoneMockup>
            <div style={{ paddingTop: 36, height: '100%', backgroundColor: '#FFFFFF' }}>
              {/* Search bar */}
              <div style={{ padding: '8px 12px' }}>
                <div style={{ height: 36, borderRadius: 18, backgroundColor: '#E4E6EB', display: 'flex', alignItems: 'center', paddingLeft: 12, gap: 6 }}>
                  <span style={{ fontSize: 14, color: '#8A8D91' }}>🔍</span>
                  <span style={{ fontSize: 13, color: '#8A8D91', fontFamily: 'AlteHaasGrotesk' }}>Where? (barangay)</span>
                </div>
              </div>
              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: '4px 8px' }}>
                {listings.map((item, i) => (
                  <div key={i} style={{
                    opacity: visibleCards > i ? 1 : 0,
                    transform: visibleCards > i ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.4s ease ${i * 0.05}s`,
                  }}>
                    <div style={{ width: '100%', aspectRatio: '1', backgroundColor: item.color, borderRadius: 6 }} />
                    <div style={{ padding: '4px 2px' }}>
                      <p style={{ fontSize: 12, fontFamily: 'BerlinSansFB', color: '#050505', margin: 0 }}>P{item.price}</p>
                      <p style={{ fontSize: 9, fontFamily: 'AlteHaasGrotesk', color: '#65676B', margin: 0 }}>{item.type} · {item.area}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PhoneMockup>
        </FadeIn>

        {/* Text */}
        <div style={{ flex: '1 1 360px', maxWidth: 440 }}>
          <FadeIn>
            <p style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#2563EB', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 12px' }}>
              Browse
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 style={{ fontSize: 36, fontFamily: 'BerlinSansFB', color: '#050505', margin: '0 0 16px', lineHeight: 1.2 }}>
              Find your next place<br />in seconds
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: 18, fontFamily: 'AlteHaasGrotesk', color: '#65676B', lineHeight: 1.6, margin: '0 0 24px' }}>
              Browse verified listings in a familiar grid layout. Filter by barangay, unit type, and budget. Every listing is from a verified landlord.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Bedspace', 'Room', 'Apartment'].map((t) => (
                <span key={t} style={{
                  padding: '8px 16px', borderRadius: 20,
                  backgroundColor: t === 'Room' ? '#DBEAFE' : '#E4E6EB',
                  border: t === 'Room' ? '1px solid #2563EB' : '1px solid transparent',
                  fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: t === 'Room' ? '#2563EB' : '#374151',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Feature 3: Connection Reveal Animation ──────────────────────────
export function ConnectionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [started]);

  return (
    <section ref={ref} style={{ padding: '100px 20px', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Text */}
        <div style={{ flex: '1 1 360px', maxWidth: 440 }}>
          <FadeIn>
            <p style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#2563EB', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 12px' }}>
              Connect
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 style={{ fontSize: 36, fontFamily: 'BerlinSansFB', color: '#050505', margin: '0 0 16px', lineHeight: 1.2 }}>
              No middleman.<br />Direct connection.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: 18, fontFamily: 'AlteHaasGrotesk', color: '#65676B', lineHeight: 1.6, margin: '0 0 32px' }}>
              When a landlord accepts your request, both phone numbers are revealed instantly. Call or text directly. No agents, no fees, no platform taking a cut.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 20 }}>📞</span>
              </div>
              <div>
                <p style={{ fontSize: 15, fontFamily: 'AlteHaasGroteskBold', color: '#050505', margin: 0 }}>Zero fees. Always.</p>
                <p style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B', margin: 0 }}>No money moves through the app. Ever.</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Phone mockup */}
        <FadeIn delay={0.2} direction="right">
          <PhoneMockup>
            <div style={{ paddingTop: 40, height: '100%', backgroundColor: '#F0F2F5' }}>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 40px)' }}>
                {/* Two avatars approaching */}
                <div style={{ display: 'flex', alignItems: 'center', gap: phase >= 2 ? 0 : 40, transition: 'gap 1s ease', marginBottom: 24 }}>
                  {/* Tenant */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 28, backgroundColor: '#DBEAFE',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: phase >= 1 ? '3px solid #16A34A' : '3px solid #CED0D4',
                      transition: 'border 0.5s ease',
                    }}>
                      <span style={{ fontSize: 24 }}>👤</span>
                    </div>
                    <p style={{ fontSize: 10, fontFamily: 'AlteHaasGrotesk', color: '#65676B', margin: '4px 0 0' }}>Tenant</p>
                    {phase >= 1 && (
                      <span style={{ fontSize: 9, fontFamily: 'AlteHaasGroteskBold', color: '#16A34A', animation: 'badgePop 0.4s ease' }}>✓ Verified</span>
                    )}
                  </div>

                  {/* Connection line */}
                  <div style={{
                    width: phase >= 2 ? 40 : 0, height: 2, backgroundColor: '#2563EB',
                    transition: 'width 0.8s ease', borderRadius: 1,
                  }} />

                  {/* Landlord */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 28, backgroundColor: '#FEF3C7',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: phase >= 1 ? '3px solid #16A34A' : '3px solid #CED0D4',
                      transition: 'border 0.5s ease 0.3s',
                    }}>
                      <span style={{ fontSize: 24 }}>🏠</span>
                    </div>
                    <p style={{ fontSize: 10, fontFamily: 'AlteHaasGrotesk', color: '#65676B', margin: '4px 0 0' }}>Landlord</p>
                    {phase >= 1 && (
                      <span style={{ fontSize: 9, fontFamily: 'AlteHaasGroteskBold', color: '#16A34A', animation: 'badgePop 0.4s ease 0.3s both' }}>✓ Verified</span>
                    )}
                  </div>
                </div>

                {/* Connection accepted */}
                {phase >= 3 && (
                  <div style={{
                    width: '100%', padding: 16, borderRadius: 16,
                    backgroundColor: '#DBEAFE', textAlign: 'center',
                    animation: 'badgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    marginBottom: 12,
                  }}>
                    <p style={{ fontSize: 13, fontFamily: 'BerlinSansFB', color: '#2563EB', margin: '0 0 8px' }}>Connected!</p>
                    <p style={{ fontSize: 20, fontFamily: 'BerlinSansFB', color: '#1D4ED8', margin: '0 0 4px', letterSpacing: 1 }}>
                      +63 917 *** 4589
                    </p>
                    <p style={{ fontSize: 11, fontFamily: 'AlteHaasGrotesk', color: '#65676B', margin: 0 }}>Phone number revealed</p>
                  </div>
                )}

                {/* Call button */}
                {phase >= 4 && (
                  <div style={{
                    display: 'flex', gap: 8, width: '100%',
                    animation: 'badgePop 0.4s ease',
                  }}>
                    <div style={{
                      flex: 1, height: 40, borderRadius: 8, backgroundColor: '#2563EB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <span style={{ fontSize: 14 }}>📞</span>
                      <span style={{ fontSize: 13, fontFamily: 'AlteHaasGroteskBold', color: '#FFFFFF' }}>Call</span>
                    </div>
                    <div style={{
                      flex: 1, height: 40, borderRadius: 8, border: '1px solid #2563EB',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <span style={{ fontSize: 14 }}>💬</span>
                      <span style={{ fontSize: 13, fontFamily: 'AlteHaasGroteskBold', color: '#2563EB' }}>Text</span>
                    </div>
                  </div>
                )}

                {/* Waiting state */}
                {phase < 3 && (
                  <p style={{ fontSize: 13, fontFamily: 'AlteHaasGrotesk', color: '#8A8D91', textAlign: 'center', marginTop: 8 }}>
                    {phase < 1 ? 'Verifying identities...' : phase < 2 ? 'Both verified!' : 'Connecting...'}
                  </p>
                )}
              </div>
            </div>
          </PhoneMockup>
        </FadeIn>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes badgePop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}} />
    </section>
  );
}

// ─── Feature 4: Cross-platform Animation ─────────────────────────────
export function CrossPlatformDemo() {
  return (
    <section style={{ padding: '100px 20px', backgroundColor: '#F0F2F5' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <FadeIn>
          <p style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#2563EB', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 12px' }}>
            Everywhere
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 style={{ fontSize: 36, fontFamily: 'BerlinSansFB', color: '#050505', margin: '0 0 16px', lineHeight: 1.2 }}>
            One app. Android and iOS.
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p style={{ fontSize: 18, fontFamily: 'AlteHaasGrotesk', color: '#65676B', lineHeight: 1.6, margin: '0 0 48px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Works on any phone. Same experience whether you are on a budget Android or an iPhone.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <a
              href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '16px 32px', borderRadius: 12,
                backgroundColor: '#050505', color: '#FFFFFF', textDecoration: 'none',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <span style={{ fontSize: 28, fontFamily: 'AlteHaasGrotesk' }}>▶</span>
              <span>
                <span style={{ fontSize: 11, fontFamily: 'AlteHaasGrotesk', display: 'block', opacity: 0.7 }}>GET IT ON</span>
                <span style={{ fontSize: 18, fontFamily: 'BerlinSansFB' }}>Google Play</span>
              </span>
            </a>
            <a
              href="#"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                padding: '16px 32px', borderRadius: 12,
                backgroundColor: '#050505', color: '#FFFFFF', textDecoration: 'none',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <span style={{ fontSize: 28, fontFamily: 'AlteHaasGrotesk' }}></span>
              <span>
                <span style={{ fontSize: 11, fontFamily: 'AlteHaasGrotesk', display: 'block', opacity: 0.7 }}>Download on the</span>
                <span style={{ fontSize: 18, fontFamily: 'BerlinSansFB' }}>App Store</span>
              </span>
            </a>
          </div>
        </FadeIn>

        {/* Stats */}
        <FadeIn delay={0.4}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 64, flexWrap: 'wrap' }}>
            {[
              { value: 100, suffix: '%', label: 'Free forever' },
              { value: 0, suffix: '', label: 'Fees charged', display: '0' },
              { value: 48, suffix: 'hr', label: 'Verification time' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 40, fontFamily: 'BerlinSansFB', color: '#2563EB', margin: '0 0 4px' }}>
                  {stat.display !== undefined ? stat.display : <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
                </p>
                <p style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B', margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Animated How It Works (replaces static version) ─────────────────
export function HowItWorksAnimated() {
  const steps = [
    { icon: '📱', title: 'Sign Up', desc: 'Register with your phone number. Takes 1 minute. No email needed.' },
    { icon: '🛡️', title: 'Get Verified', desc: 'Upload your ID and proof. Our team reviews in 24-48 hours.' },
    { icon: '🤝', title: 'Connect', desc: 'Both sides verified? Phone numbers revealed. Call directly.' },
  ];

  return (
    <section style={{ padding: '100px 20px', backgroundColor: '#FFFFFF' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <FadeIn>
          <h2 style={{ fontSize: 36, fontFamily: 'BerlinSansFB', textAlign: 'center', margin: '0 0 16px', color: '#050505' }}>
            How It Works
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p style={{ fontSize: 18, fontFamily: 'AlteHaasGrotesk', textAlign: 'center', color: '#65676B', margin: '0 0 56px' }}>
            Three steps. No complicated forms. No waiting forever.
          </p>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 40 }}>
          {steps.map((step, i) => (
            <FadeIn key={i} delay={0.15 * (i + 1)}>
              <div style={{
                textAlign: 'center', padding: '32px 24px', borderRadius: 16,
                backgroundColor: '#F9FAFB', border: '1px solid #E4E6EB',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 16, backgroundColor: '#DBEAFE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: 32,
                }}>
                  {step.icon}
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: 14, backgroundColor: '#2563EB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '-34px auto 16px', position: 'relative', zIndex: 1,
                  border: '3px solid #FFFFFF',
                }}>
                  <span style={{ fontSize: 13, fontFamily: 'AlteHaasGroteskBold', color: '#FFFFFF' }}>{i + 1}</span>
                </div>
                <h3 style={{ fontSize: 20, fontFamily: 'BerlinSansFB', margin: '0 0 8px', color: '#050505' }}>{step.title}</h3>
                <p style={{ fontSize: 15, fontFamily: 'AlteHaasGrotesk', color: '#65676B', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
