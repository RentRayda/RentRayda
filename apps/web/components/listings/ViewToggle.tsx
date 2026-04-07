'use client';

import { motion } from 'framer-motion';

type ViewMode = 'feed' | 'gallery';

interface ViewToggleProps {
  activeView: ViewMode;
  onToggle: (view: ViewMode) => void;
}

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="2" y1="4" x2="14" y2="4" />
    <line x1="2" y1="8" x2="14" y2="8" />
    <line x1="2" y1="12" x2="14" y2="12" />
  </svg>
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="5" height="5" rx="1" />
    <rect x="9" y="2" width="5" height="5" rx="1" />
    <rect x="2" y="9" width="5" height="5" rx="1" />
    <rect x="9" y="9" width="5" height="5" rx="1" />
  </svg>
);

const options: { key: ViewMode; label: string; icon: React.ReactNode }[] = [
  { key: 'feed', label: 'Feed', icon: <ListIcon /> },
  { key: 'gallery', label: 'Gallery', icon: <GridIcon /> },
];

export default function ViewToggle({ activeView, onToggle }: ViewToggleProps) {
  return (
    <div style={{
      display: 'inline-flex',
      backgroundColor: '#E4E6EB',
      borderRadius: 9999,
      padding: 4,
      gap: 2,
    }}>
      {options.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onToggle(key)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 20px',
            border: 'none',
            borderRadius: 9999,
            cursor: 'pointer',
            fontFamily: 'NotoSansOsage, sans-serif',
            fontSize: 14,
            fontWeight: activeView === key ? 600 : 400,
            color: activeView === key ? '#050505' : '#65676B',
            background: 'transparent',
            zIndex: 1,
            transition: 'color 0.2s ease',
          }}
        >
          {activeView === key && (
            <motion.div
              layoutId="viewTogglePill"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: 9999,
                boxShadow: '0 1px 3px rgba(43,81,227,0.15)',
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            {icon}
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
