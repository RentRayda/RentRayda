'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, placeholder, id, value, ...props }, ref) => {
    const selectId = id || React.useId();
    const hasValue = value !== undefined && value !== '';

    return (
      <div className="space-y-1.5">
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            value={value}
            className={cn(
              /* Base — matches Input height & style */
              'peer flex h-[52px] w-full appearance-none rounded-xl border bg-surface px-4 text-base text-text-primary',
              'shadow-sm shadow-black/5',
              'transition-all duration-200',
              /* Focus */
              'focus:outline-none focus:ring-[3px] focus:ring-brand/15 focus:border-brand',
              /* Disabled */
              'disabled:cursor-not-allowed disabled:opacity-50',
              /* Error */
              error
                ? 'border-danger focus:ring-danger/15 focus:border-danger'
                : 'border-border hover:border-border/80',
              /* Float label padding */
              label && 'pt-5 pb-1.5',
              /* Chevron */
              'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2218%22%20height%3D%2218%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2365676B%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22/%3E%3C/svg%3E")] bg-[length:18px] bg-[right_14px_center] bg-no-repeat pr-10',
              /* Placeholder color when no value */
              !hasValue && 'text-text-tertiary',
              className
            )}
            aria-invalid={!!error}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Floating label */}
          {label && (
            <label
              htmlFor={selectId}
              className={cn(
                'pointer-events-none absolute left-4 text-text-tertiary',
                'transition-all duration-200 origin-[0]',
                hasValue
                  ? 'top-2 text-xs text-text-secondary font-medium'
                  : 'top-1/2 -translate-y-1/2 text-base',
              )}
            >
              {label}
            </label>
          )}
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-danger pl-1">
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-text-tertiary pl-1">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
