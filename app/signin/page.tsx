import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { FirebaseError } from '@firebase/util';

import { signIn, auth } from '@/auth';
import type { SignInData } from '@/auth/schema';

import LoginForm from './components/LoginForm';
import { ErrorMessagesByType } from './constants';
import { AuthErrorType, FirebaseAuthErrorCode } from './types';

interface Props {
  searchParams: {
    callbackUrl?: string;
    error?: AuthErrorType;
  };
}

const SignIn: React.FC<Props> = async ({ searchParams }) => {
  const { callbackUrl, error: errorType } = searchParams;
  const error =
    errorType &&
    (ErrorMessagesByType[errorType] ?? ErrorMessagesByType.default);
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
      <LoginForm error={error} onSubmit={handleFormSubmit} />
    </SessionProvider>
  );
};

export default SignIn;
