import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value

  const pathname = request.nextUrl.pathname

  // kalau belum login
  if (!role && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // ROLE PROTECTION

  // PEGAWAI
  if (role === "pegawai") {
    if (
      pathname.startsWith("/approver") ||
      pathname.startsWith("/master") ||
      pathname.startsWith("/members")
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // HRD
  if (role === "hrd") {
    if (
      pathname.startsWith("/approver/manager") ||
      pathname.startsWith("/approver/director") ||
      pathname.startsWith("/approver/finance")
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // MANAGER
  if (role === "manager") {
    if (
      pathname.startsWith("/approver/hrd") ||
      pathname.startsWith("/approver/director") ||
      pathname.startsWith("/approver/finance")
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // DIREKTUR
  if (role === "direktur") {
    if (
      pathname.startsWith("/approver/hrd") ||
      pathname.startsWith("/approver/manager") ||
      pathname.startsWith("/approver/finance")
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // FINANCE
  if (role === "finance") {
    if (
      pathname.startsWith("/approver/hrd") ||
      pathname.startsWith("/approver/manager") ||
      pathname.startsWith("/approver/director")
    ) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/petty-cash/:path*",
    "/loan/:path*",
    "/reports/:path*",
    "/approver/:path*",
    "/master/:path*",
    "/members/:path*",
    "/settings/:path*",
  ],
}