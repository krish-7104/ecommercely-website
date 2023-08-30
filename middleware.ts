import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/register";

  const token = request.cookies.get("token")?.value || "";

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (token) {
    try {
      const decodedToken = jwt.verify(token, "your-secret-key");
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
}

export const config = {
  matcher: [
    "/login",
    "/order",
    "/order/:orderId*",
    "/settings",
    "/register",
    "/settings/myorders",
    "/settings/profile",
  ],
};
