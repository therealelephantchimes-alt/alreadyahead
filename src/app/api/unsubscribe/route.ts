import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { tokenForEmail } from "@/lib/tokens";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.toLowerCase().trim();
  const token = searchParams.get("token");

  if (!email || !token) {
    return NextResponse.redirect(
      new URL("/unsubscribe?status=invalid", request.url),
    );
  }

  const expected = tokenForEmail(email);
  if (token !== expected) {
    return NextResponse.redirect(
      new URL("/unsubscribe?status=invalid", request.url),
    );
  }

  try {
    const admin = createAdminClient();
    await admin.from("email_captures").delete().eq("email", email);

    return NextResponse.redirect(
      new URL(
        `/unsubscribe?status=ok&email=${encodeURIComponent(email)}`,
        request.url,
      ),
    );
  } catch (err) {
    console.error("unsubscribe error", err);
    return NextResponse.redirect(
      new URL("/unsubscribe?status=error", request.url),
    );
  }
}

/**
 * POST is for the one-click unsubscribe header (RFC 8058).
 * Gmail and Yahoo use this for their "Unsubscribe" button in the inbox.
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.toLowerCase().trim();
  const token = searchParams.get("token");

  if (!email || !token) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const expected = tokenForEmail(email);
  if (token !== expected) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  try {
    const admin = createAdminClient();
    await admin.from("email_captures").delete().eq("email", email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("unsubscribe error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}