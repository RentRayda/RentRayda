'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Wordmark from './Wordmark';

const TarsierScene = dynamic(() => import('./TarsierScene'), { ssr: false });

/* Seeded random — deterministic, hydration-safe */
function sr(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}
const r2 = (n: number) => Math.round(n * 100) / 100;

/* Premium easing */
const EASE = [0.16, 1, 0.3, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export default function InteractiveHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      top: r2(sr(i * 3 + 1) * 100),
      left: r2(sr(i * 3 + 2) * 100),
      dur: r2(6 + sr(i * 3 + 3) * 8),
      del: r2(sr(i * 7) * 5),
      size: Math.round(1 + sr(i * 5) * 2),
    })),
  []);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-brand"
    >
      {/* ── Gradient mesh (Igloo-style layered radials) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 55% 40% at 15% 10%, rgba(96,165,250,0.30) 0%, transparent 70%),
            radial-gradient(ellipse 45% 50% at 85% 85%, rgba(36,98,143,0.40) 0%, transparent 70%),
            radial-gradient(ellipse 30% 25% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── Subtle grid (Igloo-style) ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0], y: [0, -25, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeInOut' }}
            className="absolute rounded-full bg-white/20"
            style={{ top: `${p.top}%`, left: `${p.left}%`, width: p.size, height: p.size }}
          />
        ))}
      </div>

      {/* ── 3D Logo scene ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] w-[320px] h-[320px] md:w-[380px] md:h-[380px] z-[1] opacity-25 md:opacity-30">
        <TarsierScene />
      </div>

      {/* ── Accent line (Igloo pattern — top accent) ── */}
      <motion.div
        className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-brand-bright to-transparent"
        initial={{ width: '0%' }}
        animate={{ width: '40%' }}
        transition={{ duration: 1.5, ease: EASE }}
      />

      {/* ── Content ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-[3] text-center text-white px-6"
        style={{ y: textY, opacity: textOpacity as unknown as number, scale }}
      >
        {/* App icon */}
        <motion.div variants={fadeUp} className="mb-8 md:mb-10">
          <Image
            src="/icon-3d.png"
            alt="RentRayda"
            width={88}
            height={88}
            priority
            className="mx-auto rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.3)] md:w-[104px] md:h-[104px]"
          />
        </motion.div>

        {/* Wordmark — Sentient Bold */}
        <motion.h1 variants={fadeUp} className="mb-6 md:mb-8">
          <Wordmark size="lg" color="#FFFFFF" />
        </motion.h1>

        {/* Subtitle — fluid body large */}
        <motion.p variants={fadeUp} className="text-fluid-body-lg max-w-[460px] mx-auto mb-10 md:mb-12 opacity-85">
          Verified rentals in Metro Manila. No scams, no agents, no fees.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold bg-white text-brand rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] no-underline"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302-2.302 2.302-2.608-2.302 2.608-2.302zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z"/></svg>
            Download free
          </motion.a>
          <motion.a
            href="/listings"
            whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.12)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-medium text-white rounded-2xl border border-white/20 backdrop-blur-sm no-underline"
          >
            Browse listings
          </motion.a>
        </motion.div>

        {/* Fine print */}
        <motion.p variants={fadeUp} className="text-xs mt-8 opacity-35">
          Android and iOS. No credit card needed.
        </motion.p>
      </motion.div>

      {/* ── Bottom accent line (Igloo pattern) ── */}
      <motion.div
        className="absolute bottom-0 right-0 h-[3px] bg-gradient-to-l from-brand-bright to-transparent"
        initial={{ width: '0%' }}
        animate={{ width: '35%' }}
        transition={{ duration: 1.5, delay: 0.3, ease: EASE }}
      />

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3]"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
            <rect x="1" y="1" width="18" height="30" rx="9" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            <motion.circle
              cx="10" cy="10" r="2.5" fill="rgba(255,255,255,0.4)"
              animate={{ cy: [10, 20, 10] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
