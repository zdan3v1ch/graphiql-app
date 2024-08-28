import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { FirebaseError } from '@firebase/util';

import { signIn } from '@/auth';
import type { SignInData } from '@/auth/schema';

import LoginForm from './components/LoginForm';
import { ErrorMessagesByType } from './constants';
import { FirebaseAuthErrorCode } from '@/lib/firestore/types';
import { AuthErrorType } from './types';

interface Props {
  searchParams: {
    callbackUrl?: string;
    error?: AuthErrorType;
  };
}

const SignIn: React.FC<Props> = ({ searchParams }) => {
  const { callbackUrl, error: errorType } = searchParams;
  const error =
    errorType &&
    (ErrorMessagesByType[errorType] ?? ErrorMessagesByType.default);

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

  return <LoginForm error={error} onSubmit={handleFormSubmit} />;
};

export default SignIn;
