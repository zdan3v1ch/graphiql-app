'use client';

import { Session } from 'next-auth';
import { useEffect } from 'react';
import { signOut } from '@/auth/utils';

interface Props {
  session: Session | null;
  children?: React.ReactNode;
}

const SessionProvider: React.FC<Props> = ({ session, children }) => {
  useEffect(() => {
    if (session) {
      const expirationTimestamp = new Date(session?.expires ?? 0).getTime();
      const currentTime = Date.now();

      const timeLeft = expirationTimestamp - currentTime;

      if (timeLeft <= 0) {
        const timer = setTimeout(() => {
          void (async () => {
            await signOut().catch();
          })();
        }, 0);

        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          void (async () => {
            await signOut().catch();
          })();
        }, timeLeft);

        return () => clearTimeout(timer);
      }
    }
  }, [session]);

  return children;
};

export default SessionProvider;
