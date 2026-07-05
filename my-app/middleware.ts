import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

const publicAuthRoutes = ["/signin", "/signup"];
const protectedPrefix = "/dashboard";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("PATHNAME \n\n\n\n", pathname);
  const accessToken = request.cookies.get(AUTH_COOKIE)?.value;
  console.log("TOKENNNNN", accessToken);

  const isProtectedRoute = pathname.startsWith(protectedPrefix);
  const isPublicAuthRoute = publicAuthRoutes.includes(pathname);

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Already logged in → skip sign-in/sign-up
  if ((isPublicAuthRoute || !pathname) && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
