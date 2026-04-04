import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export function NetworkBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!(state.isConnected && state.isInternetReachable !== false));
    });
    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <View
      style={{
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 16,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}
      accessibilityLabel="No internet connection"
      accessibilityRole="alert"
    >
      <Text style={{ fontSize: 16 }}>📡</Text>
      <Text style={{ fontSize: 14, color: '#92400E', flex: 1 }}>
        No internet. Check your connection.
      </Text>
    </View>
  );
}
