import { View, Text, Pressable } from 'react-native';

interface EmptyStateViewProps {
  icon: string;
  headline: string;
  body: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
  ctaVariant?: 'primary' | 'secondary';
}

export function EmptyStateView({
  icon,
  headline,
  body,
  ctaLabel,
  onCtaPress,
  ctaVariant = 'primary',
}: EmptyStateViewProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>{icon}</Text>
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1A2E', textAlign: 'center' }}>
        {headline}
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
        {body}
      </Text>
      {ctaLabel && onCtaPress && (
        <Pressable
          onPress={onCtaPress}
          style={{
            marginTop: 24,
            height: 48,
            paddingHorizontal: 24,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            ...(ctaVariant === 'primary'
              ? { backgroundColor: '#2B51E3' }
              : { borderWidth: 1, borderColor: '#2B51E3' }),
          }}
        >
          <Text style={{
            fontWeight: '600',
            fontSize: 16,
            color: ctaVariant === 'primary' ? '#FFFFFF' : '#2B51E3',
          }}>
            {ctaLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
