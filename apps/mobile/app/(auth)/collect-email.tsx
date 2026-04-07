import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function CollectEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSave = async () => {
    if (!isValid || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/tenants/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save email');
      }

      router.replace('/(auth)/setup-passkey');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(onboarding)/tenant-profile' as never);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 24, fontFamily: 'BobbyJonesSoft', color: '#050505', textAlign: 'center' }}>
            Add your email
          </Text>
          <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B', textAlign: 'center', marginTop: 8, marginBottom: 32 }}>
            For password-free sign in next time. No spam, ever.
          </Text>

          <TextInput
            style={{
              height: 48,
              borderWidth: 1,
              borderColor: error ? '#E41E3F' : '#CED0D4',
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 16,
              fontFamily: 'AlteHaasGrotesk',
              backgroundColor: '#FFFFFF',
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="your@email.com"
            placeholderTextColor="#8A8D91"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(null); }}
            editable={!isLoading}
          />

          {error && (
            <Text style={{ fontSize: 12, fontFamily: 'AlteHaasGrotesk', color: '#E41E3F', marginTop: 4 }}>
              {error}
            </Text>
          )}

          <Pressable
            onPress={handleSave}
            disabled={!isValid || isLoading}
            style={{
              marginTop: 16,
              width: '100%',
              height: 48,
              backgroundColor: '#2B51E3',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: !isValid || isLoading ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold', fontSize: 16 }}>CONTINUE</Text>
            )}
          </Pressable>

          <Pressable onPress={handleSkip} style={{ marginTop: 16, paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B' }}>
              Skip for now
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
