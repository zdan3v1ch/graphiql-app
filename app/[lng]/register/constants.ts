import { AuthErrorCodes } from '@firebase/auth';
import { FirebaseAuthErrorCode } from '@/lib/firestore/types';

export const ErrorMessagesByType: {
  [key in FirebaseAuthErrorCode | 'default']?: string;
} = {
  default: 'default',
  [AuthErrorCodes.EMAIL_EXISTS]: 'auth/email-already-in-use',
};
