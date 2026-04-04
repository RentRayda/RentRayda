import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authClient } from '../../lib/auth';

export default function OTPVerifyScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [expirySeconds, setExpirySeconds] = useState(600);
  const [isLocked, setIsLocked] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // OTP expiry timer
  useEffect(() => {
    if (expirySeconds <= 0) return;
    const timer = setInterval(() => setExpirySeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [expirySeconds]);

  const shakeInputs = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const handleVerify = useCallback(async (code: string) => {
    if (isLoading || isLocked) return;
    setIsLoading(true);
    setError(null);

    try {
      const fullPhone = `09${phone?.substring(1) || ''}`;
      await authClient.phoneNumber.verify({ phoneNumber: fullPhone, code });
      // Success — navigate to role selection
      router.replace('/(auth)/role');
    } catch {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setIsLocked(true);
        setError('Account temporarily locked. Try again in 15 minutes.');
      } else {
        setError(`Wrong code. ${3 - newAttempts} attempt${3 - newAttempts === 1 ? '' : 's'} left.`);
        shakeInputs();
        // Clear inputs after shake
        setTimeout(() => {
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isLocked, phone, attempts, router, shakeInputs]);

  const handleDigitChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit on 6th digit
    if (text && index === 5) {
      const code = newOtp.join('');
      if (code.length === 6) {
        handleVerify(code);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const fullPhone = `09${phone?.substring(1) || ''}`;
      await authClient.phoneNumber.sendOtp({ phoneNumber: fullPhone });
      setResendCooldown(60);
      setExpirySeconds(600);
      setError(null);
      setAttempts(0);
    } catch {
      setError('Failed to resend code.');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const displayPhone = phone ? `+63 ${phone}` : '';
  const code = otp.join('');
  const isComplete = code.length === 6;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 24, color: '#1A1A2E' }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1A2E', marginLeft: 12 }}>
          Verify your code
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>
          We sent a 6-digit code to
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A2E', marginTop: 4 }}>
          {displayPhone}
        </Text>

        {/* OTP Inputs */}
        <Animated.View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
            marginVertical: 32,
            transform: [{ translateX: shakeAnim }],
          }}
        >
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => { inputRefs.current[i] = ref; }}
              style={{
                width: 48,
                height: 48,
                borderWidth: 1,
                borderColor: error ? '#EF4444' : '#D1D5DB',
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '600',
              }}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleDigitChange(text, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              editable={!isLoading && !isLocked}
              autoFocus={i === 0}
            />
          ))}
        </Animated.View>

        {error && (
          <Text style={{ fontSize: 14, color: '#DC2626', textAlign: 'center', marginBottom: 16 }}>
            {error}
          </Text>
        )}

        {/* CTA */}
        <Pressable
          onPress={() => handleVerify(code)}
          disabled={!isComplete || isLoading || isLocked}
          style={{
            width: '100%',
            height: 48,
            backgroundColor: '#2B51E3',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !isComplete || isLoading || isLocked ? 0.5 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>VERIFY</Text>
          )}
        </Pressable>

        {/* Resend */}
        {!isLocked && (
          <Pressable
            onPress={handleResend}
            disabled={resendCooldown > 0}
            style={{ marginTop: 24, paddingVertical: 12, alignItems: 'center' }}
          >
            <Text style={{ fontSize: 14, color: resendCooldown > 0 ? '#9CA3AF' : '#2B51E3' }}>
              {resendCooldown > 0
                ? `Didn't receive it? Resend code (${resendCooldown}s)`
                : "Didn't receive it? Resend code"}
            </Text>
          </Pressable>
        )}

        {/* Expiry countdown */}
        {expirySeconds > 0 && !isLocked && (
          <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center', marginTop: 8 }}>
            Code expires in {formatTime(expirySeconds)}
          </Text>
        )}

        {expirySeconds <= 0 && !isLocked && (
          <Text style={{ fontSize: 14, color: '#D97706', textAlign: 'center', marginTop: 8 }}>
            Code expired. Request a new one.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
