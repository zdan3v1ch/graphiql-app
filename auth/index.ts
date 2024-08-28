import NextAuth, { NextAuthConfig } from 'next-auth';
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
  pages: {
    signIn: '/signin',
  },
  ...authConfig,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
