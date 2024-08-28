import { redirect } from 'next/navigation';

import { registerWithEmailAndPassword } from '@/lib/firestore/service';
import type { RegisterData } from '@/lib/firestore/schema';

import RegisterForm from './components/RegisterForm';
import { FirebaseAuthErrorCode } from '@/lib/firestore/types';
import { FirebaseError } from '@firebase/util';
import { ErrorMessagesByType } from './constants';

interface Props {
  searchParams: {
    error?: FirebaseAuthErrorCode;
    registeredEmail?: string;
  };
}

const Register: React.FC<Props> = ({ searchParams }) => {
  const { registeredEmail, error: errorType } = searchParams;
  const error =
    errorType &&
    (ErrorMessagesByType[errorType] ?? ErrorMessagesByType.default);

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
