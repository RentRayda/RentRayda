import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* BRAND.MD: minimum 12px text. Caption level = 12px/400 */
const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1',
    'text-xs font-medium',    /* 12px per brand spec — never smaller */
    'transition-colors duration-150',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-brand/20 bg-brand-light text-brand-dark',
        verified: 'border-verified-border bg-verified-light text-verified',
        pending: 'border-warning/30 bg-warning-light text-amber-800',
        danger: 'border-danger/20 bg-danger-light text-danger',
        outline: 'border-border bg-transparent text-text-secondary',
        secondary: 'border-transparent bg-background text-text-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a pulsing dot indicator */
  dot?: boolean;
  /** Leading icon element */
  icon?: React.ReactNode;
}

function Badge({ className, variant, dot, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
        </span>
      )}
      {icon && <span className="shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
