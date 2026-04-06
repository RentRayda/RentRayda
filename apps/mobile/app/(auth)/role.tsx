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
    title,
    description,
  }: {
    role: RoleOption;
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
          borderColor: isSelected ? '#2563EB' : '#CED0D4',
          backgroundColor: isSelected ? '#DBEAFE' : '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Text style={{ fontSize: 16, fontFamily: 'AlteHaasGroteskBold', color: '#050505' }}>
          {title}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#65676B', marginTop: 2 }}>
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
              backgroundColor: '#2563EB',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontFamily: 'AlteHaasGroteskBold' }}>✓</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F2F5' }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: 'BobbyJonesSoft',
            color: '#050505',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          What are you looking for?
        </Text>

        <RoleCard
          role="landlord"
          title="I'm renting out a place"
          description="I have a unit for rent"
        />

        <View style={{ height: 16 }} />

        <RoleCard
          role="tenant"
          title="Looking for a rental"
          description="I want to find an apartment or room"
        />

        {error && (
          <Text style={{ fontSize: 14, fontFamily: 'AlteHaasGrotesk', color: '#E41E3F', textAlign: 'center', marginTop: 16 }}>
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
            backgroundColor: '#2563EB',
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !selectedRole || isLoading ? 0.5 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={{ color: '#FFFFFF', fontFamily: 'AlteHaasGroteskBold', fontSize: 16 }}>CONTINUE</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
