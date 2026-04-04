import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type RoleOption = 'landlord' | 'tenant';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selectedRole || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      // Role assignment happens via the verify-otp endpoint on first login
      // For now, navigate to the appropriate onboarding flow
      if (selectedRole === 'landlord') {
        router.replace('/(onboarding)/landlord-profile' as never);
      } else {
        router.replace('/(onboarding)/tenant-profile' as never);
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const RoleCard = ({
    role,
    emoji,
    title,
    description,
  }: {
    role: RoleOption;
    emoji: string;
    title: string;
    description: string;
  }) => {
    const isSelected = selectedRole === role;
    return (
      <Pressable
        onPress={() => setSelectedRole(role)}
        disabled={isLoading}
        style={{
          height: 120,
          borderWidth: 2,
          borderColor: isSelected ? '#2B51E3' : '#E5E7EB',
          backgroundColor: isSelected ? '#EBF0FC' : '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Text style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</Text>
        <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1A2E' }}>
          {title}
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
          {description}
        </Text>
        {isSelected && (
          <View
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#2B51E3',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>✓</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '600',
            color: '#1A1A2E',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          What are you looking for?
        </Text>

        <RoleCard
          role="landlord"
          emoji="🏠"
          title="I'm renting out a place"
          description="I have a unit for rent"
        />

        <View style={{ height: 16 }} />

        <RoleCard
          role="tenant"
          emoji="🔍"
          title="Looking for a rental"
          description="I want to find an apartment or room"
        />

        {error && (
          <Text style={{ fontSize: 14, color: '#DC2626', textAlign: 'center', marginTop: 16 }}>
            {error}
          </Text>
        )}

        {/* CTA */}
        <Pressable
          onPress={handleContinue}
          disabled={!selectedRole || isLoading}
          style={{
            marginTop: 32,
            width: '100%',
            height: 48,
            backgroundColor: '#2B51E3',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !selectedRole || isLoading ? 0.5 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16 }}>CONTINUE</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
