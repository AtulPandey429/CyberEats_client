import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/orders', '/checkout', '/profile', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const hasAuth = request.cookies.get('cybereats_auth')?.value === '1';
  if (!hasAuth) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/orders/:path*', '/checkout/:path*', '/profile/:path*', '/admin/:path*'],
};
