import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'group inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium',
    'transition-all duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
    'cursor-pointer select-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-brand text-white shadow-sm shadow-brand/25',
          'hover:bg-brand-dark hover:shadow-md hover:shadow-brand/30',
        ].join(' '),
        secondary: [
          'border border-border bg-surface text-text-primary shadow-sm shadow-black/5',
          'hover:bg-background hover:border-border/80',
        ].join(' '),
        ghost: [
          'text-text-primary',
          'hover:bg-background',
        ].join(' '),
        danger: [
          'bg-danger text-white shadow-sm shadow-danger/25',
          'hover:bg-danger/90 hover:shadow-md hover:shadow-danger/30',
        ].join(' '),
        link: [
          'text-brand underline-offset-4',
          'hover:underline hover:text-brand-dark',
        ].join(' '),
      },
      size: {
        sm: 'h-9 rounded-lg px-3.5 text-[13px]',         /* Caption+ size */
        default: 'h-11 rounded-xl px-5 text-sm',           /* Label size: 14px/500 */
        lg: 'h-12 rounded-xl px-6 text-base',              /* Body size: 16px */
        icon: 'h-11 w-11 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
