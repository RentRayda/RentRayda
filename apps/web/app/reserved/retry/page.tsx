import { Suspense } from 'react';
import RetryContent from './RetryContent';

export default function RetryPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-text-secondary">Loading...</p>
      </main>
    }>
      <RetryContent />
    </Suspense>
  );
}
