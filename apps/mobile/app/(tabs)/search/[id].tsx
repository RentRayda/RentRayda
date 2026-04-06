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
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FreshnessIndicator } from '../../../components/FreshnessIndicator';
import { VerifiedBadge } from '../../../components/VerifiedBadge';
import { USE_MOCK_DATA, MOCK_LISTING_DETAILS } from '../../../lib/mock-data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_HEIGHT = 400;
const THUMBNAIL_SIZE = 64;
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

const INCLUSION_LABELS: Record<string, string> = {
  water: 'Tubig',
  electricity: 'Kuryente',
  wifi: 'WiFi',
  cr: 'CR',
  aircon: 'Aircon',
  parking: 'Parking',
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

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [ctaState, setCtaState] = useState<CTAState>({ type: 'loading' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (USE_MOCK_DATA) {
        const mockDetail = MOCK_LISTING_DETAILS[id!];
        if (!mockDetail) {
          setError('This listing is no longer available.');
          setLoading(false);
          return;
        }
        setListing(mockDetail);
        setCtaState({ type: 'connect', landlordName: mockDetail.landlordProfile?.fullName || 'Landlord' });
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/listings/${id}`);
        if (res.status === 404) {
          setError('This listing is no longer available.');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch');
        const { data } = await res.json();
        setListing(data);

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

  const handleShare = async () => {
    if (!listing) return;
    try {
      await Share.share({
        message: `Check out this ${listing.unitType} in ${listing.barangay}, ${listing.city} for P${listing.monthlyRent.toLocaleString()}/mo on RentRayda`,
      });
    } catch {}
  };

  const scrollToPhoto = (index: number) => {
    // This scrolls the horizontal photo carousel — we need a ref to it
    setPhotoIndex(index);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2B51E3" />
      </SafeAreaView>
    );
  }

  if (error || !listing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGrotesk', color: '#65676B', textAlign: 'center', marginBottom: 16 }}>
            {error || 'Listing not found.'}
          </Text>
          <Pressable onPress={() => router.back()} style={{ height: 48, paddingHorizontal: 24, backgroundColor: '#2B51E3', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold' }}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const typeLabel = listing.unitType.charAt(0).toUpperCase() + listing.unitType.slice(1);
  const inclusions = Array.isArray(listing.inclusions) ? listing.inclusions : [];
  const photoCount = listing.photos.length || 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['bottom']}>
      {/* Header bar — overlaid on photos */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'ios' ? 54 : 12,
          paddingBottom: 8,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 20, color: '#FFFFFF' }}>←</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/report' as never)}
          style={{
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16, color: '#FFFFFF' }}>⋯</Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} bounces showsVerticalScrollIndicator={false}>
        {/* Photo Carousel */}
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
                <View key={photo.id} style={{ width: SCREEN_WIDTH, height: PHOTO_HEIGHT, backgroundColor: '#E4E6EB' }}>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 40, color: '#8A8D91' }}>🏠</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'AlteHaasGrotesk', color: '#8A8D91', marginTop: 4 }}>Photo {i + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Photo counter */}
            <View
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 12, fontFamily: 'AlteHaasGrotesk', color: '#FFFFFF' }}>
                {photoIndex + 1}/{photoCount}
              </Text>
            </View>

            {/* Thumbnail strip */}
            {photoCount > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 8 }}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 6 }}
              >
                {listing.photos.map((photo, i) => (
                  <Pressable
                    key={photo.id}
                    onPress={() => scrollToPhoto(i)}
                    style={{
                      width: THUMBNAIL_SIZE,
                      height: THUMBNAIL_SIZE,
                      borderRadius: 6,
                      backgroundColor: '#E4E6EB',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: i === photoIndex ? 2 : 0,
                      borderColor: '#2B51E3',
                      opacity: i === photoIndex ? 1 : 0.6,
                      marginRight: 2,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#8A8D91' }}>🏠</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        ) : (
          <View style={{ width: '100%', height: PHOTO_HEIGHT, backgroundColor: '#E4E6EB', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 48, color: '#8A8D91' }}>🏠</Text>
            <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#8A8D91', marginTop: 8 }}>No photos yet</Text>
          </View>
        )}

        {/* Content */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}>
          {/* Title + Price */}
          <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B' }}>
            {typeLabel}
          </Text>
          <Text style={{ fontSize: 24, fontFamily: 'BerlinSansFB', color: '#050505', marginTop: 2 }}>
            P{listing.monthlyRent.toLocaleString()}/month
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B', marginTop: 4 }}>
            Listed {timeAgo(listing.lastActiveAt)} in {listing.barangay}, {listing.city}
          </Text>

          {/* CTA Button */}
          <View style={{ marginTop: 16 }}>
            {ctaState.type === 'connect' && (
              <Pressable
                onPress={() => {/* TODO: open connection request modal */}}
                style={{
                  height: 48, backgroundColor: '#2B51E3', borderRadius: 8,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold', fontSize: 16 }}>
                  CONNECT WITH {ctaState.landlordName.toUpperCase()}
                </Text>
              </Pressable>
            )}
            {ctaState.type === 'verify_first' && (
              <Pressable
                onPress={() => router.push('/(onboarding)/verify-id' as never)}
                style={{
                  height: 48, backgroundColor: '#F7B928', borderRadius: 8,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold', fontSize: 16 }}>
                  VERIFY YOUR PROFILE FIRST
                </Text>
              </Pressable>
            )}
            {ctaState.type === 'already_sent' && (
              <Pressable
                disabled
                style={{
                  height: 48, backgroundColor: '#E4E6EB', borderRadius: 8,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#65676B', fontFamily: 'AlteHaasGroteskBold', fontSize: 16 }}>
                  REQUEST ALREADY SENT
                </Text>
              </Pressable>
            )}
            {ctaState.type === 'loading' && (
              <View style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="small" color="#2B51E3" />
              </View>
            )}
          </View>

          {/* Save + Share row */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            <Pressable
              onPress={() => setSaved(!saved)}
              style={{
                flex: 1, height: 40, borderRadius: 8,
                backgroundColor: '#F0F2F5',
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Text style={{ fontSize: 18 }}>{saved ? '♥' : '♡'}</Text>
              <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGroteskBold', color: '#050505' }}>
                {saved ? 'Saved' : 'Save'}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={{
                flex: 1, height: 40, borderRadius: 8,
                backgroundColor: '#F0F2F5',
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Text style={{ fontSize: 16 }}>↗</Text>
              <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGroteskBold', color: '#050505' }}>Share</Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={{ height: 8, backgroundColor: '#F0F2F5', marginHorizontal: -16, marginTop: 20, marginBottom: 20 }} />

          {/* Details section */}
          <Text style={{ fontSize: 18, fontFamily: 'BerlinSansFB', color: '#050505', marginBottom: 12 }}>
            Details
          </Text>

          <View style={{ gap: 12 }}>
            {listing.beds && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, fontFamily: 'AlteHaasGrotesk', color: '#65676B' }}>Beds</Text>
                <Text style={{ fontSize: 15, fontFamily: 'AlteHaasGroteskBold', color: '#050505' }}>
                  {listing.beds}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 15, fontFamily: 'AlteHaasGrotesk', color: '#65676B' }}>Advance</Text>
              <Text style={{ fontSize: 15, fontFamily: 'AlteHaasGroteskBold', color: '#050505' }}>
                {listing.advanceMonths ?? 1} month{(listing.advanceMonths ?? 1) !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 15, fontFamily: 'AlteHaasGrotesk', color: '#65676B' }}>Deposit</Text>
              <Text style={{ fontSize: 15, fontFamily: 'AlteHaasGroteskBold', color: '#050505' }}>
                {listing.depositMonths ?? 2} month{(listing.depositMonths ?? 2) !== 1 ? 's' : ''}
              </Text>
            </View>
            {listing.availableDate && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 15, fontFamily: 'AlteHaasGrotesk', color: '#65676B' }}>Available</Text>
                <Text style={{ fontSize: 15, fontFamily: 'AlteHaasGroteskBold', color: '#050505' }}>
                  {listing.availableDate}
                </Text>
              </View>
            )}
          </View>

          {/* Inclusions */}
          {inclusions.length > 0 && (
            <>
              <View style={{ height: 1, backgroundColor: '#E4E6EB', marginVertical: 16 }} />
              <Text style={{ fontSize: 18, fontFamily: 'BerlinSansFB', color: '#050505', marginBottom: 12 }}>
                Included in rent
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {inclusions.map((inc) => (
                  <View key={inc} style={{ backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#050505' }}>
                      {INCLUSION_LABELS[inc] || inc}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Description */}
          {listing.description && (
            <>
              <View style={{ height: 1, backgroundColor: '#E4E6EB', marginVertical: 16 }} />
              <Text style={{ fontSize: 18, fontFamily: 'BerlinSansFB', color: '#050505', marginBottom: 8 }}>
                Description
              </Text>
              <Text style={{ fontSize: 15, fontFamily: 'AlteHaasGrotesk', color: '#050505', lineHeight: 22 }}>
                {listing.description}
              </Text>
            </>
          )}

          {/* Divider */}
          <View style={{ height: 8, backgroundColor: '#F0F2F5', marginHorizontal: -16, marginTop: 20, marginBottom: 20 }} />

          {/* Landlord Card */}
          {listing.landlordProfile && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#E4E6EB', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {listing.landlordProfile.profilePhotoUrl ? (
                  <Image source={{ uri: listing.landlordProfile.profilePhotoUrl }} style={{ width: 52, height: 52 }} />
                ) : (
                  <Text style={{ fontSize: 22, color: '#8A8D91' }}>👤</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGroteskBold', color: '#050505' }}>
                    {listing.landlordProfile.fullName || 'Landlord'}
                  </Text>
                  <VerifiedBadge status="verified" size="sm" />
                </View>
                <FreshnessIndicator lastActiveAt={listing.lastActiveAt} />
              </View>
            </View>
          )}

          {/* Divider */}
          <View style={{ height: 8, backgroundColor: '#F0F2F5', marginHorizontal: -16, marginTop: 20, marginBottom: 20 }} />

          {/* Anti-scam info card */}
          <View style={{ backgroundColor: '#F0F9FF', borderRadius: 12, padding: 16 }}>
            <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGroteskBold', color: '#2B51E3', marginBottom: 6 }}>
              Safety reminder
            </Text>
            <Text style={{ fontSize: 13, fontFamily: 'AlteHaasGrotesk', color: '#374151', lineHeight: 20 }}>
              This landlord is verified with a confirmed ID and property proof. Never send money before visiting in person. You will never be asked to pay anything on this app.
            </Text>
          </View>

          {/* Report link */}
          <Pressable onPress={() => router.push('/report' as never)} style={{ marginTop: 16, alignItems: 'center', paddingVertical: 8 }}>
            <Text style={{ fontSize: 13, fontFamily: 'AlteHaasGrotesk', color: '#65676B' }}>Report this listing</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
