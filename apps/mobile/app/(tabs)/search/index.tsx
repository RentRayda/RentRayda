import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ListingCard } from '../../../components/ListingCard';
import { SkeletonCard } from '../../../components/SkeletonCard';

const UNIT_TYPES = ['bedspace', 'room', 'apartment'] as const;
const LAUNCH_BARANGAYS = ['Ugong', 'San Antonio', 'Kapitolyo', 'Oranbo', 'Boni', 'Shaw'] as const;

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface Listing {
  id: string;
  monthlyRent: number;
  unitType: 'bedspace' | 'room' | 'apartment';
  barangay: string;
  city: string;
  lastActiveAt: string;
  landlordProfile: {
    fullName: string;
    profilePhotoUrl: string | null;
    verificationStatus: string;
  };
  firstPhoto: { r2ObjectKey: string } | null;
}

export default function ListingSearchScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Filters
  const [barangay, setBarangay] = useState('');
  const [showBarangaySuggestions, setShowBarangaySuggestions] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');

  const filteredBarangays = barangay.length > 0
    ? LAUNCH_BARANGAYS.filter((b) => b.toLowerCase().includes(barangay.toLowerCase()))
    : [];

  const fetchListings = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      const params = new URLSearchParams();
      params.set('page', String(pageNum));
      if (barangay && LAUNCH_BARANGAYS.includes(barangay as typeof LAUNCH_BARANGAYS[number])) {
        params.set('barangay', barangay);
      }
      if (typeFilter) params.set('type', typeFilter);
      if (minRent) params.set('minRent', minRent);
      if (maxRent) params.set('maxRent', maxRent);

      const res = await fetch(`${API_URL}/api/listings?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const { data } = await res.json();

      if (append) {
        setListings((prev) => [...prev, ...data.listings]);
      } else {
        setListings(data.listings);
      }
      setHasMore(data.listings.length === data.pageSize);
      setPage(pageNum);
    } catch {
      setError('Could not load listings. Try again?');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [barangay, typeFilter, minRent, maxRent]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchListings(1);
  }, [fetchListings]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchListings(1);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchListings(page + 1, true);
  };

  const clearFilters = () => {
    setBarangay('');
    setTypeFilter(null);
    setMinRent('');
    setMaxRent('');
  };

  // Error state
  if (error && !loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, color: '#65676B', textAlign: 'center', marginBottom: 16 }}>
            {error}
          </Text>
          <Pressable
            onPress={() => { setError(null); setLoading(true); fetchListings(1); }}
            style={{ height: 48, paddingHorizontal: 24, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '500', color: '#050505' }}>Find a listing</Text>
        <Text style={{ fontSize: 14, color: '#65676B', marginTop: 2 }}>Hello!</Text>

        {/* Search Input */}
        <View style={{ flexDirection: 'row', backgroundColor: '#E4E6EB', borderRadius: 20, height: 44, alignItems: 'center', paddingHorizontal: 12, gap: 8, marginTop: 12 }}>
          <Text style={{ fontSize: 16, color: '#8A8D91' }}>S</Text>
          <TextInput
            style={{ flex: 1, fontSize: 16, color: '#050505' }}
            placeholder="Where? (barangay)"
            placeholderTextColor="#8A8D91"
            value={barangay}
            onChangeText={(t) => { setBarangay(t); setShowBarangaySuggestions(true); }}
            onBlur={() => setTimeout(() => setShowBarangaySuggestions(false), 200)}
          />
          {barangay.length > 0 && (
            <Pressable onPress={() => setBarangay('')}>
              <Text style={{ fontSize: 16, color: '#8A8D91' }}>x</Text>
            </Pressable>
          )}
        </View>

        {/* Barangay suggestions */}
        {showBarangaySuggestions && filteredBarangays.length > 0 && (
          <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8, marginTop: 4, maxHeight: 200 }}>
            {filteredBarangays.map((b) => (
              <Pressable key={b} onPress={() => { setBarangay(b); setShowBarangaySuggestions(false); }} style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
                <Text style={{ fontSize: 16, color: '#050505' }}>{b}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              style={{
                height: 36, paddingHorizontal: 12, borderRadius: 18, fontSize: 14,
                backgroundColor: minRent ? '#DBEAFE' : '#E4E6EB', color: '#374151', width: 80,
              }}
              placeholder="P Min"
              placeholderTextColor="#8A8D91"
              keyboardType="number-pad"
              value={minRent}
              onChangeText={setMinRent}
            />
            <TextInput
              style={{
                height: 36, paddingHorizontal: 12, borderRadius: 18, fontSize: 14,
                backgroundColor: maxRent ? '#DBEAFE' : '#E4E6EB', color: '#374151', width: 80,
              }}
              placeholder="P Max"
              placeholderTextColor="#8A8D91"
              keyboardType="number-pad"
              value={maxRent}
              onChangeText={setMaxRent}
            />
            {UNIT_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => setTypeFilter(typeFilter === type ? null : type)}
                style={{
                  height: 36, paddingHorizontal: 14, borderRadius: 18,
                  backgroundColor: typeFilter === type ? '#DBEAFE' : '#E4E6EB',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: typeFilter === type ? 1 : 0,
                  borderColor: '#2563EB',
                }}
              >
                <Text style={{ fontSize: 14, color: typeFilter === type ? '#2563EB' : '#374151' }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Results count */}
        <Text style={{ fontSize: 12, color: '#65676B', marginTop: 12, marginBottom: 8 }}>
          {loading ? '' : `${listings.length} verified listing${listings.length !== 1 ? 's' : ''}`}
        </Text>
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ paddingHorizontal: 20 }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : listings.length === 0 ? (
        /* Empty State */
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>H</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#050505', textAlign: 'center' }}>
            No listings in this area yet.
          </Text>
          <Text style={{ fontSize: 14, color: '#65676B', textAlign: 'center', marginTop: 8 }}>
            Try a nearby barangay or check again tomorrow.
          </Text>
          <Pressable
            onPress={clearFilters}
            style={{
              marginTop: 24, height: 48, paddingHorizontal: 24, borderRadius: 8,
              borderWidth: 1, borderColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#2563EB', fontWeight: '600', fontSize: 16 }}>CLEAR FILTERS</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <FlashList
            data={listings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListingCard
                id={item.id}
                thumbnailUrl={null}
                monthlyRent={item.monthlyRent}
                unitType={item.unitType}
                barangay={item.barangay}
                city={item.city}
                landlordName={item.landlordProfile.fullName}
                verificationStatus={item.landlordProfile.verificationStatus}
                lastActiveAt={item.lastActiveAt}
                onPress={() => router.push(`/(tabs)/search/${item.id}` as never)}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#2563EB" />
            }
            ListFooterComponent={
              hasMore ? (
                <Pressable
                  onPress={handleLoadMore}
                  disabled={loadingMore}
                  style={{
                    height: 48, borderRadius: 8, borderWidth: 1, borderColor: '#CED0D4',
                    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                  }}
                >
                  {loadingMore ? (
                    <ActivityIndicator size="small" color="#2563EB" />
                  ) : (
                    <Text style={{ color: '#374151', fontWeight: '500', fontSize: 14 }}>
                      LOAD MORE (page {page + 1})
                    </Text>
                  )}
                </Pressable>
              ) : null
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}
