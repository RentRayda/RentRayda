'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Avatar } from './avatar';

export interface ListingCardProps {
  id: string;
  photos: string[];
  unitType: 'bedspace' | 'room' | 'apartment';
  monthlyRent: number;
  barangay: string;
  city?: string;
  beds?: number;
  landlordName?: string;
  landlordPhoto?: string | null;
  isVerified?: boolean;
  lastActiveAt?: string | null;
  variant?: 'feed' | 'gallery';
  onClick?: () => void;
  className?: string;
}

function formatPeso(amount: number): string {
  return '₱' + amount.toLocaleString('en-PH');
}

function getFreshness(lastActiveAt: string | null | undefined): {
  label: string;
  dotColor: string;
  textColor: string;
} {
  if (!lastActiveAt) return { label: 'New', dotColor: 'bg-brand', textColor: 'text-brand' };
  const hours = Math.floor((Date.now() - new Date(lastActiveAt).getTime()) / 3600000);
  const days = Math.floor(hours / 24);

  if (hours < 1) return { label: 'Just now', dotColor: 'bg-verified', textColor: 'text-verified' };
  if (hours < 24) return { label: `${hours}h ago`, dotColor: 'bg-verified', textColor: 'text-verified' };
  if (days < 3) return { label: `${days}d ago`, dotColor: 'bg-warning', textColor: 'text-amber-700' };
  return { label: `${days}d ago`, dotColor: 'bg-text-tertiary', textColor: 'text-text-tertiary' };
}

const UNIT_LABELS: Record<string, string> = {
  bedspace: 'Bedspace',
  room: 'Room',
  apartment: 'Apartment',
};

/* Shield check icon for verified badge */
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

/* Map pin icon */
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

/* Bed icon */
const BedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v9" />
  </svg>
);

function ListingCard({
  photos,
  unitType,
  monthlyRent,
  barangay,
  city,
  beds,
  landlordName,
  landlordPhoto,
  isVerified,
  lastActiveAt,
  variant = 'feed',
  onClick,
  className,
}: ListingCardProps) {
  const [currentPhoto, setCurrentPhoto] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const freshness = getFreshness(lastActiveAt);

  const isFeed = variant === 'feed';

  return (
    <motion.div
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'group cursor-pointer overflow-hidden rounded-2xl border border-border bg-surface',
        'shadow-sm shadow-black/5',
        'transition-shadow duration-300',
        'hover:shadow-lg hover:shadow-black/10',
        isFeed ? 'w-full' : 'w-full max-w-[300px]',
        className
      )}
    >
      {/* ── Image area ── */}
      <div className={cn('relative overflow-hidden', isFeed ? 'h-56' : 'h-44')}>
        {photos.length > 0 ? (
          <img
            src={photos[currentPhoto]}
            alt={`${UNIT_LABELS[unitType]} in ${barangay}`}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CED0D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Verified badge — BRAND: always green, never blue */}
        {isVerified && (
          <div className="absolute top-3 left-3">
            <Badge variant="verified" icon={<ShieldIcon />} className="backdrop-blur-sm bg-verified-light/90">
              Verified
            </Badge>
          </div>
        )}

        {/* Photo navigation arrows (show on hover) */}
        {photos.length > 1 && isHovered && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentPhoto((p) => (p === 0 ? photos.length - 1 : p - 1)); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow-md backdrop-blur-sm text-text-primary hover:bg-surface transition-all"
              aria-label="Previous photo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentPhoto((p) => (p === photos.length - 1 ? 0 : p + 1)); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow-md backdrop-blur-sm text-text-primary hover:bg-surface transition-all"
              aria-label="Next photo"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Photo indicator dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentPhoto(i); }}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === currentPhoto
                    ? 'w-5 bg-white shadow-sm'
                    : 'w-1.5 bg-white/60 hover:bg-white/80'
                )}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content area ── */}
      <div className="p-4 space-y-3">
        {/* Row 1: Unit type + freshness */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {UNIT_LABELS[unitType]}
          </Badge>
          <span className={cn('flex items-center gap-1.5 text-xs font-medium', freshness.textColor)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', freshness.dotColor)} />
            {freshness.label}
          </span>
        </div>

        {/* Row 2: Price — BRAND: Subhead = 18px/600 */}
        <div>
          <span className="text-lg font-semibold text-text-primary tracking-tight">
            {formatPeso(monthlyRent)}
          </span>
          <span className="text-sm text-text-secondary ml-0.5">/mo</span>
        </div>

        {/* Row 3: Location + beds — BRAND: Caption = 12px */}
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <PinIcon />
            {barangay}{city ? `, ${city}` : ''}
          </span>
          {beds !== undefined && beds > 0 && (
            <>
              <span className="h-3 w-px bg-divider" />
              <span className="flex items-center gap-1">
                <BedIcon />
                {beds} {beds === 1 ? 'bed' : 'beds'}
              </span>
            </>
          )}
        </div>

        {/* Row 4: Landlord — with divider */}
        {landlordName && (
          <div className="flex items-center gap-2.5 pt-2.5 border-t border-divider">
            <Avatar src={landlordPhoto} fallback={landlordName} size="sm" />
            <span className="text-xs text-text-secondary truncate">{landlordName}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export { ListingCard };
