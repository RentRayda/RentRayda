import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { VerifiedBadge } from '../../components/VerifiedBadge';

export default function VerificationSubmittedScreen() {
  const router = useRouter();
  // TODO: derive from auth session
  const [role] = useState<'landlord' | 'tenant'>('tenant');

  const ctaLabel = role === 'tenant' ? 'BROWSE LISTINGS' : 'CREATE A LISTING';
  const ctaDestination = role === 'tenant' ? '/(tabs)/search' : '/(tabs)/listings/create';
  const caption = role === 'tenant'
    ? 'While you wait, you can start browsing.'
    : 'While you wait, you can start creating a listing.';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        {/* Clock icon — amber, 48px */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: '#FEF3C7',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 32, color: '#92400E' }}>Pending</Text>
        </View>

        {/* Headline */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: '600',
            color: '#050505',
            textAlign: 'center',
          }}
        >
          Your documents have been submitted!
        </Text>

        {/* Body */}
        <Text
          style={{
            fontSize: 16,
            color: '#65676B',
            textAlign: 'center',
            marginTop: 16,
            marginBottom: 24,
            paddingHorizontal: 32,
            lineHeight: 24,
          }}
        >
          We're reviewing — usually 24-48 hours. You'll get a notification when approved.
        </Text>

        {/* Badge preview — shows what they'll get */}
        <VerifiedBadge status="pending" />

        {/* Role-based primary CTA */}
        <Pressable
          onPress={() => router.replace(ctaDestination as never)}
          style={{
            marginTop: 32,
            width: '100%',
            height: 48,
            backgroundColor: '#2563EB',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
            {ctaLabel}
          </Text>
        </Pressable>

        {/* Caption */}
        <Text
          style={{
            fontSize: 14,
            color: '#65676B',
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          {caption}
        </Text>
      </View>
    </SafeAreaView>
  );
}
