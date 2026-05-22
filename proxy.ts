import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./server/auth";
import { routing } from "./shared/i18n/routing";

const intlMiddleware = createMiddleware(routing);
type AppLocale = (typeof routing.locales)[number];

const localeSet = new Set<AppLocale>(routing.locales);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const response = intlMiddleware(request);

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const segments = pathname.split("/").filter(Boolean);
  const localeSegment = segments[0];
  const locale: AppLocale = localeSet.has(localeSegment as AppLocale)
    ? (localeSegment as AppLocale)
    : routing.defaultLocale;
  const isLocaleRoot = segments.length === 1 && localeSet.has(locale);

  const isAuthRoute =
    pathname.includes("/login") ||
    pathname.includes("/signup") ||
    pathname.includes("/forgot-password") ||
    pathname.includes("/reset-password") ||
    pathname.includes("/verify-email");
  const isProtectedRoute = !isAuthRoute && pathname !== "/" && !isLocaleRoot;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
