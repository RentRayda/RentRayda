'use client'

import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  }
}

// ─── SECTION 1: HERO ───
// Asymmetric tarsier-forward editorial. Spec:
// docs/superpowers/specs/2026-04-24-landing-hero-redesign-design.md
export function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Subtle grain overlay — SVG inlined as a data-URL so it does not cost
  // an extra HTTP request. 3% opacity is the spec's warmth-without-dirt threshold.
  const grainStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.03'/></svg>\")",
  } as const

  return (
    <section
      ref={ref}
      style={grainStyle}
      className="relative bg-hero-warm py-24 sm:py-28 md:py-32 motion-reduce:[&_*]:!transition-none motion-reduce:[&_*]:!animate-none"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[45fr_55fr] md:gap-12 md:px-12">
        {/* LEFT — tarsier */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 flex justify-center md:order-none md:justify-start"
        >
          <Image
            src="/tarsier-3d.png"
            alt="Illustration of a Philippine tarsier looking directly at the viewer"
            width={500}
            height={500}
            priority
            className="h-[260px] w-auto sm:h-[320px] md:h-[500px]"
          />
        </motion.div>

        {/* RIGHT — text stack */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
          }}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="order-2 flex flex-col items-start text-left md:order-none"
        >
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display mb-6 text-[40px] font-bold leading-[1.05] tracking-tight text-text-primary md:text-[56px]"
          >
            Verified rentals in Pasig/Ortigas.
            <br />
            Scam-protected. Landlord-safe.
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 max-w-[520px] text-base leading-[1.6] text-text-secondary md:text-lg"
          >
            For anyone moving to Manila without a kakilala network. Browse free. Pay only if you want our verified placement service.
          </motion.p>

          {/* Trust signals — vertical stack, green checkmarks */}
          <motion.ul
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 flex flex-col gap-3"
          >
            {[
              'Verified landlord IDs (PhilSys-backed)',
              '3 verified matches in 48 hours',
              'Female-only options available',
            ].map((signal) => (
              <li key={signal} className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 flex-shrink-0 text-verified"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 5.29a1 1 0 00-1.408-1.42l-7.29 7.23-3.3-3.27a1 1 0 10-1.41 1.42l4 3.97a1 1 0 001.41 0l8-7.93z"
                    clipRule="evenodd"
                  />
                </svg>
                {signal}
              </li>
            ))}
          </motion.ul>

          {/* CTAs */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Link
              href="/listings"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand px-6 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-hero-warm"
            >
              Find a verified place
            </Link>
            <Link
              href="/landlord/signup"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-brand bg-transparent px-6 text-[15px] font-semibold text-brand transition-colors hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-hero-warm"
            >
              I&apos;m a landlord
            </Link>
          </motion.div>

          <p className="mt-6 text-xs text-text-tertiary">
            Free to browse. Free for landlords forever.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 2: TWO-PATH CTA ───
export function TwoPathCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative bg-background py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--max-width)] px-[var(--space-gutter)]">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="font-display mb-12 text-center font-bold text-fluid-headline text-text-primary"
        >
          Choose how much help you want.
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-6 md:grid-cols-2"
        >
          {/* CARD 1: Free browsing */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col rounded-2xl border border-border bg-surface p-8 shadow-sm"
          >
            <span className="mb-4 inline-block w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand">
              FREE FOREVER
            </span>
            <h3 className="mb-4 text-xl font-semibold text-text-primary">
              Browse 30+ verified listings in Pasig/Ortigas
            </h3>
            <ul className="mb-8 flex-1 space-y-3">
              {[
                'All listings have verified landlord IDs',
                'All units have been photographed in-person',
                'Female-only filter available',
                'No sign-up to browse',
                'Connect with landlords after both parties verified',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/listings"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-brand bg-surface px-6 py-3 text-base font-semibold text-brand transition-colors hover:bg-brand-light"
            >
              Browse listings &rarr;
            </a>
          </motion.div>

          {/* CARD 2: Verified Placement */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col rounded-2xl border-2 border-brand bg-surface p-8 shadow-md"
          >
            <span className="mb-4 inline-block w-fit rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
              DONE FOR YOU
            </span>
            <h3 className="mb-4 text-xl font-semibold text-text-primary">
              Find me a place in 48 hours. Guaranteed.
            </h3>
            <ul className="mb-8 flex-1 space-y-3">
              {[
                '3 verified matches in 48 hours',
                'Housing buddy coordinates your viewings',
                'Full refund if we can\'t deliver',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/reserve/placement"
              className="mb-3 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Reserve your spot — &#8369;149 &rarr;
            </a>
            <p className="text-center text-xs text-text-tertiary">
              &#8369;149 applied to your &#8369;499 total. Refunded in full if we can&apos;t deliver in 48 hours.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 3: WHY WE EXIST ───
export function WhyWeExist() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative bg-surface py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--max-width-narrow)] px-[var(--space-gutter)]">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="font-display mb-8 font-bold text-fluid-headline text-text-primary"
        >
          Finding safe housing in Manila shouldn&apos;t be this hard.
        </motion.h2>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-fluid-body-lg text-text-secondary"
        >
          <p>
            Most people arriving in Manila without a kakilala network — BPO new hires, students, fresh grads, OFW families — land with training or classes starting in 5-14 days, no local contacts, and scammers waiting. We heard story after story: &#8369;10,000 deposits sent to listings that didn&apos;t exist. Units that looked nothing like the photos. Landlords who locked out tenants after complaints.
          </p>
          <p>
            We built RentRayda because Facebook groups weren&apos;t enough. Every landlord on our platform is verified via PhilSys. Every listing is photographed in person. Your deposit goes directly to the landlord — we don&apos;t touch it.
          </p>
          <p>
            You shouldn&apos;t have to choose between &ldquo;unsafe and free&rdquo; and &ldquo;safe but expensive.&rdquo; With us, free is the default. Safety is the commitment. Money only changes hands when we&apos;ve delivered.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 4: HOW IT WORKS ───
export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative bg-background py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--max-width)] px-[var(--space-gutter)]">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="font-display mb-12 text-center font-bold text-fluid-headline text-text-primary"
        >
          How RentRayda works
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-8 md:grid-cols-2"
        >
          {/* Free browsing path */}
          <motion.div variants={staggerItem} className="rounded-2xl border border-border bg-surface p-8">
            <h3 className="mb-6 text-lg font-semibold text-text-primary">Free browsing</h3>
            <ol className="space-y-5">
              {[
                'Browse verified listings',
                'Both sides verify (PhilSys)',
                'Phone numbers reveal — you coordinate directly',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-sm text-text-secondary">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Verified Placement path */}
          <motion.div variants={staggerItem} className="rounded-2xl border-2 border-brand bg-surface p-8">
            <h3 className="mb-6 text-lg font-semibold text-text-primary">Verified Placement</h3>
            <ol className="space-y-5">
              {[
                'Submit 5-field form + \u20B1149 reservation',
                'We find 3 verified matches within 48 hours',
                'You view, pick, move in — deposit goes direct to landlord, \u20B1350 balance due',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-sm text-text-secondary">{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 5: SAFETY ───
export function Safety() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const indicators = [
    {
      icon: '\uD83D\uDEE1\uFE0F',
      title: 'PhilSys verification',
      desc: 'Every landlord verified through the Philippines\u2019 official ID system',
    },
    {
      icon: '\uD83D\uDC65',
      title: 'Female-only options',
      desc: 'Filter for female-only rooms, female-only landlords, female-only floors',
    },
    {
      icon: '\uD83D\uDCF9',
      title: 'Property walkthrough',
      desc: 'Every listed unit photographed in person by our team',
    },
    {
      icon: '\uD83D\uDEA8',
      title: 'Scam response',
      desc: 'If you report a scam within 48h of move-in, our team intervenes immediately',
    },
  ]

  return (
    <section ref={ref} className="relative bg-surface py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--max-width)] px-[var(--space-gutter)]">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="font-display mb-12 text-center font-bold text-fluid-headline text-text-primary"
        >
          Because safety isn&apos;t optional.
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-6 sm:grid-cols-2"
        >
          {indicators.map((item) => (
            <motion.div
              key={item.title}
              variants={staggerItem}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <div className="mb-3 text-3xl">{item.icon}</div>
              <h3 className="mb-2 text-base font-semibold text-text-primary">{item.title}</h3>
              <p className="text-sm text-text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 6: BUILT FOR MIGRANTS ───
export function BuiltForMigrants() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative bg-background py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--max-width-narrow)] px-[var(--space-gutter)]">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="font-display mb-8 font-bold text-fluid-headline text-text-primary"
        >
          Built for migrants moving to Pasig/Ortigas.
        </motion.h2>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.1 }}
          className="space-y-6 text-fluid-body-lg text-text-secondary"
        >
          <p>
            We focus narrowly on Pasig/Ortigas because focus wins. Our network is densest near:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Concentrix, Accenture, Teleperformance, TaskUs, Foundever (BPO offices)</li>
            <li>University belt extensions (DLSU-based students commuting, PUP, UP satellite)</li>
            <li>Pasig General Hospital, Rizal Medical Center</li>
            <li>Banks, retail chains, government offices in Ortigas Center</li>
          </ul>
          <p>
            Female-only options in San Antonio, Kapitolyo, Ugong, and Oranbo. Walking distance or jeep-ride to your destination.
          </p>
          <p>
            Other areas coming soon. For now — we&apos;d rather be great in one neighborhood than mediocre everywhere.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 7: FAQ ───
const faqItems = [
  {
    q: 'Ano ba yung "verified"?',
    a: 'Every landlord uploads a valid Philippine ID (PhilID, passport, driver\'s license) AND proof of property ownership (deed or utility bill). We manually review. Only after verification is their listing published.',
  },
  {
    q: 'Magkano ang Verified Placement?',
    a: '\u20B1499 po \u2014 kasama na lahat. 3 verified matches in 48 hours, housing buddy coordinates viewings, full refund kung hindi namin ma-deliver.',
  },
  {
    q: 'May bayad ba sa landlord?',
    a: 'Wala. Libre forever. Hindi kami kumukuha sa inyo ng bayad, fee, subscription, kahit anong form. Kayo lang yung nagde-decide at nag-a-approve ng tenant.',
  },
  {
    q: 'Paano yung deposit ko?',
    a: 'Diretso po ang deposit ninyo sa landlord \u2014 cash o bank transfer. Hindi kami humahawak ng pera. Ang binabayaran ninyo sa amin ay ang matching service lang po.',
  },
  {
    q: 'Pag may issue after move-in, ano mangyayari?',
    a: 'Report mo sa amin within 48 hours of move-in. Coordinate kami sa landlord at sa inyong legal options. Worst case: Verified Placement users get full \u20B1499 refund, plus we help locate a replacement unit within 48 hours.',
  },
  {
    q: 'Bakit Pasig/Ortigas lang?',
    a: 'Focus wins. We\'d rather be deeply trusted in one corridor than mediocre across five. Makati, BGC, and QC \u2014 soon, when we\'ve proven this works here.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex min-h-[44px] w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-text-primary">{q}</span>
        <svg
          className={`h-5 w-5 shrink-0 text-text-tertiary transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-text-secondary">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative bg-surface py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--max-width-narrow)] px-[var(--space-gutter)]">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="font-display mb-10 text-center font-bold text-fluid-headline text-text-primary"
        >
          Frequently asked questions
        </motion.h2>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ delay: 0.1 }}
        >
          {faqItems.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── SECTION 8: FINAL CTA ───
export function FinalCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative bg-brand py-[var(--section-padding-y)]">
      <div className="mx-auto max-w-[var(--max-width-narrow)] px-[var(--space-gutter)] text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="font-display mb-10 font-bold text-fluid-display text-white"
        >
          Your next place is 48 hours away.
        </motion.h2>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <motion.a
            variants={staggerItem}
            href="/listings"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-white bg-transparent px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Browse listings
          </motion.a>
          <motion.a
            variants={staggerItem}
            href="/reserve/placement"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-8 py-3 text-base font-semibold text-brand transition-colors hover:bg-white/90"
          >
            Reserve your spot — &#8369;149
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

// ─── FOOTER ───
export function Footer() {
  return (
    <footer className="border-t border-border bg-dark-surface py-10">
      <div className="mx-auto max-w-[var(--max-width)] px-[var(--space-gutter)] text-center">
        <p className="text-sm text-text-secondary">
          Built by Filipinos, for Filipinos. RA 10173 compliant. Data Protection Officer: dpo@rentrayda.com
        </p>
      </div>
    </footer>
  )
}
