/**
 * Geometric section dividers — brand-consistent visual rhythm between sections.
 *
 * Variants:
 * - dots: Row of evenly-spaced circles in brand blue
 * - diamonds: Small rotated squares
 * - tarsier: Tiny tarsier silhouettes (SVG)
 * - zigzag: Geometric zigzag line
 */

import { cn } from '@/lib/utils';

type DividerVariant = 'dots' | 'diamonds' | 'tarsier' | 'zigzag';

interface SectionDividerProps {
  variant?: DividerVariant;
  className?: string;
  /** Background color to match the section above/below */
  bg?: string;
}

export default function SectionDivider({ variant = 'dots', className, bg }: SectionDividerProps) {
  return (
    <div className={cn('flex items-center justify-center py-6 md:py-8', className)} style={bg ? { backgroundColor: bg } : undefined}>
      {variant === 'dots' && <Dots />}
      {variant === 'diamonds' && <Diamonds />}
      {variant === 'tarsier' && <TarsierRow />}
      {variant === 'zigzag' && <Zigzag />}
    </div>
  );
}

function Dots() {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all',
            i === 2 ? 'w-2.5 h-2.5 bg-brand' : 'w-1.5 h-1.5 bg-brand/30'
          )}
        />
      ))}
    </div>
  );
}

function Diamonds() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-px bg-border" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'rotate-45 transition-all',
            i === 1 ? 'w-3 h-3 bg-brand' : 'w-2 h-2 bg-brand/25'
          )}
        />
      ))}
      <div className="w-12 h-px bg-border" />
    </div>
  );
}

function TarsierRow() {
  return (
    <div className="flex items-center gap-5">
      <div className="w-16 h-px bg-border" />
      {/* Simplified tarsier head silhouette */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-tarsier/40">
        <circle cx="12" cy="11" r="8" fill="currentColor" />
        <circle cx="8" cy="9" r="3.5" fill="currentColor" />
        <circle cx="16" cy="9" r="3.5" fill="currentColor" />
        <circle cx="8" cy="9" r="2" fill="white" />
        <circle cx="16" cy="9" r="2" fill="white" />
        <circle cx="8.5" cy="9" r="1" fill="currentColor" />
        <circle cx="16.5" cy="9" r="1" fill="currentColor" />
        {/* Ears */}
        <ellipse cx="5" cy="4" rx="2.5" ry="3" fill="currentColor" />
        <ellipse cx="19" cy="4" rx="2.5" ry="3" fill="currentColor" />
      </svg>
      <div className="w-16 h-px bg-border" />
    </div>
  );
}

function Zigzag() {
  return (
    <svg width="200" height="12" viewBox="0 0 200 12" fill="none" className="text-brand/20">
      <path
        d="M0 6 L10 1 L20 6 L30 1 L40 6 L50 1 L60 6 L70 1 L80 6 L90 1 L100 6 L110 1 L120 6 L130 1 L140 6 L150 1 L160 6 L170 1 L180 6 L190 1 L200 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
