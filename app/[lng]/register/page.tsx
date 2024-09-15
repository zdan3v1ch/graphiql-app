import { redirect } from 'next/navigation';

import { registerWithEmailAndPassword } from '@/lib/firestore/service';
import type { RegisterData } from '@/lib/firestore/schema';
import { FirebaseError } from '@firebase/util';
import { FirebaseAuthErrorCode } from '@/lib/firestore/types';
import { initI18n } from '@/app/i18n/i18n';
import { Params } from '@/app/i18n/data/i18n.interface';
import { Namespaces } from '@/app/i18n/data/i18n.enum';

import RegisterForm from './components/RegisterForm';
import { ErrorMessagesByType } from './constants';

interface Props {
  params: Params;
  searchParams: {
    error?: FirebaseAuthErrorCode;
    registeredEmail?: string;
  };
}

const Register: React.FC<Props> = async ({ params, searchParams }) => {
  const language = params.lng;
  const ns = Namespaces.ERRORS;
  const { t } = await initI18n({ language, namespaces: ns });
  const { registeredEmail, error: errorType } = searchParams;
  const error =
    errorType &&
    t(
      `signUp.${ErrorMessagesByType[errorType] ?? ErrorMessagesByType.default!}`,
      { ns }
    );

  const handleFormSubmit = async ({
    username,
    email,
    password,
  }: Omit<RegisterData, 'confirmPassword'>) => {
    'use server';
    try {
      await registerWithEmailAndPassword(username, email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorType = error.code as FirebaseAuthErrorCode;
        const registerErrorUrl = `register?error=${errorType}`;

        return redirect(registerErrorUrl);
      }

      throw error;
    }

    return redirect(`register?registeredEmail=${email}`);
  };

  return (
    <RegisterForm
      registeredEmail={registeredEmail}
      error={error}
      onSubmit={handleFormSubmit}
    />
  );
};

export default Register;
