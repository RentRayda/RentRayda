'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ReservationData {
  id: string;
  tier: string;
  status: string;
  amountCentavos: number;
  currency: string;
  createdAt: string;
  paidAt: string | null;
}

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('No reservation ID found.');
      setLoading(false);
      return;
    }

    async function fetchReservation() {
      try {
        const res = await fetch(`${API_URL}/api/payments/reservations/${id}`);
        if (!res.ok) throw new Error('Reservation not found');
        const { data } = await res.json();
        setReservation(data);
      } catch {
        setError('Could not load reservation details. Contact us at dpo@rentrayda.com');
      } finally {
        setLoading(false);
      }
    }

    fetchReservation();
    // Poll for status update (webhook may arrive after redirect)
    const interval = setInterval(fetchReservation, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-text-secondary">Loading reservation...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center">
          <h1 className="font-display mb-4 text-2xl font-bold text-text-primary">Something went wrong</h1>
          <p className="mb-6 text-sm text-text-secondary">{error}</p>
          <a href="/" className="text-sm font-medium text-brand hover:text-brand-dark">Back to RentRayda</a>
        </div>
      </main>
    );
  }

  const isPaid = reservation?.status === 'paid';
  const amount = reservation ? `\u20B1${(reservation.amountCentavos / 100).toLocaleString()}` : '\u20B1149';
  const date = reservation?.paidAt
    ? new Date(reservation.paidAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
    : reservation?.createdAt
      ? new Date(reservation.createdAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
      : '';

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[520px] px-[var(--space-gutter)] py-16 text-center">
        {/* Status icon */}
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7]">
          {isPaid ? (
            <svg className="h-8 w-8 text-[#16A34A]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-8 w-8 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
        </div>

        <h1 className="font-display mb-2 text-2xl font-bold text-text-primary">
          {isPaid ? 'Reservation confirmed!' : 'Confirming payment...'}
        </h1>

        <p className="mb-8 text-sm text-text-secondary">
          {isPaid
            ? 'Your verified placement reservation is active.'
            : 'Waiting for payment confirmation. This usually takes a few seconds.'}
        </p>

        {/* Receipt */}
        <div className="mb-8 rounded-xl border border-border bg-surface p-6 text-left">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
            <span className="text-sm text-text-secondary">Amount</span>
            <span className="text-lg font-bold text-text-primary">{amount}</span>
          </div>
          <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
            <span className="text-sm text-text-secondary">Status</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isPaid ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#FEF3C7] text-[#92400E]'
            }`}>
              {isPaid ? 'Paid' : 'Pending'}
            </span>
          </div>
          {date && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Date</span>
              <span className="text-sm font-medium text-text-primary">{date}</span>
            </div>
          )}
        </div>

        {/* Next steps */}
        {isPaid && (
          <div className="mb-8 rounded-xl border border-brand/20 bg-brand-light p-6 text-left">
            <h2 className="mb-4 text-base font-semibold text-text-primary">What happens next</h2>
            <ol className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">1</span>
                We&apos;ll call you within 24 hours to understand your needs.
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">2</span>
                Expect 3 verified matches within 48 hours.
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">3</span>
                &#8369;350 balance due on move-in (&#8369;499 total).
              </li>
            </ol>
          </div>
        )}

        <p className="text-xs text-text-tertiary">
          Questions? Contact us at <a href="mailto:dpo@rentrayda.com" className="text-brand">dpo@rentrayda.com</a>
        </p>
      </div>
    </main>
  );
}
