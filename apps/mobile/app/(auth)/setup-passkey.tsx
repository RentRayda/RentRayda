import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { authClient } from '../../lib/auth';

export default function SetupPasskeyScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnable = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      await authClient.passkey.addPasskey();
      // Success — navigate to onboarding
      router.replace('/(onboarding)/tenant-profile' as never);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Passkey setup failed';
      if (message.includes('not supported') || message.includes('NotAllowed')) {
        setError('Your device does not support passkeys. No worries — you can still sign in with a magic link.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(onboarding)/tenant-profile' as never);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        {/* Biometric icon */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#EBF0FC',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 36 }}>🔐</Text>
        </View>

        <Text style={{ fontSize: 24, fontFamily: 'TANNimbus', color: '#050505', textAlign: 'center' }}>
          Enable FaceID / Fingerprint
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'NotoSansOsage', color: '#65676B', textAlign: 'center', marginTop: 8, marginBottom: 32, lineHeight: 20 }}>
          Sign in instantly next time with your face or fingerprint. No codes, no waiting.
        </Text>

        {error && (
          <Text style={{ fontSize: 14, fontFamily: 'NotoSansOsage', color: '#E41E3F', textAlign: 'center', marginBottom: 16 }}>
            {error}
          </Text>
        )}

        <Pressable
          onPress={handleEnable}
          disabled={isLoading}
          style={{
            width: '100%',
            height: 48,
            backgroundColor: '#2B51E3',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontFamily: 'NotoSansOsage', fontSize: 16 }}>ENABLE</Text>
          )}
        </Pressable>

        <Pressable onPress={handleSkip} style={{ marginTop: 16, paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontFamily: 'NotoSansOsage', color: '#65676B' }}>
            Maybe later
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
