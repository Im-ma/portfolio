# Immanuel Mensah

Personal site for a designer who engineers. Next.js App Router, TypeScript, and the Signal Path tokens.

Round 1 is the shared shell and the homepage. Gatherings, case studies, About, and Lab are routed and use the same layout. Their full pages come in later rounds.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site runs with no env vars. Forms still succeed: notes and questions are logged on the server, the note wall shows the sample notes, and booking says "Booking opens soon".

```bash
npm run lint
npm run build
npm run start
```

## Env vars

Copy `.env.example` to `.env.local`.

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public key. Inserts and reads follow the row policies below. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Needed for `/admin/notes` to approve notes. |
| `ADMIN_PASSWORD` | Password for `/admin/notes`. |
| `RESEND_API_KEY` | Sends "Ask me anything" mail. |
| `RESEND_FROM` | Verified sender, such as `Portfolio <onboarding@resend.dev>` for tests. |
| `CONTACT_EMAIL` | Where questions go. Defaults to tutuimmanuel10@gmail.com. |
| `NEXT_PUBLIC_CALCOM_LINK` | Cal.com link, such as `immanuel-mensah/15min`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for link previews. |
| `NEXT_PUBLIC_SHOW_CHECKS` | Set to `1` to show CHECK markers and STAND-IN tags on a preview. |

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
- `content/pages/gatherings.json`, `about.json`, `lab.json`: those pages (full layout comes later).
- `content/pages/talk-panel.json`: the talk panel menu and the three forms.
- `content/work/<slug>.json`: case studies. `content/work-mdx/` is the same writing in MDX, kept for reference. The site uses the JSON.
- `tokens/tokens.css`: colors, type, shadows, radii. Do not paste hex colors into components.
- `public/images/` and `public/videos/`: photos, posters, and flow videos.
- `public/resume.pdf`: the Resume link.

A `"check": true` field still needs Immanuel to confirm it. In local dev, and on previews when `NEXT_PUBLIC_SHOW_CHECKS=1`, a small CHECK marker shows after that text. `"standin": true` images get a STAND-IN tag in those same builds. Production hides both.

House style for anything you add: no em dashes or en dashes. Do not invent metrics. Do not mention an HBCU. Do not say the work was made by AI. Trace's simulated assistant is a product feature and should stay labeled that way.

## Shortcuts

- `T` opens and closes the talk panel, unless you are typing in a field.
- `Esc` steps back inside the panel, then closes it.
- On a case study, select a sentence and press `T` (or click the tooltip) to ask about that quote. The full case studies land in a later round. The work placeholders already let you try it on the summary.

## Project map

```
app/page.tsx                 homepage
app/work/[slug]/page.tsx     case study routes (placeholder this round)
app/gatherings, about, lab   placeholder pages
app/admin/notes              approve notes
app/api/notes                save a note
app/api/question             email a question
components/                  nav, footer, cards, notes, talk panel
lib/                         content loaders, Supabase, mail, rate limit
```

Motion respects `prefers-reduced-motion`: tilts, the path draw, and page moves drop away. Opacity and the resting layout stay.
