import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { VerifiedBadge } from '../../../components/VerifiedBadge';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

const DOC_STATUS_ICONS: Record<string, { icon: string; color: string }> = {
  approved: { icon: 'OK', color: '#31A24C' },
  pending: { icon: '...', color: '#F7B928' },
  rejected: { icon: 'X', color: '#E41E3F' },
  none: { icon: 'o', color: '#8A8D91' },
};

export default function ProfileScreen() {
  const router = useRouter();
  const [name] = useState('User');
  const [city] = useState('Pasig');
  const [role] = useState<'landlord' | 'tenant'>('tenant');
  const [verificationStatus] = useState<'verified' | 'pending' | 'unverified' | 'rejected'>('unverified');
  const [govIdStatus] = useState<'approved' | 'pending' | 'rejected' | 'none'>('none');
  const [secondDocStatus] = useState<'approved' | 'pending' | 'rejected' | 'none'>('none');
  const [connectionCount, setConnectionCount] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/connections`, { credentials: 'include' });
      if (res.ok) {
        const { data } = await res.json();
        setConnectionCount(data.length);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchConnections(); }, [fetchConnections]);

  const handleLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
              });
            } catch { /* silent */ }
            router.replace('/(auth)/phone' as never);
          },
        },
      ],
    );
  };

  const renderStatusRow = (label: string, status: 'approved' | 'pending' | 'rejected' | 'none', onPress?: () => void, isLast?: boolean) => {
    const { icon, color } = DOC_STATUS_ICONS[status];
    const statusLabel = status === 'approved' ? 'OK' : status === 'pending' ? 'Pending' : status === 'rejected' ? 'Rejected' : 'Not submitted';

    return (
      <Pressable
        onPress={onPress}
        style={{
          height: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          paddingHorizontal: 16,
          borderBottomWidth: isLast ? 0 : 1, borderBottomColor: '#E4E6EB',
        }}
      >
        <Text style={{ fontSize: 16, color: '#050505' }}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 14, color }}>{icon} {statusLabel}</Text>
          <Text style={{ fontSize: 14, color: '#8A8D91' }}>{'>'}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}>
        <Text style={{ fontSize: 20, fontWeight: '500', color: '#050505', marginBottom: 16 }}>Profile</Text>

        {/* Profile Card */}
        <View style={{
          backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
          flexDirection: 'row', alignItems: 'center', gap: 12,
          marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
        }}>
          <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, color: '#8A8D91' }}>P</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#050505' }}>{name}</Text>
            <View style={{ marginTop: 4 }}>
              <VerifiedBadge status={verificationStatus} size="sm" />
            </View>
            <Text style={{ fontSize: 14, color: '#65676B', marginTop: 2 }}>
              {role.charAt(0).toUpperCase() + role.slice(1)} · {city}
            </Text>
          </View>
        </View>

        {/* Verification Status */}
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#65676B', letterSpacing: 1, marginBottom: 8 }}>
          VERIFICATION STATUS
        </Text>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, marginBottom: 24, overflow: 'hidden' }}>
          {renderStatusRow(
            'Government ID',
            govIdStatus,
            () => router.push('/(onboarding)/verify-id' as never),
            role === 'landlord' ? false : secondDocStatus === 'none',
          )}
          {role === 'landlord' && renderStatusRow(
            'Property Proof',
            secondDocStatus,
            () => router.push('/(onboarding)/property-proof' as never),
            true,
          )}
          {role === 'tenant' && renderStatusRow(
            'Employment Proof',
            secondDocStatus,
            () => router.push('/(onboarding)/employment-proof' as never),
            true,
          )}
        </View>

        {/* Connections */}
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#65676B', letterSpacing: 1, marginBottom: 8 }}>
          CONNECTIONS
        </Text>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, marginBottom: 24, overflow: 'hidden' }}>
          <Pressable style={{ height: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 16, color: '#050505' }}>
              {connectionCount} active connection{connectionCount !== 1 ? 's' : ''}
            </Text>
            <Text style={{ fontSize: 14, color: '#8A8D91' }}>{'>'}</Text>
          </Pressable>
        </View>

        {/* Settings */}
        <Text style={{ fontSize: 12, fontWeight: '500', color: '#65676B', letterSpacing: 1, marginBottom: 8 }}>
          SETTINGS
        </Text>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1, marginBottom: 24, overflow: 'hidden' }}>
          <Pressable style={{ height: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E4E6EB' }}>
            <Text style={{ fontSize: 16, color: '#050505' }}>Privacy Policy</Text>
            <Text style={{ fontSize: 14, color: '#8A8D91' }}>{'>'}</Text>
          </Pressable>
          <Pressable style={{ height: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#E4E6EB' }}>
            <Text style={{ fontSize: 16, color: '#050505' }}>Terms of Service</Text>
            <Text style={{ fontSize: 14, color: '#8A8D91' }}>{'>'}</Text>
          </Pressable>
          <Pressable style={{ height: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 16, color: '#050505' }}>About</Text>
            <Text style={{ fontSize: 14, color: '#8A8D91' }}>v1.0.0 {'>'}</Text>
          </Pressable>
        </View>

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          disabled={loggingOut}
          style={{
            height: 48, borderWidth: 1, borderColor: '#E41E3F', borderRadius: 8,
            alignItems: 'center', justifyContent: 'center',
            opacity: loggingOut ? 0.5 : 1,
          }}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#E41E3F" />
          ) : (
            <Text style={{ color: '#E41E3F', fontWeight: '600', fontSize: 16 }}>LOG OUT</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
