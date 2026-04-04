import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FreshnessIndicator } from '../../../components/FreshnessIndicator';
import { VerifiedBadge } from '../../../components/VerifiedBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

const INCLUSION_LABELS: Record<string, string> = {
  water: '💧 Tubig',
  electricity: '⚡ Kuryente',
  wifi: '📶 WiFi',
  cr: '🚿 CR',
  aircon: '❄️ Aircon',
  parking: '🅿️ Parking',
};

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
  availableDate: string | null;
  advanceMonths: number | null;
  depositMonths: number | null;
  lastActiveAt: string;
  photos: { id: string; displayOrder: number }[];
  landlordProfile: {
    fullName: string;
    profilePhotoUrl: string | null;
    verificationStatus: string;
  } | null;
}

type CTAState =
  | { type: 'connect'; landlordName: string }
  | { type: 'verify_first' }
  | { type: 'already_sent' }
  | { type: 'loading' };

export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [ctaState, setCtaState] = useState<CTAState>({ type: 'loading' });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`${API_URL}/api/listings/${id}`);
        if (res.status === 404) {
          setError('This listing is no longer available.');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch');
        const { data } = await res.json();
        setListing(data);

        // Determine CTA state — for now default to verify_first
        // In real app, check tenant profile verification status
        setCtaState({
          type: 'connect',
          landlordName: data.landlordProfile?.fullName || 'Landlord',
        });
      } catch {
        setError('Could not load listing. Try again?');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setPhotoIndex(index);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2B51E3" />
      </SafeAreaView>
    );
  }

  if (error || !listing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 16 }}>
            {error || 'Listing not found.'}
          </Text>
          <Pressable onPress={() => router.back()} style={{ height: 48, paddingHorizontal: 24, backgroundColor: '#2B51E3', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const typeLabel = listing.unitType.charAt(0).toUpperCase() + listing.unitType.slice(1);
  const inclusions = Array.isArray(listing.inclusions) ? listing.inclusions : [];
  const photoCount = listing.photos.length || 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 8 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 24, color: '#1A1A2E' }}>←</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/report' as never)}>
          <Text style={{ fontSize: 16, color: '#6B7280' }}>🚩</Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} bounces showsVerticalScrollIndicator={false}>
        {/* Photo Gallery */}
        {photoCount > 0 ? (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {listing.photos.map((photo, i) => (
                <View key={photo.id} style={{ width: SCREEN_WIDTH, height: 256, backgroundColor: '#E5E7EB' }}>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 32, color: '#9CA3AF' }}>🏠</Text>
                    <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Photo {i + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            {/* Dot indicators */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: 8 }}>
              {listing.photos.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 6, height: 6, borderRadius: 3,
                    backgroundColor: i === photoIndex ? '#2B51E3' : '#D1D5DB',
                  }}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={{ width: '100%', height: 256, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 48, color: '#9CA3AF' }}>🏠</Text>
            <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 8 }}>No photos yet</Text>
          </View>
        )}

        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}>
          {/* Price */}
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#2B51E3' }}>
            ₱{listing.monthlyRent.toLocaleString()}/month
          </Text>

          {/* Meta */}
          <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 4 }}>
            {typeLabel} · {listing.barangay}, {listing.city}
          </Text>

          {/* Landlord Card */}
          {listing.landlordProfile && (
            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {listing.landlordProfile.profilePhotoUrl ? (
                  <Image source={{ uri: listing.landlordProfile.profilePhotoUrl }} style={{ width: 48, height: 48 }} />
                ) : (
                  <Text style={{ fontSize: 20, color: '#9CA3AF' }}>👤</Text>
                )}
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#1A1A2E' }}>
                  {listing.landlordProfile.fullName || 'Landlord'}
                </Text>
                <VerifiedBadge status="verified" size="sm" />
              </View>
            </View>
          )}

          {/* Freshness */}
          <FreshnessIndicator lastActiveAt={listing.lastActiveAt} />

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 }} />

          {/* Inclusions */}
          {inclusions.length > 0 && (
            <>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#1A1A2E', marginBottom: 8 }}>
                Included in rent:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {inclusions.map((inc) => (
                  <View key={inc} style={{ backgroundColor: '#F3F4F6', borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 12, color: '#374151' }}>
                      {INCLUSION_LABELS[inc] || inc}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Details */}
          <View style={{ gap: 4, marginBottom: 16 }}>
            {listing.beds && (
              <Text style={{ fontSize: 16, color: '#1A1A2E' }}>
                {listing.beds} bed{listing.beds > 1 ? 's' : ''}
                {listing.availableDate ? ` · Available ${listing.availableDate}` : ''}
              </Text>
            )}
            <Text style={{ fontSize: 16, color: '#6B7280' }}>
              Advance: {listing.advanceMonths ?? 1} month{(listing.advanceMonths ?? 1) !== 1 ? 's' : ''}
            </Text>
            <Text style={{ fontSize: 16, color: '#6B7280' }}>
              Deposit: {listing.depositMonths ?? 2} month{(listing.depositMonths ?? 2) !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Description */}
          {listing.description && (
            <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16, lineHeight: 24 }}>
              {listing.description}
            </Text>
          )}

          {/* Anti-scam card */}
          <View style={{ backgroundColor: '#EBF0FC', borderRadius: 8, padding: 12 }}>
            <Text style={{ fontSize: 12, color: '#2B51E3', fontStyle: 'italic', lineHeight: 18 }}>
              ✓ This landlord is verified — they have a confirmed ID and property proof. You will never be asked to pay anything on this app.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={{ height: 80, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingHorizontal: 20, justifyContent: 'center' }}>
        {ctaState.type === 'connect' && (
          <Pressable
            onPress={() => {/* TODO: open connection request modal */}}
            style={{ height: 48, backgroundColor: '#2B51E3', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
              CONNECT WITH {ctaState.landlordName.toUpperCase()}
            </Text>
          </Pressable>
        )}
        {ctaState.type === 'verify_first' && (
          <Pressable
            onPress={() => router.push('/(onboarding)/verify-id' as never)}
            style={{ height: 48, backgroundColor: '#D97706', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
              PLEASE VERIFY YOUR PROFILE
            </Text>
          </Pressable>
        )}
        {ctaState.type === 'already_sent' && (
          <Pressable
            disabled
            style={{ height: 48, backgroundColor: '#D1D5DB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
              REQUEST ALREADY SENT
            </Text>
          </Pressable>
        )}
        {ctaState.type === 'loading' && (
          <ActivityIndicator size="small" color="#2B51E3" />
        )}
        <Pressable onPress={() => router.push('/report' as never)} style={{ marginTop: 4, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>⚠ Report this listing</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
