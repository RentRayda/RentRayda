'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

function AnimatedCounter({ target, suffix = '', prefix = '' }: {
  target: number; suffix?: string; prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const dur = 1600, steps = 45;
    const inc = target / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(cur));
    }, dur / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const stats = [
  { value: 67, suffix: '%', label: 'of Filipinos encounter scams monthly', color: '#E41E3F', bg: '#FEF2F2', border: '#FECACA' },
  { value: 100, suffix: '%', label: 'of users verified before connecting', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  { value: 0, suffix: '', prefix: '₱', label: 'fees — free forever, no catch', color: '#2B51E3', bg: '#EFF6FF', border: '#BFDBFE' },
  { value: 48, suffix: 'hr', label: 'average verification time', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
];

export default function TrustStats() {
  return (
    <section style={{ padding: '80px 24px', backgroundColor: '#FAFBFF' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: 13, fontFamily: 'NotoSansOsage', color: '#2B51E3',
            fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase',
            textAlign: 'center', margin: '0 0 12px',
          }}
        >
          Trust in numbers
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)', fontFamily: 'Ralgine',
            color: '#050505', textAlign: 'center', margin: '0 0 48px',
            lineHeight: 1.3, letterSpacing: 0.5,
          }}
        >
          Built for a market where trust is broken
        </motion.h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 16,
        }}>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -3, boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}
              style={{
                padding: '28px 20px', borderRadius: 14,
                backgroundColor: s.bg,
                border: `1px solid ${s.border}`,
                textAlign: 'center',
              }}
            >
              <div style={{
                fontSize: 38, fontFamily: 'TANNimbus', color: s.color,
                marginBottom: 8, lineHeight: 1,
              }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} prefix={s.prefix} />
              </div>
              <p style={{
                fontSize: 13, fontFamily: 'NotoSansOsage', color: '#65676B',
                margin: 0, lineHeight: 1.5,
              }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
