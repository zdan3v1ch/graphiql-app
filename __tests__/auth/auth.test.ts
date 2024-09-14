import { Account } from 'next-auth';

import { authOptions } from '@/auth';
import { AdapterUser } from '@auth/core/adapters';

jest.mock('next-auth', () =>
  jest.fn().mockImplementation(() => ({
    handlers: jest.fn(),
    auth: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  }))
);
jest.mock('@auth/firebase-adapter', () => ({
  FirestoreAdapter: jest.fn(),
}));
jest.mock('@/lib/firestore', () => jest.fn());
jest.mock('@/auth/config', () => ({}));

const mockDateNow = jest
  .spyOn(Date, 'now')
  .mockImplementation(() => 1000000000000) as jest.Mock;

describe('authOptions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('callbacks', () => {
    describe('jwt', () => {
      it('should add accessToken and expiration if account and user exist', () => {
        const token = {};
        const user = { id: '1' };
        const account = { access_token: 'access_token_123' } as Account;

        const callbacks = authOptions.callbacks!;
        const jwt = callbacks.jwt!;

        const result = jwt({
          token,
          user,
          account,
        }) as {
          accessToken: string;
          expiration: number;
        };

        expect(result?.accessToken).toBe('access_token_123');
        expect(result?.expiration).toBe(
          Math.floor(mockDateNow() / 1000) + 60 * 60 * 24
        );
      });
    });

    describe('session', () => {
      it('should correctly modify the session with accessToken and expires', () => {
        const token = {
          accessToken: 'access_token_123',
          expiration: Math.floor(mockDateNow() / 1000) + 10000,
        };

        const callbacks = authOptions.callbacks!;
        const session = callbacks.session!;

        const result = session({
          session: {
            user: {} as AdapterUser,
            sessionToken: 'token',
            userId: '123',
            expires: Date.now() as unknown as Date & string,
          },
          token,
          user: {} as AdapterUser,
          newSession: {},
        }) as unknown as {
          accessToken: string;
          expires: number;
        };

        expect(result.accessToken).toBe('access_token_123');
        expect(result.expires).toBe(
          new Date(token.expiration * 1000).toISOString()
        );
      });
    });
  });
});
