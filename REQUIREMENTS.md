# PawConnect — Requirements Document

> Derived entirely from the existing codebase (TypeScript / Next.js / Supabase).
> Status column reflects what is **actually built** vs what is **stubbed / missing**.

---

## 1. Product Overview

PawConnect is a web platform targeting **India's dog-owner market**.
It connects pet owners with verified service providers (vets, groomers, trainers, walkers, boarders, food suppliers) and provides a community space for dog lovers.

**Tagline:** "Where Every Paw Finds Its Pack"
**Target market:** India (phone/pincode validation is India-specific, INR pricing, India climate data)
**Current state:** Beta — banner shown on every page

---

## 2. User Roles

| Role | Description |
|---|---|
| `pet_owner` | Registers pets, searches providers, books services, leaves reviews |
| `service_provider` | Lists a business, sets availability, manages bookings |

Role is set at signup or during onboarding and stored in Supabase `auth.users.user_metadata.user_type`.

---

## 3. Authentication

| Feature | Status |
|---|---|
| Email + password signup | ✅ Built |
| Email + password login | ✅ Built |
| Google OAuth (signup & login) | ✅ Built |
| Email confirmation on signup | ✅ Built (redirects to `/auth/callback`) |
| Sign out | ✅ Built |
| Role selection at signup | ✅ Built (radio: pet_owner / service_provider) |
| Onboarding page (post-signup role picker) | ✅ Built |
| Password reset / forgot password | ❌ Missing |
| Email change | ❌ Missing |

---

## 4. Pet Owner — Features

### 4.1 Profile
| Feature | Status |
|---|---|
| Display name, phone, city | ✅ Built |
| Avatar upload (JPEG/PNG/WebP, max 2 MB) | ✅ Built |
| Stored in `pet_owner_profiles` table | ✅ Built |

### 4.2 Pet Management
| Feature | Status |
|---|---|
| Add pet (name, species, breed, age, weight, gender) | ✅ Built |
| Pet health fields (vaccinations, deworming, neutered, blood type, microchip) | ✅ Built |
| Pet photo upload (max 1 MB) | ✅ Built |
| Edit pet | ✅ Built |
| Delete pet | ✅ Built |
| Species supported: dog, cat, bird, rabbit, other | ✅ Built |

### 4.3 Provider Search & Discovery
| Feature | Status |
|---|---|
| Search by city (partial match) | ✅ Built |
| Filter by service type | ✅ Built |
| Filter by availability | ✅ Built |
| Filter by minimum rating | ✅ Built |
| Provider card with rating, price, availability | ✅ Built |
| Provider detail page | ✅ Built |
| URL-based filter state (shareable search links) | ✅ Built |

### 4.4 Bookings
| Feature | Status |
|---|---|
| View provider availability slots (1-hour blocks) | ✅ Built |
| Create booking (date, time slot, pet, notes) | ✅ Built |
| View own bookings list | ✅ Built |
| Cancel own booking (pending or confirmed only) | ✅ Built |
| Booking status: pending → confirmed → completed / cancelled | ✅ Built |
| Booking wizard UI | ✅ Built |
| Payment / online checkout | ❌ Missing |
| Booking reminders / email notifications | ❌ Missing |

### 4.5 Reviews
| Feature | Status |
|---|---|
| Leave star rating (1–5) + comment on completed booking | ✅ Built |
| One review per provider per user (unique constraint) | ✅ Built |
| View reviews on provider profile | ✅ Built |
| Edit or delete own review | ❌ Missing |

### 4.6 Notifications
| Feature | Status |
|---|---|
| In-app notification list | ✅ Built |
| Notification types: booking_request, booking_confirmed, booking_cancelled | ✅ Built |
| Mark single notification as read | ✅ Built |
| Mark all notifications as read | ✅ Built |
| Real-time notifications (Supabase Realtime enabled) | ✅ Built (infra ready) |
| Push / email notifications | ❌ Missing |

### 4.7 Settings
| Feature | Status |
|---|---|
| Settings page (placeholder) | ⚠️ Stub only — no actual settings |

---

## 5. Service Provider — Features

### 5.1 Profile
| Feature | Status |
|---|---|
| Business name, service type, description | ✅ Built |
| Address, city, state, pincode (6-digit Indian) | ✅ Built |
| Phone (Indian number validation) | ✅ Built |
| Website URL | ✅ Built |
| Price range (from/to) + price unit (per visit/hour/day/month) | ✅ Built |
| Years of experience, license number | ✅ Built |
| Avatar upload (max 1 MB) | ✅ Built |
| Is available toggle | ✅ Built |
| Lat/lng coordinates (stored, not used in UI) | ⚠️ Stored but no map/geo search |

### 5.2 Availability
| Feature | Status |
|---|---|
| Set open/close times per day of week | ✅ Built |
| Availability used to generate 1-hour booking slots | ✅ Built |

### 5.3 Booking Management
| Feature | Status |
|---|---|
| View all incoming bookings | ✅ Built |
| Confirm booking | ✅ Built |
| Cancel booking (with reason) | ✅ Built |
| Mark booking as completed | ❌ Missing (no UI action for this) |
| Revenue summary on dashboard | ✅ Built (calculated from completed bookings) |

### 5.4 Settings
| Feature | Status |
|---|---|
| Settings page (placeholder) | ⚠️ Stub only |

---

## 6. Community

| Feature | Status |
|---|---|
| View community feed (public) | ✅ Built |
| Create post (title, content, tags, post type) | ✅ Built |
| Post types: question, tip, story, blood_request, lost_found | ✅ Built |
| Reply to posts | ❌ Missing (links to `/coming-soon`) |
| Like / upvote posts | ❌ Missing |
| Edit / delete own post | ❌ Missing |
| Author display name (shows truncated UUID currently) | ⚠️ No real name shown |
| Post detail page | ❌ Missing |

---

## 7. Breed Directory

| Feature | Status |
|---|---|
| Breed listing page | ✅ Built |
| Breed detail page (`/breeds/[breed]`) | ✅ Built |
| India-specific care tips, climate suitability | ✅ Built |
| Health issues, exercise, feeding guide | ✅ Built |
| Breed data from Supabase DB (with placeholder fallback) | ✅ Built |
| AI-generated breed profiles (schema has `generated_by_ai` flag) | ⚠️ Schema ready, no AI integration wired |
| Breed search / filter on directory page | ✅ Built (client-side) |

---

## 8. Public Pages

| Page | Status |
|---|---|
| Home / landing page | ✅ Built |
| How It Works | ✅ Built |
| Search (public provider search) | ✅ Built |
| Provider public profile (`/providers/[id]`) | ✅ Built |
| Contact form (saves to DB + sends via AWS SES) | ✅ Built |
| Newsletter signup (saves email to DB) | ✅ Built |
| Privacy Policy | ✅ Built (page exists) |
| Terms of Service | ✅ Built (page exists) |
| Coming Soon (placeholder for unbuilt features) | ✅ Built |

---

## 9. Analytics

| Feature | Status |
|---|---|
| Custom event tracking to Supabase `analytics_events` table | ✅ Built |
| Events: page_view, booking_created, pet_added, search_performed, provider_viewed, review_submitted, share_clicked, referral_link_copied | ✅ Defined |
| Analytics migration SQL | ⚠️ Documented in code comment, migration file not present |
| Dashboard / reporting UI | ❌ Missing |

---

## 10. Infrastructure & Integrations

| Item | Status |
|---|---|
| Next.js 16 (App Router) | ✅ |
| Supabase (Auth, DB, Storage, Realtime) | ✅ |
| AWS SES (contact form email) | ✅ |
| Deployed (hosted — per user description) | ✅ |
| Row Level Security on all tables | ✅ |
| Storage buckets: pet-photos, provider-avatars, pet-owner-avatars | ✅ |
| AI integration (Claude / any LLM for breed profiles) | ❌ Not wired |
| Payment gateway | ❌ Not present |
| SMS / WhatsApp notifications | ❌ Not present |
| SEO metadata (title/description only) | ⚠️ Minimal |

---

## 11. What's Missing Before Digital Marketing Launch

These are the gaps that would cause user drop-off or trust issues if you start driving traffic:

### Critical (fix before any marketing)
1. **"Mark as Completed" for bookings** — providers have no way to mark a booking done, so reviews can never be left (review requires `status = completed`)
2. **Author names in community** — posts show a truncated UUID instead of a display name, looks broken
3. **Settings pages** — both pet owner and provider settings are empty stubs
4. **Password reset** — no forgot-password flow; users who forget their password are locked out
5. **Analytics migration** — the `analytics_events` table SQL is only in a code comment, not a migration file; tracking won't work

### Important (fix soon after launch)
6. **Community replies** — the Reply button goes to `/coming-soon`; community feels dead
7. **Post detail page** — no way to read a full post
8. **Real-time notification delivery** — infra is ready but no UI polling or websocket listener is wired to show live badge counts
9. **SEO metadata** — every page uses the same generic title/description; bad for organic search
10. **Blood donor / emergency feature** — prominently shown on both dashboards but links to `/coming-soon`

### Nice to have (post-launch)
11. Payment integration
12. Email/SMS booking reminders
13. AI breed profile generation (schema is ready)
14. Map-based provider search (lat/lng stored but unused)
15. Review edit/delete
16. Analytics reporting dashboard
