import { AuthErrorCodes } from '@firebase/auth';

export type FirebaseAuthErrorCode =
  (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes];
