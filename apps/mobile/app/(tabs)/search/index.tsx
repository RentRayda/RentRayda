import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ListingCard, CARD_GAP, HORIZONTAL_PADDING } from '../../../components/ListingCard';
import { USE_MOCK_DATA, MOCK_LISTINGS } from '../../../lib/mock-data';

const UNIT_TYPES = ['bedspace', 'room', 'apartment'] as const;
const LAUNCH_BARANGAYS = ['Ugong', 'San Antonio', 'Kapitolyo', 'Oranbo', 'Boni', 'Shaw'] as const;

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

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

function SkeletonGrid() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP, paddingHorizontal: HORIZONTAL_PADDING }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={{ width: CARD_WIDTH, marginBottom: 16 }}>
          <View style={{ width: CARD_WIDTH, height: CARD_WIDTH, backgroundColor: '#E4E6EB', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
          <View style={{ paddingTop: 8, paddingHorizontal: 2 }}>
            <View style={{ width: '60%', height: 16, backgroundColor: '#E4E6EB', borderRadius: 4 }} />
            <View style={{ width: '80%', height: 14, backgroundColor: '#E4E6EB', borderRadius: 4, marginTop: 6 }} />
            <View style={{ width: '40%', height: 12, backgroundColor: '#E4E6EB', borderRadius: 4, marginTop: 4 }} />
          </View>
        </View>
      ))}
    </View>
  );
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
    if (USE_MOCK_DATA) {
      let filtered = [...MOCK_LISTINGS];
      if (barangay && LAUNCH_BARANGAYS.includes(barangay as any)) {
        filtered = filtered.filter(l => l.barangay === barangay);
      }
      if (typeFilter) filtered = filtered.filter(l => l.unitType === typeFilter);
      if (minRent) filtered = filtered.filter(l => l.monthlyRent >= parseInt(minRent));
      if (maxRent) filtered = filtered.filter(l => l.monthlyRent <= parseInt(maxRent));
      if (append) setListings(prev => [...prev, ...filtered]);
      else setListings(filtered);
      setHasMore(false);
      setPage(pageNum);
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
      return;
    }
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'NotoSansOsage', color: '#65676B', textAlign: 'center', marginBottom: 16 }}>
            {error}
          </Text>
          <Pressable
            onPress={() => { setError(null); setLoading(true); fetchListings(1); }}
            style={{ height: 48, paddingHorizontal: 24, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#FFFFFF', fontFamily: 'NotoSansOsage', fontSize: 16 }}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item, index }: { item: Listing; index: number }) => (
    <View style={{ marginLeft: index % 2 === 0 ? 0 : CARD_GAP }}>
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
    </View>
  );

  const ListHeader = () => (
    <View style={{ paddingHorizontal: HORIZONTAL_PADDING, paddingBottom: 8 }}>
      {/* Results count */}
      <Text style={{ fontSize: 13, fontFamily: 'NotoSansOsage', color: '#65676B' }}>
        {loading ? '' : `${listings.length} verified listing${listings.length !== 1 ? 's' : ''}`}
      </Text>
    </View>
  );

  const ListFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={{ paddingVertical: 16, alignItems: 'center' }}>
        {loadingMore ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : (
          <Pressable
            onPress={handleLoadMore}
            style={{
              height: 40,
              paddingHorizontal: 20,
              borderRadius: 20,
              backgroundColor: '#E4E6EB',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#050505', fontFamily: 'NotoSansOsage', fontSize: 14 }}>
              Load more
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  const EmptyState = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingTop: 60 }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>🏠</Text>
      <Text style={{ fontSize: 18, fontFamily: 'NotoSansOsage', color: '#050505', textAlign: 'center' }}>
        No listings found
      </Text>
      <Text style={{ fontSize: 14, fontFamily: 'NotoSansOsage', color: '#65676B', textAlign: 'center', marginTop: 8 }}>
        Try a different barangay or adjust your filters.
      </Text>
      <Pressable
        onPress={clearFilters}
        style={{
          marginTop: 24, height: 40, paddingHorizontal: 20, borderRadius: 20,
          backgroundColor: '#E4E6EB', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#050505', fontFamily: 'NotoSansOsage', fontSize: 14 }}>Clear filters</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Search bar + filters */}
      <View style={{ paddingHorizontal: HORIZONTAL_PADDING, paddingTop: 12, paddingBottom: 4, backgroundColor: '#FFFFFF' }}>
        {/* Search Input */}
        <View style={{ flexDirection: 'row', backgroundColor: '#F0F2F5', borderRadius: 20, height: 40, alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
          <Text style={{ fontSize: 16, fontFamily: 'NotoSansOsage', color: '#65676B' }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, fontFamily: 'NotoSansOsage', color: '#050505' }}
            placeholder="Search by barangay"
            placeholderTextColor="#65676B"
            value={barangay}
            onChangeText={(t) => { setBarangay(t); setShowBarangaySuggestions(true); }}
            onBlur={() => setTimeout(() => setShowBarangaySuggestions(false), 200)}
          />
          {barangay.length > 0 && (
            <Pressable onPress={() => setBarangay('')} hitSlop={8}>
              <Text style={{ fontSize: 18, fontFamily: 'NotoSansOsage', color: '#65676B' }}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Barangay suggestions */}
        {showBarangaySuggestions && filteredBarangays.length > 0 && (
          <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E6EB', borderRadius: 8, marginTop: 4, maxHeight: 200, zIndex: 10 }}>
            {filteredBarangays.map((b) => (
              <Pressable key={b} onPress={() => { setBarangay(b); setShowBarangaySuggestions(false); }} style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
                <Text style={{ fontSize: 15, fontFamily: 'NotoSansOsage', color: '#050505' }}>{b}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', gap: 8, paddingRight: 8 }}>
            <TextInput
              style={{
                height: 36, paddingHorizontal: 12, borderRadius: 16, fontSize: 13, fontFamily: 'NotoSansOsage',
                backgroundColor: minRent ? '#EBF0FC' : '#F0F2F5', color: '#050505', width: 72,
                borderWidth: minRent ? 1 : 0, borderColor: '#2563EB',
              }}
              placeholder="Min"
              placeholderTextColor="#65676B"
              keyboardType="number-pad"
              value={minRent}
              onChangeText={setMinRent}
            />
            <TextInput
              style={{
                height: 36, paddingHorizontal: 12, borderRadius: 16, fontSize: 13, fontFamily: 'NotoSansOsage',
                backgroundColor: maxRent ? '#EBF0FC' : '#F0F2F5', color: '#050505', width: 72,
                borderWidth: maxRent ? 1 : 0, borderColor: '#2563EB',
              }}
              placeholder="Max"
              placeholderTextColor="#65676B"
              keyboardType="number-pad"
              value={maxRent}
              onChangeText={setMaxRent}
            />
            {UNIT_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => setTypeFilter(typeFilter === type ? null : type)}
                style={{
                  height: 36, paddingHorizontal: 14, borderRadius: 16,
                  backgroundColor: typeFilter === type ? '#EBF0FC' : '#F0F2F5',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: typeFilter === type ? 1 : 0,
                  borderColor: '#2563EB',
                }}
              >
                <Text style={{ fontSize: 13, fontFamily: 'NotoSansOsage', color: typeFilter === type ? '#2563EB' : '#050505' }}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: '#E4E6EB' }} />

      {/* Content */}
      {loading ? (
        <ScrollView style={{ flex: 1, paddingTop: 12 }}>
          <SkeletonGrid />
        </ScrollView>
      ) : listings.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={{ paddingHorizontal: HORIZONTAL_PADDING, gap: CARD_GAP }}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#2563EB" />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
