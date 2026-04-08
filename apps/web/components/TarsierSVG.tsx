'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Interactive SVG Tarsier — exact match to the brand logo.
 * White silhouette, blue stroke details. No nose, no mouth.
 * Big head, huge eyes, small ears, compact body, curled paws, little tail.
 * Eyes follow cursor/touch with spring physics.
 */
export default function TarsierSVG({ size = 320, strokeColor = '#3571B8' }: { size?: number; strokeColor?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const pupilX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.4 });
  const pupilY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.4 });

  const handlePointer = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.35;
    const dx = Math.max(-1, Math.min(1, (clientX - cx) / (window.innerWidth / 2)));
    const dy = Math.max(-1, Math.min(1, (clientY - cy) / (window.innerHeight / 2)));
    mouseX.set(dx * 5);
    mouseY.set(dy * 3.5);
  }, [mouseX, mouseY]);

  useEffect(() => {
    setMounted(true);
    const onMouse = (e: MouseEvent) => handlePointer(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [handlePointer]);

  if (!mounted) return <div style={{ width: size, height: size }} />;

  const s = strokeColor;

  return (
    <div ref={containerRef} style={{ width: size, height: size }}>
      <motion.div
        animate={{ scale: [1, 1.015, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '100%', height: '100%' }}
      >
        <svg viewBox="0 0 240 280" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">

          {/* ── Tail — curves up on right ── */}
          <path d="M175 185 Q195 175 192 148 Q190 135 185 128" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M175 185 Q195 175 192 148 Q190 135 185 128" stroke={s} strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* ── Body — compact sitting oval ── */}
          <ellipse cx="120" cy="195" rx="58" ry="52" fill="white" />

          {/* ── Feet ── */}
          <ellipse cx="88" cy="240" rx="18" ry="9" fill="white" />
          <ellipse cx="152" cy="240" rx="18" ry="9" fill="white" />

          {/* ── Head — big round ── */}
          <circle cx="120" cy="108" r="62" fill="white" />

          {/* ── Ears — small rounded bumps ── */}
          <ellipse cx="68" cy="65" rx="20" ry="15" fill="white" transform="rotate(-20 68 65)" />
          <ellipse cx="172" cy="65" rx="20" ry="15" fill="white" transform="rotate(20 172 65)" />
          {/* Ear inner curves */}
          <path d="M58 60 Q68 52 76 62" stroke={s} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M164 62 Q172 52 182 60" stroke={s} strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* ── Left Eye — big circle with outline + inner ring ── */}
          <circle cx="95" cy="100" r="24" fill="white" stroke={s} strokeWidth="2.5" />
          <circle cx="95" cy="100" r="16" fill="white" stroke={s} strokeWidth="1.5" />
          {/* Pupil — follows cursor */}
          <motion.circle cx="95" cy="100" r="9" fill={s} style={{ x: pupilX, y: pupilY }} />
          {/* Highlight dot */}
          <motion.circle cx="99" cy="95" r="3.5" fill="white" style={{ x: pupilX, y: pupilY }} />

          {/* ── Right Eye — big circle with outline + inner ring ── */}
          <circle cx="145" cy="100" r="24" fill="white" stroke={s} strokeWidth="2.5" />
          <circle cx="145" cy="100" r="16" fill="white" stroke={s} strokeWidth="1.5" />
          <motion.circle cx="145" cy="100" r="9" fill={s} style={{ x: pupilX, y: pupilY }} />
          <motion.circle cx="149" cy="95" r="3.5" fill="white" style={{ x: pupilX, y: pupilY }} />

          {/* ── Hands / paws — curled in front of belly ── */}
          <path d="M88 200 Q78 210 82 218 Q88 222 94 215 Q96 208 92 202" fill="white" stroke={s} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M152 200 Q162 210 158 218 Q152 222 146 215 Q144 208 148 202" fill="white" stroke={s} strokeWidth="1.8" strokeLinejoin="round" />

          {/* ── Belly crease ── */}
          <path d="M98 190 Q120 202 142 190" stroke={s} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
