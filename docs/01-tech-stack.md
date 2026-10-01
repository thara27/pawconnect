# Tech stack

PawConnect is a Next.js 16 App Router app in TypeScript, styled with Tailwind CSS 4, backed by Supabase (Postgres, Auth, Storage, Realtime). Versions are the installed versions in `node_modules`; the declared `package.json` range follows in parentheses where it differs.

## Runtime and framework

| Layer | Technology | Version | Used for |
| --- | --- | --- | --- |
| Runtime | Node.js | 22.14.0 (local dev) | Build and server runtime |
| Framework | Next.js (App Router) | 16.2.2 | Pages, layouts, Server Components, Server Actions, route handlers, middleware, image optimisation |
| UI library | React / React DOM | 19.2.3 | Components; client components for forms and interactive widgets |
| Language | TypeScript | 5.9.3 (declared 5.x) | Strict mode, `@/*` path alias, `bundler` module resolution |
| Styling | Tailwind CSS | 4.2.1 (declared 4.x) | Utility CSS with custom brand tokens in `tailwind.config.ts` |
| CSS build | @tailwindcss/postcss | 4.2.1 (declared 4.x) | PostCSS plugin for Tailwind 4 |
| Fonts | next/font/google: Fraunces, DM Sans | bundled with Next.js | Display serif (headings) and body sans |

## Backend services

| Service | Technology | Version | Used for |
| --- | --- | --- | --- |
| Database | Supabase Postgres | managed | All app data; Row Level Security on every table; 11 SQL migrations in `supabase/migrations` |
| Auth | Supabase Auth | managed | Email/password, Google OAuth, email verification, password reset |
| Storage | Supabase Storage | managed | Buckets `pet-photos`, `provider-avatars`, `pet-owner-avatars` |
| Realtime | Supabase Realtime | managed | Enabled on `notifications` table |
| DB client | @supabase/supabase-js | 2.99.1 | Queries from server and browser |
| SSR auth | @supabase/ssr | 0.9.0 | Cookie-based sessions in Server Components, actions and middleware |
| Email | @aws-sdk/client-ses | 3.1024.0 | Sends contact-form emails through AWS SES |
| AI | Anthropic Messages API (raw `fetch`) | model `claude-3-5-haiku-20241022`, API version 2023-06-01 | Generates breed profiles on demand when `ANTHROPIC_API_KEY` is set |
| Email (unused) | nodemailer, @types/nodemailer | 8.0.4, 7.x | Installed but not imported anywhere; candidate for removal |

## Tooling

| Tool | Version | Notes |
| --- | --- | --- |
| ESLint | 9.39.4 (declared 9.x) | Flat config `eslint.config.mjs`; run with `npm run lint` |
| eslint-config-next | 16.1.6 | Next.js lint rules (one minor behind Next 16.2.2) |
| @types/node | 20.19.37 (declared 20.x) |  |
| @types/react, @types/react-dom | 19.2.14 (declared 19.x) |  |
| Package manager | npm (`package-lock.json`) |  |
| Testing | none | No test framework or test files in the repo |

## Environment variables

| Variable | Where read | Required |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase clients, `next.config.ts` image domains | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase clients | Yes |
| `AWS_SES_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | `lib/actions/contact.ts` | For contact emails |
| `CONTACT_FORM_EMAIL`, `CONTACT_FORM_FROM_EMAIL` | `lib/actions/contact.ts` | For contact emails |
| `ANTHROPIC_API_KEY` | `lib/data/breeds.ts` | Optional; without it, breed pages fall back to stored or placeholder data |
