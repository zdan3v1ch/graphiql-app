import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { FirebaseError } from '@firebase/util';

// import { signIn } from '@/auth';
// import type { SignInData } from '@/auth/schema';

import GraphqlForm, { GraphqlData } from './components/GraphqlForm';
import { ErrorMessagesByType } from '../signin/constants';
import { FirebaseAuthErrorCode } from '@/lib/firestore/types';
import { AuthErrorType } from '../signin/types';

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

  const handleFormSubmit = async ({ endpoint }: GraphqlData) => {
    'use server';
    try {
      await fetch('http:');
      console.log(endpoint);
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

  return <GraphqlForm error={error} onSubmit={handleFormSubmit} />;
};

export default SignIn;
