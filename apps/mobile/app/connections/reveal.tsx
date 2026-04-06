import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Animated,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { VerifiedBadge } from '../../components/VerifiedBadge';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface ConnectionData {
  id: string;
  otherPartyPhone: string;
  otherPartyName: string;
  otherPartyPhotoUrl: string | null;
  connectedAt: string;
}

export default function ConnectionRevealScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [connection, setConnection] = useState<ConnectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Spring scale animation
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchConnection = async () => {
      try {
        const res = await fetch(`${API_URL}/api/connections/${id}`, {
          credentials: 'include',
        });
        if (res.status === 403) {
          setError('One party is not verified yet. Cannot reveal the number.');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch');
        const { data } = await res.json();
        setConnection(data);

        // Trigger spring animation
        Animated.spring(scaleAnim, {
          toValue: 1,
          stiffness: 200,
          damping: 15,
          useNativeDriver: true,
        }).start();
      } catch {
        setError('Could not load connection details.');
      } finally {
        setLoading(false);
      }
    };
    fetchConnection();
  }, [id, scaleAnim]);

  const handleCall = () => {
    if (!connection) return;
    const phone = connection.otherPartyPhone;
    // Format for dialer
    const dialPhone = phone.startsWith('09')
      ? `+63${phone.substring(1)}`
      : phone.startsWith('+') ? phone : `+63${phone}`;
    Linking.openURL(`tel:${dialPhone}`);
  };

  const handleCopy = async () => {
    if (!connection) return;
    await Clipboard.setStringAsync(connection.otherPartyPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!connection) return;
    try {
      await Share.share({
        message: `I found a verified rental on RentRayda! Contact ${connection.otherPartyName} at ${connection.otherPartyPhone}. Download RentRayda to find verified rentals in Pasig.`,
      });
    } catch { /* user cancelled */ }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (error || !connection) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGrotesk', color: '#E41E3F', textAlign: 'center', marginBottom: 16 }}>
            {error || 'Connection not found.'}
          </Text>
          <Pressable onPress={() => router.back()} style={{ height: 48, paddingHorizontal: 24, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold' }}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 24, fontFamily: 'AlteHaasGrotesk', color: '#050505' }}>←</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        {/* Handshake icon with spring animation */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: '#DBEAFE',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 24, fontFamily: 'AlteHaasGroteskBold', color: '#2563EB' }}>Connected</Text>
        </Animated.View>

        {/* Headline */}
        <Text style={{ fontSize: 32, fontFamily: 'BobbyJonesSoft', color: '#2563EB', marginTop: 24, textAlign: 'center' }}>
          You are now connected!
        </Text>

        <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGrotesk', color: '#65676B', textAlign: 'center', marginTop: 16, paddingHorizontal: 24 }}>
          You can now call or text each other to schedule a viewing.
        </Text>

        {/* Contact Card */}
        <View style={{ backgroundColor: '#DBEAFE', borderRadius: 16, padding: 20, width: '100%', marginTop: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 24, fontFamily: 'AlteHaasGrotesk', color: '#65676B' }}>P</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontFamily: 'AlteHaasGroteskBold', color: '#050505' }}>
                {connection.otherPartyName}
              </Text>
              <VerifiedBadge status="verified" size="sm" />
            </View>
          </View>

          {/* Phone Number — THE KEY REVEAL */}
          <Text style={{ fontSize: 24, fontFamily: 'AlteHaasGroteskBold', color: '#2563EB', marginTop: 16, textAlign: 'center' }}>
            {connection.otherPartyPhone}
          </Text>

          {/* Call + Copy buttons */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <Pressable
              onPress={handleCall}
              style={{ flex: 1, height: 44, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold', fontSize: 14 }}>Call</Text>
            </Pressable>
            <Pressable
              onPress={handleCopy}
              style={{ flex: 1, height: 44, borderWidth: 1, borderColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#2563EB', fontFamily: 'AlteHaasGroteskBold', fontSize: 14 }}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Share button */}
        <Pressable
          onPress={handleShare}
          style={{ width: '100%', height: 44, borderWidth: 1, borderColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 16 }}
        >
          <Text style={{ color: '#2563EB', fontFamily: 'AlteHaasGroteskBold', fontSize: 14 }}>Share with friends</Text>
        </Pressable>

        {/* Tip */}
        <Text style={{ fontSize: 12, fontFamily: 'AlteHaasGrotesk', color: '#65676B', textAlign: 'center', marginTop: 16 }}>
          Tip: Schedule a viewing by calling or texting.
        </Text>
      </View>

      {/* Copied toast */}
      {copied && (
        <View style={{ position: 'absolute', bottom: 100, left: 20, right: 20, backgroundColor: '#31A24C', borderRadius: 8, padding: 12, alignItems: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGrotesk' }}>Number copied!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
