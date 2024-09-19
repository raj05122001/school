import { NextResponse } from "next/server";
import { isExpired } from "react-jwt";

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  let origin = req.nextUrl.origin;
  const token = req.cookies.get("REFRESH_TOKEN");

  const host = req.headers.get("host");
  
  // Set origin dynamically based on the host (use care-insight domain in production)
  if (host.includes("vidya.ultimeet.io")) {
    origin = "https://vidya.ultimeet.io";
  }

  try {
    if (!token || !token?.value || isExpired(token?.value)) {
      if (
        pathname.includes("/registration") ||
        pathname.includes("/forget-password") ||
        pathname.includes("/login") ||
        pathname === "/"
      ) {
        return NextResponse.next();
      }
      const redirectTo = encodeURIComponent(`${pathname}?${searchParams.toString()}`);
      return NextResponse.redirect(new URL(`/login?redirectTo=${redirectTo}`, origin));
    }
    if (
      pathname.includes("/registration") ||
      pathname.includes("/forget-password") ||
      pathname.includes("/login")
    ) {
      return NextResponse.redirect(new URL("/", origin));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};
