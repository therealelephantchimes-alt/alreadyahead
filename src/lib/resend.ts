import { Resend } from "resend";
import { tokenForEmail } from "@/app/api/unsubscribe/route";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL || "Cole Ashford <hello@alreadyahead.net>";

export async function sendWelcomeEmail(to: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alreadyahead.net";
  const pricingUrl = `${siteUrl}/pricing`;

  const email = to.toLowerCase().trim();
  const token = tokenForEmail(email);
  const unsubUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;

  const text = `You're in.

Most people treat AI like a search engine.
They ask a question, get an answer, and move on.
That works, but it leaves most of the value on the table.

The real advantage comes from structuring your thinking clearly and using AI as a system.

If you want to go deeper into that, you can get full access here:
${pricingUrl}

— Cole

---
You're receiving this because you subscribed at alreadyahead.net.
Unsubscribe: ${unsubUrl}`;

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#FAFAF7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111;line-height:1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAF7;padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
            <tr><td style="padding-bottom:28px;">
              <p style="margin:0;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#6B6B66;">Already Ahead</p>
            </td></tr>
            <tr><td>
              <p style="font-size:20px;margin:0 0 24px 0;"><strong>You're in.</strong></p>
              <p style="margin:0 0 16px 0;">Most people treat AI like a search engine.</p>
              <p style="margin:0 0 16px 0;">They ask a question, get an answer, and move on.</p>
              <p style="margin:0 0 24px 0;">That works, but it leaves most of the value on the table.</p>
              <p style="margin:0 0 24px 0;">The real advantage comes from structuring your thinking clearly and using AI as a system.</p>
              <p style="margin:0 0 28px 0;">If you want to go deeper into that, you can get full access here:</p>
              <p style="margin:0 0 32px 0;">
                <a href="${pricingUrl}" style="display:inline-block;background:#111;color:#FAFAF7;padding:12px 20px;text-decoration:none;font-weight:600;">Get the Already Ahead System &rarr;</a>
              </p>
              <p style="margin:0;color:#6B6B66;">&mdash; Cole</p>
            </td></tr>
            <tr><td style="padding-top:40px;">
              <hr style="border:0;border-top:1px solid #E5E2DA;margin:0 0 24px 0;">
              <p style="font-size:12px;color:#6B6B66;margin:0 0 8px 0;">
                You're receiving this because you subscribed at alreadyahead.net.
              </p>
              <p style="font-size:12px;color:#6B6B66;margin:0;">
                <a href="${unsubUrl}" style="color:#6B6B66;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Start here",
    text,
    html,
    headers: {
      // RFC 8058 — enables Gmail/Yahoo's one-click unsubscribe button in the inbox
      "List-Unsubscribe": `<${unsubUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}