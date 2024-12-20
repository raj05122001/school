import { NextResponse } from "next/server";
import { isExpired } from "react-jwt";
import { decodeToken } from "react-jwt";

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  let origin = req.nextUrl.origin;
  const token = req.cookies.get("REFRESH_TOKEN");
  const userDetails = decodeToken(token?.value);
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
    } else if (
      pathname === "/" ||
      pathname.includes("/registration") ||
      pathname.includes("/forget-password") ||
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
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.bmp|.*\\.ico|.*\\.tiff).*)",
  ],
};

