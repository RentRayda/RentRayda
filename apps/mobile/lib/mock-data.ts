/**
 * MOCK DATA FOR UI PREVIEW
 * Delete this entire file before production launch.
 * Set USE_MOCK_DATA = false to switch back to real API.
 */

export const USE_MOCK_DATA = true;

// ── Mock Listings ──────────────────────────────────────────────────
export const MOCK_LISTINGS = [
  {
    id: 'mock-1',
    monthlyRent: 3500,
    unitType: 'bedspace' as const,
    barangay: 'Ugong',
    city: 'Pasig',
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2hrs ago
    landlordProfile: { fullName: 'Maria Santos', profilePhotoUrl: null, verificationStatus: 'verified' },
    firstPhoto: null,
  },
  {
    id: 'mock-2',
    monthlyRent: 5500,
    unitType: 'room' as const,
    barangay: 'Kapitolyo',
    city: 'Pasig',
    lastActiveAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18hrs ago
    landlordProfile: { fullName: 'Jun Reyes', profilePhotoUrl: null, verificationStatus: 'verified' },
    firstPhoto: null,
  },
  {
    id: 'mock-3',
    monthlyRent: 12000,
    unitType: 'apartment' as const,
    barangay: 'San Antonio',
    city: 'Pasig',
    lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    landlordProfile: { fullName: 'Ate Bing', profilePhotoUrl: null, verificationStatus: 'verified' },
    firstPhoto: null,
  },
  {
    id: 'mock-4',
    monthlyRent: 4200,
    unitType: 'room' as const,
    barangay: 'Oranbo',
    city: 'Pasig',
    lastActiveAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1hr ago
    landlordProfile: { fullName: 'Kuya Dong', profilePhotoUrl: null, verificationStatus: 'verified' },
    firstPhoto: null,
  },
  {
    id: 'mock-5',
    monthlyRent: 3000,
    unitType: 'bedspace' as const,
    barangay: 'Shaw',
    city: 'Mandaluyong',
    lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    landlordProfile: { fullName: 'Tita Rose', profilePhotoUrl: null, verificationStatus: 'verified' },
    firstPhoto: null,
  },
  {
    id: 'mock-6',
    monthlyRent: 8500,
    unitType: 'apartment' as const,
    barangay: 'Boni',
    city: 'Mandaluyong',
    lastActiveAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12hrs ago
    landlordProfile: { fullName: 'Mark Villanueva', profilePhotoUrl: null, verificationStatus: 'verified' },
    firstPhoto: null,
  },
  {
    id: 'mock-7',
    monthlyRent: 6000,
    unitType: 'room' as const,
    barangay: 'Ugong',
    city: 'Pasig',
    lastActiveAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36hrs ago
    landlordProfile: { fullName: 'Joy Dela Cruz', profilePhotoUrl: null, verificationStatus: 'verified' },
    firstPhoto: null,
  },
  {
    id: 'mock-8',
    monthlyRent: 4800,
    unitType: 'room' as const,
    barangay: 'Kapitolyo',
    city: 'Pasig',
    lastActiveAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6hrs ago
    landlordProfile: { fullName: 'Lito Mendoza', profilePhotoUrl: null, verificationStatus: 'verified' },
    firstPhoto: null,
  },
  {
    id: 'mock-9',
    monthlyRent: 15000,
    unitType: 'apartment' as const,
    barangay: 'San Antonio',
    city: 'Pasig',
    lastActiveAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Carlo Tan', profilePhotoUrl: null, verificationStatus: 'verified' },
    firstPhoto: null,
  },
  {
    id: 'mock-10',
    monthlyRent: 2800,
    unitType: 'bedspace' as const,
    barangay: 'Oranbo',
    city: 'Pasig',
    lastActiveAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30min ago
    landlordProfile: { fullName: 'Nanay Linda', profilePhotoUrl: null, verificationStatus: 'verified' },
    firstPhoto: null,
  },
];

// ── Mock Listing Details ───────────────────────────────────────────
export const MOCK_LISTING_DETAILS: Record<string, {
  id: string;
  monthlyRent: number;
  unitType: string;
  barangay: string;
  city: string;
  beds: number | null;
  rooms: number | null;
  inclusions: string[];
  description: string | null;
  availableDate: string | null;
  advanceMonths: number | null;
  depositMonths: number | null;
  lastActiveAt: string;
  photos: { id: string; displayOrder: number }[];
  landlordProfile: { fullName: string; profilePhotoUrl: string | null; verificationStatus: string } | null;
}> = {
  'mock-1': {
    id: 'mock-1',
    monthlyRent: 3500,
    unitType: 'bedspace',
    barangay: 'Ugong',
    city: 'Pasig',
    beds: 1,
    rooms: null,
    inclusions: ['water', 'electricity', 'wifi', 'cr'],
    description: 'Bedspace sa Ugong malapit sa Ortigas. Tahimik na compound, may sariling CR. WiFi kasama. Bawal maingay after 10PM.',
    availableDate: '2026-04-15',
    advanceMonths: 1,
    depositMonths: 1,
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }, { id: 'p3', displayOrder: 2 }],
    landlordProfile: { fullName: 'Maria Santos', profilePhotoUrl: null, verificationStatus: 'verified' },
  },
  'mock-2': {
    id: 'mock-2',
    monthlyRent: 5500,
    unitType: 'room',
    barangay: 'Kapitolyo',
    city: 'Pasig',
    beds: 1,
    rooms: 1,
    inclusions: ['water', 'electricity', 'wifi', 'cr', 'aircon'],
    description: 'Solo room with aircon near Kapitolyo Merkato. Walking distance to restaurants and cafes. Good for professionals.',
    availableDate: '2026-04-10',
    advanceMonths: 1,
    depositMonths: 2,
    lastActiveAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }],
    landlordProfile: { fullName: 'Jun Reyes', profilePhotoUrl: null, verificationStatus: 'verified' },
  },
  'mock-3': {
    id: 'mock-3',
    monthlyRent: 12000,
    unitType: 'apartment',
    barangay: 'San Antonio',
    city: 'Pasig',
    beds: 2,
    rooms: 1,
    inclusions: ['water', 'wifi', 'parking', 'aircon'],
    description: 'Studio type apartment sa San Antonio Village. May parking. Malapit sa Megamall at Shaw MRT. Pets allowed.',
    availableDate: '2026-05-01',
    advanceMonths: 2,
    depositMonths: 2,
    lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }, { id: 'p3', displayOrder: 2 }, { id: 'p4', displayOrder: 3 }],
    landlordProfile: { fullName: 'Ate Bing', profilePhotoUrl: null, verificationStatus: 'verified' },
  },
  'mock-4': {
    id: 'mock-4',
    monthlyRent: 4200,
    unitType: 'room',
    barangay: 'Oranbo',
    city: 'Pasig',
    beds: 1,
    rooms: 1,
    inclusions: ['water', 'electricity', 'cr'],
    description: 'Room for rent in Oranbo. Quiet neighborhood near Pasig City Hall. Ideal for single working professional.',
    availableDate: null,
    advanceMonths: 1,
    depositMonths: 1,
    lastActiveAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    photos: [{ id: 'p1', displayOrder: 0 }],
    landlordProfile: { fullName: 'Kuya Dong', profilePhotoUrl: null, verificationStatus: 'verified' },
  },
  'mock-5': {
    id: 'mock-5',
    monthlyRent: 3000,
    unitType: 'bedspace',
    barangay: 'Shaw',
    city: 'Mandaluyong',
    beds: 1,
    rooms: null,
    inclusions: ['water', 'electricity', 'wifi'],
    description: 'Bedspace near Shaw MRT. Walking distance lang. Good for BPO workers na may shifting schedule.',
    availableDate: '2026-04-20',
    advanceMonths: 1,
    depositMonths: 1,
    lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }],
    landlordProfile: { fullName: 'Tita Rose', profilePhotoUrl: null, verificationStatus: 'verified' },
  },
  'mock-6': {
    id: 'mock-6',
    monthlyRent: 8500,
    unitType: 'apartment',
    barangay: 'Boni',
    city: 'Mandaluyong',
    beds: 1,
    rooms: 1,
    inclusions: ['water', 'electricity', 'wifi', 'aircon', 'parking'],
    description: '1BR apartment near Boni MRT. Fully furnished. Building has guard and CCTV. Good for couples.',
    availableDate: '2026-04-12',
    advanceMonths: 2,
    depositMonths: 2,
    lastActiveAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }, { id: 'p3', displayOrder: 2 }],
    landlordProfile: { fullName: 'Mark Villanueva', profilePhotoUrl: null, verificationStatus: 'verified' },
  },
};

// Fill in remaining mock details for any listing not explicitly detailed
MOCK_LISTINGS.forEach((l) => {
  if (!MOCK_LISTING_DETAILS[l.id]) {
    MOCK_LISTING_DETAILS[l.id] = {
      ...l,
      beds: l.unitType === 'bedspace' ? 1 : l.unitType === 'room' ? 1 : 2,
      rooms: l.unitType === 'apartment' ? 1 : null,
      inclusions: ['water', 'electricity', 'wifi'],
      description: `${l.unitType.charAt(0).toUpperCase() + l.unitType.slice(1)} for rent in ${l.barangay}, ${l.city}. Message for more details.`,
      availableDate: null,
      advanceMonths: 1,
      depositMonths: 1,
      photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }],
    };
  }
});

// ── Mock Connection Requests (Inbox) ───────────────────────────────
export const MOCK_CONNECTION_REQUESTS = [
  {
    id: 'conn-1',
    message: 'Hi po! BPO worker ako sa Concentrix Ortigas. Looking for a room near the office. Verified na po ako.',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tenant: { fullName: 'Anna Garcia', verificationStatus: 'verified' },
    landlord: null,
    listing: { unitType: 'room', barangay: 'Kapitolyo', monthlyRent: 5500 },
  },
  {
    id: 'conn-2',
    message: 'Good day! Interested po sa bedspace. Student po ako sa PUP. May part time job din po.',
    status: 'pending',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    tenant: { fullName: 'Miguel Torres', verificationStatus: 'verified' },
    landlord: null,
    listing: { unitType: 'bedspace', barangay: 'Ugong', monthlyRent: 3500 },
  },
  {
    id: 'conn-3',
    message: null,
    status: 'accepted',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tenant: { fullName: 'Kris Manalo', verificationStatus: 'verified' },
    landlord: null,
    listing: { unitType: 'apartment', barangay: 'San Antonio', monthlyRent: 12000 },
  },
  {
    id: 'conn-4',
    message: 'Hello po, me and my partner are looking for a room. Both working sa Ortigas area.',
    status: 'declined',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tenant: { fullName: 'Rico and Jen', verificationStatus: 'verified' },
    landlord: null,
    listing: { unitType: 'room', barangay: 'Oranbo', monthlyRent: 4200 },
  },
];

// ── Mock Profile Data ──────────────────────────────────────────────
export const MOCK_PROFILE = {
  name: 'Jeff Ong',
  city: 'Pasig',
  role: 'tenant' as const,
  verificationStatus: 'verified' as const,
  govIdStatus: 'approved' as const,
  secondDocStatus: 'approved' as const,
  connectionCount: 3,
};

// ── Mock Connection Reveal ─────────────────────────────────────────
export const MOCK_CONNECTION_REVEAL = {
  id: 'conn-3',
  otherPartyPhone: '09171234567',
  otherPartyName: 'Ate Bing',
  otherPartyPhotoUrl: null,
  connectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
};

// ── Mock Landlord Listings (for landlord role) ─────────────────────
export const MOCK_MY_LISTINGS = [
  {
    id: 'mock-1',
    unitType: 'bedspace',
    monthlyRent: 3500,
    barangay: 'Ugong',
    status: 'active',
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-2',
    unitType: 'room',
    monthlyRent: 5500,
    barangay: 'Kapitolyo',
    status: 'active',
    lastActiveAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-3',
    unitType: 'apartment',
    monthlyRent: 12000,
    barangay: 'San Antonio',
    status: 'rented',
    lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
