import { getCurrentUser } from "@/lib/auth";
import { PortalButton } from "./PortalButton";

/**
 * Shows a banner at the top of every page if the user's subscription is
 * in a failed state (past_due / unpaid / incomplete). Links to Stripe
 * Customer Portal so they can update their payment method.
 */
export async function SubscriptionBanner() {
  let ctx = null;
  try {
    ctx = await getCurrentUser();
  } catch {
    return null;
  }
  if (!ctx || !ctx.subscription) return null;

  const bad = ["past_due", "unpaid", "incomplete"];
  if (!bad.includes(ctx.subscription.status)) return null;

  return (
    <div className="bg-danger text-paper text-sm">
      <div className="max-w-page mx-auto px-5 md:px-8 py-2.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span>Payment failed on your last renewal.</span>
        <PortalButton
          className="underline underline-offset-2 hover:no-underline font-medium"
          label="Update your payment method →"
        />
      </div>
    </div>
  );
}
