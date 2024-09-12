import NextAuth, { NextAuthConfig, Session } from 'next-auth';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import authConfig from './config';

import firestore from '@/lib/firestore';

export const BASE_PATH = '/api/auth';

export const authOptions: NextAuthConfig = {
  adapter: FirestoreAdapter(firestore),
  basePath: BASE_PATH,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // Expires in 24 hour
      }

      if (Date.now() / 1000 > (token.expiration as number)) {
        throw new Error('Token expired');
      }

      return token;
    },
    session({ session, token }) {
      const newSession = session as unknown as Session & {
        accessToken: string;
      };
      newSession.accessToken = token.accessToken as string;
      newSession.expires = new Date(
        (token.expiration as number) * 1000
      ).toISOString();

      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  ...authConfig,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
