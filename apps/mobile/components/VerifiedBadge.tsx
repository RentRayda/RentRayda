import { View, Text, Pressable } from 'react-native';

interface VerifiedBadgeProps {
  status: 'verified' | 'pending' | 'unverified' | 'rejected';
  showBpoSubBadge?: boolean;
  size?: 'sm' | 'md';
  onPress?: () => void;
}

const BADGE_CONFIG = {
  verified: {
    bg: '#DCFCE7',
    border: '#86EFAC',
    icon: '✓',
    iconColor: '#16A34A',
    label: 'Verified ✓',
    textColor: '#16A34A',
    a11yLabel: 'Verification status: Verified',
  },
  pending: {
    bg: '#FEF3C7',
    border: '#FCD34D',
    icon: '⏳',
    iconColor: '#92400E',
    label: 'Under review',
    textColor: '#92400E',
    a11yLabel: 'Verification status: Under review',
  },
  unverified: {
    bg: '#F3F4F6',
    border: '#D1D5DB',
    icon: '○',
    iconColor: '#6B7280',
    label: 'Not verified',
    textColor: '#6B7280',
    a11yLabel: 'Verification status: Not verified',
  },
  rejected: {
    bg: '#FEE2E2',
    border: '#FCA5A5',
    icon: '✕',
    iconColor: '#DC2626',
    label: 'Not approved',
    textColor: '#DC2626',
    a11yLabel: 'Verification status: Not approved',
  },
} as const;

export function VerifiedBadge({ status, showBpoSubBadge, size = 'md', onPress }: VerifiedBadgeProps) {
  const config = BADGE_CONFIG[status];
  const height = size === 'sm' ? 24 : 28;
  const fontSize = 11;
  const iconSize = size === 'sm' ? 12 : 16;

  const badge = (
    <View>
      <View
        style={{
          height,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 14,
          borderWidth: 1,
          backgroundColor: config.bg,
          borderColor: config.border,
          alignSelf: 'flex-start',
        }}
        accessibilityLabel={config.a11yLabel}
        accessibilityRole={onPress ? 'button' : 'text'}
      >
        <Text style={{ fontSize: iconSize, color: config.iconColor }}>{config.icon}</Text>
        <Text style={{ fontSize, fontWeight: '500', color: config.textColor }}>{config.label}</Text>
      </View>

      {showBpoSubBadge && status === 'verified' && (
        <View
          style={{
            height: 22,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 11,
            borderWidth: 1,
            backgroundColor: '#DBEAFE',
            borderColor: '#93C5FD',
            alignSelf: 'flex-start',
            marginTop: 4,
          }}
          accessibilityLabel="Employment verified: BPO"
        >
          <Text style={{ fontSize: 12, color: '#1E40AF' }}>💼</Text>
          <Text style={{ fontSize: 10, fontWeight: '500', color: '#1E40AF' }}>BPO ✓</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={{ minWidth: 48, minHeight: 48, justifyContent: 'center' }}
        accessibilityHint="Tap to view verification details"
      >
        {badge}
      </Pressable>
    );
  }

  return badge;
}
