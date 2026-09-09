import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  const isInventoryRoute =
    request.nextUrl.pathname.startsWith("/products") ||
    request.nextUrl.pathname.startsWith("/purchases") ||
    request.nextUrl.pathname.startsWith("/sales") ||
    request.nextUrl.pathname.startsWith("/users");

  const isLoginRoute = request.nextUrl.pathname.startsWith("/auth/login");

  if (isInventoryRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/products/:path*",
    "/purchases/:path*",
    "/sales/:path*",
    "/users/:path*",
    "/auth/login",
  ],
};
