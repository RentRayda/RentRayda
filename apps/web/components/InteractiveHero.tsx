'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const TarsierScene = dynamic(() => import('./TarsierScene'), { ssr: false });

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function InteractiveHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#2B51E3',
        position: 'relative', overflow: 'hidden',
        paddingTop: 64, // nav height
      }}
    >
      {/* Background gradient mesh — static, GPU-free */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 50% at 30% 20%, rgba(96,165,250,0.3) 0%, transparent 70%),
          radial-gradient(ellipse 60% 60% at 75% 80%, rgba(29,78,216,0.4) 0%, transparent 70%)
        `,
      }} />

      {/* Subtle dot pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: 'radial-gradient(circle, #FFFFFF 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* 3D Tarsier — centered, large */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -55%)',
        width: 380, height: 380,
        zIndex: 1, opacity: 0.2,
      }}>
        {/* 3D version for desktop (lazy loaded) */}
        <TarsierScene />
      </div>

      {/* Static tarsier fallback + always visible at partial opacity as watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -58%)',
          zIndex: 0, opacity: 0.08,
          width: 500, height: 500,
        }}
      >
        <Image src="/icon-3d.png" alt="" width={500} height={500} priority style={{ filter: 'brightness(10)' }} />
      </motion.div>

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative', zIndex: 3,
          textAlign: 'center', color: '#FFFFFF',
          maxWidth: 640, padding: '0 24px',
          y: textY, opacity: textOpacity as unknown as number,
        }}
      >
        {/* Logo icon */}
        <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
          <Image
            src="/icon-3d.png"
            alt="RentRayda"
            width={88}
            height={88}
            priority
            style={{ borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', margin: '0 auto' }}
          />
        </motion.div>

        <motion.h1 variants={fadeUp} style={{
          fontFamily: 'TANNimbus',
          fontSize: 'clamp(40px, 7vw, 68px)',
          lineHeight: 1.1, margin: '0 0 16px', letterSpacing: 2,
        }}>
          rent rayda
        </motion.h1>

        <motion.p variants={fadeUp} style={{
          fontFamily: 'NotoSansOsage', fontSize: 'clamp(15px, 2vw, 18px)',
          margin: '0 auto 32px', opacity: 0.88, maxWidth: 420, lineHeight: 1.65,
        }}>
          Verified rentals in Metro Manila. No scams, no agents, no fees.
          Both sides verified before you connect.
        </motion.p>

        {/* Two CTA buttons */}
        <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', fontSize: 15,
              fontFamily: 'NotoSansOsage', fontWeight: 600,
              backgroundColor: '#FFFFFF', color: '#2B51E3', borderRadius: 10,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            }}
          >
            Download free
          </motion.a>
          <motion.a
            href="/listings"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', fontSize: 15,
              fontFamily: 'NotoSansOsage', fontWeight: 500,
              backgroundColor: 'transparent', color: '#FFFFFF', borderRadius: 10,
              textDecoration: 'none',
              border: '1.5px solid rgba(255,255,255,0.35)',
            }}
          >
            Browse listings
          </motion.a>
        </motion.div>

        <motion.p variants={fadeUp} style={{
          fontFamily: 'NotoSansOsage', fontSize: 12, marginTop: 20, opacity: 0.45,
        }}>
          Android and iOS. No credit card needed.
        </motion.p>
      </motion.div>

      {/* Scroll mouse indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
            <rect x="1" y="1" width="16" height="26" rx="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <motion.circle cx="9" cy="8" r="2.5" fill="rgba(255,255,255,0.6)"
              animate={{ cy: [8, 18, 8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
