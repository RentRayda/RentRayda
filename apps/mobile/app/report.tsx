import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

const REPORT_TYPES = [
  { value: 'fake_listing', label: 'Fake listing' },
  { value: 'scam_attempt', label: 'Scam attempt' },
  { value: 'identity_fraud', label: 'Identity fraud' },
  { value: 'other', label: 'Other' },
] as const;

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function ReportScreen() {
  const router = useRouter();
  const { userId, listingId } = useLocalSearchParams<{ userId?: string; listingId?: string }>();
  const [reportType, setReportType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reportType || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const body: Record<string, unknown> = { reportType };
      if (userId) body.reportedUserId = userId;
      if (listingId) body.reportedListingId = listingId;
      if (description.trim()) body.description = description.trim();

      const res = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to submit');

      router.back();
    } catch {
      setError('Could not submit. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 24, color: '#050505' }}>X</Text>
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '500', color: '#050505' }}>Report</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#050505', marginBottom: 12 }}>
          What is the problem?
        </Text>

        {/* Report Type Radio List */}
        {REPORT_TYPES.map((type) => (
          <Pressable
            key={type.value}
            onPress={() => setReportType(type.value)}
            style={{ flexDirection: 'row', alignItems: 'center', height: 48, gap: 12 }}
          >
            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: reportType === type.value ? '#E41E3F' : '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
              {reportType === type.value && (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#E41E3F' }} />
              )}
            </View>
            <Text style={{ fontSize: 16, color: '#050505' }}>{type.label}</Text>
          </Pressable>
        ))}

        {/* Description */}
        <Text style={{ fontSize: 16, fontWeight: '500', color: '#050505', marginTop: 16, marginBottom: 8 }}>
          Details (optional)
        </Text>
        <TextInput
          style={{
            height: 96, borderWidth: 1, borderColor: '#CED0D4', borderRadius: 8,
            padding: 12, fontSize: 16, textAlignVertical: 'top', backgroundColor: '#FFFFFF',
          }}
          multiline
          maxLength={500}
          placeholder="Describe the problem..."
          placeholderTextColor="#8A8D91"
          value={description}
          onChangeText={setDescription}
          editable={!isSubmitting}
        />

        {error && (
          <Text style={{ fontSize: 14, color: '#E41E3F', textAlign: 'center', marginTop: 12 }}>{error}</Text>
        )}

        {/* CTA */}
        <Pressable
          onPress={handleSubmit}
          disabled={!reportType || isSubmitting}
          style={{
            marginTop: 24, width: '100%', height: 48, backgroundColor: '#E41E3F',
            borderRadius: 8, alignItems: 'center', justifyContent: 'center',
            opacity: !reportType || isSubmitting ? 0.5 : 1,
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>SUBMIT REPORT</Text>
          )}
        </Pressable>

        <Text style={{ fontSize: 12, color: '#65676B', textAlign: 'center', marginTop: 16 }}>
          We will review this within 24 hours. Thank you for reporting.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
