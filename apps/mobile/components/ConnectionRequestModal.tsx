import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

interface ConnectionRequestModalProps {
  visible: boolean;
  onClose: () => void;
  listingId: string;
  landlordName: string;
  onSuccess: () => void;
}

export function ConnectionRequestModal({
  visible,
  onClose,
  listingId,
  landlordName,
  onSuccess,
}: ConnectionRequestModalProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/connections/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          message: message.trim() || undefined,
        }),
      });

      if (res.status === 403) {
        const data = await res.json();
        setError(data.code === 'NOT_VERIFIED' ? 'Verify your profile first.' : data.error);
        return;
      }
      if (res.status === 409) {
        setError('You already sent a request for this listing.');
        return;
      }
      if (!res.ok) throw new Error('Failed to send');

      onSuccess();
      onClose();
      setMessage('');
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingBottom: 32,
          }}
        >
          {/* Drag handle */}
          <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#CED0D4' }} />
          </View>

          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <Text style={{ fontSize: 20, fontFamily: 'NotoSansOsage', color: '#050505', marginBottom: 16 }}>
              Introduce yourself
            </Text>

            <TextInput
              style={{
                height: 96,
                borderWidth: 0,
                borderRadius: 12,
                padding: 12,
                fontSize: 16,
                fontFamily: 'NotoSansOsage',
                textAlignVertical: 'top',
                backgroundColor: '#E4E6EB',
              }}
              multiline
              maxLength={200}
              placeholder="Hi! I'm a BPO worker in Ortigas..."
              placeholderTextColor="#8A8D91"
              value={message}
              onChangeText={setMessage}
              editable={!isSubmitting}
            />
            <Text style={{ fontSize: 12, fontFamily: 'NotoSansOsage', color: '#65676B', textAlign: 'right', marginTop: 4 }}>
              {message.length}/200
            </Text>

            {error && (
              <Text style={{ fontSize: 14, fontFamily: 'NotoSansOsage', color: '#E41E3F', textAlign: 'center', marginTop: 8 }}>
                {error}
              </Text>
            )}

            <Pressable
              onPress={handleSend}
              disabled={isSubmitting}
              style={{
                height: 48,
                backgroundColor: '#2563EB',
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 16,
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={{ color: '#FFFFFF', fontFamily: 'NotoSansOsage', fontSize: 16 }}>
                  SEND REQUEST
                </Text>
              )}
            </Pressable>

            <Text style={{ fontSize: 12, fontFamily: 'NotoSansOsage', color: '#65676B', textAlign: 'center', marginTop: 12 }}>
              The landlord will see your verified profile along with your message.
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
