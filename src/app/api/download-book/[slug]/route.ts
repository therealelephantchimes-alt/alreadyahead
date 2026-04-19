import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";

const BOOKS: Record<string, { storagePath: string; filename: string }> = {
  "already-ahead": {
    storagePath: "books/already-ahead.pdf",
    filename: "Already-Ahead.pdf",
  },
  "the-prompt-is-the-product": {
    storagePath: "books/the-prompt-is-the-product.pdf",
    filename: "The-Prompt-Is-The-Product.pdf",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const ctx = await getCurrentUser();
  if (!ctx) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!ctx.activeTier) {
    return NextResponse.json(
      { error: "An active subscription is required." },
      { status: 403 },
    );
  }

  const book = BOOKS[params.slug];
  if (!book) {
    return NextResponse.json({ error: "Book not found." }, { status: 404 });
  }

  // Generate a short-lived signed URL from Supabase Storage
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from("protected")
    .createSignedUrl(book.storagePath, 60, { download: book.filename });

  if (error || !data?.signedUrl) {
    console.error("signed url error", error);
    return NextResponse.json(
      { error: "Could not generate download link." },
      { status: 500 },
    );
  }

  return NextResponse.redirect(data.signedUrl, { status: 302 });
}
