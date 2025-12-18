import { NextResponse } from "next/server";
import { isExpired, decodeToken } from "react-jwt";

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  let origin = req.nextUrl.origin;
  const token = req.cookies.get("REFRESH_TOKEN");
  const userDetails = decodeToken(token?.value);
  const host = req.headers.get("host");

  if (host.includes("vidya.ultimeet.io")) {
    origin = "https://vidya.ultimeet.io";
  }

  try {
    // ---------- NOT LOGGED IN ----------
    if (!token || !token?.value || isExpired(token?.value)) {
      if (
        pathname.includes("/registration") ||
        pathname.includes("/forgot-password") ||
        pathname.includes("/login") ||
        pathname.includes("/terms-and-conditions") ||
        pathname.includes("/delete-account") ||
        pathname.includes("/privacy-policy") ||
        pathname.includes("/signup")
      ) {
        return NextResponse.next();
      }

      const redirectTo = encodeURIComponent(
        `${pathname}?${searchParams.toString()}`
      );

      return NextResponse.redirect(
        new URL(`/login?redirectTo=${redirectTo}`, origin)
      );
    }

    // ---------- LOGGED IN AND GOING TO /, /login, etc ----------
    else if (
      pathname === "/" ||
      pathname.includes("/registration") ||
      pathname.includes("/forgot-password") ||
      pathname.includes("/login") ||
      pathname.includes("/invite-accept")
    ) {
      if (userDetails?.role === "STUDENT" && token?.value && userDetails) {
        return NextResponse.redirect(new URL("/student/dashboard", origin));
      } else if (
        userDetails?.role === "TEACHER" &&
        token?.value &&
        userDetails
      ) {
        return NextResponse.redirect(new URL("/teacher/dashboard", origin));
      } else if (userDetails?.role === "ADMIN" && token?.value && userDetails) {
        return NextResponse.redirect(new URL("/admin/dashboard", origin));
      }
    }

    // ---------- BLOCK AUTH PAGES FOR LOGGED-IN USERS ----------
    if (
      pathname.includes("/registration") ||
      pathname.includes("/forgot-password") ||
      pathname.includes("/login")
    ) {
      return NextResponse.redirect(new URL("/", origin));
    }

    // ---------- NEW PART: STUDENT/TEACHER PATH AUTO-FIX ----------
    if (userDetails?.role === "TEACHER" && pathname.startsWith("/student")) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.replace(/^\/student/, "/teacher");
      return NextResponse.redirect(url);
    }

    if (userDetails?.role === "STUDENT" && pathname.startsWith("/teacher")) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.replace(/^\/teacher/, "/student");
      return NextResponse.redirect(url);
    }

    // ---------- DEFAULT ----------
    return NextResponse.next();
  } catch (error) {
    console.error("An error occurred:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.bmp|.*\\.ico|.*\\.tiff).*)",
  ],
};