import * as React from 'react';
import { cn } from '@/lib/utils';

const sizeMap = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
} as const;

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: keyof typeof sizeMap;
}

function Avatar({ src, alt, fallback, size = 'md', className, ...props }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  const initials = fallback
    ? fallback.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'ring-2 ring-surface',
        sizeMap[size],
        /* Gradient background for fallback — feels more polished than flat color */
        !src || imgError ? 'bg-gradient-to-br from-brand to-brand-dark' : '',
        className
      )}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={alt || fallback || 'Avatar'}
          className="aspect-square h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-medium text-white select-none">{initials}</span>
      )}
    </div>
  );
}

export { Avatar };
