# Behind the Mask — The Morality of Anonymity

An English, single-page educational website for an Astana IT University Philosophy Endterm Social Project. It presents five principles for responsible online communication, a private decision exercise, a philosophical comparison, and a concise summary of the team's surveys.

## Run locally

Requires Node.js 20.19+ or 22.12+.

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

## Project structure

```text
src/App.tsx                    page sections, sharing and print action
src/components/Header.tsx      responsive navigation and active section
src/components/MaskVisual.tsx  original SVG visual
src/components/Reveal.tsx      reduced-motion-aware section entrance
src/components/ScenarioExperience.tsx  private interactive exercise
src/data/content.ts            typed principles, scenarios and team
src/index.css                  design system, responsive and A4 print CSS
public/                        favicon and Open Graph art
```

The site uses React, TypeScript, Vite, Tailwind CSS, Lucide React, and Motion. It makes no analytics or application API requests.
