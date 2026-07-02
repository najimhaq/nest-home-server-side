// backend - lib/auth.js
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prisma.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'TENANT',
        input: false, // signup form থেকে role পাঠানো যাবে না, নিরাপত্তার জন্য
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 din
    updateAge: 60 * 60 * 24, // proti din update hobe
  },

  trustedOrigins: ['http://localhost:3000'],

  advanced: {
    crossSubDomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
});
