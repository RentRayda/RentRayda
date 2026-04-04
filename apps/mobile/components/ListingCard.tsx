import { View, Text, Pressable } from 'react-native';
import { FreshnessIndicator } from './FreshnessIndicator';
import { VerifiedBadge } from './VerifiedBadge';
import { OptimizedImage } from './OptimizedImage';

interface ListingCardProps {
  id: string;
  thumbnailUrl: string | null;
  monthlyRent: number;
  unitType: 'bedspace' | 'room' | 'apartment';
  barangay: string;
  city: string;
  landlordName: string;
  verificationStatus: string;
  lastActiveAt: string;
  onPress: () => void;
}

export function ListingCard({
  thumbnailUrl,
  monthlyRent,
  unitType,
  barangay,
  city,
  landlordName,
  lastActiveAt,
  onPress,
}: ListingCardProps) {
  const typeLabel = unitType.charAt(0).toUpperCase() + unitType.slice(1);

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      {/* Photo — expo-image with caching + blurhash */}
      {thumbnailUrl ? (
        <OptimizedImage
          uri={thumbnailUrl}
          style={{ width: '100%', height: 192 }}
        />
      ) : (
        <View style={{ width: '100%', height: 192, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 32, color: '#9CA3AF' }}>🏠</Text>
        </View>
      )}

      {/* Content */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#2B51E3' }}>
          ₱{monthlyRent.toLocaleString()}/month
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
          {typeLabel} · {barangay}, {city}
        </Text>

        {/* Verified Badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <VerifiedBadge status="verified" size="sm" />
          <Text style={{ fontSize: 12, color: '#6B7280' }}>{landlordName}</Text>
        </View>

        <FreshnessIndicator lastActiveAt={lastActiveAt} />
      </View>
    </Pressable>
  );
}
