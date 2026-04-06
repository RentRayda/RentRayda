import { Redirect } from 'expo-router';
import { USE_MOCK_DATA } from '../lib/mock-data';

export default function Index() {
  // MOCK MODE: skip auth, go straight to tabs
  if (USE_MOCK_DATA) {
    return <Redirect href="/(tabs)/search" />;
  }

  // TODO: Check auth state and redirect accordingly
  return <Redirect href="/(auth)/phone" />;
}
