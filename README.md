# Behind the Mask — The Morality of Anonymity

An English, single-page educational website for an Astana IT University Philosophy Endterm Social Project. It presents five principles for responsible online communication, a private decision exercise, a philosophical comparison, and a concise summary of the team's surveys.

## Run locally

Requires Node.js 20.19+ or 22.12+ for the site itself. Running `npm test` and the report script needs Node 22.18+ or 24+.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. To verify the production build:

```bash
npm run build
npm run preview
```

`npm run build` runs TypeScript checks and writes the static site to `dist/`.

## Deploy to Vercel

1. Push this source folder to a Git repository.
2. Import the repository in Vercel and choose the **Vite** framework preset.
3. Use `npm ci` as the install command, `npm run build` as the build command, and `dist` as the output directory.
4. Deploy. The site is static and needs no environment variables, server, database, or API keys.

The same `dist/` directory can be deployed to Netlify or GitHub Pages. Vite's relative `base` in `vite.config.ts` allows assets to work under a GitHub Pages project path. If a hosting provider needs an absolute Open Graph image URL, set `og:image` in `index.html` to the deployed image URL after deployment.

## How to use the site

- **Explore the Code** jumps to the five principles.
- **Test Your Choices** opens three scenario questions. Selections and feedback exist only in React memory and reset on reload. No selection is transmitted, stored, scored, or tracked.
- **Print the Code** opens the browser print dialog with a dedicated one-page A4 layout. Choose “Save as PDF” if desired.
- **Copy page link** copies the current browser URL. **Share the Code** uses the native Web Share API when available and otherwise copies the link.

## Research and interpretation

The team's two survey exports included 22 consenting respondents: 12 anonymous and 10 identified. On the online-insult scenario, 6/12 anonymous respondents selected reporting, while 9/10 identified respondents selected reporting or defending the target. The latter figure combines two distinct actions. These are real answers to questions about what people would do, not records of actions taken in real events. The survey does not establish that anonymity caused the difference. No names or individual responses are included in the site.

## Anonymous feedback (setup)

The site collects three anonymous single-choice answers (usefulness, learning, intended use) after the code and challenge. Submissions go through the Vercel function `api/feedback.ts` into a Supabase table `guide_feedback`. The site works without this setup, but the form will show “could not be submitted” until the steps below are completed.

### 1. Create the database table (Supabase free tier)

1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run `supabase/migrations/20261110000000_create_guide_feedback.sql` once.
   - Row Level Security is enabled with no policies, and `anon`/`authenticated` roles have no table privileges. Public reads and writes are impossible.
   - `guide_feedback_counts()` returns counts only and is executable only by the secret key.

### 2. Configure environment variables

Copy `.env.example` to `.env.local` for local use, and add the same names in **Vercel → Project → Settings → Environment Variables**:

| Name | Where to find it | Used by |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase → Project Settings → API | `api/feedback.ts`, report script |
| `SUPABASE_SECRET_KEY` | Supabase → Project Settings → API Keys (secret / service role) | `api/feedback.ts`, report script |

Never prefix these with `VITE_` and never commit them. The secret key bypasses Row Level Security and must stay on the server.

### 3. Deploy

Push to Git; Vercel rebuilds with `npm run build` (TypeScript for the app and the API, then Vite). Redeploy after adding the environment variables.

### 4. Research report (admin, local only)

```bash
npm run report:feedback
npm run report:feedback -- --csv feedback-summary.csv
```

This prints the total, the count and percentage for each answer, and a slide 11 sentence generated from the actual data. It never prints or exports individual records. Run it on your own computer with the secret key in `.env.local`; do not expose it on the website.

### Spam and privacy protections

- Validation accepts only the exact allowlisted values and the consent field. Unknown fields are rejected.
- Requests must come from the site's own origin and be JSON under 2 KB.
- A hidden honeypot field and a minimum completion time (3 seconds) reject simple bots.
- A global limit of 500 submissions per hour protects the free tier. It is not a per-person limit.
- No IP addresses, cookies, user agents, names or emails are stored. Hosting providers (Vercel, Supabase) may still process standard technical connection data under their own policies, so the study should not claim absolute anonymity.
- Anonymous feedback cannot enforce one response per person without identifying people, so duplicate submissions are not prevented.

### Interpreting results

Report usefulness as **reported usefulness**, learning as **self-reported learning**, and the third question as **intended future behavior**. These results do not show verified changes in real-world online behavior.

### Tests

```bash
npm test
```

Requires Node.js 22.18+ or 24+ (tests import `.ts` files directly through Node's built-in type stripping; `npm run report:feedback` uses `--env-file-if-exists`, available from Node 22.9). Runs 20 `node:test` checks on validation, consent enforcement, allowlists, origin/size/content-type limits, honeypot and timing checks, database failure handling, and the absence of extra fields in stored rows.

## Project structure

```text
src/App.tsx                    page sections, sharing and print action
src/components/Header.tsx      responsive navigation and active section
src/components/MaskVisual.tsx  original SVG visual
src/components/Reveal.tsx      reduced-motion-aware section entrance
src/components/ScenarioExperience.tsx  private interactive exercise
api/feedback.ts                Vercel function: validated anonymous feedback storage
src/components/FeedbackSection.tsx  anonymous three-question feedback form
src/data/content.ts            typed principles, scenarios and team
src/data/feedback.ts           feedback allowlists and server-side validation
supabase/migrations/           guide_feedback table, RLS and count function
scripts/feedback-report.mjs    local aggregated research report and CSV
tests/                         node:test checks for validation and the API
src/index.css                  design system, responsive and A4 print CSS
public/                        favicon and Open Graph art
```

The site uses React, TypeScript, Vite, Tailwind CSS, Lucide React, and Motion. It makes no analytics or application API requests.
