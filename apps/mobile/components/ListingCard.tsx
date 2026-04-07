import { View, Text, Pressable, Dimensions } from 'react-native';
import { OptimizedImage } from './OptimizedImage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 8;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

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
  lastActiveAt,
  onPress,
}: ListingCardProps) {
  const typeLabel = unitType.charAt(0).toUpperCase() + unitType.slice(1);

  // "Just listed" if lastActiveAt < 24hrs ago
  const hoursAgo = (Date.now() - new Date(lastActiveAt).getTime()) / (1000 * 60 * 60);
  const isJustListed = hoursAgo < 24;

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: CARD_WIDTH,
        marginBottom: 16,
      }}
    >
      {/* Photo — square aspect */}
      <View style={{ position: 'relative' }}>
        {thumbnailUrl ? (
          <OptimizedImage
            uri={thumbnailUrl}
            style={{
              width: CARD_WIDTH,
              height: CARD_WIDTH,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />
        ) : (
          <View
            style={{
              width: CARD_WIDTH,
              height: CARD_WIDTH,
              backgroundColor: '#E4E6EB',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 32, color: '#8A8D91' }}>🏠</Text>
          </View>
        )}

        {/* "Just listed" badge overlay */}
        {isJustListed && (
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: '#2563EB',
              borderRadius: 4,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ fontSize: 11, fontFamily: 'NotoSansOsage', color: '#FFFFFF' }}>
              Just listed
            </Text>
          </View>
        )}
      </View>

      {/* Text below photo */}
      <View style={{ paddingTop: 8, paddingHorizontal: 2 }}>
        <Text
          style={{ fontSize: 15, fontFamily: 'TANNimbus', color: '#050505' }}
          numberOfLines={1}
        >
          P{monthlyRent.toLocaleString()}/mo
        </Text>
        <Text
          style={{ fontSize: 13, fontFamily: 'NotoSansOsage', color: '#050505', marginTop: 2 }}
          numberOfLines={1}
        >
          {typeLabel} in {barangay}
        </Text>
        <Text
          style={{ fontSize: 12, fontFamily: 'NotoSansOsage', color: '#65676B', marginTop: 1 }}
          numberOfLines={1}
        >
          {city}
        </Text>
      </View>
    </Pressable>
  );
}

export { CARD_WIDTH, CARD_GAP, HORIZONTAL_PADDING };
