import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const CITIES = ['Pasig', 'Mandaluyong'] as const;

const LAUNCH_BARANGAYS = [
  'Ugong',
  'San Antonio',
  'Kapitolyo',
  'Oranbo',
  'Boni',
  'Shaw',
] as const;

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function LandlordProfileScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState<string>('Pasig');
  const [barangay, setBarangay] = useState<string>('');
  const [unitCount, setUnitCount] = useState(1);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showBarangayPicker, setShowBarangayPicker] = useState(false);

  const isValid = fullName.trim().length >= 2 && barangay.length > 0;

  const handlePhotoPick = async () => {
    setPhotoError(false);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      setPhotoUri(asset.uri);

      // Get presigned URL for PUBLIC profile photos bucket
      const presignRes = await fetch(`${API_URL}/api/storage/presigned-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucket: 'profiles',
          contentType: 'image/jpeg',
        }),
      });

      if (!presignRes.ok) throw new Error('Failed to get upload URL');
      const { data } = await presignRes.json();

      // Upload to R2
      const blob = await fetch(asset.uri).then((r) => r.blob());
      const uploadRes = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: blob,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      setPhotoUrl(data.objectKey);
    } catch {
      setPhotoError(true);
    }
  };

  const handleSave = async () => {
    if (!isValid || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        fullName: fullName.trim(),
        city,
        barangay,
        unitCount,
      };
      if (photoUrl) body.profilePhotoUrl = photoUrl;

      const res = await fetch(`${API_URL}/api/landlords/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save');
      }

      // Success → navigate to verify-id
      router.replace('/(onboarding)/verify-id' as never);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 24, color: '#1A1A2E' }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1A2E', marginLeft: 12 }}>
          Set up your profile
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo Picker */}
        <Pressable onPress={handlePhotoPick} style={{ alignSelf: 'center', marginBottom: 8 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#E5E7EB',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderWidth: photoError ? 2 : 0,
              borderColor: photoError ? '#EF4444' : undefined,
            }}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={{ width: 80, height: 80 }} />
            ) : (
              <Text style={{ fontSize: 32, color: '#9CA3AF' }}>📷</Text>
            )}
          </View>
          {/* Camera badge */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: '#2B51E3',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 14 }}>📷</Text>
          </View>
        </Pressable>
        <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 }}>
          Tap to take a selfie
        </Text>
        {photoError && (
          <Pressable onPress={handlePhotoPick}>
            <Text style={{ fontSize: 12, color: '#DC2626', textAlign: 'center', marginBottom: 16 }}>
              Photo upload failed. Try again?
            </Text>
          </Pressable>
        )}

        {/* Full Name */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#1A1A2E', marginBottom: 4 }}>
          Full name <Text style={{ color: '#DC2626' }}>*</Text>
        </Text>
        <TextInput
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 8,
            paddingHorizontal: 12,
            fontSize: 16,
            marginBottom: 16,
            backgroundColor: '#FFFFFF',
          }}
          placeholder="Juan Dela Cruz"
          placeholderTextColor="#9CA3AF"
          value={fullName}
          onChangeText={setFullName}
          editable={!isLoading}
        />

        {/* City Picker */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#1A1A2E', marginBottom: 4 }}>
          City <Text style={{ color: '#DC2626' }}>*</Text>
        </Text>
        <Pressable
          onPress={() => setShowCityPicker(!showCityPicker)}
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 8,
            paddingHorizontal: 12,
            justifyContent: 'center',
            marginBottom: showCityPicker ? 0 : 16,
            backgroundColor: '#FFFFFF',
          }}
        >
          <Text style={{ fontSize: 16, color: '#1A1A2E' }}>▾ {city}</Text>
        </Pressable>
        {showCityPicker && (
          <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderTopWidth: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 16, backgroundColor: '#FFFFFF' }}>
            {CITIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => { setCity(c); setShowCityPicker(false); }}
                style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: city === c ? '#EBF0FC' : '#FFFFFF' }}
              >
                <Text style={{ fontSize: 16, color: '#1A1A2E' }}>{c}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Barangay Picker */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#1A1A2E', marginBottom: 4 }}>
          Barangay <Text style={{ color: '#DC2626' }}>*</Text>
        </Text>
        <Pressable
          onPress={() => setShowBarangayPicker(!showBarangayPicker)}
          style={{
            height: 48,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 8,
            paddingHorizontal: 12,
            justifyContent: 'center',
            marginBottom: showBarangayPicker ? 0 : 16,
            backgroundColor: '#FFFFFF',
          }}
        >
          <Text style={{ fontSize: 16, color: barangay ? '#1A1A2E' : '#9CA3AF' }}>
            ▾ {barangay || 'Select barangay'}
          </Text>
        </Pressable>
        {showBarangayPicker && (
          <View style={{ borderWidth: 1, borderColor: '#D1D5DB', borderTopWidth: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 16, backgroundColor: '#FFFFFF' }}>
            {LAUNCH_BARANGAYS.map((b) => (
              <Pressable
                key={b}
                onPress={() => { setBarangay(b); setShowBarangayPicker(false); }}
                style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: barangay === b ? '#EBF0FC' : '#FFFFFF' }}
              >
                <Text style={{ fontSize: 16, color: '#1A1A2E' }}>{b}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => { setBarangay('Other'); setShowBarangayPicker(false); }}
              style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: barangay === 'Other' ? '#EBF0FC' : '#FFFFFF' }}
            >
              <Text style={{ fontSize: 16, color: '#1A1A2E' }}>Other</Text>
            </Pressable>
          </View>
        )}

        {/* Unit Count Stepper */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#1A1A2E', marginBottom: 4 }}>
          How many units? <Text style={{ color: '#DC2626' }}>*</Text>
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1A2E' }}>{unitCount}</Text>
          </View>
          <Pressable
            onPress={() => setUnitCount(Math.max(1, unitCount - 1))}
            disabled={unitCount <= 1}
            style={{
              marginLeft: 12,
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: unitCount <= 1 ? '#E5E7EB' : '#D1D5DB',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '600', color: unitCount <= 1 ? '#9CA3AF' : '#1A1A2E' }}>−</Text>
          </Pressable>
          <Pressable
            onPress={() => setUnitCount(Math.min(50, unitCount + 1))}
            disabled={unitCount >= 50}
            style={{
              marginLeft: 8,
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: unitCount >= 50 ? '#E5E7EB' : '#D1D5DB',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '600', color: unitCount >= 50 ? '#9CA3AF' : '#1A1A2E' }}>+</Text>
          </Pressable>
        </View>

        {error && (
          <Text style={{ fontSize: 14, color: '#DC2626', textAlign: 'center', marginBottom: 16 }}>
            {error}
          </Text>
        )}

        {/* CTA */}
        <Pressable
          onPress={handleSave}
          disabled={!isValid || isLoading}
          style={{
            width: '100%',
            height: 48,
            backgroundColor: '#2B51E3',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !isValid || isLoading ? 0.5 : 1,
            marginBottom: 16,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>SAVE PROFILE</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
