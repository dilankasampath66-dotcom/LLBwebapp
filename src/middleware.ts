import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isPublicRoute = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'].includes(nextUrl.pathname);
  
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isPublicRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  // Role based access control for protected routes
  const path = nextUrl.pathname;

  if (path.startsWith('/tutor')) {
    if (user?.role !== 'TUTOR' || user?.tutorStatus !== 'APPROVED') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  if (path.startsWith('/admin')) {
    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  if (path.startsWith('/superadmin')) {
    if (user?.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
