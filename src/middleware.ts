import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyJwt } from "@/lib/auth-edge"

const protectedPaths = ["/", "/users", "/analytics", "/settings"]
const publicPaths = ["/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  if (protectedPaths.some((p) => pathname === p || pathname.startsWith(p))) {
    const token = request.cookies.get("session")?.value
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    const user = await verifyJwt(token)
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
