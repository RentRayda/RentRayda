'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

// Seeded random number generator for deterministic particle positions
function seededRandom(seed: number) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

// Generate deterministic particle positions
const generateParticles = () => {
  const random = seededRandom(42)
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: random() * 100,
    y: random() * 100,
    size: 1 + random() * 2,
    delay: random() * 4,
    duration: 8 + random() * 8,
  }))
}

const particles = generateParticles()

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
}

export default function InteractiveHero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden bg-brand"
    >
      {/* Background Effects Layer */}
      <div className="pointer-events-none absolute inset-0">
        {/* Radial Gradient Mesh */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 0%, rgba(96, 165, 250, 0.4), transparent 60%),
              radial-gradient(ellipse 60% 80% at 0% 50%, rgba(36, 98, 143, 0.3), transparent 50%),
              radial-gradient(ellipse 60% 80% at 100% 50%, rgba(219, 234, 254, 0.2), transparent 50%)
            `,
          }}
        />

        {/* CSS Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.2,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear',
            }}
          />
        ))}

        {/* Top Accent Line */}
        <motion.div
          className="absolute left-0 top-0 h-[3px] bg-gradient-to-r from-brand-bright to-transparent"
          initial={{ width: '0%' }}
          animate={{ width: '40%' }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        />

        {/* Bottom Accent Line */}
        <motion.div
          className="absolute bottom-0 right-0 h-[3px] bg-gradient-to-l from-brand-bright to-transparent"
          initial={{ width: '0%' }}
          animate={{ width: '40%' }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-[var(--space-gutter)] text-center text-white"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex max-w-[720px] flex-col items-center gap-6"
        >
          {/* App Icon */}
          <motion.div variants={itemVariants}>
            <div className="relative">
              <Image
                src="/icon-3d.png"
                alt="RentRayda"
                width={104}
                height={104}
                className="h-[88px] w-[88px] rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:h-[104px] sm:w-[104px]"
                priority
              />
            </div>
          </motion.div>

          {/* Wordmark */}
          <motion.h1
            variants={itemVariants}
            className="text-fluid-display font-display font-bold tracking-[0.5px]"
          >
            RentRayda
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-fluid-body-lg max-w-[460px] opacity-85"
          >
            Verified rentals in Metro Manila. No scams, no agents, no fees.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            {/* Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-brand shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_12px_48px_rgba(0,0,0,0.16)]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M3 20.5V3.5C3 2.4 3.89 1.5 5 1.5H19C20.1 1.5 21 2.4 21 3.5V20.5L12 17L3 20.5Z"
                  fill="currentColor"
                  opacity="0.9"
                />
              </svg>
              <span>Download free</span>
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="flex items-center justify-center gap-3 rounded-2xl border-2 border-white bg-transparent px-8 py-4 font-semibold text-white backdrop-blur-sm"
            >
              <span>Browse listings</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </motion.div>

          {/* Fine Print */}
          <motion.p
            variants={itemVariants}
            className="text-xs opacity-35"
          >
            Android and iOS. No credit card needed.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-white opacity-40">
            Scroll
          </span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/30 p-1">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-white"
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
