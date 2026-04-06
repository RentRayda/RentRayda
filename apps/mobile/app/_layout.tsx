import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NetworkBanner } from '../components/NetworkBanner';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'BobbyJonesSoft': require('../assets/fonts/Bobby Jones Soft.otf'),
    'BerlinSansFB': require('../assets/fonts/Berlin Sans FB Regular.ttf'),
    'AlteHaasGrotesk': require('../assets/fonts/AlteHaasGroteskRegular.ttf'),
    'AlteHaasGroteskBold': require('../assets/fonts/AlteHaasGroteskBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F2F5' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <NetworkBanner />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" />
          <Stack.Screen name="report" options={{ presentation: 'modal' }} />
          <Stack.Screen name="connections" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}
