import NextAuth from 'next-auth';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import authConfig from '@/auth/config';

const { auth } = NextAuth(authConfig);

const protectedRoutes = ['/dashboard', '/profile'];
const unprotectedRoutes = ['/signin'];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtectedRoute = protectedRoutes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  if (!session && isProtectedRoute) {
    const absoluteURL = new URL(
      `/sign-in?callbackUrl=${request.nextUrl.href}`,
      request.nextUrl.origin
    );

    return NextResponse.redirect(absoluteURL.toString());
  }

  if (session && unprotectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL('/', request.nextUrl.origin);

    return NextResponse.redirect(absoluteURL.toString());
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
