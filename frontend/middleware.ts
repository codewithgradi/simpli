import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  // Check for either cookie name so it never fails due to naming
  const token =
    request.cookies.get("jwt")?.value ||
    request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/console") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/console/:path*"],
};
