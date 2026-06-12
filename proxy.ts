import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  const pathname = req.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isRegisterPage = pathname === "/admin/register";

  // Not logged in → protect admin routes
  if (
    isAdminRoute &&
    !isLoggedIn &&
    !isLoginPage &&
    !isRegisterPage
  ) {
    return NextResponse.redirect(
      new URL("/admin/login", req.url)
    );
  }

  // Already logged in → don't allow login/register page
  if (
    isLoggedIn &&
    (isLoginPage || isRegisterPage)
  ) {
    return NextResponse.redirect(
      new URL("/admin", req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};