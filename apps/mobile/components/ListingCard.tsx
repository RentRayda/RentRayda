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
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      {/* Photo — expo-image with caching + blurhash */}
      <View style={{ position: 'relative' }}>
        {thumbnailUrl ? (
          <OptimizedImage
            uri={thumbnailUrl}
            style={{ width: '100%', height: 208 }}
          />
        ) : (
          <View style={{ width: '100%', height: 208, backgroundColor: '#CED0D4', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 32, color: '#8A8D91' }}>🏠</Text>
          </View>
        )}

        {/* Save/heart button overlay */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, color: '#65676B' }}>♡</Text>
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#050505' }}>
          ₱{monthlyRent.toLocaleString()}/month
        </Text>
        <Text style={{ fontSize: 14, color: '#65676B', marginTop: 4 }}>
          {typeLabel} · {barangay}, {city}
        </Text>

        {/* Seller row with avatar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#E4E6EB',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 10, color: '#65676B' }}>👤</Text>
          </View>
          <VerifiedBadge status="verified" size="sm" />
          <Text style={{ fontSize: 12, color: '#65676B' }}>{landlordName}</Text>
        </View>

        <FreshnessIndicator lastActiveAt={lastActiveAt} />
      </View>
    </Pressable>
  );
}
