import { AuthErrorCodes } from '@firebase/auth';
import { AuthErrorType } from './types';

export const ErrorMessagesByType: {
  [key in AuthErrorType | 'default']?: string;
} = {
  default: 'default',
  CallbackRouteError: 'CallbackRouteError',
  [AuthErrorCodes.INVALID_LOGIN_CREDENTIALS]: 'auth/invalid-credential',
};
