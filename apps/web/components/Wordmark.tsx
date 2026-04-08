import { cn } from '@/lib/utils';

/**
 * "RentRayda" wordmark — Sentient Bold, consistent everywhere.
 * SINGLE SOURCE OF TRUTH for the wordmark style.
 */

const sizes = {
  sm: 'text-xl',
  md: 'text-xl',
  lg: 'text-[clamp(44px,7vw,72px)]',
} as const;

interface WordmarkProps {
  size?: keyof typeof sizes;
  className?: string;
  color?: string;
}

export default function Wordmark({ size = 'sm', className, color }: WordmarkProps) {
  return (
    <span
      className={cn(
        'font-display font-bold tracking-[0.5px] leading-[1.1]',
        sizes[size],
        !color && 'text-text-primary',
        className
      )}
      style={color ? { color } : undefined}
    >
      RentRayda
    </span>
  );
}
