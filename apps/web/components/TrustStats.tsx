'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { label: 'Scam reports blocked', value: 412, prefix: '', suffix: '+', color: '#E41E3F', bg: '#FEE2E2' },
  { label: 'Verified users', value: 1847, prefix: '', suffix: '', color: '#16A34A', bg: '#DCFCE7' },
  { label: 'Connections made', value: 623, prefix: '', suffix: '+', color: '#2D79BF', bg: '#DBEAFE' },
  { label: 'Cost to tenants', value: 0, prefix: '₱', suffix: '', color: '#F59E0B', bg: '#FEF3C7' },
] as const;

function AnimatedNumber({ value, prefix, suffix, inView }: { value: number; prefix: string; suffix: string; inView: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (value === 0) { setDisplay(0); return; }
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span className="tabular-nums">
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

export default function TrustStats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="section-padding-sm bg-background">
      <div className="max-w-[var(--max-width)] mx-auto">
        <h2 className="font-display font-bold text-fluid-headline text-center text-text-primary mb-4">
          Trust in numbers
        </h2>
        <p className="text-center text-fluid-body-lg text-text-secondary mb-14 max-w-[420px] mx-auto">
          Real data from real users. Updated daily.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-surface p-5 md:p-6 text-center shadow-sm shadow-black/[0.03] hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
              </div>
              <div className="font-display text-3xl md:text-4xl mb-1" style={{ color: s.color }}>
                <AnimatedNumber value={s.value} prefix={s.prefix} suffix={s.suffix} inView={inView} />
              </div>
              <div className="text-xs md:text-sm text-text-secondary">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
