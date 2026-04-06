'use client';

import dynamic from 'next/dynamic';

const TarsierScene = dynamic(() => import('./TarsierScene'), { ssr: false });

export default function TarsierHero() {
  return <TarsierScene />;
}
