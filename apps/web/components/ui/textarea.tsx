'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, showCount, maxLength, id, value, ...props }, ref) => {
    const textareaId = id || React.useId();
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-text-secondary pl-1">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            /* Matches Input styling */
            'flex min-h-[120px] w-full rounded-xl border bg-surface px-4 py-3.5 text-base text-text-primary',
            'shadow-sm shadow-black/5',
            'placeholder:text-text-tertiary',
            'transition-all duration-200 resize-y',
            'focus:outline-none focus:ring-[3px] focus:ring-brand/15 focus:border-brand',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-danger focus:ring-danger/15 focus:border-danger'
              : 'border-border hover:border-border/80',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        <div className="flex items-center justify-between px-1">
          <div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-danger">
                <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </p>
            )}
            {!error && helperText && (
              <p className="text-xs text-text-tertiary">{helperText}</p>
            )}
          </div>
          {showCount && maxLength && (
            <p className={cn(
              'text-xs tabular-nums',
              charCount > maxLength * 0.9 ? 'text-danger' : 'text-text-tertiary'
            )}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
