import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const CEREMONY_KEY = 'ceremony_shown_v1';

export default function VerificationCeremonyScreen() {
  const router = useRouter();
  const [name] = useState('User'); // TODO: fetch from profile
  const [role] = useState<'landlord' | 'tenant'>('tenant'); // TODO: derive from auth

  // Spring scale animation
  const scaleAnim = useRef(new Animated.Value(0)).current;
  // Background flash
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check if already shown
    SecureStore.getItemAsync(CEREMONY_KEY).then((val) => {
      if (val === 'true') {
        // Skip — go to main tabs
        router.replace('/(tabs)/search' as never);
        return;
      }

      // Mark as shown
      SecureStore.setItemAsync(CEREMONY_KEY, 'true');

      // Play animations
      Animated.spring(scaleAnim, {
        toValue: 1,
        stiffness: 200,
        damping: 15,
        useNativeDriver: true,
      }).start();

      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
        Animated.timing(flashAnim, { toValue: 0, duration: 150, useNativeDriver: false }),
      ]).start();
    });
  }, [scaleAnim, flashAnim, router]);

  const flashBg = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(220, 252, 231, 0)', 'rgba(220, 252, 231, 1)'],
  });

  const handleContinue = () => {
    if (role === 'tenant') {
      router.replace('/(tabs)/search' as never);
    } else {
      router.replace('/(tabs)/listings' as never);
    }
  };

  const handleShare = async () => {
    const appLink = 'https://rentrayda.ph';
    const message = role === 'tenant'
      ? `I found a verified landlord on RentRayda — no connections needed. Try it: ${appLink}`
      : `Free app for landlords — RentRayda verifies tenants before they connect. It's free. ${appLink}`;

    try {
      await Share.share({ message });
    } catch { /* user cancelled */ }
  };

  const bodyText = role === 'tenant'
    ? "You don't need connections in Manila anymore. You're verified — landlords can see you are real, have a job, and are reliable."
    : `You are verified, ${name}! Tenants can see you are legitimate and have a real property.`;

  const ctaLabel = role === 'tenant' ? 'BROWSE LISTINGS' : 'CREATE A LISTING';

  return (
    <Animated.View style={{ flex: 1, backgroundColor: flashBg }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          {/* Green Shield with spring animation */}
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: '#31A24C',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 32, fontFamily: 'NotoSansOsage', color: '#FFFFFF' }}>✓</Text>
          </Animated.View>

          {/* Headline */}
          <Text
            style={{
              fontSize: 32,
              fontFamily: 'TANNimbus',
              color: '#2563EB',
              textAlign: 'center',
              marginTop: 24,
            }}
          >
            {name}, you're verified!
          </Text>

          {/* Body copy — role specific */}
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'NotoSansOsage',
              color: '#65676B',
              textAlign: 'center',
              marginTop: 16,
              paddingHorizontal: 24,
              lineHeight: 24,
            }}
          >
            {bodyText}
          </Text>

          {/* Primary CTA */}
          <Pressable
            onPress={handleContinue}
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
            <Text style={{ color: '#FFFFFF', fontFamily: 'NotoSansOsage', fontSize: 16 }}>
              {ctaLabel}
            </Text>
          </Pressable>

          {/* Share CTA */}
          <Pressable
            onPress={handleShare}
            style={{
              marginTop: 16,
              width: '100%',
              height: 48,
              borderWidth: 1,
              borderColor: '#2563EB',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#2563EB', fontFamily: 'NotoSansOsage', fontSize: 16 }}>
              SHARE WITH FRIENDS
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
