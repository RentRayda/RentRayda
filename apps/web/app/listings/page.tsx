import { USE_MOCK_DATA, MOCK_WEB_LISTINGS, MOCK_PHOTOS } from '../../lib/mock-data';

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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return 'Active today';
  if (hours < 48) return 'Yesterday';
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} week(s) ago`;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ barangay?: string; minRent?: string; maxRent?: string; type?: string; page?: string }>;
}) {
  const params = await searchParams;
  const data = await getListings(params);
  const listings: Listing[] = data.listings;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F2F5' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #CED0D4', padding: '16px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: 20, fontWeight: 700, color: '#2563EB', textDecoration: 'none', fontFamily: 'BerlinSansFB' }}>RentRayda</a>
          <a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            style={{ padding: '8px 16px', fontSize: 14, fontWeight: 600, backgroundColor: '#2563EB', color: '#FFFFFF', borderRadius: 8, textDecoration: 'none' }}
          >
            Download App
          </a>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, fontFamily: 'BerlinSansFB' }}>Verified Listings</h1>
        <p style={{ fontSize: 16, color: '#65676B', marginBottom: 24 }}>
          All landlords are verified. Only active listings shown.
        </p>

        {/* Filters */}
        <form method="GET" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
          <select name="barangay" defaultValue={params.barangay || ''} style={{ height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CED0D4', fontSize: 14, backgroundColor: '#FFFFFF' }}>
            <option value="">All barangays</option>
            {['Ugong', 'San Antonio', 'Kapitolyo', 'Oranbo', 'Boni', 'Shaw'].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <input name="minRent" type="number" placeholder="₱ Min" defaultValue={params.minRent || ''} style={{ height: 40, width: 100, padding: '0 12px', borderRadius: 8, border: '1px solid #CED0D4', fontSize: 14 }} />
          <input name="maxRent" type="number" placeholder="₱ Max" defaultValue={params.maxRent || ''} style={{ height: 40, width: 100, padding: '0 12px', borderRadius: 8, border: '1px solid #CED0D4', fontSize: 14 }} />
          <select name="type" defaultValue={params.type || ''} style={{ height: 40, padding: '0 12px', borderRadius: 8, border: '1px solid #CED0D4', fontSize: 14, backgroundColor: '#FFFFFF' }}>
            <option value="">All types</option>
            <option value="bedspace">Bedspace</option>
            <option value="room">Room</option>
            <option value="apartment">Apartment</option>
          </select>
          <button type="submit" style={{ height: 40, padding: '0 20px', borderRadius: 8, backgroundColor: '#2563EB', color: '#FFFFFF', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Search
          </button>
        </form>

        {/* Results */}
        {listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🏠</p>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#050505' }}>No listings found.</h2>
            <p style={{ fontSize: 16, color: '#65676B', marginTop: 8 }}>Try a different barangay or adjust your filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {listings.map((listing) => (
              <a
                key={listing.id}
                href={`/listings/${listing.id}`}
                style={{ textDecoration: 'none', color: 'inherit', backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', border: '1px solid #E4E6EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }}
              >
                {/* Photo */}
                {USE_MOCK_DATA && MOCK_PHOTOS[listing.id] ? (
                  <img src={MOCK_PHOTOS[listing.id][0]} alt="" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: 200, backgroundColor: '#CED0D4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 48, color: '#8A8D91' }}>🏠</span>
                  </div>
                )}
                <div style={{ padding: 16 }}>
                  <p style={{ fontSize: 20, fontWeight: 600, color: '#2563EB', margin: '0 0 4px', fontFamily: 'BerlinSansFB' }}>
                    ₱{listing.monthlyRent.toLocaleString()}/month
                  </p>
                  <p style={{ fontSize: 14, color: '#65676B', margin: '0 0 8px' }}>
                    {listing.unitType.charAt(0).toUpperCase() + listing.unitType.slice(1)} · {listing.barangay}, {listing.city}
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 9999, border: '1px solid #86EFAC' }}>
                    <span style={{ fontSize: 11, color: '#31A24C' }}>✓</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#31A24C' }}>Verified · {listing.landlordProfile.fullName}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#65676B', marginTop: 8, marginBottom: 0 }}>
                    {timeAgo(listing.lastActiveAt)}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
