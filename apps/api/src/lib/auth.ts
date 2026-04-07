import { betterAuth } from 'better-auth';
import { phoneNumber, magicLink } from 'better-auth/plugins';
import { bearer } from 'better-auth/plugins';
import { expo } from '@better-auth/expo';
import { passkey } from '@better-auth/passkey';
import { Pool } from 'pg';
import { sendOTP } from './sms';
import { sendEmail } from './email';
import { magicLinkTemplate } from './magic-link-email';

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber: phone, code }) => {
        await sendOTP(phone, code);
      },
      signUpOnVerification: {
        getTempEmail: (phone) => `${phone}@rentrayda.local`,
        getTempName: (phone) => phone,
      },
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      allowedAttempts: 3,
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail(email, 'Sign in to RentRayda', magicLinkTemplate(url));
      },
      expiresIn: 600, // 10 minutes
    }),
    passkey({
      rpName: 'RentRayda',
      rpID: process.env.NODE_ENV === 'production' ? 'rentrayda.ph' : 'localhost',
      origin: process.env.NODE_ENV === 'production'
        ? ['https://rentrayda.ph', 'rentrayda://']
        : ['http://localhost:3000', 'http://localhost:3001', 'rentrayda://'],
    }),
    bearer(),
    expo(),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
  trustedOrigins: [
    'http://localhost:3000',
    'https://rentrayda.ph',
    'rentrayda://',
  ],
});
