# Corrections round 2: plan

Source of the brief: your Oct 23 feedback. The writing sounds like AI and some lines don't finish a thought. The case studies repeat themselves, feel like "too much of nothing", and lose context between sections. The Lab needs a better idea. Reference: Rachel Chen's case studies.

Working branch: `corrections-round-2`. Nothing is pushed, merged, or deployed.

## Rules I'm holding myself to

- Only facts already on the site, in the Figma notes from the Oct 23 session, or in the PDF guide. No invented metrics, quotes, or stories.
- House style from the README: no em or en dashes, no "made by AI" wording, Trace's assistant stays labeled simulated.
- Colors and type come from `tokens/`, copy stays in `content/`.
- Anything I can't do without you (photos, clips, links, personal stories) is written down in `docs/handoff.md`, not faked.
- Decisions that were open (names, tags, nav) I make and record. Facts only you know keep their CHECK marker.

## Steps

1. **Baseline.** Branch, `npm run lint`, `npm run build`, so I know what "unbroken" looks like.
2. **Case study page shape (code).** Hide links with no URL. Stop rendering the key takeaway quote, the scope inventory, and the "How I built it" and "Impact" sections. Lighter decision layout with a claim heading. A tinted `panel` block for problem and solution clips, like Rachel's.
3. **Rewrite the four case studies.** Same spine for all: Overview, What I made, Decisions (2 or 3, each a claim plus a few plain sentences plus one visual), Looking back. Target 400 to 800 words each. Existing wording is fact-check material only.
4. **Homepage, About, Gatherings, talk panel copy.** Cut filler, finish half-thoughts, make the voice consistent and plain.
5. **Lab.** Replace eight thin tiles (one claimed MediaPipe and was only a pointer follow) with four playable pieces taken from real case study decisions: quarantine vs delete (Trace), name your price (Campus Ride), pause vs emergency stop (Mimic), RSVP states (Campus Events). Keep three honest experiments from this site.
6. **Verify.** Lint, build, dash and banned-phrase scan, render every page, headless screenshots at desktop and phone widths, check for console errors.
7. **Handoff.** `docs/handoff.md`: what changed, what I decided, every asset and answer I still need from you.
