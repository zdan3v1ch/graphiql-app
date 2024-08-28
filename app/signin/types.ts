import { AuthErrorCodes } from '@firebase/auth';
import { AuthError } from 'next-auth';

export type FirebaseAuthErrorCode =
  (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes];
export type AuthErrorType =
  | typeof AuthError.prototype.type
  | FirebaseAuthErrorCode;
