import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  // Magic link expired or invalid — redirect to /auth/expired
  if (error || errorCode === "otp_expired") {
    return NextResponse.redirect(`${origin}/auth/expired`);
  }

  if (code) {
    const supabase = createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      const safeNext = next.startsWith("/") ? next : "/dashboard";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Fallback: treat as expired
  return NextResponse.redirect(`${origin}/auth/expired`);
}
