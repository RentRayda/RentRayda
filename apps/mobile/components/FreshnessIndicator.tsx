import { Text } from 'react-native';

interface FreshnessIndicatorProps {
  lastActiveAt: string;
}

export function FreshnessIndicator({ lastActiveAt }: FreshnessIndicatorProps) {
  const diff = Date.now() - new Date(lastActiveAt).getTime();
  const hours = diff / (1000 * 60 * 60);
  const days = hours / 24;

  let label: string;
  let color: string;

  if (hours < 24) {
    label = '🟢 Active today';
    color = '#16A34A';
  } else if (hours < 48) {
    label = '🟢 Yesterday';
    color = '#16A34A';
  } else if (days < 7) {
    label = `🟡 ${Math.floor(days)} days ago`;
    color = '#D97706';
  } else if (days < 14) {
    label = `🟡 ${Math.floor(days / 7)} week(s) ago`;
    color = '#D97706';
  } else {
    label = '🔴 Not active';
    color = '#DC2626';
  }

  return (
    <Text style={{ fontSize: 12, color, marginTop: 8 }}>
      {label}
    </Text>
  );
}
