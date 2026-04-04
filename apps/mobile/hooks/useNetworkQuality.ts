import { useState, useEffect } from 'react';
import NetInfo, { NetInfoStateType } from '@react-native-community/netinfo';

type NetworkQuality = 'fast' | 'slow' | 'offline';

export function useNetworkQuality(): NetworkQuality {
  const [quality, setQuality] = useState<NetworkQuality>('fast');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setQuality('offline');
      } else if (
        state.type === NetInfoStateType.cellular &&
        state.details &&
        'cellularGeneration' in state.details &&
        (state.details.cellularGeneration === '2g' || state.details.cellularGeneration === '3g')
      ) {
        setQuality('slow');
      } else {
        setQuality('fast');
      }
    });
    return () => unsubscribe();
  }, []);

  return quality;
}
