import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE_NAME, routing } from "./i18n/routing";

const handleInternationalization = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (!hasLocale) {
    const savedLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    const locale =
      savedLocale === "ru" || savedLocale === "en" ? savedLocale : routing.defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }
  return handleInternationalization(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
