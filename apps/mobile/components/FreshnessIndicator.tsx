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
    label = '• Active today';
    color = '#31A24C';
  } else if (hours < 48) {
    label = '• Yesterday';
    color = '#31A24C';
  } else if (days < 7) {
    label = `• ${Math.floor(days)} days ago`;
    color = '#F7B928';
  } else if (days < 14) {
    label = `• ${Math.floor(days / 7)} week(s) ago`;
    color = '#F7B928';
  } else {
    label = '• Not active';
    color = '#E41E3F';
  }

  return (
    <Text style={{ fontSize: 12, fontFamily: 'AlteHaasGrotesk', color, marginTop: 8 }}>
      {label}
    </Text>
  );
}
