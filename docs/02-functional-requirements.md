# Functional requirements

PawConnect connects dog and pet owners in India with local service providers (vets, groomers, walkers, boarders, trainers, food suppliers) and gives them a community and breed guide. Requirements below describe what the code does today; each has an ID used by the coverage checklist in section 6.

## 2.1 Scope and users

| Role | Stored as | Can do |
| --- | --- | --- |
| Visitor | not signed in | Browse home, search, provider profiles, breeds, community feed and posts; contact form; newsletter |
| Pet owner | `user_metadata.user_type = pet_owner` | Everything a visitor can, plus profile, pets, bookings, reviews, notifications, posting and replying |
| Service provider | `user_metadata.user_type = service_provider` | Everything a visitor can, plus business profile, weekly hours, booking management, notifications, posting and replying |

Market assumptions in code: Indian 10-digit mobile numbers (optional +91), 6-digit pincodes, INR prices, India climate notes on breeds.

## 2.2 Authentication and onboarding (AUTH)

| ID | Requirement |
| --- | --- |
| AUTH-01 | A visitor can sign up with full name, email, password and a role (pet owner or service provider). A verification email is sent; the link returns to `/auth/callback`. |
| AUTH-02 | A visitor can sign up or log in with Google OAuth. |
| AUTH-03 | A user can log in with email and password. |
| AUTH-04 | A user with no role (first Google sign-in) is sent to `/onboarding` to pick one; the choice is saved to user metadata. |
| AUTH-05 | A user can request a password reset email (`/forgot-password`) and set a new password (`/auth/update-password`). |
| AUTH-06 | A user can request a new verification email (`/resend-verification`). |
| AUTH-07 | A user can sign out. |
| AUTH-08 | Signed-out users opening `/dashboard*` or `/onboarding` are redirected to `/login?next=<path>`. Signed-in users opening `/login` or `/signup` go to `/dashboard`. |
| AUTH-09 | `/dashboard` routes each user to the dashboard for their role. |
| AUTH-10 | The auth callback only follows same-origin relative `next` paths (no open redirect). |

## 2.3 Pet owner (PO)

| ID | Requirement |
| --- | --- |
| PO-01 | Dashboard shows a welcome banner, pets, upcoming bookings and quick links. |
| PO-02 | Owner can edit profile: display name, phone, city, avatar (JPEG/PNG/WebP, max 2 MB). |
| PO-03 | Owner can add a pet: name (required), species (dog, cat, bird, rabbit, other), breed, breed size, age, weight, gender, colour, blood type, microchip ID (letters, digits, hyphens), medical notes. |
| PO-04 | Owner can record health data: vaccinated, rabies, DHPP, last and next deworming dates, neutered. |
| PO-05 | Owner can upload a pet photo (JPEG/PNG/WebP, max 1 MB). |
| PO-06 | Owner can view, edit and delete their own pets; nobody else can see them. |
| PO-07 | Owner can view settings: email, sign-in method, link to profile, sign out. |

## 2.4 Provider discovery (SRCH)

| ID | Requirement |
| --- | --- |
| SRCH-01 | Anyone can search providers by city (partial, case-insensitive), service type, available-now and minimum rating. |
| SRCH-02 | Filters live in the URL so searches can be shared and bookmarked. |
| SRCH-03 | Each result shows business name, service, city, rating, review count, price range and weekly hours. |
| SRCH-04 | A provider profile page shows details, hours and reviews with reviewer names, publicly at `/providers/[id]` and inside the owner dashboard. |
| SRCH-05 | Users can share a provider or page link (Share button). |

## 2.5 Bookings (BK)

| ID | Requirement |
| --- | --- |
| BK-01 | A pet owner books through a wizard: pick a date (today or later), a 1-hour slot, one of their pets and optional notes. |
| BK-02 | Slots are generated from the provider's open and close times for that weekday, in 1-hour steps; slots held by pending or confirmed bookings are shown as taken. |
| BK-03 | The server re-checks the slot, that the pet belongs to the owner and that the user is a pet owner, then creates a `pending` booking priced at the provider's `price_from`. |
| BK-04 | The provider receives a `booking_request` notification. |
| BK-05 | The provider sees bookings in tabs (pending, confirmed, completed, cancelled) and can confirm or cancel pending ones, and complete or cancel confirmed ones. A cancel asks for a reason. |
| BK-06 | Each status change notifies the owner (`booking_confirmed`, `booking_completed`, `booking_cancelled`). |
| BK-07 | The owner sees their bookings and can cancel a pending or confirmed booking. |
| BK-08 | The provider dashboard shows booking counts and revenue from completed bookings. |

## 2.6 Reviews (REV)

| ID | Requirement |
| --- | --- |
| REV-01 | A pet owner can rate (1 to 5 stars) and comment on a provider after a booking with them is `completed`. |
| REV-02 | One review per owner per provider (database unique constraint). |
| REV-03 | Reviews and average rating appear on provider cards and profiles. |
| REV-04 | A reviewer can delete their own review at database level (no UI yet). |

## 2.7 Service provider (SP)

| ID | Requirement |
| --- | --- |
| SP-01 | Provider can create and edit a business profile: name, service type, description, address, city, state, 6-digit pincode, Indian phone, website, price from/to and unit (per visit, hour, day, month), years of experience, licence number, avatar (max 1 MB), available toggle. |
| SP-02 | Provider can set open and close times for each day of the week; saving replaces the previous schedule. |
| SP-03 | Provider profile and hours are public. |
| SP-04 | Provider can view settings (account info, sign out). |

## 2.8 Notifications (NOT)

| ID | Requirement |
| --- | --- |
| NOT-01 | Users see an in-app notification list and an unread count on the bell. |
| NOT-02 | New notifications appear live through Supabase Realtime; provider booking lists also refresh live. |
| NOT-03 | Users can mark one or all notifications as read. |
| NOT-04 | Only parties to a booking can notify each other; nobody can notify themselves (RLS). |

## 2.9 Community (COM)

| ID | Requirement |
| --- | --- |
| COM-01 | Anyone can read the feed and individual posts with replies. |
| COM-02 | A signed-in user can create a post: title (max 120), content (max 2,000), type (question, tip, story, blood request, lost and found), up to 5 tags. |
| COM-03 | A signed-in user can reply to a post (max 1,000 characters). |
| COM-04 | Authors are shown by display name from their owner profile. |
| COM-05 | Authors can edit or delete their own posts and replies at database level (no UI yet). |

## 2.10 Breed directory (BR)

| ID | Requirement |
| --- | --- |
| BR-01 | Anyone can browse and search (client-side) a list of breeds. |
| BR-02 | A breed page shows size, origin, temperament, energy, grooming and training scores, India climate suitability and popularity, care tips, health issues, exercise, feeding and a fun fact. |
| BR-03 | Breed data is read from `breed_profiles`; on a miss it is generated by Claude and cached; if that fails, a static placeholder is shown. |
| BR-04 | The same data is served as JSON at `GET /api/breeds/[breed]`. |

## 2.11 Public site and marketing (PUB)

| ID | Requirement |
| --- | --- |
| PUB-01 | Home, How it works, Privacy, Terms and Coming soon pages. |
| PUB-02 | A beta banner with a contact link shows on every page. |
| PUB-03 | Contact form: name (max 100), email, subject (max 200), message (max 5,000); saved to `contact_messages` and emailed through AWS SES. |
| PUB-04 | Newsletter sign-up saves an email to `newsletter_subscribers` (home section and footer). |
| PUB-05 | Signed-out visitors see sign-up nudges and auth prompts on actions that need an account. |

## 2.12 Analytics (AN)

| ID | Requirement |
| --- | --- |
| AN-01 | Client events are written to `analytics_events`: page\_view, booking\_created, pet\_added, search\_performed, provider\_viewed, review\_submitted, share\_clicked, referral\_link\_copied. |
| AN-02 | Analytics data is write-only for users; only the service role can read it. |

## 2.13 Non-functional requirements

| Area | Requirement |
| --- | --- |
| Security | Row Level Security on every table; role checks repeated in Server Actions; server-side validation of all form input |
| Uploads | Images only (JPEG/PNG/WebP); Server Action body limit 6 MB; images served from Supabase public storage |
| Responsiveness | All pages usable at phone width |
| Availability | Contact form succeeds if either the DB save or the email works; breed pages never fail (placeholder fallback) |
| Hosting | AWS Amplify (per SES setup docs) |

## 2.14 Out of scope today

Payments, email/SMS/WhatsApp reminders, map or distance search (lat/lng stored but unused), blood donor matching (links to Coming soon), editing or deleting reviews, posts and replies in the UI, likes, account deletion and an analytics dashboard.
