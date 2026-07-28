# PawConnect — Design Document

> Derived entirely from the existing codebase. Describes what is actually built.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Email | AWS SES via `@aws-sdk/client-ses` |
| Fonts | DM Sans (body), Fraunces (headings) — Google Fonts |
| Hosting | Deployed (AWS Amplify based on SES setup docs) |

---

## 2. Project Structure

```
pawconnect/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Login / Signup (shared auth layout)
│   ├── api/breeds/             # API route for breed data
│   ├── auth/callback/          # OAuth redirect handler
│   ├── breeds/                 # Breed directory + detail pages
│   ├── community/              # Community feed + new post
│   ├── components/             # Shared UI components
│   │   ├── providers/          # Provider-specific cards
│   │   └── ui/                 # Generic UI primitives
│   ├── contact/                # Contact form page
│   ├── dashboard/
│   │   ├── pet-owner/          # Pet owner dashboard + sub-pages
│   │   └── service-provider/   # Provider dashboard + sub-pages
│   ├── how-it-works/
│   ├── onboarding/             # Role selection after signup
│   ├── privacy/ terms/         # Legal pages
│   ├── providers/[id]/         # Public provider profile
│   ├── search/                 # Public provider search
│   └── page.tsx                # Landing page
├── lib/
│   ├── actions/                # Next.js Server Actions (all DB writes)
│   ├── data/                   # Static data (breeds seed)
│   ├── supabase/               # Supabase client helpers (client/server/middleware)
│   └── types/                  # Shared TypeScript types
├── supabase/migrations/        # SQL migration files
└── middleware.ts               # Session refresh on every request
```

---

## 3. Authentication & Session Flow

```
User visits any page
        │
        ▼
middleware.ts  ──►  lib/supabase/middleware.ts
        │           (refreshes Supabase session cookie on every request)
        │
        ▼
Protected route?
   Yes ──► Supabase server client checks session
           No session → redirect /login
   No  ──► Render page
```

**Auth providers:**
- Email/password (`supabase.auth.signInWithPassword`)
- Google OAuth (`supabase.auth.signInWithOAuth`)
- Callback handled at `/auth/callback` → redirects to `/dashboard`

**Role stored in:** `auth.users.user_metadata.user_type` (`pet_owner` | `service_provider`)

**Post-login routing:**
```
/dashboard
    ├── no user_type → /onboarding
    ├── pet_owner   → /dashboard/pet-owner
    └── service_provider → /dashboard/service-provider
```

---

## 4. Database Schema

### Tables

#### `auth.users` (Supabase managed)
- `id` uuid PK
- `email` text
- `user_metadata.user_type` — `pet_owner` | `service_provider`
- `user_metadata.full_name`

#### `pet_owner_profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → auth.users | unique |
| display_name | text | |
| phone | text | |
| city | text | |
| avatar_url | text | public URL from storage |
| created_at / updated_at | timestamptz | |

#### `pets`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| owner_id | uuid FK → auth.users | |
| name | text | max 80 chars |
| species | text | dog/cat/bird/rabbit/other |
| breed | text | max 80 chars |
| breed_size | text | toy/small/medium/large/giant |
| age_years | numeric | 0–40 |
| weight_kg | numeric | 0–250 |
| gender | text | male/female/unknown |
| blood_type | text | |
| color | text | |
| microchip_id | text | alphanumeric + hyphens |
| is_vaccinated | boolean | |
| is_vaccinated_rabies | boolean | |
| is_vaccinated_dhpp | boolean | |
| last_dewormed / next_deworming | date | |
| neutered | boolean | |
| medical_notes | text | max 1000 chars |
| photo_url | text | |

#### `provider_profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | referenced by bookings |
| provider_id | uuid FK → auth.users | |
| business_name | text | |
| service_type | text | vet/groomer/walker/boarder/food_supplier/trainer/other |
| description | text | max 300 chars |
| address / city / state / pincode | text | pincode: 6-digit Indian |
| lat / lng | numeric | stored, not used in search yet |
| phone | text | Indian number format |
| website | text | |
| price_from / price_to | numeric | |
| price_unit | text | per_visit/per_hour/per_day/per_month |
| is_available | boolean | |
| avatar_url | text | |
| years_experience | numeric | |
| license_number | text | |

#### `provider_availability`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| provider_id | uuid FK → auth.users | (user id, not profile id) |
| day_of_week | integer | 0=Sunday … 6=Saturday |
| open_time / close_time | text | "HH:MM" format |

#### `bookings`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| pet_owner_id | uuid FK → auth.users | |
| provider_id | uuid FK → provider_profiles(id) | profile UUID, not user UUID |
| pet_id | uuid FK → pets | |
| booking_date | date | |
| start_time / end_time | text | "HH:MM" |
| service_type | text | |
| status | text | pending/confirmed/cancelled/completed |
| notes | text | |
| total_price | numeric | copied from provider price_from at booking time |
| cancellation_reason | text | |

#### `notifications`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → auth.users | |
| title / message | text | |
| type | text | booking_request/booking_confirmed/booking_cancelled/system |
| is_read | boolean | |
| booking_id | uuid FK → bookings | nullable |

#### `community_posts`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| author_id | uuid FK → auth.users | |
| title | text | max 120 chars |
| content | text | max 2000 chars |
| tags | text[] | max 5 tags, slugified |
| post_type | text | question/tip/story/blood_request/lost_found |
| is_resolved | boolean | |
| view_count | integer | |

#### `breed_profiles`
| Column | Type | Notes |
|---|---|---|
| breed_slug | text unique | URL key |
| breed_name | text unique | |
| origin / size / temperament | text/text[] | |
| energy_level / grooming_needs / training_difficulty | smallint | 1–5 |
| india_climate_suitability | text | low/medium/high |
| india_care_tips / common_health_issues | text[] | |
| exercise_needs / feeding_guide / fun_fact / summary | text | |
| generated_by_ai | boolean | |

#### `contact_messages`
| Column | Type |
|---|---|
| name / email / subject / message | text |
| created_at | timestamptz |

#### `newsletter_subscribers`
| Column | Type |
|---|---|
| email | text unique |

#### `analytics_events` *(migration not yet in file — only in code comment)*
| Column | Type |
|---|---|
| event | text |
| properties | jsonb |
| user_id | uuid nullable |

### Views
- `provider_search_view` — joins `provider_profiles` with aggregated `avg_rating` and `review_count` from `provider_reviews`

### Storage Buckets
| Bucket | Public | Used for |
|---|---|---|
| `pet-photos` | yes | Pet profile photos |
| `provider-avatars` | yes | Provider business avatars |
| `pet-owner-avatars` | yes | Pet owner profile avatars |

### RLS Summary
All tables have RLS enabled. Key policies:
- Users can only read/write their own rows
- Bookings: pet owners own their side; providers own theirs via subquery join on `provider_profiles`
- Notifications: any authenticated user can insert (needed for cross-party notifications from server actions)
- Community posts: public read, authenticated write, author-only update
- Breed profiles: public read, authenticated upsert

---

## 5. Server Actions Architecture

All data mutations go through Next.js Server Actions in `lib/actions/`. No API routes are used for mutations.

| File | Responsibilities |
|---|---|
| `auth.ts` | Sign out, set user type |
| `pets.ts` | CRUD for pet profiles + photo upload |
| `providers.ts` | Provider profile upsert, availability upsert, search, get by ID |
| `bookings.ts` | Create booking, get bookings (owner/provider), update status, cancel, notifications CRUD |
| `reviews.ts` | Create review, get reviewed provider IDs |
| `profile.ts` | Pet owner profile read/write + avatar upload |
| `community.ts` | Create community post |
| `contact.ts` | Save contact message to DB + send via AWS SES |
| `newsletter.ts` | Subscribe email |

---

## 6. Key Data Flows

### Booking Creation Flow
```
Pet owner selects provider
    → getAvailableSlots(providerId, date)
        → fetch provider_availability for that day_of_week
        → fetch existing bookings for that date (pending/confirmed)
        → generate 1-hour slots, mark booked ones unavailable
    → User picks slot + pet + notes
    → createBooking()
        → validate ownership of pet
        → re-validate slot availability
        → insert booking (status: pending)
        → createNotification() → provider gets "New booking request"
```

### Booking Status Flow
```
pending
  ├── Provider confirms → confirmed → createNotification(owner: "Booking confirmed")
  ├── Provider cancels → cancelled → createNotification(owner: "Booking cancelled")
  └── Owner cancels    → cancelled → createNotification(provider: "Booking cancelled")

confirmed
  └── [No UI to mark completed — this is a gap]
```

### Provider Search Flow
```
searchProviders(filters)
    → query provider_search_view (has avg_rating, review_count)
    → apply filters: service_type, city (ilike), is_available, min_rating
    → fetch provider_availability for all result provider_ids
    → merge availability into results
```

---

## 7. Page Map

### Public (no auth required)
```
/                       Landing page
/login                  Email/password + Google login
/signup                 Registration
/search                 Provider search (client component)
/providers/[id]         Provider public profile
/breeds                 Breed directory
/breeds/[breed]         Breed detail
/how-it-works           Static explainer
/contact                Contact form
/privacy                Privacy policy
/terms                  Terms of service
/coming-soon            Placeholder for unbuilt features
```

### Protected — Pet Owner
```
/dashboard/pet-owner                    Dashboard home
/dashboard/pet-owner/pets               Pet list
/dashboard/pet-owner/pets/new           Add pet form
/dashboard/pet-owner/pets/[id]          Pet detail
/dashboard/pet-owner/pets/[id]/edit     Edit pet form
/dashboard/pet-owner/bookings           Booking list + review form
/dashboard/pet-owner/search             Provider search (same as /search)
/dashboard/pet-owner/providers/[id]     Provider detail + book button
/dashboard/pet-owner/providers/[id]/book  Booking wizard
/dashboard/pet-owner/profile            Profile view
/dashboard/pet-owner/notifications      Notification list
/dashboard/pet-owner/settings           Settings (stub)
```

### Protected — Service Provider
```
/dashboard/service-provider             Dashboard home
/dashboard/service-provider/bookings    Booking management
/dashboard/service-provider/profile     Profile view
/dashboard/service-provider/profile/edit  Profile + availability form
/dashboard/service-provider/notifications  Notification list
/dashboard/service-provider/settings    Settings (stub)
```

### Auth Utility
```
/auth/callback          OAuth redirect handler
/onboarding             Role picker (post-signup)
/dashboard              Smart redirect based on user_type
```

---

## 8. Component Architecture

### Layout Components
- `Header` — nav bar with auth state, notification bell
- `Footer` — links, newsletter section
- `NavBar` — navigation links
- Beta banner — shown globally in root layout

### Shared UI (`app/components/ui/`)
- `WelcomeBanner` — shown on first dashboard visit
- `ComingSoonCard` — reusable placeholder card

### Provider Components (`app/components/providers/`)
- `ProviderCard` — used in dashboard featured row
- `PublicProviderCard` — used in public search results

### Form Components (co-located with pages)
- `pet-form.tsx` — add/edit pet
- `provider-profile-form.tsx` — provider profile + availability
- `profile-form.tsx` — pet owner profile
- `post-form.tsx` — community post
- `booking-wizard.tsx` — multi-step booking flow
- `review-form.tsx` — star rating + comment

### Client Components (marked `"use client"`)
- Search page, booking wizard, login/signup, onboarding, all forms
- `notifications-client.tsx` — notification list with mark-read

### Server Components (default)
- All dashboard pages, community feed, breed pages, provider detail

---

## 9. Analytics Design

Custom lightweight tracker in `lib/analytics.ts`:
- Fire-and-forget inserts to `analytics_events` Supabase table
- Captures: `user_id`, `event` name, `properties` (jsonb)
- Named helpers: `pageView`, `bookingCreated`, `petAdded`, `searchPerformed`, `providerViewed`, `reviewSubmitted`, `shareClicked`, `referralLinkCopied`
- No third-party analytics service used

---

## 10. Email Design

Contact form uses AWS SES:
- Saves message to `contact_messages` table first (non-blocking)
- Sends HTML + plain text email to `CONTACT_FORM_EMAIL` env var
- Reply-To set to the submitter's email
- Region validated against allowlist before passing to SDK
- Credentials: IAM role in production (Amplify), `.env.local` keys for dev

---

## 11. Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
CONTACT_FORM_EMAIL          # recipient for contact form emails
CONTACT_FORM_FROM_EMAIL     # SES verified sender address
AWS_SES_REGION              # e.g. ap-south-1
AWS_ACCESS_KEY_ID           # local dev only; IAM role used in prod
AWS_SECRET_ACCESS_KEY       # local dev only
```

---

## 12. Known Design Gaps / Technical Debt

| Issue | Impact |
|---|---|
| `bookings.provider_id` references `provider_profiles(id)` not `auth.users(id)` | Intentional but unusual — documented in migration comment |
| `start_time`/`end_time` stored as TEXT not TIME | Intentional for simplicity; no casting needed |
| Owner name in provider booking list shows `Owner ${id.slice(0,6)}` | Privacy-safe but poor UX — no join to `pet_owner_profiles` |
| Author in community feed shows truncated UUID | Should join to `pet_owner_profiles.display_name` |
| `avg_rating` hardcoded as `4.8` on provider dashboard | Should be computed from actual reviews |
| `analytics_events` migration only in code comment | Table may not exist in production |
| Lat/lng stored but no geo-search implemented | Dead columns for now |
| Settings pages are empty stubs | Users expect account settings |
| No "mark booking completed" action | Blocks the entire review flow |
