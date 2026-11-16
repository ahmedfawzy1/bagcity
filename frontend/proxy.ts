import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const authPages = ['/login', '/signup', '/forgot-password'];

const localePattern = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`);

function stripLocale(pathname: string): string {
  return pathname.replace(localePattern, '') || '/';
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = stripLocale(pathname);

  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authPages.includes(pathWithoutLocale)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip api, _next, _vercel, and any path with a file extension
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
