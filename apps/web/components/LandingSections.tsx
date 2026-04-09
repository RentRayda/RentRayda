'use client'

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
}

// Counter animation hook
function useCounter(target: number, isInView: boolean) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 2000, bounce: 0 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      motionValue.set(target)
    }
  }, [isInView, motionValue, target])

  useEffect(() => {
    return springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest))
    })
  }, [springValue])

  return displayValue
}

// SECTION 1: BOLD STATEMENT
export function BoldStatement() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative bg-surface py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[720px] px-[var(--space-gutter)] text-center">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-8 inline-flex items-center justify-center"
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            className="text-brand"
          >
            {/* House with shield icon */}
            <path
              d="M40 8L12 28V68H68V28L40 8Z"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M40 28C40 28 32 32 32 40C32 48 40 52 40 52C40 52 48 48 48 40C48 32 40 28 40 28Z"
              fill="currentColor"
              opacity="0.2"
            />
            <path
              d="M40 28C40 28 32 32 32 40C32 48 40 52 40 52C40 52 48 48 48 40C48 32 40 28 40 28Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </motion.div>

        <motion.h2
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.1 }}
          className="font-display mb-6 font-bold text-fluid-headline text-text-primary"
        >
          You Don&apos;t Need Connections in Manila.
        </motion.h2>

        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.2 }}
          className="text-fluid-body-lg text-text-secondary"
        >
          No agents. No fixers. No under-the-table payments. Just verified renters and landlords connecting directly.
        </motion.p>
      </div>
    </section>
  )
}

// SECTION 2: TRUST STATS
interface StatCardProps {
  color: string
  value: number
  label: string
  prefix?: string
  suffix?: string
}

function StatCard({ color, value, label, prefix = '', suffix = '' }: StatCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const count = useCounter(value, isInView)

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-6 text-center shadow-sm"
    >
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <div className="font-display text-4xl font-bold text-text-primary sm:text-5xl">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-text-secondary">{label}</div>
    </motion.div>
  )
}

export function TrustStats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative bg-background py-[var(--section-padding-y)]">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="mx-auto grid max-w-[1120px] grid-cols-2 gap-4 px-[var(--space-gutter)] lg:grid-cols-4"
      >
        <StatCard color="bg-danger" value={412} label="Scams blocked" suffix="+" />
        <StatCard color="bg-verified" value={1847} label="Verified users" />
        <StatCard color="bg-brand" value={623} label="Connections made" suffix="+" />
        <StatCard color="bg-warning" value={0} label="Platform fee" prefix="₱" />
      </motion.div>
    </section>
  )
}

// SECTION 3: HOW IT WORKS
interface StepCardProps {
  step: number
  icon: string
  title: string
  description: string
}

function StepCard({ step, icon, title, description }: StepCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="group relative flex flex-col items-center rounded-2xl border border-border bg-surface p-8 text-center shadow-sm"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light text-2xl">
        {icon}
      </div>
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
        {step}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </motion.div>
  )
}

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative bg-surface py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[1120px] px-[var(--space-gutter)]">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-12 text-center"
        >
          <h2 className="font-display mb-4 font-bold text-fluid-headline text-text-primary">
            How It Works
          </h2>
          <p className="text-fluid-body-lg text-text-secondary">Three simple steps to safe renting</p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-6 md:grid-cols-3"
        >
          <StepCard
            step={1}
            icon="📱"
            title="Sign Up"
            description="Download the app and create your free account. No credit card required."
          />
          <StepCard
            step={2}
            icon="🛡️"
            title="Get Verified"
            description="Upload your ID and selfie. Our team reviews within 48 hours."
          />
          <StepCard
            step={3}
            icon="🤝"
            title="Connect"
            description="Browse verified listings or post your property. Connect directly with no middleman."
          />
        </motion.div>
      </div>
    </section>
  )
}

// Phone Mockup Component
interface PhoneMockupProps {
  children: React.ReactNode
  className?: string
}

function PhoneMockup({ children, className = '' }: PhoneMockupProps) {
  return (
    <div className={`relative mx-auto w-[280px] sm:w-[320px] ${className}`}>
      {/* Phone frame */}
      <div className="relative overflow-hidden rounded-[40px] border-[3px] border-[#1A1A2E] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.16)]">
        {/* Dynamic Island */}
        <div className="absolute left-1/2 top-4 z-10 h-[24px] w-[90px] -translate-x-1/2 rounded-full bg-[#1A1A2E]" />
        
        {/* Screen content */}
        <div className="relative aspect-[9/19.5] bg-white">
          {children}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 h-1 w-[100px] -translate-x-1/2 rounded-full bg-[#1A1A2E] opacity-40" />
      </div>
    </div>
  )
}

// SECTION 4: VERIFICATION DEMO
export function VerificationDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 2500)
    return () => clearInterval(interval)
  }, [isInView])

  const steps = [
    { label: 'Upload valid ID', icon: '🪪' },
    { label: 'Take a selfie', icon: '📸' },
    { label: 'Submit for review', icon: '📤' },
    { label: 'Get verified badge', icon: '✅' }
  ]

  return (
    <section className="relative bg-warm py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[1120px] px-[var(--space-gutter)]">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Text Content */}
          <motion.div
            ref={ref}
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="mb-4 inline-block rounded-full bg-warm-text px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
              Trust First
            </div>
            <h2 className="font-display mb-6 font-bold text-fluid-headline text-warm-text">
              Verify once, connect safely
            </h2>
            <p className="mb-8 text-fluid-body-lg text-warm-text/80">
              Our verification process ensures every user is real. No fake profiles, no catfishing, no scammers.
            </p>

            {/* Step checklist */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: activeStep === index ? 1 : 0.4 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all duration-500 ${
                      activeStep === index 
                        ? 'bg-warm-text text-white scale-110' 
                        : 'bg-white/50 scale-100'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-sm font-medium transition-all duration-500 ${
                      activeStep === index ? 'text-warm-text font-semibold' : 'text-warm-text opacity-60'
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
          >
            <PhoneMockup>
              <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white p-8">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="text-center"
                >
                  <div className="mb-6 text-7xl">{steps[activeStep].icon}</div>
                  <h3 className="mb-2 text-lg font-semibold text-text-primary">
                    {activeStep === 0 && 'Upload ID'}
                    {activeStep === 1 && 'Verify Face'}
                    {activeStep === 2 && 'Processing'}
                    {activeStep === 3 && 'Verified!'}
                  </h3>
                  <p className="text-sm text-text-secondary">{steps[activeStep].label}</p>
                  
                  {activeStep === 3 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-verified px-4 py-2 text-sm font-semibold text-white"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified User
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </PhoneMockup>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// SECTION 5: BROWSE DEMO
export function BrowseListingsDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const filters = ['All', 'Studio', '1BR', '2BR', 'Makati', 'BGC', 'Ortigas']

  return (
    <section className="relative bg-surface py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[1120px] px-[var(--space-gutter)]">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Phone Mockup - LEFT on desktop */}
          <motion.div
            ref={ref}
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="order-2 lg:order-1"
          >
            <PhoneMockup>
              <div className="h-full overflow-hidden bg-background p-4">
                {/* Status bar */}
                <div className="mb-4 mt-8 flex items-center justify-between px-2 text-xs text-text-tertiary">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="h-3 w-3 rounded-full bg-verified" />
                    <div className="h-3 w-3 rounded-full bg-brand" />
                  </div>
                </div>

                {/* Search bar */}
                <div className="mb-4 rounded-xl bg-white px-4 py-3 text-sm text-text-secondary shadow-sm">
                  Search location...
                </div>

                {/* Listing cards */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className="space-y-3"
                >
                  {[1, 2, 3].map((item) => (
                    <motion.div
                      key={item}
                      variants={staggerItem}
                      className="overflow-hidden rounded-xl bg-white shadow-sm"
                    >
                      <div className="h-24 bg-gradient-to-br from-brand-light to-brand-bright" />
                      <div className="p-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-semibold text-text-primary">Studio • Makati</span>
                          <span className="flex items-center gap-1 text-xs text-verified">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        </div>
                        <div className="text-sm font-bold text-text-primary">₱15,000/mo</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </PhoneMockup>
          </motion.div>

          {/* Text Content - RIGHT on desktop */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-display mb-6 font-bold text-fluid-headline text-text-primary">
              Find your next place in seconds
            </h2>
            <p className="mb-8 text-fluid-body-lg text-text-secondary">
              Browse hundreds of verified listings across Metro Manila. Every landlord is verified, every photo is real.
            </p>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <div
                  key={filter}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-brand-light"
                >
                  {filter}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// SECTION 6: CONNECTION DEMO
export function ConnectionDemo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative bg-warm py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[720px] px-[var(--space-gutter)] text-center">
        <motion.div
          ref={ref}
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className="font-display mb-6 font-bold text-fluid-headline text-warm-text">
            No middleman. Direct connection.
          </h2>
          <p className="mb-12 text-fluid-body-lg text-warm-text/80">
            When you find a match, we reveal contact info instantly. No waiting, no agent fees.
          </p>
        </motion.div>

        {/* Animation: Two avatars approaching */}
        <div className="relative mx-auto h-64 w-full max-w-md">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="absolute left-0 top-1/2 -translate-y-1/2"
          >
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-2xl text-white shadow-lg">
                👤
              </div>
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-verified">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs font-semibold text-warm-text">Tenant</div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warm-text text-2xl text-white shadow-lg">
                🏠
              </div>
              <div className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-verified">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs font-semibold text-warm-text">Landlord</div>
          </motion.div>

          {/* Phone number reveal in center */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="rounded-2xl bg-white px-6 py-4 shadow-xl">
              <div className="text-xs font-semibold text-text-tertiary">Contact unlocked</div>
              <div className="text-lg font-bold text-text-primary">+63 917 123 4567</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// SECTION 7: ANTI-SCAM
export function AntiScam() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const competitors = [
    'Pay agent fees',
    'Fake listings',
    'Unverified users',
    'Hidden costs'
  ]

  const rentrayda = [
    '100% Free forever',
    'Verified listings only',
    'All users verified',
    'Zero hidden fees'
  ]

  return (
    <section 
      className="relative bg-dark py-[var(--section-padding-y)]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px'
      }}
    >
      <div className="mx-auto max-w-[1120px] px-[var(--space-gutter)]">
        <motion.div
          ref={ref}
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-12 text-center"
        >
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-bright">
            Why RentRayda
          </div>
          <h2 className="font-display mb-6 font-bold text-fluid-headline text-white">
            We Are Not Lamudi. We Are Not Rentpad.
          </h2>
          <p className="text-fluid-body-lg text-white/70">
            Other platforms profit from agent fees and fake listings. We don&apos;t.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Competitors */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
          >
            <h3 className="mb-6 text-lg font-semibold text-white/60">Other Platforms</h3>
            <div className="space-y-3">
              {competitors.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-danger/20">
                    <svg className="h-4 w-4 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-sm text-white/70">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RentRayda */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-verified/20 bg-verified/10 p-8 backdrop-blur-sm"
          >
            <h3 className="mb-6 text-lg font-semibold text-white">RentRayda</h3>
            <div className="space-y-3">
              {rentrayda.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-verified">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-white">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// SECTION 8: CROSS-PLATFORM
export function CrossPlatform() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative bg-surface py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[720px] px-[var(--space-gutter)] text-center">
        <motion.div
          ref={ref}
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className="font-display mb-6 font-bold text-fluid-headline text-text-primary">
            One app. Android and iOS.
          </h2>
          <p className="mb-8 text-fluid-body-lg text-text-secondary">
            Available on both platforms. Same features, same security, same zero fees.
          </p>

          {/* Store buttons */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-2xl bg-dark px-6 py-4 text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.341c-.098 1.607.39 3.191 1.352 4.386.854.987 2.063 1.573 3.326 1.573.119 0 .238-.004.357-.012-.148.648-.371 1.271-.666 1.859-1.038 2.027-2.947 3.853-5.163 3.853-1.073 0-1.91-.337-2.684-.656-.765-.316-1.475-.612-2.388-.612-.944 0-1.683.303-2.475.628-.755.31-1.558.64-2.596.64-2.304 0-4.355-1.977-5.423-4.138-1.141-2.352-1.663-4.703-1.663-6.993 0-3.191 2.074-4.881 4.008-4.881.992 0 1.82.344 2.584.665.711.299 1.382.582 2.116.582.703 0 1.354-.276 2.053-.574.853-.363 1.811-.771 3.021-.771 1.931 0 3.38 1.007 4.173 2.906-1.76 1.004-2.691 2.807-2.642 5.09zM14.638 3.084c.752-.925 1.265-2.227 1.096-3.518-1.194.06-2.604.831-3.44 1.846-.745.897-1.351 2.176-1.164 3.449 1.284.007 2.591-.754 3.508-1.777z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-2xl bg-dark px-6 py-4 text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186c-.122-.122-.197-.285-.197-.491V2.305c0-.206.075-.369.197-.491zM14.5 12.707l2.247 2.248-9.644 5.419c-.241.135-.516.135-.757 0L14.5 12.707zM20.753 9.439l-2.247 1.261-2.753-2.753 2.753-2.753 2.247 1.261c.619.348.619.936 0 1.284zM6.346 3.626l9.644 5.419-2.247 2.248-8.154-8.154c.241-.135.516-.135.757.006z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">GET IT ON</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </motion.button>
          </div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12"
          >
            <motion.div variants={staggerItem} className="text-center">
              <div className="font-display mb-1 text-3xl font-bold text-brand">100%</div>
              <div className="text-sm text-text-secondary">Free</div>
            </motion.div>
            <motion.div variants={staggerItem} className="text-center">
              <div className="font-display mb-1 text-3xl font-bold text-brand">₱0</div>
              <div className="text-sm text-text-secondary">Fees</div>
            </motion.div>
            <motion.div variants={staggerItem} className="text-center">
              <div className="font-display mb-1 text-3xl font-bold text-brand">&lt;48hr</div>
              <div className="text-sm text-text-secondary">Verification</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// SECTION 9: TESTIMONIALS
interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  initials: string
}

function TestimonialCard({ quote, name, role, initials }: TestimonialCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="relative rounded-2xl bg-white p-8 shadow-sm"
    >
      {/* Quote marks */}
      <div className="absolute right-8 top-8 text-6xl font-heading opacity-[0.15] text-warm-text">
        "
      </div>

      <p className="relative mb-6 font-heading text-base leading-relaxed text-warm-text">
        {quote}
      </p>

      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
          {initials}
        </div>
        <div>
          <div className="text-sm font-semibold text-warm-text">{name}</div>
          <div className="text-xs text-warm-text/60">{role}</div>
        </div>
      </div>
    </motion.div>
  )
}

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="relative bg-warm py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[1120px] px-[var(--space-gutter)]">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mb-12 text-center"
        >
          <h2 className="font-display mb-4 font-bold text-fluid-headline text-warm-text">
            Real stories from real users
          </h2>
          <p className="text-fluid-body-lg text-warm-text/80">
            No fake reviews. No paid endorsements.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-6 md:grid-cols-3"
        >
          <TestimonialCard
            quote="Dati sa Facebook groups lang ako naghahanap. Dalawang beses na akong na-scam—peke yung listing, at isa pa nung dumating ako sa unit, ibang tao yung may-ari. With RentRayda, lahat verified. Safe ako."
            name="Maria Santos"
            role="Tenant, Quezon City"
            initials="MS"
          />
          <TestimonialCard
            quote="Ang dami kong tinanggap na tenant na hindi nag-bayad after 1 month. Wala akong paraan para i-verify sila dati. Ngayon, may verification badge na. Mas kampante na ako mag-rent out."
            name="Tita Susan Reyes"
            role="Landlord, Makati"
            initials="SR"
          />
          <TestimonialCard
            quote="Galing ako sa Cebu, walang kakilala dito sa Manila. Lahat ng apartment hunting sites may agent fee. RentRayda saved me ₱8,000 in agent fees. Salamat talaga!"
            name="James dela Cruz"
            role="Tenant, BGC"
            initials="JD"
          />
        </motion.div>
      </div>
    </section>
  )
}

// SECTION 10: FINAL CTA
export function FinalCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative bg-brand py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[720px] px-[var(--space-gutter)] text-center">
        <motion.div
          ref={ref}
          variants={fadeUpVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <h2 className="font-display mb-8 font-bold text-fluid-display text-white">
            Find your place.
          </h2>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6 rounded-full bg-white px-12 py-5 text-lg font-semibold text-brand shadow-xl transition-shadow hover:shadow-2xl"
          >
            Download RentRayda
          </motion.button>

          <p className="text-sm text-white/60">
            Android and iOS. No fees. No agents. No scams.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// SECTION 11: FOOTER
export function Footer() {
  return (
    <footer className="border-t border-border bg-dark-surface py-12">
      <div className="mx-auto max-w-[1120px] px-[var(--space-gutter)]">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Wordmark */}
          <div>
            <h3 className="font-display mb-2 text-2xl font-bold text-text-primary">RentRayda</h3>
            <p className="text-sm text-text-tertiary">Verified rentals in Metro Manila</p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            <a href="#" className="text-sm text-text-secondary transition-colors hover:text-brand">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-text-secondary transition-colors hover:text-brand">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-text-secondary transition-colors hover:text-brand">
              Contact Us
            </a>
          </div>

          {/* Built in PH */}
          <div className="flex flex-col items-start md:items-end">
            <p className="text-sm text-text-tertiary">Built in the Philippines 🇵🇭</p>
            <p className="mt-2 text-xs text-text-tertiary">© 2024 RentRayda. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
