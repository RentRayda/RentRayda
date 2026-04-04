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
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { authClient } from '../../lib/auth';

export default function PhoneEntryScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = /^9\d{9}$/.test(phone);

  const handleSendCode = async () => {
    if (!isValid || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const fullPhone = `09${phone.substring(1)}`;
      await authClient.phoneNumber.sendOtp({ phoneNumber: fullPhone });
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      if (message.includes('rate') || message.includes('429')) {
        setError('Too many codes sent. Try again in 1 hour.');
      } else {
        setError('Failed to send code. Try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[\s\-\(\)\.]/g, '');
    if (/^\d*$/.test(cleaned) && cleaned.length <= 10) {
      setPhone(cleaned);
      setError(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          {/* Logo placeholder */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: '#2B51E3',
              marginBottom: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '700' }}>R</Text>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: '#1A1A2E',
              textAlign: 'center',
            }}
          >
            Sign up or log in
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: '#6B7280',
              textAlign: 'center',
              marginBottom: 32,
              marginTop: 8,
            }}
          >
            Enter your phone number to get started.
          </Text>

          {/* Phone Input */}
          <View
            style={{
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: error ? '#EF4444' : '#D1D5DB',
              borderRadius: 8,
              height: 48,
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <View
              style={{
                backgroundColor: '#F3F4F6',
                paddingHorizontal: 12,
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, color: '#6B7280' }}>+63</Text>
            </View>
            <TextInput
              style={{ flex: 1, paddingHorizontal: 12, fontSize: 16 }}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="9XX XXX XXXX"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={handlePhoneChange}
              editable={!isLoading}
            />
          </View>

          {error && (
            <Text style={{ fontSize: 12, color: '#DC2626', marginTop: 4, alignSelf: 'flex-start' }}>
              {error}
            </Text>
          )}

          {/* CTA */}
          <Pressable
            onPress={handleSendCode}
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
              <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
                SEND CODE
              </Text>
            )}
          </Pressable>

          <Text
            style={{
              fontSize: 12,
              color: '#6B7280',
              textAlign: 'center',
              marginTop: 16,
            }}
          >
            It's free. No fees. No credit card needed.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
