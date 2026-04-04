import { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const ID_TYPES = [
  { value: 'philsys', label: 'PhilSys National ID' },
  { value: 'umid', label: 'UMID' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'passport', label: 'Passport' },
  { value: 'voters_id', label: "Voter's ID" },
  { value: 'prc_id', label: 'PRC ID' },
  { value: 'postal_id', label: 'Postal ID' },
] as const;

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export default function GovernmentIDUploadScreen() {
  const router = useRouter();
  const [idType, setIdType] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const consentAtRef = useRef<string | null>(null);
  const [idPhotoUri, setIdPhotoUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [idObjectKey, setIdObjectKey] = useState<string | null>(null);
  const [selfieObjectKey, setSelfieObjectKey] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);

  const canTakeIdPhoto = consentChecked && idType !== null;
  const canTakeSelfie = idPhotoUri !== null;
  const canSubmit = idObjectKey !== null && selfieObjectKey !== null;

  const handleConsentToggle = () => {
    const newVal = !consentChecked;
    setConsentChecked(newVal);
    if (newVal && !consentAtRef.current) {
      consentAtRef.current = new Date().toISOString();
    }
  };

  const uploadToPrivateBucket = async (uri: string, docType: string): Promise<string> => {
    // Get presigned URL for PRIVATE verification bucket
    const presignRes = await fetch(`${API_URL}/api/storage/presigned-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bucket: 'verification',
        contentType: 'image/jpeg',
      }),
    });

    if (!presignRes.ok) throw new Error('Failed to get upload URL');
    const { data } = await presignRes.json();

    // Upload to R2 PRIVATE bucket
    const blob = await fetch(uri).then((r) => r.blob());
    const uploadRes = await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: blob,
    });

    if (!uploadRes.ok) throw new Error('Upload failed');
    return data.objectKey;
  };

  const handleTakeIdPhoto = async () => {
    if (!canTakeIdPhoto) return;

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
    setIdPhotoUri(result.assets[0].uri);
    setUploadError(false);

    // Upload immediately
    try {
      setIsUploading(true);
      setUploadProgress(15);
      const key = await uploadToPrivateBucket(result.assets[0].uri, 'gov_id');
      setIdObjectKey(key);
      setUploadProgress(50);
    } catch {
      setUploadError(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTakeSelfie = async () => {
    if (!canTakeSelfie) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
      cameraType: ImagePicker.CameraType.front,
    });

    if (result.canceled || !result.assets[0]) return;
    setSelfieUri(result.assets[0].uri);
    setUploadError(false);

    // Upload immediately
    try {
      setIsUploading(true);
      setUploadProgress(65);
      const key = await uploadToPrivateBucket(result.assets[0].uri, 'selfie');
      setSelfieObjectKey(key);
      setUploadProgress(100);
    } catch {
      setUploadError(true);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit || !idType || !consentAtRef.current || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Determine which endpoint based on user role
      // For now, try landlord first, then tenant
      const res = await fetch(`${API_URL}/api/landlords/verify/id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idType,
          r2ObjectKey: idObjectKey,
          selfieR2Key: selfieObjectKey,
          consentAt: consentAtRef.current,
        }),
      });

      if (res.status === 403) {
        // Try tenant endpoint
        const tenantRes = await fetch(`${API_URL}/api/tenants/verify/id`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idType,
            r2ObjectKey: idObjectKey,
            selfieR2Key: selfieObjectKey,
            consentAt: consentAtRef.current,
          }),
        });
        if (!tenantRes.ok) throw new Error('Submit failed');
      } else if (!res.ok) {
        throw new Error('Submit failed');
      }

      setIsComplete(true);
    } catch {
      setUploadError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-submit when both uploads complete
  if (canSubmit && !isComplete && !isSubmitting && !uploadError) {
    handleSubmit();
  }

  if (isComplete) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#16A34A',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 32 }}>✓</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#1A1A2E', textAlign: 'center' }}>
            Uploaded!
          </Text>
          <Text style={{ fontSize: 16, color: '#6B7280', textAlign: 'center', marginTop: 8 }}>
            Under review — 24-48 hours.
          </Text>
          <Pressable
            onPress={() => router.replace('/(onboarding)/submitted' as never)}
            style={{
              marginTop: 32,
              width: '100%',
              height: 48,
              backgroundColor: '#2B51E3',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>CONTINUE</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
        <Pressable onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 24, color: '#1A1A2E' }}>←</Text>
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1A2E', marginLeft: 12 }}>
          Verify your ID
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress bar */}
        <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Step 1 of 3</Text>
        <View style={{ height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, marginBottom: 20 }}>
          <View style={{ width: '33%', height: 4, backgroundColor: '#2B51E3', borderRadius: 2 }} />
        </View>

        {/* Info card */}
        <Pressable
          onPress={() => setInfoExpanded(!infoExpanded)}
          style={{
            backgroundColor: '#EFF6FF',
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#1A1A2E' }}>
            ℹ️ Why is this needed?
          </Text>
          {infoExpanded && (
            <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>
              To confirm you are the real person who registered. We will never show your ID to anyone else.
            </Text>
          )}
        </Pressable>

        {/* ID Type Radio List */}
        <Text style={{ fontSize: 14, fontWeight: '500', color: '#1A1A2E', marginBottom: 8 }}>
          What type of ID? <Text style={{ color: '#DC2626' }}>*</Text>
        </Text>
        {ID_TYPES.map((type) => (
          <Pressable
            key={type.value}
            onPress={() => setIdType(type.value)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 48,
              gap: 12,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: idType === type.value ? '#2B51E3' : '#D1D5DB',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {idType === type.value && (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#2B51E3' }} />
              )}
            </View>
            <Text style={{ fontSize: 16, color: '#1A1A2E' }}>{type.label}</Text>
          </Pressable>
        ))}

        {/* PDPA Consent Checkbox */}
        <Pressable
          onPress={handleConsentToggle}
          style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 16, marginBottom: 20 }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: consentChecked ? '#2B51E3' : '#D1D5DB',
              backgroundColor: consentChecked ? '#2B51E3' : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 2,
            }}
          >
            {consentChecked && (
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>✓</Text>
            )}
          </View>
          <Text style={{ fontSize: 14, color: '#6B7280', flex: 1 }}>
            I agree to store my government ID for verification.{' '}
            <Text style={{ color: '#2B51E3', textDecorationLine: 'underline' }}>
              Read the Privacy Policy
            </Text>
            .
          </Text>
        </Pressable>

        {/* CTA 1: Take Photo of ID */}
        <Pressable
          onPress={handleTakeIdPhoto}
          disabled={!canTakeIdPhoto || isUploading}
          style={{
            width: '100%',
            height: 48,
            backgroundColor: '#2B51E3',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !canTakeIdPhoto || isUploading ? 0.5 : 1,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
            📷 TAKE PHOTO OF ID
          </Text>
        </Pressable>

        {/* ID Photo Preview */}
        {idPhotoUri && (
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16, alignItems: 'center' }}>
            <Image
              source={{ uri: idPhotoUri }}
              style={{
                width: 120,
                height: 80,
                borderRadius: 8,
                borderWidth: uploadError && !idObjectKey ? 2 : 0,
                borderColor: '#EF4444',
              }}
            />
            <Pressable onPress={handleTakeIdPhoto}>
              <Text style={{ fontSize: 14, color: '#2B51E3' }}>Retake</Text>
            </Pressable>
          </View>
        )}

        {/* CTA 2: Take Selfie (only after ID captured) */}
        {idPhotoUri && (
          <Pressable
            onPress={handleTakeSelfie}
            disabled={!canTakeSelfie || isUploading}
            style={{
              width: '100%',
              height: 48,
              backgroundColor: '#2B51E3',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: !canTakeSelfie || isUploading ? 0.5 : 1,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>
              📷 TAKE SELFIE
            </Text>
          </Pressable>
        )}

        {/* Selfie Preview */}
        {selfieUri && (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image
              source={{ uri: selfieUri }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          </View>
        )}

        {/* Upload Progress */}
        {(isUploading || isSubmitting) && (
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>
              {isSubmitting ? 'Submitting...' : 'Uploading...'}
            </Text>
            <View style={{ height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 }}>
              <View
                style={{
                  width: `${uploadProgress}%`,
                  height: 8,
                  backgroundColor: '#2B51E3',
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        )}

        {/* Upload Error */}
        {uploadError && (
          <Pressable onPress={idObjectKey ? handleTakeSelfie : handleTakeIdPhoto}>
            <Text style={{ fontSize: 14, color: '#DC2626', textAlign: 'center', marginTop: 16 }}>
              Upload failed. Try again?
            </Text>
          </Pressable>
        )}

        {/* Skip */}
        <Pressable
          onPress={() => router.replace('/(onboarding)/submitted' as never)}
          style={{ marginTop: 24, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 14, color: '#6B7280', textDecorationLine: 'underline' }}>
            Skip for now — i-verify later
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
