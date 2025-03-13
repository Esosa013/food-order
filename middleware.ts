import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Update this to match route patterns, not just exact paths
const publicRoutes = ["/auth"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const pathname = req.nextUrl.pathname;

  // Check if the current path starts with any of the public routes
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};