# Journal Atlas

A polished, Supabase-ready journaling frontend built with React, Vite, Tailwind CSS, and Framer Motion. The app stores entries locally by default, and can connect to Supabase through environment variables without requiring a custom backend.

## Features

- Editorial-style landing page with a warm, premium visual system.
- Journal composer with mood, privacy, and tag controls.
- Entry archive with search, mood filters, tag filters, pinning, and removal.
- Weekly summary cards for streaks, word count, favorite tag, and average mood.
- Supabase-ready client configuration for future Auth and Postgres sync.

## Automated Testing And Deployment

- `npm run lint` checks code quality.
- `npm run test:run` runs the Vitest suite with jsdom.
- `npm run build` verifies the production bundle.
- GitHub Actions runs the same checks on every push and pull request.
- The deployment workflow publishes the built static site to GitHub Pages after validation passes.

## Supabase Setup

1. Copy `.env.example` to `.env.local`.
2. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values.
3. Create a `journal_entries` table in Supabase if you want to persist shared entries later.

## Scripts

- `npm run dev` starts the local development server.
- `npm run lint` runs ESLint.
- `npm run test:run` executes the unit tests once.
- `npm run test:coverage` runs tests with coverage.
- `npm run build` creates the production bundle.

## Project Activity Talking Points
