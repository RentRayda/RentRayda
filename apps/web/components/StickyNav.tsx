'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function StickyNav() {
  const { scrollY } = useScroll();
  const shadow = useTransform(scrollY, [0, 80], ['0 0 0 transparent', '0 1px 8px rgba(0,0,0,0.06)']);
  const borderOpacity = useTransform(scrollY, [0, 80], [0.04, 0.1]);

  return (
    <motion.nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        padding: '0 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderBottom: `1px solid rgba(0,0,0,${borderOpacity})` as unknown as string,
        boxShadow: shadow as unknown as string,
      }}
    >
      {/* Logo */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <Image src="/icon-3d.png" alt="RentRayda" width={36} height={36} style={{ borderRadius: 8 }} />
        <span style={{ fontFamily: 'TANNimbus', fontSize: 20, color: '#050505', letterSpacing: 1.5 }}>
          rent rayda
        </span>
      </a>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <a href="/listings" style={{ fontFamily: 'NotoSansOsage', fontSize: 14, color: '#374151', textDecoration: 'none' }}>
          Listings
        </a>
        <a href="#how" style={{ fontFamily: 'NotoSansOsage', fontSize: 14, color: '#374151', textDecoration: 'none' }}>
          How it works
        </a>
        <motion.a
          href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            fontFamily: 'NotoSansOsage', fontSize: 13, fontWeight: 600,
            color: '#FFFFFF', backgroundColor: '#2B51E3',
            padding: '9px 22px', borderRadius: 8, textDecoration: 'none',
          }}
        >
          Get the app
        </motion.a>
      </div>
    </motion.nav>
  );
}
