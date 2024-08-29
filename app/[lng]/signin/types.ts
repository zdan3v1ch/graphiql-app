import { AuthError } from 'next-auth';
import { FirebaseAuthErrorCode } from '@/lib/firestore/types';

export type AuthErrorType =
  | typeof AuthError.prototype.type
  | FirebaseAuthErrorCode;
