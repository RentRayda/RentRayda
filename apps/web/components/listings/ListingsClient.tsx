'use client';

import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import ViewToggle from './ViewToggle';
import FeedCard from './FeedCard';
import GalleryCard from './GalleryCard';

interface Listing {
  id: string;
  monthlyRent: number;
  unitType: string;
  barangay: string;
  city: string;
  description: string;
  lastActiveAt: string;
  landlordProfile: {
    fullName: string;
    verificationStatus: string;
  };
}

function AnimatedBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Large blue glow - top right */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(43,81,227,0.14) 0%, rgba(43,81,227,0.04) 50%, rgba(43,81,227,0) 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Blue glow - bottom left */}
      <motion.div
        animate={{
          x: [0, -30, 25, 0],
          y: [0, 25, -35, 0],
          scale: [1, 0.94, 1.06, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          bottom: '-5%',
          left: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(43,81,227,0.12) 0%, rgba(43,81,227,0.03) 50%, rgba(43,81,227,0) 70%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Lighter accent - center floating */}
      <motion.div
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -15, 25, 0],
          opacity: [0.6, 1, 0.7, 0.6],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: '35%',
          left: '45%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96,165,250,0.10) 0%, rgba(96,165,250,0.02) 50%, rgba(96,165,250,0) 70%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  );
}

export default function ListingsClient({
  listings,
  defaultView = 'feed',
}: {
  listings: Listing[];
  defaultView?: 'feed' | 'gallery';
}) {
  const [view, setView] = useState<'feed' | 'gallery'>(defaultView);

  const handleToggle = (newView: 'feed' | 'gallery') => {
    setView(newView);
    // Preserve view choice in URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('view', newView);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <>
      <AnimatedBackground />

      {/* Toggle bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'relative',
        zIndex: 1,
      }}>
        <LayoutGroup>
          <ViewToggle activeView={view} onToggle={handleToggle} />
        </LayoutGroup>
      </div>

      {/* Listings views */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {view === 'feed' ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {listings.map((listing, i) => (
                <FeedCard key={listing.id} listing={listing} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 16,
              }}
            >
              {listings.map((listing, i) => (
                <GalleryCard key={listing.id} listing={listing} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {listings.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '80px 24px',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CED0D4" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <p style={{
            fontFamily: 'Ralgine, serif',
            fontSize: 22, color: '#050505', margin: '0 0 8px',
          }}>
            No listings here yet
          </p>
          <p style={{
            fontFamily: 'NotoSansOsage, sans-serif',
            fontSize: 15, color: '#65676B',
          }}>
            Try a different area or check back soon.
          </p>
        </div>
      )}
    </>
  );
}
