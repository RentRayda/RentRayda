'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const BARANGAY_OPTIONS = [
  'San Antonio', 'Kapitolyo', 'Ugong', 'Oranbo',
  'Rosario', 'Santa Rosa', 'Pinagbuhatan', 'Caniogan',
  'Bagong Ilog', 'Bambang', 'Santolan',
];

export default function ReservationForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [barangays, setBarangays] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const utmSource = searchParams.get('utm_source') || undefined;
  const utmCampaign = searchParams.get('utm_campaign') || undefined;
  const utmMedium = searchParams.get('utm_medium') || undefined;
  const referrer = searchParams.get('ref') || undefined;
  const variant = searchParams.get('v') || undefined;

  function toggleBarangay(b: string) {
    setBarangays((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError('Please agree to the Privacy Policy to continue.');
      return;
    }
    if (!email || !phone) {
      setError('Email and phone are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/payments/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          name: name || undefined,
          utmSource,
          utmCampaign,
          utmMedium,
          referrer,
          variant,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create reservation');
      }

      const { data } = await res.json();
      window.location.href = data.checkoutUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[520px] px-[var(--space-gutter)] py-16">
        <a href="/" className="mb-8 inline-block text-sm text-text-tertiary hover:text-brand">
          &larr; Back to RentRayda
        </a>

        <h1 className="font-display mb-2 text-2xl font-bold text-text-primary">
          Reserve Verified Placement
        </h1>
        <p className="mb-8 text-sm text-text-secondary">
          3 verified matches in 48 hours or full refund. &#8369;149 reservation, &#8369;350 balance on move-in (&#8369;499 total).
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-primary">
              Email <span className="text-[#DC2626]">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@gmail.com"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text-primary">
              Phone (PH mobile) <span className="text-[#DC2626]">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09171234567"
              pattern="09\d{9}"
              title="Philippine mobile number starting with 09"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-primary">
              Name <span className="text-text-tertiary">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Maria Santos"
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Preferred barangays <span className="text-text-tertiary">(select all that work)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {BARANGAY_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBarangay(b)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    barangays.includes(b)
                      ? 'border-brand bg-brand text-white'
                      : 'border-border bg-surface text-text-secondary hover:border-brand/40'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="moveIn" className="mb-1.5 block text-sm font-medium text-text-primary">
              When do you need to move in?
            </label>
            <input
              id="moveIn"
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="budgetMin" className="mb-1.5 block text-sm font-medium text-text-primary">
                Budget min (&#8369;)
              </label>
              <input
                id="budgetMin"
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                placeholder="3000"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label htmlFor="budgetMax" className="mb-1.5 block text-sm font-medium text-text-primary">
                Budget max (&#8369;)
              </label>
              <input
                id="budgetMax"
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="8000"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-border text-brand focus:ring-brand/20"
              />
              <span className="text-xs leading-relaxed text-text-secondary">
                I agree to RentRayda&apos;s{' '}
                <a href="/privacy" className="text-brand underline">Privacy Policy</a>{' '}
                and consent to storing my contact information for rental matching purposes.
                My data will not be shared with third parties.
              </span>
            </label>
          </div>

          {error && (
            <div className="rounded-lg bg-[#FEE2E2] px-4 py-3 text-sm text-[#DC2626]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
          >
            {loading ? 'Redirecting to payment...' : 'Pay \u20B1149 \u2014 Reserve my spot'}
          </button>

          <p className="text-center text-xs text-text-tertiary">
            &#8369;149 applied to your &#8369;499 total. Refunded in full if we can&apos;t deliver in 48 hours.
          </p>
        </form>
      </div>
    </main>
  );
}
