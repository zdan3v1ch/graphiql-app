import { render, act } from '@testing-library/react';

import { signOut } from '@/auth/utils';

import SessionProvider from '@/app/[lng]/SessionProvider';

jest.mock('../auth/utils', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));

describe('SessionProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('calls signOut immediately if session is expired', () => {
    const expiredSession = {
      expires: new Date(Date.now() - 1000).toISOString(),
    };

    render(
      <SessionProvider session={expiredSession}>
        <div>Logged In</div>
      </SessionProvider>
    );

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(signOut).toHaveBeenCalled();
  });

  it('calls signOut after the session expires', () => {
    const validSession = {
      expires: new Date(Date.now() + 5000).toISOString(),
    };

    render(
      <SessionProvider session={validSession}>
        <div>Logged In</div>
      </SessionProvider>
    );

    expect(signOut).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(signOut).toHaveBeenCalled();
  });

  it('clears the timeout when the component is unmounted', () => {
    const validSession = {
      expires: new Date(Date.now() + 5000).toISOString(),
    };

    const { unmount } = render(
      <SessionProvider session={validSession}>
        <div>Logged In</div>
      </SessionProvider>
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    expect(signOut).not.toHaveBeenCalled();
  });
});
