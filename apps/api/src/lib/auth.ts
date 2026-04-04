import { betterAuth } from 'better-auth';
import { phoneNumber } from 'better-auth/plugins';
import { bearer } from 'better-auth/plugins';
import { expo } from '@better-auth/expo';
import { Pool } from 'pg';
import { sendOTP } from './sms';

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
