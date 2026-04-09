import type { Metadata } from 'next';
import { USE_MOCK_DATA, MOCK_WEB_LISTING_DETAILS, MOCK_PHOTOS } from '../../../lib/mock-data';
import ListingDetail from '../../../components/ListingDetail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ListingData {
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

async function getListing(id: string): Promise<ListingData | null> {
  if (USE_MOCK_DATA) {
    return MOCK_WEB_LISTING_DETAILS[id] || null;
  }
  try {
    const res = await fetch(`${API_URL}/api/listings/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()).data;
  } catch { return null; }
}

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
      <div className="min-h-screen flex items-center justify-center flex-col bg-background">
        <h1 className="font-display font-bold text-2xl text-text-primary">Listing not found</h1>
        <p className="text-text-secondary mt-2">This listing may have been removed.</p>
        <a href="/listings" className="mt-6 px-6 py-3 bg-brand text-white rounded-xl no-underline font-semibold hover:bg-brand-dark transition-colors">
          Browse Listings
        </a>
      </div>
    );
  }

  const landlordName = listing.landlordProfile?.fullName || 'Landlord';
  const initials = landlordName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const inclusions = Array.isArray(listing.inclusions) ? listing.inclusions : [];

  // Build photo URLs — use mock photos keyed by listing ID, or fallback
  const mockPhotos = MOCK_PHOTOS[listing.id] || Object.values(MOCK_PHOTOS)[0] || [];
  const images = mockPhotos.length > 0 ? mockPhotos : ['/placeholder.svg?height=600&width=800'];

  return (
    <ListingDetail
      listing={{
        id: listing.id,
        monthlyRent: listing.monthlyRent,
        unitType: listing.unitType.charAt(0).toUpperCase() + listing.unitType.slice(1),
        barangay: listing.barangay,
        city: listing.city,
        beds: listing.beds ?? undefined,
        advanceDeposit: listing.depositMonths ?? listing.advanceMonths ?? undefined,
        description: listing.description,
        inclusions,
        images,
        landlordName,
        landlordInitials: initials,
        isVerified: listing.landlordProfile?.verificationStatus === 'verified',
        lastActiveAt: listing.lastActiveAt,
      }}
    />
  );
}
