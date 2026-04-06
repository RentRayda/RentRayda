import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const EMPLOYMENT_TYPES = [
  { value: 'bpo', label: 'BPO' },
  { value: 'student', label: 'Student' },
  { value: 'office', label: 'Office' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'other', label: 'Other' },
] as const;

const BPO_COMPANIES = [
  'Concentrix', 'Teleperformance', 'Accenture', 'TaskUs',
  'Alorica', 'Sutherland', 'TTEC', 'Conduent', 'iQor', 'Other',
] as const;

const LAUNCH_BARANGAYS = ['Ugong', 'San Antonio', 'Kapitolyo', 'Oranbo', 'Boni', 'Shaw'] as const;

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function TenantProfileScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [searchBarangay, setSearchBarangay] = useState('');
  const [showBarangayPicker, setShowBarangayPicker] = useState(false);
  const [employmentType, setEmploymentType] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showCompanyField = employmentType === 'bpo' || employmentType === 'student' || employmentType === 'office';
  const isValid = fullName.trim().length >= 2 && searchBarangay.length > 0 && employmentType !== null;

  const filteredCompanies = companyName.length > 0
    ? BPO_COMPANIES.filter((c) => c.toLowerCase().includes(companyName.toLowerCase()))
    : [];

  const handlePhotoPick = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (result.canceled || !result.assets[0]) return;
      setPhotoUri(result.assets[0].uri);

      const presignRes = await fetch(`${API_URL}/api/storage/presigned-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket: 'profiles', contentType: 'image/jpeg' }),
      });
      if (!presignRes.ok) return;
      const { data } = await presignRes.json();

      const blob = await fetch(result.assets[0].uri).then((r) => r.blob());
      await fetch(data.uploadUrl, { method: 'PUT', headers: { 'Content-Type': 'image/jpeg' }, body: blob });
      setPhotoUrl(data.objectKey);
    } catch { /* photo upload not critical */ }
  };

  const handleSave = async () => {
    if (!isValid || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        fullName: fullName.trim(),
        searchBarangay,
        employmentType,
      };
      if (companyName) body.companyName = companyName;
      if (photoUrl) body.profilePhotoUrl = photoUrl;

      const res = await fetch(`${API_URL}/api/tenants/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save');
      }

      router.replace('/(onboarding)/verify-id' as never);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 24, fontFamily: 'AlteHaasGrotesk', color: '#050505' }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 18, fontFamily: 'BerlinSansFB', color: '#050505', marginLeft: 12 }}>
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
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={{ width: 80, height: 80 }} />
            ) : (
              <Text style={{ fontSize: 32, fontFamily: 'AlteHaasGrotesk', color: '#8A8D91' }}>📷</Text>
            )}
          </View>
          <View style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGrotesk', fontSize: 14 }}>📷</Text>
          </View>
        </Pressable>
        <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B', textAlign: 'center', marginBottom: 24 }}>
          Tap to take a selfie
        </Text>

        {/* Full Name */}
        <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#050505', marginBottom: 4 }}>
          Full name <Text style={{ color: '#E41E3F' }}>*</Text>
        </Text>
        <TextInput
          style={{ height: 48, borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8, paddingHorizontal: 12, fontSize: 16, fontFamily: 'AlteHaasGrotesk', marginBottom: 16, backgroundColor: '#FFFFFF' }}
          placeholder="Maria Santos"
          placeholderTextColor="#8A8D91"
          value={fullName}
          onChangeText={setFullName}
          editable={!isLoading}
        />

        {/* Search Barangay */}
        <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#050505', marginBottom: 4 }}>
          Where are you looking? <Text style={{ color: '#E41E3F' }}>*</Text>
        </Text>
        <Pressable
          onPress={() => setShowBarangayPicker(!showBarangayPicker)}
          style={{ height: 48, borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center', marginBottom: showBarangayPicker ? 0 : 16, backgroundColor: '#FFFFFF' }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGrotesk', color: searchBarangay ? '#050505' : '#8A8D91' }}>
            ▾ {searchBarangay || 'Select barangay'}
          </Text>
        </Pressable>
        {showBarangayPicker && (
          <View style={{ borderWidth: 1, borderColor: '#CED0D4', borderTopWidth: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 16, backgroundColor: '#FFFFFF' }}>
            {LAUNCH_BARANGAYS.map((b) => (
              <Pressable key={b} onPress={() => { setSearchBarangay(b); setShowBarangayPicker(false); }} style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: searchBarangay === b ? '#DBEAFE' : '#FFFFFF' }}>
                <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGrotesk', color: '#050505' }}>{b}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Employment Type Chips */}
        <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#050505', marginBottom: 8 }}>
          What is your job? <Text style={{ color: '#E41E3F' }}>*</Text>
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {EMPLOYMENT_TYPES.map((type) => (
            <Pressable
              key={type.value}
              onPress={() => { setEmploymentType(type.value); setCompanyName(''); }}
              style={{
                height: 40, paddingHorizontal: 16, borderRadius: 20,
                backgroundColor: employmentType === type.value ? '#2563EB' : '#E4E6EB',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: employmentType === type.value ? '#FFFFFF' : '#374151' }}>
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Company Name (conditional) */}
        {showCompanyField && (
          <>
            <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#050505', marginBottom: 4 }}>
              {employmentType === 'student' ? 'School name' : 'Company name'}
            </Text>
            <TextInput
              style={{ height: 48, borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8, paddingHorizontal: 12, fontSize: 16, fontFamily: 'AlteHaasGrotesk', marginBottom: showSuggestions && employmentType === 'bpo' && filteredCompanies.length > 0 ? 0 : 16, backgroundColor: '#FFFFFF' }}
              placeholder={employmentType === 'bpo' ? 'e.g., Concentrix' : employmentType === 'student' ? 'e.g., PUP' : 'e.g., Company Inc.'}
              placeholderTextColor="#8A8D91"
              value={companyName}
              onChangeText={(t) => { setCompanyName(t); setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              editable={!isLoading}
            />
            {showSuggestions && employmentType === 'bpo' && filteredCompanies.length > 0 && (
              <View style={{ borderWidth: 1, borderColor: '#CED0D4', borderTopWidth: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 16, backgroundColor: '#FFFFFF', maxHeight: 200 }}>
                <FlatList
                  data={filteredCompanies}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => { setCompanyName(item); setShowSuggestions(false); }} style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
                      <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGrotesk', color: '#050505' }}>{item}</Text>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </>
        )}

        {error && (
          <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#E41E3F', textAlign: 'center', marginBottom: 16 }}>{error}</Text>
        )}

        {/* CTA */}
        <Pressable
          onPress={handleSave}
          disabled={!isValid || isLoading}
          style={{
            width: '100%', height: 48, backgroundColor: '#2563EB', borderRadius: 8,
            alignItems: 'center', justifyContent: 'center',
            opacity: !isValid || isLoading ? 0.5 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold', fontSize: 16 }}>SAVE PROFILE</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
