import type { Prompt } from "@/lib/types";

export const PROMPTS: Prompt[] = [
  {
    slug: "critical-first-draft",
    title: "The Critical First Draft",
    description:
      "Generate a first draft and its critique in one pass. Produces a usable draft plus a list of the three weakest parts to fix next.",
    tier: "tier_1",
    body: `You are a senior writer and a hard-to-impress editor working together.

CONTEXT
[Paste the background, audience, and purpose here. Include any existing notes, outlines, or source material.]

TASK
1. Write a first draft of [specific artifact: essay / memo / email / landing page / etc.] of approximately [word count] words.
2. Then switch roles. As the editor, list the three weakest parts of the draft you just wrote. Be specific about what is weak and why.
3. Do not revise the draft. Just surface the weaknesses.

CONSTRAINTS
- Voice: [calm, plain, confident] — no hype words, no adverbs where a stronger verb works.
- Reading level: [grade 8–10].
- Format: Draft first, then a clearly labeled "EDITOR'S NOTES" section with the three weaknesses as a numbered list.
- Do not ask clarifying questions. Make reasonable assumptions and state them at the top.`,
  },
  {
    slug: "decision-brief",
    title: "The Decision Brief",
    description:
      "Turn a tangled decision into a one-page brief. Forces the model to separate facts, assumptions, options, and recommendation.",
    tier: "tier_1",
    body: `You are a management consultant writing a one-page decision brief for a founder.

CONTEXT
The decision: [describe the decision being made in one sentence].
What is known: [bullet the facts you have].
What is unknown: [bullet the open questions].
The stakes: [what changes based on this decision].

TASK
Produce a one-page brief with exactly these four sections, in this order:

1. SITUATION — Three sentences. No adjectives. What is the decision and why is it being made now.
2. OPTIONS — Three distinct options, each with (a) a one-line description, (b) the strongest argument for, (c) the strongest argument against, (d) the cost of being wrong.
3. RECOMMENDATION — One option. Two sentences explaining why, anchored in the strongest argument from the OPTIONS section.
4. WHAT WOULD CHANGE YOUR MIND — Two specific facts that, if true, would flip the recommendation.

CONSTRAINTS
- Total length: under 400 words.
- No hedging language ("it depends," "both have merit," "further research needed").
- If you have to assume something to make the call, state the assumption in brackets inline.`,
  },
  {
    slug: "meeting-into-artifact",
    title: "Meeting Into Artifact",
    description:
      "Take raw meeting notes or a transcript and produce three different artifacts — a summary, a decisions log, and an action list.",
    tier: "tier_1",
    body: `You are a chief of staff processing raw meeting notes into three separate artifacts.

CONTEXT
The meeting was: [1 sentence — what, who, why].
Raw notes / transcript follows below the dashes.

---
[Paste raw notes or transcript here.]
---

TASK
Produce three separate artifacts, clearly labeled, in this order:

ARTIFACT 1 — SUMMARY (for people who were not there)
Five sentences. What was discussed, what was decided, what is still open, the next meaningful date, who owns the follow-up.

ARTIFACT 2 — DECISIONS LOG
A table with columns: Decision | Who made it | When it takes effect | What it rules out.
Only include decisions that were actually made. Do not include discussion points.

ARTIFACT 3 — ACTION LIST
One bullet per action. Format: [Owner] will [verb] [artifact] by [date].
If any of those four fields was not specified in the meeting, write "[unspecified]" so it is visible.

CONSTRAINTS
- Do not paraphrase the discussion — compress it.
- If something was implied but not said, mark it "(inferred)".
- If the notes contradict themselves, flag it: "(conflict — needs resolution)".`,
  },
];
