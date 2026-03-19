# PawConnect

PawConnect is a Next.js + TypeScript + Tailwind app with Supabase auth scaffolding.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.local.example` and fill in your Supabase project credentials.

3. In Supabase, enable `Email` auth provider.

4. In Supabase auth redirect URLs, add:

```text
http://localhost:3000/auth/callback
```

5. Start the app:

```bash
npm run dev
```

## Auth Scaffolding

- Login page: `/login`
- Signup page: `/signup`
- Auth callback route: `/auth/callback`
- Protected dashboard entry: `/dashboard`
- Pet owner dashboard: `/dashboard/pet-owner`
- Service provider dashboard: `/dashboard/service-provider`

Middleware behavior:

- Unauthenticated users visiting `/dashboard*` are redirected to `/login`.
- Authenticated users visiting `/login` or `/signup` are redirected to `/dashboard`.
- `/dashboard` automatically redirects to a role-specific dashboard based on `user_type`.

Sign-up stores user metadata including:

- `user_type`: `pet_owner` or `service_provider`
- `full_name`

## Project Structure

```text
app/
	(auth)/
		layout.tsx
		login/page.tsx
		signup/page.tsx
	dashboard/
		page.tsx
		pet-owner/page.tsx
		service-provider/page.tsx
	auth/
		callback/route.ts
	layout.tsx
	page.tsx
lib/
	supabase/
		client.ts
		middleware.ts
		server.ts
	types/
		auth.ts
middleware.ts
```
