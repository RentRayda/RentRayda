'use client';

import { motion } from 'framer-motion';

interface BlobConfig {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  color: string;
  opacity: number;
  duration: number;
  blur: number;
  movement: { x: number[]; y: number[] };
}

function Blob({ config }: { config: BlobConfig }) {
  return (
    <motion.div
      animate={{
        x: config.movement.x,
        y: config.movement.y,
        scale: [1, 1.06, 0.95, 1],
      }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        top: config.top,
        bottom: config.bottom,
        left: config.left,
        right: config.right,
        width: config.size,
        height: config.size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${config.color} 0%, transparent 70%)`,
        opacity: config.opacity,
        filter: `blur(${config.blur}px)`,
      }}
    />
  );
}

// Soft blue-white blobs for light sections
export function LightSectionBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <Blob config={{
        top: '-15%', right: '-10%', size: 600,
        color: 'rgba(43,81,227,0.08)',
        opacity: 1, duration: 22, blur: 60,
        movement: { x: [0, 30, -20, 0], y: [0, -25, 15, 0] },
      }} />
      <Blob config={{
        bottom: '-10%', left: '-8%', size: 500,
        color: 'rgba(43,81,227,0.06)',
        opacity: 1, duration: 28, blur: 50,
        movement: { x: [0, -25, 20, 0], y: [0, 20, -30, 0] },
      }} />
    </div>
  );
}

// Subtle glows for dark sections
export function DarkSectionBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <Blob config={{
        top: '-20%', right: '-15%', size: 700,
        color: 'rgba(43,81,227,0.15)',
        opacity: 1, duration: 25, blur: 80,
        movement: { x: [0, 35, -25, 0], y: [0, -30, 20, 0] },
      }} />
      <Blob config={{
        bottom: '-15%', left: '-10%', size: 500,
        color: 'rgba(96,165,250,0.10)',
        opacity: 1, duration: 30, blur: 70,
        movement: { x: [0, -20, 30, 0], y: [0, 25, -20, 0] },
      }} />
    </div>
  );
}

// Hero gradient mesh for the hero section
export function HeroMeshBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Bright accent top-left */}
      <Blob config={{
        top: '-20%', left: '-10%', size: 800,
        color: 'rgba(96,165,250,0.25)',
        opacity: 1, duration: 20, blur: 100,
        movement: { x: [0, 40, -30, 0], y: [0, -30, 25, 0] },
      }} />
      {/* Deep accent bottom-right */}
      <Blob config={{
        bottom: '-25%', right: '-15%', size: 700,
        color: 'rgba(29,78,216,0.30)',
        opacity: 1, duration: 26, blur: 90,
        movement: { x: [0, -35, 25, 0], y: [0, 30, -25, 0] },
      }} />
      {/* Central glow */}
      <Blob config={{
        top: '30%', left: '40%', size: 400,
        color: 'rgba(255,255,255,0.08)',
        opacity: 1, duration: 32, blur: 60,
        movement: { x: [0, 20, -15, 0], y: [0, -15, 20, 0] },
      }} />
    </div>
  );
}
