'use client';

import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Maria Santos',
    role: 'Tenant',
    location: 'BPO worker from Pampanga',
    quote: 'Dati sa Facebook groups lang ako naghahanap. Dalawang beses na akong na-scam — nagbayad ng deposit tapos nawala yung "landlord." Sa RentRayda, verified yung landlord bago pa ako nag-message. First time ko na-feel safe.',
    color: 'bg-brand-light',
    initials: 'MS',
    initialsColor: 'bg-brand text-white',
  },
  {
    name: 'Tita Susan Reyes',
    role: 'Landlord',
    location: '3 bedspaces in Ugong, Pasig',
    quote: 'Ang dami kong tinanggap na tenant na hindi nag-bayad after 1 month. Ngayon, bago ko pa buksan yung pinto, alam ko na verified yung tao. May government ID, may employment proof. Malaking difference.',
    color: 'bg-verified-light',
    initials: 'SR',
    initialsColor: 'bg-verified text-white',
  },
  {
    name: 'James dela Cruz',
    role: 'Tenant',
    location: 'Call center agent, Mandaluyong',
    quote: 'Galing ako sa Cebu, walang kakilala dito sa Manila. Yung ibang app parang listing lang ng listing, walang verification. Dito alam mo na legit yung bahay kasi verified yung landlord. Naka-connect ako in 2 days.',
    color: 'bg-warning-light',
    initials: 'JD',
    initialsColor: 'bg-warning text-white',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-24 px-5 bg-surface relative">
      {/* Subtle tarsier pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #2D79BF 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-[1060px] mx-auto relative">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold text-brand tracking-widest uppercase text-center mb-3"
        >
          Real Stories
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="font-display text-[clamp(28px,4vw,36px)] text-text-primary text-center leading-[1.2] tracking-[0.5px] mb-4"
        >
          What our users say
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="font-heading text-base text-text-secondary text-center mb-12 max-w-[440px] mx-auto"
        >
          Real tenants and landlords. Real connections. Real trust.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-surface p-6 shadow-sm shadow-black/[0.03] hover:shadow-md transition-all"
            >
              {/* Quote mark */}
              <div className="text-brand/15 text-5xl font-display leading-none mb-2">"</div>

              {/* Quote text — Sentient italic feel */}
              <p className="font-heading text-[15px] text-text-primary leading-relaxed mb-6">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-divider">
                <div className={`w-10 h-10 rounded-full ${t.initialsColor} flex items-center justify-center text-sm font-semibold`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{t.name}</p>
                  <p className="text-xs text-text-tertiary">{t.role} · {t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
