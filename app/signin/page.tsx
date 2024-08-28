import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { FirebaseError } from '@firebase/util';

import { signIn, auth } from '@/auth';
import type { SignInData } from '@/auth/schema';

import LoginForm from './components/LoginForm';
import { AuthErrorType, FirebaseAuthErrorCode } from './types';

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

const SignIn: React.FC<Props> = async ({ searchParams }) => {
  const { callbackUrl } = searchParams;
  const session = await auth();

  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
    };
  }

  const handleFormSubmit = async ({ email, password }: SignInData) => {
    'use server';
    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: callbackUrl ?? '/',
      });
    } catch (error) {
      if (error instanceof AuthError) {
        const errorType: AuthErrorType =
          error.cause?.err instanceof FirebaseError
            ? (error.cause.err.code as FirebaseAuthErrorCode)
            : error.type;
        let signInErrorUrl = `signin?error=${errorType}`;

        if (callbackUrl) {
          signInErrorUrl += `&callbackUrl=${callbackUrl}`;
        }

        return redirect(signInErrorUrl);
      }

      throw error;
    }
  };

  return (
    <SessionProvider>
      <LoginForm onSubmit={handleFormSubmit} />
    </SessionProvider>
  );
};

export default SignIn;
