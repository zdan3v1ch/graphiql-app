import { AuthErrorCodes } from '@firebase/auth';
import { FirebaseAuthErrorCode } from '@/lib/firestore/types';

export const ErrorMessagesByType: {
  [key in FirebaseAuthErrorCode | 'default']?: string;
} = {
  default: 'Something went wrong.',
  [AuthErrorCodes.EMAIL_EXISTS]:
    'The email you have entered is already in use.',
};
