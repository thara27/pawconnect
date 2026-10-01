# Functionality coverage checklist

These 73 items are what QA and release sign-off need to cover: 55 built, 3 partial and 15 missing. IDs match section 2; set Test status as you go.

## Auth and pet owner

| Area | ID | What to cover | Build state | Test status |
| --- | --- | --- | --- | --- |
| Auth | AUTH-01 | Email sign-up with role; verification email arrives; link signs in | Built | Not tested |
| Auth | AUTH-02 | Google sign-up and login | Built | Not tested |
| Auth | AUTH-03 | Email login; wrong password and unverified email show errors | Built | Not tested |
| Auth | AUTH-04 | New Google user is sent to onboarding and role is saved | Built | Not tested |
| Auth | AUTH-05 | Forgot password email and set new password | Built | Not tested |
| Auth | AUTH-06 | Resend verification email | Built | Not tested |
| Auth | AUTH-07 | Sign out from menu and settings | Built | Not tested |
| Auth | AUTH-08 | Signed-out user on /dashboard goes to /login?next=; signed-in user on /login goes to /dashboard | Built | Not tested |
| Auth | AUTH-09 | /dashboard routes each role to its own dashboard | Built | Not tested |
| Auth | AUTH-10 | Callback ignores external or // next URLs | Built | Not tested |
| Auth | ACC-01 | Change role, change email, delete account | Missing | Not tested |
| Pet owner | PO-01 | Owner dashboard: welcome, pets, upcoming bookings | Built | Not tested |
| Pet owner | PO-02 | Profile save; avatar rejects non-image and files over 2 MB | Built | Not tested |
| Pet owner | PO-03 | Add pet: name required, species list, microchip format, text limits | Built | Not tested |
| Pet owner | PO-04 | Health fields save and show on pet detail | Built | Not tested |
| Pet owner | PO-05 | Pet photo rejects non-image and files over 1 MB | Built | Not tested |
| Pet owner | PO-06 | Edit and delete pet; another user cannot view or edit it | Built | Not tested |
| Pet owner | PO-07 | Settings page shows account info and sign out | Partial | Not tested |

## Search and bookings

| Area | ID | What to cover | Build state | Test status |
| --- | --- | --- | --- | --- |
| Search | SRCH-01 | Filters: city partial match, service type, available now, min rating, combined | Built | Not tested |
| Search | SRCH-02 | Filters persist in URL and reload correctly | Built | Not tested |
| Search | SRCH-03 | Result card shows rating, reviews, price, hours; empty state | Built | Not tested |
| Search | SRCH-04 | Provider profile, public and in dashboard, with reviewer names | Built | Not tested |
| Search | SRCH-05 | Share button copies or shares link | Built | Not tested |
| Search | GEO-01 | Map or distance search | Missing | Not tested |
| Bookings | BK-01 | Wizard: 4 steps, cannot advance without pet, date, slot; past dates disabled | Built | Not tested |
| Bookings | BK-02 | Slots match provider hours in 1-hour steps; taken slots disabled; closed day shows none | Built | Not tested |
| Bookings | BK-03 | Server rejects taken slot, another user's pet, provider account booking | Built | Not tested |
| Bookings | BK-04 | Provider gets booking\_request notification | Built | Not tested |
| Bookings | BK-05 | Provider confirm, complete, cancel with reason per tab | Built | Not tested |
| Bookings | BK-06 | Owner notified on confirm, complete, cancel | Built | Not tested |
| Bookings | BK-07 | Owner cancels pending or confirmed booking; not completed ones | Built | Not tested |
| Bookings | BK-08 | Provider dashboard counts and revenue; rating is hard-coded 4.8 | Partial | Not tested |
| Bookings | BK-09 | Two owners booking the same slot at once: only one succeeds | Missing | Not tested |
| Bookings | BK-10 | Invalid status changes rejected (cancelled back to confirmed) | Missing | Not tested |
| Bookings | BK-11 | Server rejects booking dates in the past | Missing | Not tested |
| Bookings | PAY-01 | Online payment | Missing | Not tested |
| Bookings | REM-01 | Email or SMS booking reminders | Missing | Not tested |

## Reviews, provider and notifications

| Area | ID | What to cover | Build state | Test status |
| --- | --- | --- | --- | --- |
| Reviews | REV-01 | Review form only on completed bookings; 1 to 5 stars required | Built | Not tested |
| Reviews | REV-02 | Second review of same provider is blocked with message | Built | Not tested |
| Reviews | REV-03 | Average rating and count update on cards and profile | Built | Not tested |
| Reviews | REV-04 | Edit or delete own review in UI | Missing | Not tested |
| Provider | SP-01 | Profile validation: pincode 6 digits, Indian phone, price range, avatar 1 MB | Built | Not tested |
| Provider | SP-02 | Weekly hours save and replace old schedule | Built | Not tested |
| Provider | SP-03 | Profile and hours visible to visitors | Built | Not tested |
| Provider | SP-04 | Settings page shows account info and sign out | Partial | Not tested |
| Notifications | NOT-01 | Notification list and unread count on bell | Built | Not tested |
| Notifications | NOT-02 | New notification appears live without reload | Built | Not tested |
| Notifications | NOT-03 | Mark one and mark all as read | Built | Not tested |
| Notifications | NOT-04 | User cannot create notifications for unrelated users | Built | Not tested |

## Community and breeds

| Area | ID | What to cover | Build state | Test status |
| --- | --- | --- | --- | --- |
| Community | COM-01 | Feed and post page with replies, signed out | Built | Not tested |
| Community | COM-02 | Create post: title 120, content 2,000, type, max 5 tags | Built | Not tested |
| Community | COM-03 | Reply up to 1,000 characters; signed-out users prompted | Built | Not tested |
| Community | COM-04 | Author display names shown | Built | Not tested |
| Community | COM-05 | Edit or delete own posts and replies in UI | Missing | Not tested |
| Community | COM-06 | Likes or upvotes | Missing | Not tested |
| Breeds | BR-01 | Directory list and client-side search | Built | Not tested |
| Breeds | BR-02 | Breed detail shows all fields | Built | Not tested |
| Breeds | BR-03 | DB hit, AI generation and cache, placeholder fallback when no API key | Built | Not tested |
| Breeds | BR-04 | GET /api/breeds/\[breed\] returns JSON | Built | Not tested |
| Breeds | BR-05 | Rate limit or allowlist on AI generation | Missing | Not tested |

## Public site, analytics and cross-cutting

| Area | ID | What to cover | Build state | Test status |
| --- | --- | --- | --- | --- |
| Public | PUB-01 | Home, How it works, Privacy, Terms, Coming soon render | Built | Not tested |
| Public | PUB-02 | Beta banner and contact link on every page | Built | Not tested |
| Public | PUB-03 | Contact form limits; saved to DB; email sent through SES | Built | Not tested |
| Public | PUB-04 | Newsletter sign-up, invalid and duplicate emails | Built | Not tested |
| Public | PUB-05 | Sign-up nudges and auth prompts for visitors | Built | Not tested |
| Public | PUB-06 | Blood donation and emergency help | Missing | Not tested |
| Analytics | AN-01 | All 8 events written to analytics\_events | Built | Not tested |
| Analytics | AN-02 | Users cannot read analytics rows | Built | Not tested |
| Analytics | AN-03 | Analytics reporting dashboard | Missing | Not tested |
| Cross-cutting | NFR-01 | RLS: user A cannot read or change user B's pets, bookings, notifications, profile | Built | Not tested |
| Cross-cutting | NFR-02 | All pages usable at 375 px phone width | Built | Not tested |
| Cross-cutting | NFR-03 | Per-page titles and descriptions for SEO | Missing | Not tested |
| Cross-cutting | NFR-04 | Automated tests and CI | Missing | Not tested |
