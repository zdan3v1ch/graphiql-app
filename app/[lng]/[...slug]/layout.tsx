import React, { Suspense } from 'react';

import Loading from './loading';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
};

export default Layout;
