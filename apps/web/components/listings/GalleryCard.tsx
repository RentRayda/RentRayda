'use client';

import { motion } from 'framer-motion';
import { MOCK_PHOTOS } from '../../lib/mock-data';

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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Active today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
}

export default function GalleryCard({ listing, index }: { listing: Listing; index: number }) {
  const photos = MOCK_PHOTOS[listing.id] || [];
  const isVerified = listing.landlordProfile.verificationStatus === 'verified';
  const initials = listing.landlordProfile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <motion.a
      href={`/listings/${listing.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #E4E6EB',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        cursor: 'pointer',
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', height: 220, backgroundColor: '#F0F2F5', overflow: 'hidden' }}>
        {photos.length > 0 ? (
          <img
            src={photos[0]}
            alt={`${listing.unitType} in ${listing.barangay}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, color: '#CED0D4',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CED0D4" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10.5" r="1.5" />
              <path d="M21 15l-5-5L5 19" />
            </svg>
          </div>
        )}

        {/* Price overlay */}
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          color: '#FFFFFF',
          padding: '6px 12px',
          borderRadius: 8,
          fontFamily: 'NotoSansOsage, sans-serif',
          fontSize: 16, fontWeight: 700,
        }}>
          PHP{listing.monthlyRent.toLocaleString()}/mo
        </div>

        {/* Photo count */}
        {photos.length > 1 && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#FFFFFF',
            padding: '4px 8px',
            borderRadius: 6,
            fontFamily: 'NotoSansOsage, sans-serif',
            fontSize: 12,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10.5" r="1.5" />
              <path d="M21 15l-5-5L5 19" />
            </svg>
            {photos.length}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{
          fontFamily: 'NotoSansOsage, sans-serif',
          fontSize: 15, fontWeight: 500, color: '#050505',
          marginBottom: 6,
          textTransform: 'capitalize',
        }}>
          {listing.unitType} in {listing.barangay}, {listing.city}
        </div>

        {/* Landlord row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 9999,
            backgroundColor: '#2B51E3', color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, fontFamily: 'NotoSansOsage, sans-serif',
          }}>
            {initials}
          </div>
          <span style={{ fontFamily: 'NotoSansOsage, sans-serif', fontSize: 13, color: '#65676B' }}>
            {listing.landlordProfile.fullName}
          </span>
          {isVerified && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              backgroundColor: '#DCFCE7', border: '1px solid #86EFAC',
              borderRadius: 9999, padding: '2px 8px',
              fontFamily: 'NotoSansOsage, sans-serif',
              fontSize: 11, fontWeight: 600, color: '#16A34A',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Verified
            </span>
          )}
        </div>

        {/* Time ago */}
        <div style={{
          fontFamily: 'NotoSansOsage, sans-serif',
          fontSize: 12, color: '#8A8D91',
        }}>
          {timeAgo(listing.lastActiveAt)}
        </div>
      </div>
    </motion.a>
  );
}
