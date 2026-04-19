import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/resend";
import { posthogServer } from "@/lib/posthog";

const bodySchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(64).default("homepage"),
});

export async function POST(request: NextRequest) {
  let payload;
  try {
    payload = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = payload.email.toLowerCase().trim();
  const source = payload.source;

  const supabase = createAdminClient();

  // Save capture (idempotent — duplicates from the same email are fine to record for analytics)
  const { error: dbError } = await supabase.from("email_captures").insert({
    email,
    source,
  });

  if (dbError) {
    console.error("email_captures insert error", dbError);
    return NextResponse.json(
      { error: "Could not save your email. Please try again." },
      { status: 500 },
    );
  }

  // Send welcome email (do not fail the request if email sending fails — the capture is saved)
  try {
    await sendWelcomeEmail(email);
  } catch (err) {
    console.error("welcome email send failed", err);
    // Swallow — the user is saved. We'd rather show success than block them.
  }

  // Server-side analytics
  try {
    const ph = posthogServer();
    if (ph) {
      ph.capture({
        distinctId: email,
        event: "email_captured",
        properties: { source },
      });
      await ph.shutdown();
    }
  } catch {}

  return NextResponse.json({ ok: true });
}
