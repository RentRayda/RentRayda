import type { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ListingDetail {
  id: string;
  monthlyRent: number;
  unitType: string;
  barangay: string;
  city: string;
  beds: number | null;
  rooms: number | null;
  inclusions: string[];
  description: string | null;
  advanceMonths: number | null;
  depositMonths: number | null;
  lastActiveAt: string;
  landlordProfile: { fullName: string; verificationStatus: string } | null;
  photos: { id: string; displayOrder: number }[];
}

async function getListing(id: string): Promise<ListingDetail | null> {
  try {
    const res = await fetch(`${API_URL}/api/listings/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()).data;
  } catch { return null; }
}

const INCLUSION_LABELS: Record<string, string> = {
  water: '💧 Water', electricity: '⚡ Electricity', wifi: '📶 WiFi',
  cr: '🚿 CR', aircon: '❄️ Aircon', parking: '🅿️ Parking',
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: 'Listing Not Found | RentRayda' };

  const type = listing.unitType.charAt(0).toUpperCase() + listing.unitType.slice(1);
  const title = `${type} in ${listing.barangay} - ₱${listing.monthlyRent.toLocaleString()}/month | RentRayda`;

  return {
    title,
    description: listing.description || `Verified ${listing.unitType} for rent in ${listing.barangay}, ${listing.city}. ₱${listing.monthlyRent.toLocaleString()}/month.`,
    openGraph: {
      title,
      description: `Verified rental in ${listing.barangay}. ₱${listing.monthlyRent.toLocaleString()}/month. Download RentRayda to connect.`,
      type: 'website',
    },
  };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Listing not found</h1>
        <p style={{ color: '#6B7280', marginTop: 8 }}>This listing may have been removed.</p>
        <a href="/listings" style={{ marginTop: 24, padding: '12px 24px', backgroundColor: '#2B51E3', color: '#FFFFFF', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          Browse Listings
        </a>
      </div>
    );
  }

  const type = listing.unitType.charAt(0).toUpperCase() + listing.unitType.slice(1);
  const inclusions = Array.isArray(listing.inclusions) ? listing.inclusions : [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '16px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontSize: 20, fontWeight: 700, color: '#2B51E3', textDecoration: 'none' }}>RentRayda</a>
          <a href="/listings" style={{ fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>← Back to listings</a>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '24px 20px' }}>
        {/* Photo */}
        <div style={{ width: '100%', height: 320, backgroundColor: '#E5E7EB', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 64, color: '#9CA3AF' }}>🏠</span>
        </div>

        {/* Price */}
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#2B51E3', margin: '0 0 4px' }}>
          ₱{listing.monthlyRent.toLocaleString()}/month
        </h1>
        <p style={{ fontSize: 18, color: '#6B7280', margin: '0 0 24px' }}>
          {type} · {listing.barangay}, {listing.city}
        </p>

        {/* Landlord Card */}
        {listing.landlordProfile && (
          <div style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 20, color: '#9CA3AF' }}>👤</span>
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500, margin: '0 0 4px' }}>{listing.landlordProfile.fullName}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 9999, border: '1px solid #86EFAC' }}>
                <span style={{ fontSize: 11, color: '#16A34A' }}>✓</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#16A34A' }}>Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* Details */}
        <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 24, marginBottom: 24 }}>
          {inclusions.length > 0 && (
            <>
              <h3 style={{ fontSize: 16, fontWeight: 500, margin: '0 0 12px' }}>Included in rent</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {inclusions.map((inc) => (
                  <span key={inc} style={{ backgroundColor: '#F3F4F6', borderRadius: 9999, padding: '4px 12px', fontSize: 13, color: '#374151' }}>
                    {INCLUSION_LABELS[inc] || inc}
                  </span>
                ))}
              </div>
            </>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 16, color: '#374151' }}>
            {listing.beds && <p style={{ margin: 0 }}>Beds: {listing.beds}</p>}
            {listing.rooms && <p style={{ margin: 0 }}>Rooms: {listing.rooms}</p>}
            <p style={{ margin: 0 }}>Advance: {listing.advanceMonths ?? 1} month(s)</p>
            <p style={{ margin: 0 }}>Deposit: {listing.depositMonths ?? 2} month(s)</p>
          </div>
        </div>

        {/* Description */}
        {listing.description && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, margin: '0 0 8px' }}>Description</h3>
            <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{listing.description}</p>
          </div>
        )}

        {/* Anti-scam card */}
        <div style={{ backgroundColor: '#EBF0FC', borderRadius: 8, padding: 16, marginBottom: 32 }}>
          <p style={{ fontSize: 14, color: '#2B51E3', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
            ✓ This landlord is verified — they have a confirmed ID and property proof. You will never be asked to pay anything on this app.
          </p>
        </div>

        {/* CTA: Download App */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24, textAlign: 'center', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px' }}>Want to connect with this landlord?</h3>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 20px' }}>
            Download the RentRayda app to send a connection request.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=ph.rentrayda.app"
            style={{ display: 'inline-block', padding: '14px 32px', fontSize: 16, fontWeight: 600, backgroundColor: '#2B51E3', color: '#FFFFFF', borderRadius: 8, textDecoration: 'none' }}
          >
            Download RentRayda App
          </a>
        </div>
      </main>
    </div>
  );
}
