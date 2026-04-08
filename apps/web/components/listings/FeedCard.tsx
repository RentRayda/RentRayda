'use client';

import { motion } from 'framer-motion';
import { MOCK_PHOTOS, MOCK_WEB_LISTING_DETAILS } from '../../lib/mock-data';
import PhotoGrid from './PhotoGrid';

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

const INCLUSION_LABELS: Record<string, string> = {
  water: 'Water',
  electricity: 'Electricity',
  wifi: 'WiFi',
  cr: 'Bathroom',
  aircon: 'Aircon',
  parking: 'Parking',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Active today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
}

export default function FeedCard({ listing, index }: { listing: Listing; index: number }) {
  const photos = MOCK_PHOTOS[listing.id] || [];
  const detail = MOCK_WEB_LISTING_DETAILS[listing.id];
  const inclusions: string[] = detail?.inclusions || [];
  const isVerified = listing.landlordProfile.verificationStatus === 'verified';
  const initials = listing.landlordProfile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        border: '1px solid #E4E6EB',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 9999,
          backgroundColor: '#2D79BF', color: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 600, fontFamily: 'Be Vietnam Pro, sans-serif',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 15, fontWeight: 600, color: '#050505' }}>
              {listing.landlordProfile.fullName}
            </span>
            {isVerified && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 3,
                backgroundColor: '#DCFCE7', border: '1px solid #86EFAC',
                borderRadius: 9999, padding: '2px 8px',
                fontFamily: 'Be Vietnam Pro, sans-serif',
                fontSize: 11, fontWeight: 600, color: '#16A34A',
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Verified
              </span>
            )}
          </div>
          <div style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 13, color: '#65676B', marginTop: 2 }}>
            <span style={{ textTransform: 'capitalize' }}>{listing.unitType}</span> &middot; {timeAgo(listing.lastActiveAt)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 16px' }}>
        {/* Price */}
        <div style={{
          fontFamily: 'Be Vietnam Pro, sans-serif',
          fontSize: 22, fontWeight: 700, color: '#2D79BF',
          marginBottom: 6,
        }}>
          PHP {listing.monthlyRent.toLocaleString()}/month
        </div>

        {/* Location */}
        <div style={{
          fontFamily: 'Be Vietnam Pro, sans-serif',
          fontSize: 14, color: '#65676B',
          marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#65676B" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {listing.barangay}, {listing.city}
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'Be Vietnam Pro, sans-serif',
          fontSize: 15, color: '#050505', lineHeight: 1.55,
          margin: '0 0 12px',
        }}>
          {listing.description}
        </p>

        {/* Inclusions */}
        {inclusions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {inclusions.map(inc => (
              <span key={inc} style={{
                fontFamily: 'Be Vietnam Pro, sans-serif',
                fontSize: 12, color: '#65676B',
                backgroundColor: '#F0F2F5',
                padding: '4px 10px',
                borderRadius: 6,
              }}>
                {INCLUSION_LABELS[inc] || inc}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Photos */}
      {photos.length > 0 && (
        <div style={{ padding: '0 16px' }}>
          <PhotoGrid photos={photos} alt={`${listing.unitType} in ${listing.barangay}`} />
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: 16 }}>
        <a
          href={`/listings/${listing.id}`}
          style={{
            display: 'block', textAlign: 'center',
            padding: '12px 24px',
            backgroundColor: '#F0F2F5',
            color: '#2D79BF',
            borderRadius: 8,
            fontFamily: 'Be Vietnam Pro, sans-serif',
            fontSize: 14, fontWeight: 600,
            textDecoration: 'none',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E4E6EB')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#F0F2F5')}
        >
          View Details
        </a>
      </div>
    </motion.div>
  );
}
