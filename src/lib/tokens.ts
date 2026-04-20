import crypto from "crypto";

/**
 * Generates a stable hash of an email for use in unsubscribe links.
 * This is used so we can give people a link that identifies their email
 * without putting their raw email in the URL.
 *
 * The hash is deterministic — the same email always produces the same token.
 * It requires SUPABASE_SERVICE_ROLE_KEY as a secret so outsiders can't
 * generate valid tokens for arbitrary emails.
 */
export function tokenForEmail(email: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return crypto
    .createHmac("sha256", secret)
    .update(email.toLowerCase().trim())
    .digest("hex")
    .slice(0, 32);
}