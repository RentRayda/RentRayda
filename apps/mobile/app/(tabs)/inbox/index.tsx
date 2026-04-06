import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VerifiedBadge } from '../../../components/VerifiedBadge';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface ConnectionRequest {
  id: string;
  message: string | null;
  status: string;
  createdAt: string;
  tenant?: { fullName: string; verificationStatus: string };
  landlord?: { fullName: string; verificationStatus: string };
  listing: { unitType: string; barangay: string; monthlyRent?: number };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

export default function InboxScreen() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [isLandlord, setIsLandlord] = useState(true); // TODO: derive from auth

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/connections/requests`, {
        credentials: 'include',
      });
      if (!res.ok) return;
      const { data } = await res.json();
      setRequests(data);
      // If first item has 'tenant' field, we're a landlord
      if (data.length > 0) {
        setIsLandlord(!!data[0].tenant);
      }
    } catch { /* silent */ } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleAccept = async (requestId: string) => {
    setProcessing(requestId);
    try {
      const res = await fetch(`${API_URL}/api/connections/${requestId}/accept`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (res.ok) {
        setRequests((prev) => prev.map((r) =>
          r.id === requestId ? { ...r, status: 'accepted' } : r,
        ));
      }
    } catch { /* silent */ } finally {
      setProcessing(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setProcessing(requestId);
    try {
      const res = await fetch(`${API_URL}/api/connections/${requestId}/decline`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (res.ok) {
        setRequests((prev) => prev.map((r) =>
          r.id === requestId ? { ...r, status: 'declined' } : r,
        ));
      }
    } catch { /* silent */ } finally {
      setProcessing(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  const renderLandlordCard = ({ item }: { item: ConnectionRequest }) => (
    <View style={{ backgroundColor: '#FFFFFF', padding: 16, marginBottom: 1, borderBottomWidth: 1, borderBottomColor: '#CED0D4' }}>
      {/* Tenant info */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 20, color: '#8A8D91' }}>P</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: '#050505' }}>
            {item.tenant?.fullName || 'Tenant'}
          </Text>
          <VerifiedBadge status="verified" size="sm" />
        </View>
      </View>

      {/* Message */}
      {item.message && (
        <Text numberOfLines={2} style={{ fontSize: 14, color: '#65676B', marginTop: 8, lineHeight: 20 }}>
          "{item.message}"
        </Text>
      )}

      {/* Listing ref + timestamp */}
      <Text style={{ fontSize: 12, color: '#8A8D91', marginTop: 8 }}>
        For: {item.listing.unitType.charAt(0).toUpperCase() + item.listing.unitType.slice(1)} {item.listing.barangay} · {timeAgo(item.createdAt)}
      </Text>

      {/* Action buttons */}
      {item.status === 'pending' ? (
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <Pressable
            onPress={() => handleAccept(item.id)}
            disabled={processing === item.id}
            style={{ flex: 1, height: 40, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center', opacity: processing === item.id ? 0.5 : 1 }}
          >
            {processing === item.id ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>Accept</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => handleDecline(item.id)}
            disabled={processing === item.id}
            style={{ flex: 1, height: 40, backgroundColor: '#E4E6EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#374151', fontWeight: '500', fontSize: 14 }}>Decline</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ marginTop: 12, paddingVertical: 8, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: item.status === 'accepted' ? '#31A24C' : '#8A8D91' }}>
            {item.status === 'accepted' ? 'Accepted' : 'Declined'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderTenantCard = ({ item }: { item: ConnectionRequest }) => (
    <View style={{ backgroundColor: '#FFFFFF', padding: 16, marginBottom: 1, borderBottomWidth: 1, borderBottomColor: '#CED0D4' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#050505' }}>
          {item.landlord?.fullName || 'Landlord'}
        </Text>
        <View style={{
          paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999,
          backgroundColor: item.status === 'pending' ? '#FEF3C7' : item.status === 'accepted' ? '#D1FAE5' : '#E4E6EB',
        }}>
          <Text style={{
            fontSize: 12, fontWeight: '500',
            color: item.status === 'pending' ? '#92400E' : item.status === 'accepted' ? '#059669' : '#65676B',
          }}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 14, color: '#65676B', marginTop: 4 }}>
        {item.listing.unitType.charAt(0).toUpperCase() + item.listing.unitType.slice(1)} · {item.listing.barangay}
        {item.listing.monthlyRent ? ` · P${item.listing.monthlyRent.toLocaleString()}` : ''}
      </Text>
      <Text style={{ fontSize: 12, color: '#8A8D91', marginTop: 4 }}>{timeAgo(item.createdAt)}</Text>
    </View>
  );

  // Skeleton
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '500', color: '#050505' }}>Connection Requests</Text>
        </View>
        <View style={{ paddingHorizontal: 0, paddingTop: 16 }}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ backgroundColor: '#FFFFFF', padding: 16, marginBottom: 1 }}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#CED0D4' }} />
                <View style={{ flex: 1 }}>
                  <View style={{ width: '60%', height: 16, backgroundColor: '#CED0D4', borderRadius: 4 }} />
                  <View style={{ width: '40%', height: 12, backgroundColor: '#CED0D4', borderRadius: 4, marginTop: 6 }} />
                </View>
              </View>
              <View style={{ width: '80%', height: 14, backgroundColor: '#CED0D4', borderRadius: 4, marginTop: 12 }} />
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <View style={{ flex: 1, height: 40, backgroundColor: '#CED0D4', borderRadius: 8 }} />
                <View style={{ flex: 1, height: 40, backgroundColor: '#CED0D4', borderRadius: 8 }} />
              </View>
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: '500', color: '#050505' }}>
          Connection Requests
        </Text>
        <Text style={{ fontSize: 14, color: '#65676B', marginTop: 2 }}>
          {pendingRequests.length} pending
        </Text>
      </View>

      {requests.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>I</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#050505', textAlign: 'center' }}>
            No connection requests yet.
          </Text>
          <Text style={{ fontSize: 14, color: '#65676B', textAlign: 'center', marginTop: 8 }}>
            {isLandlord
              ? 'When tenants are interested in your listing, their requests will appear here.'
              : 'Your sent requests and connections will appear here.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 0 }}
          renderItem={isLandlord ? renderLandlordCard : renderTenantCard}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchRequests(); }}
              tintColor="#2563EB"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
