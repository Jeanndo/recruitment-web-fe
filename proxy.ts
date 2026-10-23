import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "brightcore_session";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isAdminPage =
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") && pathname !== "/admin/sign-in");

  if (isAdminPage && !request.cookies.has(SESSION_COOKIE)) {
    const signIn = new URL("/admin/sign-in", request.url);
    signIn.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
