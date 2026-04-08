'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Wordmark from './Wordmark';

export default function StickyNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 60], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.98)']);
  const shadow = useTransform(scrollY, [0, 80], ['none', '0 1px 12px rgba(0,0,0,0.06)']);
  const border = useTransform(scrollY, [0, 60], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.06)']);

  return (
    <>
      <motion.nav
        style={{ backgroundColor: bg, boxShadow: shadow, borderBottomColor: border } as any}
        className="fixed top-0 left-0 right-0 z-[100] h-16 px-5 md:px-7 flex items-center justify-between border-b backdrop-blur-md"
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline">
          <Image src="/icon-3d.png" alt="RentRayda" width={34} height={34} className="rounded-lg" />
          <Wordmark />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/listings" className="text-sm text-text-secondary hover:text-text-primary transition-colors no-underline">
            Listings
          </a>
          <a href="#how" className="text-sm text-text-secondary hover:text-text-primary transition-colors no-underline">
            How it works
          </a>
          <motion.a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="text-[13px] font-semibold text-white bg-brand px-5 py-2.5 rounded-lg no-underline shadow-sm shadow-brand/20 hover:bg-brand-dark transition-colors"
          >
            Get the app
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Menu"
        >
          <motion.span animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }} className="block w-5 h-[2px] bg-text-primary rounded-full origin-center" />
          <motion.span animate={{ opacity: mobileOpen ? 0 : 1 }} className="block w-5 h-[2px] bg-text-primary rounded-full" />
          <motion.span animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }} className="block w-5 h-[2px] bg-text-primary rounded-full origin-center" />
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-[99] bg-surface border-b border-border shadow-lg md:hidden"
          >
            <div className="flex flex-col p-5 gap-1">
              <a href="/listings" onClick={() => setMobileOpen(false)} className="py-3 px-4 text-base text-text-primary no-underline rounded-xl hover:bg-background transition-colors">
                Listings
              </a>
              <a href="#how" onClick={() => setMobileOpen(false)} className="py-3 px-4 text-base text-text-primary no-underline rounded-xl hover:bg-background transition-colors">
                How it works
              </a>
              <div className="pt-2 mt-2 border-t border-divider">
                <a
                  href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
                  className="flex items-center justify-center py-3.5 text-[15px] font-semibold text-white bg-brand rounded-xl no-underline shadow-sm"
                >
                  Download the app
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
