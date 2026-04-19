import type { CaseStudy } from "@/lib/types";

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "founder-investor-update",
    title: "Turning a founder update from three hours to forty minutes",
    tier: "tier_2",
    context: `A first-time founder was spending a full afternoon each month writing the investor update. The drafts came out bloated, defensive about the hard numbers, and thin on the parts investors actually cared about. The ask was not "write it for me" — it was "build a system so I never dread this again."

Inputs used: one-line notes on what happened that month, the raw numbers (ARR, cash, headcount, churn), and a list of open asks. Outputs expected: a 400-word update that is direct, confident, and makes the ask land.`,
    input: `Prompt used (Tier 2 — the version with the critique pass built in):

"You are a seasoned seed investor who has read thousands of founder updates. You are also a writing coach. You are going to do two jobs back to back.

FIRST: Write a 400-word monthly investor update from the bullet points below. Structure: (1) the one thing that mattered most this month — a single sentence, (2) the numbers, stated plainly, (3) what went wrong and what we did about it, (4) what we're doing next month, (5) the ask — specific, one sentence.

Constraints: no adjectives where a verb works. No hedging. If a number is bad, say it is bad and say what we're doing. Never write 'exciting,' 'incredible,' or 'leveraging.'

SECOND: Switch roles. As the investor, score this update 1–10 on three axes: trust (does this founder sound honest), clarity (do I know what's going on in ninety seconds), and ask-ability (would I respond to the ask). For any score below 8, say exactly what would raise it.

BULLETS:
- ARR $47K MRR, up from $41K. Two churned, one small, one bigger ($2K).
- Shipped the onboarding rewrite. Activation up 18% week over week.
- Hired a second engineer, starts in two weeks.
- Cash runway: 11 months at current burn.
- Lost the enterprise deal we mentioned last month — they went with an incumbent.
- Ask: warm intros to VPs of RevOps at Series B SaaS companies, 100–400 FTE."`,
    output: `The system returned a draft that opened with "We crossed $47K MRR and lost the enterprise deal in the same week — both matter, and here is why." The update was 380 words, plainly stated the $2K churn, and named the specific reason they lost the enterprise deal.

The critique pass then scored its own draft: trust 9, clarity 8, ask-ability 6. The fix it suggested for ask-ability: "The ask says 'warm intros' but doesn't say what I should send the VP. Give me a one-line pitch I can forward."

The founder added that one line. The final update went out in forty minutes total, including the time to review the critique. Three of the seven investors replied with intros within a week. Before the system, the average response rate had been one reply per update.`,
    takeaway: `The leverage was not in the writing. The leverage was in making the model critique its own output with a different role — and then actually using the critique. Most people ask for a draft and stop there. The second pass is where the work becomes worth sending.`,
  },
];
