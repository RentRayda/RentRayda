import { Suspense } from 'react';
import ReservationForm from './ReservationForm';

export default function ReservePlacementPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-text-secondary">Loading...</p>
      </main>
    }>
      <ReservationForm />
    </Suspense>
  );
}
