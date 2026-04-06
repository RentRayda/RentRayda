/**
 * MOCK DATA FOR WEB UI PREVIEW
 * Delete this file before production launch.
 */

// Placeholder photos — random room/interior images from picsum
export const MOCK_PHOTOS: Record<string, string[]> = {
  'mock-1': [
    'https://picsum.photos/seed/room1/600/400',
    'https://picsum.photos/seed/room1b/600/400',
    'https://picsum.photos/seed/room1c/600/400',
  ],
  'mock-2': [
    'https://picsum.photos/seed/room2/600/400',
    'https://picsum.photos/seed/room2b/600/400',
  ],
  'mock-3': [
    'https://picsum.photos/seed/apt3/600/400',
    'https://picsum.photos/seed/apt3b/600/400',
    'https://picsum.photos/seed/apt3c/600/400',
    'https://picsum.photos/seed/apt3d/600/400',
  ],
  'mock-4': [
    'https://picsum.photos/seed/room4/600/400',
  ],
  'mock-5': [
    'https://picsum.photos/seed/bed5/600/400',
    'https://picsum.photos/seed/bed5b/600/400',
  ],
  'mock-6': [
    'https://picsum.photos/seed/apt6/600/400',
    'https://picsum.photos/seed/apt6b/600/400',
    'https://picsum.photos/seed/apt6c/600/400',
  ],
  'mock-7': [
    'https://picsum.photos/seed/room7/600/400',
  ],
  'mock-8': [
    'https://picsum.photos/seed/room8/600/400',
    'https://picsum.photos/seed/room8b/600/400',
  ],
};

export const USE_MOCK_DATA = true;

export const MOCK_WEB_LISTINGS = [
  {
    id: 'mock-1',
    monthlyRent: 3500,
    unitType: 'bedspace',
    barangay: 'Ugong',
    city: 'Pasig',
    description: 'Bedspace sa Ugong malapit sa Ortigas. Tahimik na compound, may sariling CR.',
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Maria Santos', verificationStatus: 'verified' },
  },
  {
    id: 'mock-2',
    monthlyRent: 5500,
    unitType: 'room',
    barangay: 'Kapitolyo',
    city: 'Pasig',
    description: 'Solo room with aircon near Kapitolyo Merkato. Walking distance to restaurants.',
    lastActiveAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Jun Reyes', verificationStatus: 'verified' },
  },
  {
    id: 'mock-3',
    monthlyRent: 12000,
    unitType: 'apartment',
    barangay: 'San Antonio',
    city: 'Pasig',
    description: 'Studio type apartment sa San Antonio Village. May parking. Malapit sa Megamall.',
    lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Ate Bing', verificationStatus: 'verified' },
  },
  {
    id: 'mock-4',
    monthlyRent: 4200,
    unitType: 'room',
    barangay: 'Oranbo',
    city: 'Pasig',
    description: 'Room for rent in Oranbo. Quiet neighborhood near Pasig City Hall.',
    lastActiveAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Kuya Dong', verificationStatus: 'verified' },
  },
  {
    id: 'mock-5',
    monthlyRent: 3000,
    unitType: 'bedspace',
    barangay: 'Shaw',
    city: 'Mandaluyong',
    description: 'Bedspace near Shaw MRT. Walking distance lang. Good for BPO workers.',
    lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Tita Rose', verificationStatus: 'verified' },
  },
  {
    id: 'mock-6',
    monthlyRent: 8500,
    unitType: 'apartment',
    barangay: 'Boni',
    city: 'Mandaluyong',
    description: '1BR apartment near Boni MRT. Fully furnished. Building has guard and CCTV.',
    lastActiveAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Mark Villanueva', verificationStatus: 'verified' },
  },
  {
    id: 'mock-7',
    monthlyRent: 6000,
    unitType: 'room',
    barangay: 'Ugong',
    city: 'Pasig',
    description: 'Spacious room in Ugong with own bathroom. Near Ortigas CBD.',
    lastActiveAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Joy Dela Cruz', verificationStatus: 'verified' },
  },
  {
    id: 'mock-8',
    monthlyRent: 4800,
    unitType: 'room',
    barangay: 'Kapitolyo',
    city: 'Pasig',
    description: 'Cozy room in Kapitolyo. Shared kitchen. Near cafes and restaurants.',
    lastActiveAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Lito Mendoza', verificationStatus: 'verified' },
  },
];

export const MOCK_WEB_LISTING_DETAILS: Record<string, {
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
}> = {
  'mock-1': {
    id: 'mock-1', monthlyRent: 3500, unitType: 'bedspace', barangay: 'Ugong', city: 'Pasig',
    beds: 1, rooms: null, inclusions: ['water', 'electricity', 'wifi', 'cr'],
    description: 'Bedspace sa Ugong malapit sa Ortigas. Tahimik na compound, may sariling CR. WiFi kasama. Bawal maingay after 10PM.',
    advanceMonths: 1, depositMonths: 1,
    lastActiveAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Maria Santos', verificationStatus: 'verified' },
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }],
  },
  'mock-2': {
    id: 'mock-2', monthlyRent: 5500, unitType: 'room', barangay: 'Kapitolyo', city: 'Pasig',
    beds: 1, rooms: 1, inclusions: ['water', 'electricity', 'wifi', 'cr', 'aircon'],
    description: 'Solo room with aircon near Kapitolyo Merkato. Walking distance to restaurants and cafes. Good for professionals.',
    advanceMonths: 1, depositMonths: 2,
    lastActiveAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Jun Reyes', verificationStatus: 'verified' },
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }],
  },
  'mock-3': {
    id: 'mock-3', monthlyRent: 12000, unitType: 'apartment', barangay: 'San Antonio', city: 'Pasig',
    beds: 2, rooms: 1, inclusions: ['water', 'wifi', 'parking', 'aircon'],
    description: 'Studio type apartment sa San Antonio Village. May parking. Malapit sa Megamall at Shaw MRT. Pets allowed.',
    advanceMonths: 2, depositMonths: 2,
    lastActiveAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Ate Bing', verificationStatus: 'verified' },
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }, { id: 'p3', displayOrder: 2 }],
  },
  'mock-4': {
    id: 'mock-4', monthlyRent: 4200, unitType: 'room', barangay: 'Oranbo', city: 'Pasig',
    beds: 1, rooms: 1, inclusions: ['water', 'electricity', 'cr'],
    description: 'Room for rent in Oranbo. Quiet neighborhood near Pasig City Hall. Ideal for single working professional.',
    advanceMonths: 1, depositMonths: 1,
    lastActiveAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Kuya Dong', verificationStatus: 'verified' },
    photos: [{ id: 'p1', displayOrder: 0 }],
  },
  'mock-5': {
    id: 'mock-5', monthlyRent: 3000, unitType: 'bedspace', barangay: 'Shaw', city: 'Mandaluyong',
    beds: 1, rooms: null, inclusions: ['water', 'electricity', 'wifi'],
    description: 'Bedspace near Shaw MRT. Walking distance lang. Good for BPO workers na may shifting schedule.',
    advanceMonths: 1, depositMonths: 1,
    lastActiveAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Tita Rose', verificationStatus: 'verified' },
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }],
  },
  'mock-6': {
    id: 'mock-6', monthlyRent: 8500, unitType: 'apartment', barangay: 'Boni', city: 'Mandaluyong',
    beds: 1, rooms: 1, inclusions: ['water', 'electricity', 'wifi', 'aircon', 'parking'],
    description: '1BR apartment near Boni MRT. Fully furnished. Building has guard and CCTV. Good for couples.',
    advanceMonths: 2, depositMonths: 2,
    lastActiveAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Mark Villanueva', verificationStatus: 'verified' },
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }, { id: 'p3', displayOrder: 2 }],
  },
  'mock-7': {
    id: 'mock-7', monthlyRent: 6000, unitType: 'room', barangay: 'Ugong', city: 'Pasig',
    beds: 1, rooms: 1, inclusions: ['water', 'electricity', 'wifi', 'cr'],
    description: 'Spacious room in Ugong with own bathroom. Near Ortigas CBD. Quiet compound.',
    advanceMonths: 1, depositMonths: 2,
    lastActiveAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Joy Dela Cruz', verificationStatus: 'verified' },
    photos: [{ id: 'p1', displayOrder: 0 }],
  },
  'mock-8': {
    id: 'mock-8', monthlyRent: 4800, unitType: 'room', barangay: 'Kapitolyo', city: 'Pasig',
    beds: 1, rooms: 1, inclusions: ['water', 'wifi'],
    description: 'Cozy room in Kapitolyo. Shared kitchen. Near cafes and restaurants along Aguirre Ave.',
    advanceMonths: 1, depositMonths: 1,
    lastActiveAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    landlordProfile: { fullName: 'Lito Mendoza', verificationStatus: 'verified' },
    photos: [{ id: 'p1', displayOrder: 0 }, { id: 'p2', displayOrder: 1 }],
  },
};

// Fill any missing details
MOCK_WEB_LISTINGS.forEach((l) => {
  if (!MOCK_WEB_LISTING_DETAILS[l.id]) {
    MOCK_WEB_LISTING_DETAILS[l.id] = {
      ...l,
      beds: l.unitType === 'apartment' ? 2 : 1,
      rooms: l.unitType === 'bedspace' ? null : 1,
      inclusions: ['water', 'electricity', 'wifi'],
      advanceMonths: 1, depositMonths: 1,
      photos: [{ id: 'p1', displayOrder: 0 }],
      landlordProfile: l.landlordProfile,
    };
  }
});
