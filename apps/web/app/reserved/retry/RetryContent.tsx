'use client';

import { useSearchParams } from 'next/navigation';

export default function RetryContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[520px] px-[var(--space-gutter)] py-16 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF3C7]">
          <svg className="h-8 w-8 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="font-display mb-2 text-2xl font-bold text-text-primary">
          Payment not completed
        </h1>
        <p className="mb-8 text-sm text-text-secondary">
          Your payment was cancelled or failed. No charge was made. You can try again with the same reservation.
        </p>

        <a
          href={id ? `/reserve/placement?retry=${id}` : '/reserve/placement'}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Try again
        </a>

        <p className="mt-6 text-xs text-text-tertiary">
          If the issue persists, contact <a href="mailto:dpo@rentrayda.com" className="text-brand">dpo@rentrayda.com</a>
        </p>
      </div>
    </main>
  );
}
