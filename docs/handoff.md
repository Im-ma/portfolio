# Corrections round 2: handoff

Branch: `corrections-round-2` (nothing committed, pushed, merged, or deployed). Lint, typecheck, and a production build all pass. `git diff` shows everything.

Open it locally: `npm run dev`, then http://localhost:3000.

## What changed

**Case studies (all four).** Rewritten from scratch to one shape: Overview, What I made, Decisions, Looking back. Much shorter (about 800 to 1,000 words including captions, down from roughly 1,400 to 2,300). Plain first person, no mono-label scaffolding (THE TENSION / WHAT I CHOSE / WHY).

- Dropped: the key takeaway quote, the scope inventory, the "How I built it" lists and collage (they were all stand-in images), the Impact section, the node IDs and screen numbers, and the empty "second flow" slots.
- Decisions are now two or three per study, each a claim heading, two short paragraphs, and one visual.
- New tinted panels: blue wraps the flow clip, yellow wraps a problem list (the audits in Campus Events and Campus Ride).
- Links with no URL no longer show as dead text. They come back when you add an `href`.
- Mimic's tools line no longer says "MediaPipe Hands (placeholder)". It now says hand tracking was built by your teammates and carries a CHECK asking which model they used.

**Lab.** Replaced eight thin tiles with four playable decisions from your case studies (Trace: delete or quarantine, Campus Ride: name your price, Mimic: pause or emergency stop with a Space bar shortcut, Campus Events: RSVP states), plus the three small experiments that are real parts of this site. Removed: filter chips, the dev note, stand-in screenshots, "Token playground", "Swipe for tonight", and "Hand cursor" (it listed MediaPipe but only followed a pointer, which was untrue).

**Home, About, Gatherings.** Rewrote the How I work steps and a few lead lines, shortened the About intro, and rewrote the Campus Events summary (it read like ad copy). The note wall now says the notes are examples until real ones arrive, which matches your own "say what is done and what is not" rule.

## Decisions I made (easy to veto)

| Open question                                            | What I chose                                                                                                                              |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Trace card tag                                           | Per project: Trace "Design + front end", Mimic "Design + engineering", Campus Events "Design + engineering", Campus Ride "Product design" |
| Campus Events name                                       | Keep "Campus Events", not "Linkup"                                                                                                        |
| Lab in nav and footer                                    | Keep both                                                                                                                                 |
| NVIDIA line in Trace                                     | Removed                                                                                                                                   |
| Trace decision 4 (the restyle)                           | Moved into Looking back as the contrast story, with the before and after image                                                            |
| Trace chip stacks, button labels, 404 copy, success copy | Treated as settled, CHECK markers cleared                                                                                                 |
| Lab content                                              | Four playable pieces, not eight tiles                                                                                                     |

## What I need from you

### Screen recordings (muted, 6 to 10 seconds, looping)

These replace or sit beside the single 12 second flow clip in each "What I made", and can go inside the Decisions as yellow (problem) and blue (solution) panels. Add them as `video` blocks inside a `panel` block (see README).

- **Trace (3 or 4):** filter, select, quarantine, revalidate. Restore that still blocks the batch. Assistant failure and retry.
- **Mimic (1 or 2):** live feed to gesture to emergency stop.
- **Campus Events (3):** discover to RSVP. The waitlist states. Organizer create to door scan.
- **Campus Ride (3):** destination to price to offers. "No drivers available" to raising the offer. The driver's incoming request.

### Photos

- A real portrait: hero and About (564 by 760 or larger, portrait). Currently a silhouette.
- Real gathering photos to replace the 10 stand-ins in `public/images/gatherings/` (used on Home, Gatherings, About, and in the Lab polaroid demo). People photos beat stock.
- Optional but strong, as in Rachel's pages: a photo of a friend trying Campus Ride or Campus Events on a phone, or a team photo from HackGT.

### Links (they stay hidden until you add them)

Figma files for all four, the Trace and Campus Events prototype links, the Trace working console, the Mimic code branch, the Campus Events v1 web app, the Cal.com link, and which resume version to publish.

### Fix in Figma

Campus Ride's map says Winston-Salem and Kannapolis in places, but the story is Salisbury. Campus Events also exists in two Figma files, so pick one as the source of truth.

### Your own words (this is what makes the copy sound like you)

I only used facts that were already in your files, so the pages are plainer and shorter, not more personal. The next step is a few real stories per project. Answer these out loud, roughly, and I will shape them.

- **Trace:** What first made you curious about bad training data? Which screen did you redo the most? What did the first person who saw it say?
- **Mimic:** What happened at the hackathon when the arm first followed your hand? What did you get wrong before the stop buttons?
- **Campus Events:** Which club or event made you want this? What did it feel like to audit your own v1?
- **Campus Ride:** Who asked you for a ride the week you started this? Who did you show the price screen to, and what did they say?

## Facts still marked CHECK (58 markers, dev and preview only)

Production hides them. These are claims only you can confirm, so I left them.

- Dates, roles, teams, and tools in the details strips (Trace, Mimic, Campus Events, Campus Ride).
- The sticky-note "why this problem" lines, and the one-line "why" at the end of each decision.
- Contact links (email, LinkedIn, GitHub, resume, Cal.com), the reply-time line, and the next gathering on Gatherings.
- The nine polaroid titles, captions, and dates on Gatherings.

## Other things I noticed

- **Next.js security notice.** `next build` and `next dev` each print a notice that Next 16.4.0 has a known vulnerability, and stop once before running. I did not run the upgrade it suggests, because you did not ask for it and it changes dependencies. The README says 16.4.0 was the latest stable when you pinned it, so it is worth checking whether a patched version exists now. Say the word and I can look into it in a separate worktree.
- **Dev-only hydration warning** on the root `<html>` className appears on every page, including pages where I only changed text. I did not chase it.
- **Unused files you can delete:** the 8 stand-in images in `public/images/lab/`, and the old MDX drafts in `content/work-mdx/` (the README now says they are stale).
- **Vercel Deployment Protection.** The PDF guide says the live URL redirected to a Vercel sign-in page when it was written. If you want recruiters to see the site, check that setting.
- `AGENTS.md` gets rewritten by `next dev` each time it runs. I restored it, so it may show as modified again after you run dev.
