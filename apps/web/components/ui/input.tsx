'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, helperText, error, prefixIcon, suffixIcon, id, value, ...props }, ref) => {
    const inputId = id || React.useId();
    const [focused, setFocused] = React.useState(false);
    const hasValue = value !== undefined && value !== '';
    const isFloating = focused || hasValue;

    return (
      <div className="space-y-1.5">
        <div className="relative">
          {/* Prefix icon */}
          {prefixIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-text-tertiary">
              <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{prefixIcon}</span>
            </div>
          )}

          {/* Input field */}
          <input
            type={type}
            id={inputId}
            ref={ref}
            value={value}
            onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
            placeholder={label ? ' ' : props.placeholder}
            className={cn(
              /* Base — BRAND: Surface bg, 16px body text, 48dp touch target */
              'peer flex h-[52px] w-full rounded-xl border bg-surface px-4 text-base text-text-primary',
              'shadow-sm shadow-black/5',
              'placeholder:text-text-tertiary',
              /* Transitions */
              'transition-all duration-200',
              /* Focus ring — BRAND: brand blue */
              'focus:outline-none focus:ring-[3px] focus:ring-brand/15 focus:border-brand',
              /* Disabled */
              'disabled:cursor-not-allowed disabled:opacity-50',
              /* Error state */
              error
                ? 'border-danger focus:ring-danger/15 focus:border-danger'
                : 'border-border hover:border-border/80',
              /* Icon padding */
              prefixIcon && 'pl-11',
              suffixIcon && 'pr-11',
              /* Float label padding */
              label && 'pt-5 pb-1.5',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Floating label — BRAND: Label = 14px/500, Caption = 12px/400 */}
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                'pointer-events-none absolute left-4 text-text-tertiary',
                'transition-all duration-200 origin-[0]',
                prefixIcon && 'left-11',
                isFloating
                  ? 'top-2 text-xs text-text-secondary font-medium'
                  : 'top-1/2 -translate-y-1/2 text-base',
                focused && !error && 'text-brand',
                error && 'text-danger',
              )}
            >
              {label}
            </label>
          )}

          {/* Suffix icon */}
          {suffixIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-tertiary">
              <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]">{suffixIcon}</span>
            </div>
          )}
        </div>

        {/* Error message — BRAND: Caption = 12px */}
        {error && (
          <p id={`${inputId}-error`} className="flex items-center gap-1.5 text-xs text-danger pl-1">
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </p>
        )}
        {/* Helper text */}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-text-tertiary pl-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
