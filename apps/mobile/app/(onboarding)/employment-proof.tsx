import { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const BPO_PROOF_TYPES = [
  { value: 'company_id', label: 'Company ID' },
  { value: 'payslip', label: 'Latest Payslip' },
  { value: 'coe', label: 'Certificate of Employment (COE)' },
];

const STUDENT_PROOF_TYPES = [
  { value: 'school_id', label: 'School ID + Enrollment Form' },
];

const OTHER_PROOF_TYPES = [
  { value: 'other_doc', label: 'Other document' },
];

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function EmploymentProofScreen() {
  const router = useRouter();
  const [proofType, setProofType] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const consentAtRef = useRef(new Date().toISOString());

  // TODO: get employmentType from profile/params. Default to showing all.
  const proofTypes = [...BPO_PROOF_TYPES, ...STUDENT_PROOF_TYPES, ...OTHER_PROOF_TYPES];

  const canTakePhoto = proofType !== null;

  const handleTakePhoto = async () => {
    if (!canTakePhoto) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Linking.openSettings();
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets[0]) return;
    setPhotoUri(result.assets[0].uri);
    setUploadError(false);

    // Upload to PRIVATE R2 bucket
    try {
      setIsUploading(true);
      setUploadProgress(20);

      const presignRes = await fetch(`${API_URL}/api/storage/presigned-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket: 'verification', contentType: 'image/jpeg' }),
      });
      if (!presignRes.ok) throw new Error('Failed to get upload URL');
      const { data } = await presignRes.json();

      setUploadProgress(50);

      const blob = await fetch(result.assets[0].uri).then((r) => r.blob());
      const uploadRes = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: blob,
      });
      if (!uploadRes.ok) throw new Error('Upload failed');

      setUploadProgress(80);

      // Submit to API
      const submitRes = await fetch(`${API_URL}/api/tenants/verify/employment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proofType,
          r2ObjectKey: data.objectKey,
          consentAt: consentAtRef.current,
        }),
      });
      if (!submitRes.ok) throw new Error('Submit failed');

      setUploadProgress(100);
      setIsComplete(true);
    } catch {
      setUploadError(true);
    } finally {
      setIsUploading(false);
    }
  };

  if (isComplete) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#31A24C', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 32 }}>✓</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#050505', textAlign: 'center' }}>
            Employment proof uploaded!
          </Text>
          <Text style={{ fontSize: 16, color: '#65676B', textAlign: 'center', marginTop: 8 }}>
            Under review — 24-48 hours.
          </Text>
          <Pressable
            onPress={() => router.replace('/(onboarding)/submitted' as never)}
            style={{ marginTop: 32, width: '100%', height: 48, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>CONTINUE</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 24, color: '#050505' }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#050505', marginLeft: 12 }}>
          Employment proof
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        {/* Progress bar */}
        <Text style={{ fontSize: 12, color: '#65676B', marginBottom: 4 }}>Step 2 of 2</Text>
        <View style={{ height: 4, backgroundColor: '#CED0D4', borderRadius: 2, marginBottom: 20 }}>
          <View style={{ width: '100%', height: 4, backgroundColor: '#2563EB', borderRadius: 2 }} />
        </View>

        {/* Instructions */}
        <Text style={{ fontSize: 16, color: '#65676B', marginBottom: 20, lineHeight: 24 }}>
          So landlords can see you have a job and are reliable.
        </Text>

        {/* Proof Type Radio List */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#050505', marginBottom: 8 }}>
          What type of proof? <Text style={{ color: '#E41E3F' }}>*</Text>
        </Text>
        {proofTypes.map((type) => (
          <Pressable
            key={type.value}
            onPress={() => setProofType(type.value)}
            style={{ flexDirection: 'row', alignItems: 'center', height: 48, gap: 12 }}
          >
            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: proofType === type.value ? '#2563EB' : '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
              {proofType === type.value && (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563EB' }} />
              )}
            </View>
            <Text style={{ fontSize: 16, color: '#050505' }}>{type.label}</Text>
          </Pressable>
        ))}

        {/* CTA: Take Photo */}
        <Pressable
          onPress={handleTakePhoto}
          disabled={!canTakePhoto || isUploading}
          style={{
            marginTop: 20, width: '100%', height: 48, backgroundColor: '#2563EB', borderRadius: 8,
            alignItems: 'center', justifyContent: 'center',
            opacity: !canTakePhoto || isUploading ? 0.5 : 1,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
            TAKE PHOTO OF DOCUMENT
          </Text>
        </Pressable>

        {/* Photo Preview */}
        {photoUri && (
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 16, alignItems: 'center' }}>
            <Image
              source={{ uri: photoUri }}
              style={{ width: 120, height: 80, borderRadius: 8, borderWidth: uploadError ? 2 : 0, borderColor: '#E41E3F' }}
            />
            <Pressable onPress={handleTakePhoto}>
              <Text style={{ fontSize: 14, color: '#2563EB' }}>Retake</Text>
            </Pressable>
          </View>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 14, color: '#65676B', marginBottom: 8 }}>Uploading...</Text>
            <View style={{ height: 8, backgroundColor: '#CED0D4', borderRadius: 4 }}>
              <View style={{ width: `${uploadProgress}%`, height: 8, backgroundColor: '#2563EB', borderRadius: 4 }} />
            </View>
          </View>
        )}

        {uploadError && (
          <Pressable onPress={handleTakePhoto}>
            <Text style={{ fontSize: 14, color: '#E41E3F', textAlign: 'center', marginTop: 16 }}>
              Upload failed. Try again?
            </Text>
          </Pressable>
        )}

        {/* Skip */}
        <Pressable
          onPress={() => router.replace('/(onboarding)/submitted' as never)}
          style={{ marginTop: 24, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 14, color: '#65676B', textDecorationLine: 'underline' }}>
            I don't have a document — skip for now
          </Text>
        </Pressable>

        {/* Warning */}
        <View style={{ marginTop: 12, backgroundColor: '#FFFBEB', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#FDE68A' }}>
          <Text style={{ fontSize: 12, color: '#92400E', lineHeight: 18 }}>
            If you skip this, you will not be able to connect with landlords.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
