import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface Listing {
  id: string;
  unitType: string;
  monthlyRent: number;
  barangay: string;
  status: string;
  lastActiveAt: string;
}

export default function MyListingsScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchListings = useCallback(async () => {
    try {
      // For now fetch all — in production filter by owner via auth
      const res = await fetch(`${API_URL}/api/listings`, { credentials: 'include' });
      if (res.ok) {
        const { data } = await res.json();
        setListings(data.listings || []);
      }
    } catch { /* silent */ } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    active: { bg: '#D1FAE5', text: '#059669' },
    draft: { bg: '#FEF3C7', text: '#92400E' },
    paused: { bg: '#E4E6EB', text: '#65676B' },
    rented: { bg: '#DBEAFE', text: '#1D4ED8' },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 20, fontFamily: 'BerlinSansFB', color: '#050505' }}>My Listings</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'AlteHaasGrotesk', color: '#65676B' }}>Loading...</Text>
        </View>
      ) : listings.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 48, fontFamily: 'AlteHaasGrotesk', marginBottom: 16 }}>H</Text>
          <Text style={{ fontSize: 18, fontFamily: 'BobbyJonesSoft', color: '#050505', textAlign: 'center' }}>
            No listings yet.
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B', textAlign: 'center', marginTop: 8 }}>
            Create your first listing to start receiving connection requests.
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/listings/create' as never)}
            style={{ marginTop: 24, height: 48, paddingHorizontal: 24, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold', fontSize: 16 }}>CREATE A LISTING</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={listings}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchListings(); }} tintColor="#2563EB" />}
            renderItem={({ item }) => {
              const sc = STATUS_COLORS[item.status] || STATUS_COLORS.draft;
              return (
                <Pressable
                  onPress={() => router.push(`/(tabs)/search/${item.id}` as never)}
                  style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E4E6EB' }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGroteskBold', color: '#050505' }}>
                      P{item.monthlyRent.toLocaleString()}/mo
                    </Text>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, backgroundColor: sc.bg }}>
                      <Text style={{ fontSize: 11, fontFamily: 'AlteHaasGrotesk', color: sc.text }}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B', marginTop: 4 }}>
                    {item.unitType.charAt(0).toUpperCase() + item.unitType.slice(1)} · {item.barangay}
                  </Text>
                </Pressable>
              );
            }}
          />
          <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
            <Pressable
              onPress={() => router.push('/(tabs)/listings/create' as never)}
              style={{ height: 48, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold', fontSize: 16 }}>+ CREATE NEW LISTING</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
