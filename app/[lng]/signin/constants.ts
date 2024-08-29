import { AuthErrorCodes } from '@firebase/auth';
import { AuthErrorType } from './types';

export const ErrorMessagesByType: {
  [key in AuthErrorType | 'default']?: string;
} = {
  default: 'Something went wrong.',
  CallbackRouteError: 'An error occurred during the authentication process.',
  [AuthErrorCodes.INVALID_LOGIN_CREDENTIALS]:
    'You have entered a wrong email or password.',
};
