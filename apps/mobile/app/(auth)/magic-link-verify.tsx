import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Deep link handler for magic link verification.
 * URL: rentrayda://auth/magic-link-verify?token=...&callbackURL=...
 *
 * better-auth's magic link plugin verifies the token server-side via GET
 * to /api/auth/magic-link/verify?token=... which sets the session cookie.
 * This screen calls that endpoint, then redirects on success.
 */
export default function MagicLinkVerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params.token;
    if (!token) {
      setError('Invalid link. Please request a new one.');
      return;
    }

    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/auth/magic-link/verify?token=${encodeURIComponent(token)}`,
          { credentials: 'include' },
        );

        if (!res.ok) {
          throw new Error('Verification failed');
        }

        // Session created — go to main app
        router.replace('/(tabs)' as never);
      } catch {
        setError('This link has expired or is invalid. Please request a new one.');
      }
    })();
  }, [params.token, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        {error ? (
          <>
            <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGroteskBold', color: '#E41E3F', textAlign: 'center', marginBottom: 12 }}>
              Link expired
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B', textAlign: 'center' }}>
              {error}
            </Text>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#2B51E3" />
            <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGrotesk', color: '#65676B', marginTop: 16 }}>
              Signing you in...
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
