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

const UNIT_TYPES = ['bedspace', 'room', 'apartment'] as const;
const UNIT_LABELS: Record<string, string> = { bedspace: 'Bedspace', room: 'Room', apartment: 'Apart.' };

const INCLUSIONS = [
  { value: 'water', label: 'Tubig', },
  { value: 'electricity', label: 'Kuryente' },
  { value: 'wifi', label: 'WiFi' },
  { value: 'cr', label: 'CR' },
  { value: 'aircon', label: 'Aircon' },
  { value: 'parking', label: 'Parking' },
] as const;

const LAUNCH_BARANGAYS = ['Ugong', 'San Antonio', 'Kapitolyo', 'Oranbo', 'Boni', 'Shaw'] as const;

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function ListingCreateScreen() {
  const router = useRouter();
  const [unitType, setUnitType] = useState<string | null>(null);
  const [monthlyRent, setMonthlyRent] = useState('');
  const [barangay, setBarangay] = useState('');
  const [showBarangayPicker, setShowBarangayPicker] = useState(false);
  const [selectedInclusions, setSelectedInclusions] = useState<string[]>([]);
  const [beds, setBeds] = useState(1);
  const [advanceMonths, setAdvanceMonths] = useState(1);
  const [depositMonths, setDepositMonths] = useState(2);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<{ uri: string; objectKey?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rentNum = parseInt(monthlyRent.replace(/,/g, ''), 10) || 0;
  const isValid = unitType && rentNum >= 500 && barangay.length > 0;

  const toggleInclusion = (value: string) => {
    setSelectedInclusions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const formatRent = (text: string) => {
    const digits = text.replace(/\D/g, '');
    if (!digits) { setMonthlyRent(''); return; }
    const num = parseInt(digits, 10);
    setMonthlyRent(num.toLocaleString('en-PH'));
  };

  const handleAddPhotos = async () => {
    if (photos.length >= 5) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      allowsMultipleSelection: true,
      selectionLimit: 5 - photos.length,
    });

    if (result.canceled || !result.assets.length) return;

    const newPhotos = result.assets.map((a) => ({ uri: a.uri }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 5));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPhoto = async (uri: string): Promise<string> => {
    const presignRes = await fetch(`${API_URL}/api/storage/presigned-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bucket: 'listings', contentType: 'image/jpeg' }),
    });
    if (!presignRes.ok) throw new Error('Failed to get upload URL');
    const { data } = await presignRes.json();

    const blob = await fetch(uri).then((r) => r.blob());
    const uploadRes = await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: blob,
    });
    if (!uploadRes.ok) throw new Error('Upload failed');
    return data.objectKey;
  };

  const handlePublish = async () => {
    if (!isValid || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      // Upload photos to PUBLIC R2 bucket
      const uploadedKeys: string[] = [];
      for (const photo of photos) {
        if (photo.objectKey) {
          uploadedKeys.push(photo.objectKey);
        } else {
          const key = await uploadPhoto(photo.uri);
          uploadedKeys.push(key);
        }
      }

      // Create listing
      const res = await fetch(`${API_URL}/api/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitType,
          monthlyRent: rentNum,
          barangay,
          beds,
          inclusions: selectedInclusions,
          description: description || undefined,
          advanceMonths,
          depositMonths,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create listing');
      }

      const { data } = await res.json();

      // Add photos to listing
      for (let i = 0; i < uploadedKeys.length; i++) {
        await fetch(`${API_URL}/api/listings/${data.id}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ r2ObjectKey: uploadedKeys[i], displayOrder: i }),
        });
      }

      router.back();
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
          <Text style={{ fontSize: 24, color: '#050505' }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#050505', marginLeft: 12 }}>
          Create a Listing
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Unit Type Chips */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#050505', marginBottom: 8 }}>
          What type of unit? <Text style={{ color: '#E41E3F' }}>*</Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {UNIT_TYPES.map((type) => (
            <Pressable
              key={type}
              onPress={() => setUnitType(type)}
              style={{
                height: 40,
                paddingHorizontal: 16,
                borderRadius: 20,
                backgroundColor: unitType === type ? '#2563EB' : '#E4E6EB',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: unitType === type ? '#FFFFFF' : '#374151' }}>
                {UNIT_LABELS[type]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Monthly Rent */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#050505', marginBottom: 4 }}>
          How much is the rent? <Text style={{ color: '#E41E3F' }}>*</Text> P
        </Text>
        <TextInput
          style={{
            height: 48, borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8,
            paddingHorizontal: 12, fontSize: 16, marginBottom: 16, backgroundColor: '#FFFFFF',
          }}
          keyboardType="number-pad"
          placeholder="5,000"
          placeholderTextColor="#8A8D91"
          value={monthlyRent}
          onChangeText={formatRent}
          editable={!isLoading}
        />

        {/* Barangay */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#050505', marginBottom: 4 }}>
          Where is the unit? <Text style={{ color: '#E41E3F' }}>*</Text>
        </Text>
        <Pressable
          onPress={() => setShowBarangayPicker(!showBarangayPicker)}
          style={{
            height: 48, borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8,
            paddingHorizontal: 12, justifyContent: 'center',
            marginBottom: showBarangayPicker ? 0 : 16, backgroundColor: '#FFFFFF',
          }}
        >
          <Text style={{ fontSize: 16, color: barangay ? '#050505' : '#8A8D91' }}>
            {barangay || 'Select barangay'}
          </Text>
        </Pressable>
        {showBarangayPicker && (
          <View style={{ borderWidth: 1, borderColor: '#CED0D4', borderTopWidth: 0, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginBottom: 16, backgroundColor: '#FFFFFF' }}>
            {LAUNCH_BARANGAYS.map((b) => (
              <Pressable
                key={b}
                onPress={() => { setBarangay(b); setShowBarangayPicker(false); }}
                style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: barangay === b ? '#DBEAFE' : '#FFFFFF' }}
              >
                <Text style={{ fontSize: 16, color: '#050505' }}>{b}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Inclusions */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#050505', marginBottom: 8 }}>
          Included in rent:
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {INCLUSIONS.map((inc) => {
            const selected = selectedInclusions.includes(inc.value);
            return (
              <Pressable
                key={inc.value}
                onPress={() => toggleInclusion(inc.value)}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  height: 40, paddingHorizontal: 12, borderRadius: 8,
                  borderWidth: 1, borderColor: selected ? '#2563EB' : '#CED0D4',
                  backgroundColor: selected ? '#DBEAFE' : '#FFFFFF',
                }}
              >
                <Text style={{ fontSize: 14 }}>{inc.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Beds Stepper */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#050505', marginBottom: 4 }}>
          How many beds/rooms?
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <View style={{ width: 48, height: 48, borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>{beds}</Text>
          </View>
          <Pressable onPress={() => setBeds(Math.max(1, beds - 1))} disabled={beds <= 1} style={{ marginLeft: 12, width: 40, height: 40, borderRadius: 8, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>-</Text>
          </Pressable>
          <Pressable onPress={() => setBeds(Math.min(20, beds + 1))} disabled={beds >= 20} style={{ marginLeft: 8, width: 40, height: 40, borderRadius: 8, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>+</Text>
          </Pressable>
        </View>

        {/* Advance & Deposit */}
        <View style={{ flexDirection: 'row', gap: 24, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#050505', marginBottom: 4 }}>Advance (months)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>{advanceMonths}</Text>
              </View>
              <Pressable onPress={() => setAdvanceMonths(Math.max(0, advanceMonths - 1))} style={{ marginLeft: 8, width: 32, height: 32, borderRadius: 6, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>-</Text>
              </Pressable>
              <Pressable onPress={() => setAdvanceMonths(Math.min(6, advanceMonths + 1))} style={{ marginLeft: 4, width: 32, height: 32, borderRadius: 6, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: '#050505', marginBottom: 4 }}>Deposit (months)</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>{depositMonths}</Text>
              </View>
              <Pressable onPress={() => setDepositMonths(Math.max(0, depositMonths - 1))} style={{ marginLeft: 8, width: 32, height: 32, borderRadius: 6, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>-</Text>
              </Pressable>
              <Pressable onPress={() => setDepositMonths(Math.min(6, depositMonths + 1))} style={{ marginLeft: 4, width: 32, height: 32, borderRadius: 6, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#050505', marginBottom: 4 }}>
          Description (optional)
        </Text>
        <TextInput
          style={{
            height: 96, borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8,
            paddingHorizontal: 12, paddingTop: 12, fontSize: 16, marginBottom: 4,
            backgroundColor: '#FFFFFF', textAlignVertical: 'top',
          }}
          multiline
          maxLength={200}
          placeholder="Describe your unit..."
          placeholderTextColor="#8A8D91"
          value={description}
          onChangeText={setDescription}
          editable={!isLoading}
        />
        <Text style={{ fontSize: 12, color: '#65676B', textAlign: 'right', marginBottom: 16 }}>
          {description.length}/200
        </Text>

        {/* Photos */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#050505', marginBottom: 8 }}>
          Photos (1-5)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {photos.map((photo, i) => (
              <Pressable key={i} onPress={() => removePhoto(i)}>
                <Image source={{ uri: photo.uri }} style={{ width: 80, height: 80, borderRadius: 8 }} />
                <View style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: 10, backgroundColor: '#E41E3F', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>x</Text>
                </View>
              </Pressable>
            ))}
            {photos.length < 5 && (
              <Pressable
                onPress={handleAddPhotos}
                style={{
                  width: 80, height: 80, borderRadius: 8,
                  borderWidth: 2, borderStyle: 'dashed', borderColor: '#CED0D4',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 24, color: '#8A8D91' }}>+</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>

        {error && (
          <Text style={{ fontSize: 14, color: '#E41E3F', textAlign: 'center', marginBottom: 16 }}>
            {error}
          </Text>
        )}

        {/* CTA */}
        <Pressable
          onPress={handlePublish}
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
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>PUBLISH</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
