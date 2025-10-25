import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

const routes = {
  account: '/account',
  login: '/login',
};

export const config = {
  matcher: ['/account/:path*', '/login'],
};

export function proxy(request: NextRequest) {
  // Check for authentication token
  const authToken = request.cookies.get('__Secure-better-auth.convex_jwt');

  // Redirect logged-in users away from login page
  if (authToken && request.nextUrl.pathname === routes.login) {
    return NextResponse.redirect(new URL(routes.account, request.url));
  }

  // Redirect to login if not authenticated trying to access protected routes
  if (!authToken && request.nextUrl.pathname.startsWith(routes.account)) {
    const loginUrl = new URL(routes.login, request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
