import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Use "export default" here
export default function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/console') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/console/:path*'],
};