import type { Workflow } from "@/lib/types";

export const WORKFLOWS: Workflow[] = [
  {
    slug: "three-pass-writing",
    title: "The Three-Pass Writing Workflow",
    description:
      "A repeatable system for turning a blank page into a finished piece. Uses three separate passes with three different roles — generator, editor, critic — to avoid the mush you get when one prompt tries to do all three at once.",
    tier: "tier_1",
    steps: [
      {
        heading: "Pass 1 — Generate five angles",
        detail: `Open a new chat. Use this prompt:

"You are a contrarian essayist known for finding the unexpected angle. Given the topic below, produce five distinct angles I could take. For each, give me the one-sentence thesis and the reader it would most land with. Rank them by which is least obvious.

Topic: [your topic]
Audience: [your audience]
Purpose: [inform / persuade / change behavior]"

Read the five angles. Pick one. Do not pick the one you would have picked without this step — pick the one that surprised you most.`,
      },
      {
        heading: "Pass 2 — Draft it fully",
        detail: `Same chat. Use this prompt:

"Now write angle #[N] as a full [word count]-word piece. Open with a concrete specific — a person, a number, an example — not a generalization. Close with a single sentence that earns the reader's next click."

Read the draft. Do not edit it yet. Move to Pass 3.`,
      },
      {
        heading: "Pass 3 — Critique, in a different chat",
        detail: `Open a new chat or switch models. Paste the draft. Use this prompt:

"You are a skeptical editor. Identify the three weakest parts of this draft. For each, explain what is weak, why a reader would disengage there, and what would make it stronger. Do not rewrite — just diagnose."

The separate chat matters. A fresh context is more honest than the one that just wrote the draft.`,
      },
      {
        heading: "Pass 4 — Fix only what Pass 3 flagged",
        detail: `Go back to the draft. Fix only the three things the critic identified. Do not start rewriting the whole thing — the urge will be strong.

If you find yourself wanting to change something the critic did not flag, stop. That is usually the sign that the draft is done and you are tinkering.`,
      },
      {
        heading: "Pass 5 — Read it out loud once",
        detail: `Read the final draft out loud, all the way through, without stopping. Your mouth will catch what your eyes skipped.

Anywhere you stumble, fix that sentence. Do not fix anything else. Ship it.`,
      },
    ],
  },
  {
    slug: "weekly-review",
    title: "The Weekly Review Workflow",
    description:
      "A 30-minute Friday system that turns a chaotic week into a clear picture of what happened, what's next, and what needs attention. Runs once. Scales with you.",
    tier: "tier_1",
    steps: [
      {
        heading: "Dump everything, unfiltered",
        detail: `Set a 5-minute timer. In one long list, write down everything that happened this week. Meetings, decisions, things that went well, things that went sideways, things you meant to do and did not, things on your mind.

Do not organize. Do not edit. Volume first.`,
      },
      {
        heading: "Hand it to the model",
        detail: `Paste the dump into a chat. Use this prompt:

"You are my chief of staff. Below is my raw dump from this week. Produce three things, clearly separated:

1. STATE OF PLAY — three sentences on where I actually am, based on what I wrote.
2. PATTERNS — anything that appears more than once, or anything noticeably missing (decisions avoided, people not mentioned who should be).
3. NEXT WEEK'S THREE PRIORITIES — the three things that, if I did them, would make the biggest difference.

Do not tell me I am doing great. Do not hedge. If something in my dump looks like avoidance, say so."`,
      },
      {
        heading: "Challenge the priorities",
        detail: `Read the three priorities. For each one, ask yourself: if this does not happen next week, what is the actual cost?

If the answer is "nothing much," cross it off. You are not trying to have three priorities. You are trying to have the right one.

Reply in the same chat: "Of those three, [X] has the highest real cost if it doesn't happen. Rewrite the week assuming [X] is the only thing that matters."`,
      },
      {
        heading: "Schedule the one thing",
        detail: `Before you close the chat, put the priority on your calendar as a specific time block on a specific day. Not "work on X." The actual verb: "Draft the Q3 memo — Tuesday 9-11 AM."

A priority without a calendar block is a wish.`,
      },
    ],
  },
];
