import { USE_MOCK_DATA, MOCK_WEB_LISTINGS } from '../../lib/mock-data';
import ListingsClient from '../../components/listings/ListingsClient';
import FilterSidebar from '../../components/listings/FilterSidebar';

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
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F2F5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #CED0D4',
        padding: '12px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: 20, fontWeight: 700, color: '#2B51E3', textDecoration: 'none', fontFamily: 'TANNimbus' }}>rent rayda</a>
          <a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, backgroundColor: '#2B51E3', color: '#FFFFFF', borderRadius: 8, textDecoration: 'none', fontFamily: 'NotoSansOsage, sans-serif' }}
          >
            Download App
          </a>
        </div>
      </header>

      {/* Content + Sidebar layout (FB Groups style: feed left, filters right) */}
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '24px 20px',
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
      }}>
        {/* Main feed */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <ListingsClient listings={listings as any} defaultView={defaultView as any} />
        </main>

        {/* Right sidebar (like FB "About" panel) */}
        <FilterSidebar currentFilters={{
          city: params.city,
          barangay: params.barangay,
          minRent: params.minRent,
          maxRent: params.maxRent,
          type: params.type,
          view: defaultView,
        }} />
      </div>
    </div>
  );
}
