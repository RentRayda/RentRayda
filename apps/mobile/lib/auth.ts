import { createAuthClient } from 'better-auth/client';
import { expoClient } from '@better-auth/expo/client';
import { phoneNumberClient } from 'better-auth/client/plugins';
import { magicLinkClient } from 'better-auth/client/plugins';
import { passkeyClient } from '@better-auth/passkey/client';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: 'rentrayda',
      storagePrefix: 'rentrayda',
      storage: SecureStore,
    }),
    phoneNumberClient(),
    magicLinkClient(),
    passkeyClient(),
  ],
});
