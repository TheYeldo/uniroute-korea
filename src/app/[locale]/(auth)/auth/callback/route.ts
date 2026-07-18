import { getServerSupabase } from "@/lib/supabase/server";
import { isSafeRedirect } from "@/lib/validation/schemas";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const destination = isSafeRedirect(next, locale) ? next! : `/${locale}/dashboard`;
  if (code) {
    const supabase = await getServerSupabase();
    await supabase?.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL(destination, url.origin));
}
