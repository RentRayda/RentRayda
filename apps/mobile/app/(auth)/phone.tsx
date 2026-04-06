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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
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
              backgroundColor: '#2563EB',
              marginBottom: 32,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontFamily: 'BerlinSansFB' }}>R</Text>
          </View>

          <Text
            style={{
              fontSize: 24,
              fontFamily: 'BobbyJonesSoft',
              color: '#050505',
              textAlign: 'center',
            }}
          >
            Sign up or log in
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: 'AlteHaasGrotesk',
              color: '#65676B',
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
              borderColor: error ? '#E41E3F' : '#CED0D4',
              borderRadius: 8,
              height: 48,
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <View
              style={{
                backgroundColor: '#E4E6EB',
                paddingHorizontal: 12,
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B' }}>+63</Text>
            </View>
            <TextInput
              style={{ flex: 1, paddingHorizontal: 12, fontSize: 16, fontFamily: 'AlteHaasGrotesk' }}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="9XX XXX XXXX"
              placeholderTextColor="#8A8D91"
              value={phone}
              onChangeText={handlePhoneChange}
              editable={!isLoading}
            />
          </View>

          {error && (
            <Text style={{ fontSize: 12, fontFamily: 'AlteHaasGrotesk', color: '#E41E3F', marginTop: 4, alignSelf: 'flex-start' }}>
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
              backgroundColor: '#2563EB',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: !isValid || isLoading ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold', fontSize: 16 }}>
                SEND CODE
              </Text>
            )}
          </Pressable>

          <Text
            style={{
              fontSize: 12,
              fontFamily: 'AlteHaasGrotesk',
              color: '#65676B',
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
