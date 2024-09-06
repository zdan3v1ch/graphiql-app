import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { FirebaseError } from '@firebase/util';

import { signIn } from '@/auth';
import type { SignInData } from '@/auth/schema';
import { FirebaseAuthErrorCode } from '@/lib/firestore/types';
import { initI18n } from '@/app/i18n/i18n';
import { Params } from '@/app/i18n/data/i18n.interface';
import { Namespaces } from '@/app/i18n/data/i18n.enum';

import LoginForm from './components/LoginForm';
import { ErrorMessagesByType } from './constants';
import { AuthErrorType } from './types';

interface Props {
  params: Params;
  searchParams: {
    callbackUrl?: string;
    error?: AuthErrorType;
  };
}

const SignIn: React.FC<Props> = async ({ params, searchParams }) => {
  const language = params.lng;
  const ns = Namespaces.ERRORS;
  const { t } = await initI18n({ language, namespaces: ns });
  const { callbackUrl, error: errorType } = searchParams;
  const error =
    errorType &&
    t(
      `signIn.${ErrorMessagesByType[errorType] ?? ErrorMessagesByType.default!}`,
      { ns }
    );

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
