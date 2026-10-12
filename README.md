# Immanuel Mensah

Personal site for a designer who engineers. Next.js App Router, TypeScript, and the Signal Path tokens.

The shared shell, homepage, gatherings, case studies, About, and Lab all use the same layout.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## npm warnings explained

A fresh install can print three warnings. None of them mean a vulnerable package is shipped to the browser or the Next server.

`eslint@9.39.5` is deprecated because ESLint 10 is the supported line, and 9.39.5 is the last 9.x release. This repo stays on 9. `eslint-config-next` 16 still depends on `eslint-plugin-react` and `eslint-plugin-jsx-a11y`, which only declare support through ESLint 9. ESLint 10 installs, then lint crashes. ESLint is a devDependency. It does not run in the browser or on the server.

`npm audit` reports 5 high findings. They are one issue, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): `braces` 3.0.3 can crash if a glob pattern is nested thousands of levels deep. The chain is dev-only: `eslint-config-next` to `@next/eslint-plugin-next` to `fast-glob` to `micromatch` to `braces`. `npm audit --omit=dev` reports 0 vulnerabilities. `braces` 3.0.3 is the latest release, so there is no patch. `npm audit fix --force` would downgrade `eslint-config-next` to 14 and break this Next 16 setup. ESLint only passes its own file globs into that code, not visitor input.

`unrs-resolver@1.12.2` prints an install-scripts warning on npm 11 and 12. It is a devDependency of `eslint-import-resolver-typescript`, used while linting. Its `postinstall` (`node postinstall.js`) only selects the prebuilt native binary for your machine. Newer npm blocks that script until `allowScripts` names the package. `package.json` allows `unrs-resolver@1.12.2`. The script does not run in production.

Next.js is pinned at 16.4.0, the latest stable release. There is no 16.4 patch to apply.

The site runs with no env vars. Forms still succeed: notes and questions are logged on the server, the note wall shows the sample notes, and booking says "Booking opens soon".

```bash
npm run lint
npm run build
npm run start
```

## Env vars

Copy `.env.example` to `.env.local`.

| Variable                        | What it does                                                            |
| ------------------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                                                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key. Inserts and reads follow the row policies below.            |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server only. Needed for `/admin/notes` to approve notes.                |
| `ADMIN_PASSWORD`                | Password for `/admin/notes`.                                            |
| `RESEND_API_KEY`                | Sends "Ask me anything" mail.                                           |
| `RESEND_FROM`                   | Verified sender, such as `Portfolio <onboarding@resend.dev>` for tests. |
| `CONTACT_EMAIL`                 | Where questions go. Defaults to tutuimmanuel10@gmail.com.               |
| `NEXT_PUBLIC_CALCOM_LINK`       | Cal.com link, such as `immanuel-mensah/15min`.                          |
| `NEXT_PUBLIC_SITE_URL`          | Canonical URL for link previews.                                        |
| `NEXT_PUBLIC_SHOW_CHECKS`       | Set to `1` to show CHECK markers and STAND-IN tags on a preview.        |

### Notes table

Run this in the Supabase SQL editor:

```sql
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  body text not null check (char_length(body) between 1 and 500),
  page text,
  color text check (color in ('yellow','cobalt','green','pink')),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.notes enable row level security;
create policy "public can read approved" on public.notes for select using (approved = true);
create policy "public can insert unapproved" on public.notes for insert with check (approved = false);
```

New notes are saved as unapproved. The homepage asks Supabase for the latest approved notes (refreshed about every 5 minutes) and falls back to the samples in `content/pages/home.json`.

Approve them at `/admin/notes` after `ADMIN_PASSWORD` and the service role key are set, or flip `approved` to true in the Supabase dashboard.

## How to edit content

Copy lives in `content/`. The site reads the JSON files. Change the words there, not in the React components.

- `content/site.json`: name, nav, availability line, talk button labels, contact links, footer.
- `content/pages/home.json`: homepage sections.
- `content/pages/gatherings.json`, `about.json`, `lab.json`: those pages.
- `content/pages/talk-panel.json`: the talk panel menu and the three forms.
- `content/work/<slug>.json`: case studies. `content/work-mdx/` is the same writing in MDX, kept for reference. The site uses the JSON. Block types are listed below.
- `tokens/tokens.css`: colors, type, shadows, radii. Do not paste hex colors into components.
- `public/images/` and `public/videos/`: photos, posters, and flow videos.
- `public/resume.pdf`: the Resume link.

A `"check": true` field still needs Immanuel to confirm it. In local dev, and on previews when `NEXT_PUBLIC_SHOW_CHECKS=1`, a small CHECK marker shows after that text. `"standin": true` images get a STAND-IN tag in those same builds. Production hides both.

House style for anything you add: no em dashes or en dashes. Do not invent metrics. Do not mention an HBCU. Do not say the work was made by AI. Trace's simulated assistant is a product feature and should stay labeled that way.

## Case study blocks

A project opens with the cover, then a short details strip, then the story. The cover shows the title, the one-line summary, and the status once. The strip keeps only what the cover does not already say: role, timeline, team, tools, links, and one scope line. The key takeaway renders once, as a quote after Context. Do not paste the summary, status, or takeaway again inside the sections.

Story sections are `sections[].blocks`. These types already in the files still work: `paragraph`, `label`, `heading`, `list`, `features`, `options`, `decision`, `figure`, `figureRow`, `video`, `annotation`.

A `figure` can set `layout` to `contained` (the default), `fullBleed`, `single`, or `flow`. A `figure` with an `images` array, or a `figureRow`, renders as a pair when there are two frames and a trio when there are three or more.

Use these block types when you have (or are standing in) an asset. To replace a stand-in, point `src` at the real file and remove `standin`. To publish a placeholder video, fill in `mp4`, `webm`, `poster`, and `caption`, then remove `devOnly`.

- `fullBleed`: `{ "type": "fullBleed", "frame": { "src", "width", "height", "caption", "objectPosition" } }`. Breaks out to the left edge of the study column.
- `contained`: one frame kept inside the column.
- `single`: one component on a soft card. Crop it with `objectPosition`.
- `split`: text beside a frame. `"side": "end"` puts the frame on the right. `"side": "start"` puts it on the left. Optional `check` and `checkNote`.
- `pair`: `{ "type": "pair", "frames": [frame, frame] }`.
- `trio`: `{ "type": "trio", "frames": [frame, frame, frame] }`.
- `bento`: up to four frames in a collage. Set `"standin": true` on the block and on each frame until the real moodboard, palette, or type sheet exists.
- `quote`: `{ "type": "quote", "label", "text", "detail" }`. The page already shows `keyTakeaway` this way, so do not copy that text into a second quote.
- `research`: `{ "type": "research", "text", "check", "checkNote" }`. A note card for a finding or a quote you already wrote.
- `flow`: `{ "type": "flow", "steps": [{ "title", "text" }], "frame": frame }`. Steps and the frame are both optional. Put the sentences you already have in `steps` so the diagram does not invent new copy.
- `compare`: `{ "type": "compare", "before": frame, "after": frame }`. A slider. Keep the real captions on the frames.
- `video`: one clip with `label`, `poster`, `mp4`, `webm`, `playLabel`, and `caption`. It lazy-loads, stays muted, and loops. Reduced motion does not autoplay. Put several video blocks in a section, or group them as `{ "type": "videos", "items": [video, video] }`.
- Empty second slot: `"type": "video"`, `"devOnly": true`, `"mp4": ""`, `"webm": ""`, plus a poster and caption. Dev builds show the poster. Production leaves it out.

`"standin": true` shows a STAND-IN tag in dev and when `NEXT_PUBLIC_SHOW_CHECKS=1`. Production hides it and still shows the image.

## Shortcuts

- `T` opens and closes the talk panel, unless you are typing in a field.
- `Esc` steps back inside the panel, then closes it.
- On a case study, select a sentence and press `T` (or click the tooltip) to ask about that quote.

## Project map

```
app/page.tsx                 homepage
app/work/[slug]/page.tsx     case study pages
app/gatherings, about, lab   gatherings, about, and lab
app/admin/notes              approve notes
app/api/notes                save a note
app/api/question             email a question
components/                  nav, footer, cards, notes, talk panel
lib/                         content loaders, Supabase, mail, rate limit
```

Motion respects `prefers-reduced-motion`: tilts, the path draw, and page moves drop away. Opacity and the resting layout stay.
