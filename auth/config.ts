import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { logInWithEmailAndPassword } from '@/lib/firestore/service';
import { signInSchema } from './schema';

export default {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = await signInSchema.parseAsync(credentials);

        return await logInWithEmailAndPassword(email, password);
      },
    }),
  ],
} satisfies NextAuthConfig;
