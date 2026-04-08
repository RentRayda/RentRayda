import { USE_MOCK_DATA, MOCK_WEB_LISTINGS } from '../../lib/mock-data';
import ListingsClient from '../../components/listings/ListingsClient';
import FilterSidebar from '../../components/listings/FilterSidebar';
import Wordmark from '../../components/Wordmark';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Listing {
  id: string;
  monthlyRent: number;
  unitType: string;
  barangay: string;
  city: string;
  description: string | null;
  lastActiveAt: string;
  landlordProfile: {
    fullName: string;
    verificationStatus: string;
  };
}

async function getListings(params: { barangay?: string; minRent?: string; maxRent?: string; type?: string; page?: string }) {
  if (USE_MOCK_DATA) {
    let filtered = [...MOCK_WEB_LISTINGS];
    if (params.barangay) filtered = filtered.filter(l => l.barangay === params.barangay);
    if (params.type) filtered = filtered.filter(l => l.unitType === params.type);
    if (params.minRent) filtered = filtered.filter(l => l.monthlyRent >= parseInt(params.minRent!));
    if (params.maxRent) filtered = filtered.filter(l => l.monthlyRent <= parseInt(params.maxRent!));
    return { listings: filtered, total: filtered.length, page: 1, pageSize: 10 };
  }

  const query = new URLSearchParams();
  if (params.barangay) query.set('barangay', params.barangay);
  if (params.minRent) query.set('minRent', params.minRent);
  if (params.maxRent) query.set('maxRent', params.maxRent);
  if (params.type) query.set('type', params.type);
  query.set('page', params.page || '1');

  try {
    const res = await fetch(`${API_URL}/api/listings?${query}`, { cache: 'no-store' });
    if (!res.ok) return { listings: [], total: 0, page: 1, pageSize: 10 };
    return (await res.json()).data;
  } catch {
    return { listings: [], total: 0, page: 1, pageSize: 10 };
  }
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; barangay?: string; minRent?: string; maxRent?: string; type?: string; page?: string; view?: string }>;
}) {
  const params = await searchParams;
  const data = await getListings(params);
  const listings: Listing[] = data.listings;
  const defaultView = params.view === 'gallery' ? 'gallery' : 'feed';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border px-5 py-3">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <a href="/" className="no-underline">
            <Wordmark />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            className="text-sm font-semibold bg-brand text-white px-4 py-2 rounded-lg no-underline hover:bg-brand-dark transition-colors shadow-sm shadow-brand/20"
          >
            Download App
          </a>
        </div>
      </header>

      {/* Content: feed + sidebar */}
      <div className="max-w-[1100px] mx-auto px-5 py-6 flex flex-col md:flex-row gap-6 items-start">
        {/* Main feed */}
        <main className="flex-1 min-w-0 order-2 md:order-1">
          <ListingsClient listings={listings as any} defaultView={defaultView as any} />
        </main>

        {/* Sidebar — hidden on mobile, shown as bottom sheet or collapsed */}
        <aside className="w-full md:w-[320px] flex-shrink-0 order-1 md:order-2 md:sticky md:top-[72px]">
          <FilterSidebar currentFilters={{
            city: params.city,
            barangay: params.barangay,
            minRent: params.minRent,
            maxRent: params.maxRent,
            type: params.type,
            view: defaultView,
          }} />
        </aside>
      </div>
    </div>
  );
}
