# Design document

The UI is a warm, light, card-based design: orange brand colour, teal secondary, a Fraunces serif for headings and DM Sans for body text, on an off-white page. Tokens live in `app/globals.css` (CSS variables plus component classes) and are mirrored in `tailwind.config.ts`.

## 4.1 Design tokens

| Token group | Values |
| --- | --- |
| Brand | `--color-brand` #FF5722, light #FFF3EE, dark #E64A19 |
| Secondary | `--color-sage` #00897B, light #E0F2F1 |
| Neutrals | ink #111111, muted #555555, light #888888, border #EBEBEB, page bg #F7F7F5, cream #FFFBF5, white |
| Status | success #16A34A, warning #D97706, error #DC2626, info #2563EB, each with a pale background |
| Type | Headings Fraunces (400–900, italic); body DM Sans (400–700); scale 0.7rem to 2.25rem (`--text-xs` to `--text-4xl`) |
| Spacing | 4px steps: `--space-1` 0.25rem to `--space-12` 3rem |
| Radius | 6, 10, 14, 20 px and full |
| Shadow | sm, md, lg and an orange `--shadow-brand` for primary buttons |
| Motion | `--transition: all 0.18s ease` |

There is no dark theme.

## 4.2 Component classes

| Class family | Variants | Used for |
| --- | --- | --- |
| Layout | `.container-app` (max 1,100 px), `.page-wrapper`, `.section`, `.section-sm` | Page width and vertical rhythm |
| Cards | `.card`, `.card-flat` | Pets, providers, bookings, posts |
| Buttons | `.btn` + `-primary`, `-outline`, `-ghost`, `-sage`, `-sm`, `-lg`, `-full`, `-full-mobile` | All actions |
| Badges | `.badge` + brand, sage, success, warning, error, info, neutral | Booking status, service type, post type |
| Headings | `.heading-xl/lg/md/sm`, `.section-header/title/link` | Page and section titles |
| Forms | `.form-group`, `-label`, `-hint`, `-error`, `-section`, `-section-title` | Pet, profile, provider, contact, post forms |
| Feedback | `.alert-*`, `.empty-state*`, `.skeleton` | Messages, empty lists, loading |
| Avatars and grids | `.avatar-sm/md/lg/xl`, `.grid-cards`, `.grid-pets` (2, 3, 4 columns by width) | People, pets, card lists |

React components: `Header`, `NavBar`, `Footer`, `NewsletterSection`, `ContactForm`, `ShareButton`, `ProviderCard`, `PublicProviderCard`, `ProviderReviewsSection`, and in `ui/`: `AuthPromptButton`, `ComingSoonCard`, `DashboardNavLinks`, `EmptyState`, `NotificationsBell`, `SignupNudge`, `TrackEvent`, `WelcomeBanner`.

## 4.3 Layout and navigation

Every page has the beta banner, header with logo and nav, content, and footer. Breakpoints: 640 px and 1,024 px for grids; 768 px switches to mobile padding and a slide-in menu.

| Who | Top navigation | Profile menu |
| --- | --- | --- |
| Visitor | Home, Services, Breeds, Community, Contact; Log in, Sign up |  |
| Pet owner | Home, My Dogs, Services, Bookings, Breeds, Community, Contact; notifications bell | Profile, Settings, Sign out |
| Service provider | Home, My Profile, Bookings, Breeds, Community, Contact; notifications bell | Profile, Settings, Sign out |
| Signed in, no role | Home, Breeds, Community, Contact |  |

## 4.4 Screen inventory

| Area | Route | Purpose |
| --- | --- | --- |
| Public | `/` | Hero, services, how it works, newsletter |
| Public | `/how-it-works`, `/privacy`, `/terms`, `/coming-soon` | Content pages |
| Public | `/search`, `/providers/[id]` | Provider search and public profile |
| Public | `/breeds`, `/breeds/[breed]` | Breed directory and breed detail |
| Public | `/community`, `/community/[id]`, `/community/new` | Feed, post with replies, new post (sign-in needed to submit) |
| Public | `/contact` | Contact form |
| Auth | `/login`, `/signup`, `/forgot-password`, `/resend-verification`, `/auth/update-password`, `/onboarding` | Account access and role choice |
| Pet owner | `/dashboard/pet-owner` | Welcome, pets, upcoming bookings, emergency blood card |
| Pet owner | `/dashboard/pet-owner/pets`, `/pets/new`, `/pets/[id]`, `/pets/[id]/edit` | Pet list, add, detail, edit |
| Pet owner | `/dashboard/pet-owner/search`, `/providers/[id]`, `/providers/[id]/book` | Find, view and book a provider |
| Pet owner | `/dashboard/pet-owner/bookings`, `/notifications`, `/profile`, `/settings` | Bookings with review form, notifications, profile, settings |
| Provider | `/dashboard/service-provider` | Stats, revenue, blood request card |
| Provider | `/dashboard/service-provider/profile`, `/profile/edit` | Business profile view and edit with weekly hours |
| Provider | `/dashboard/service-provider/bookings`, `/notifications`, `/settings` | Booking tabs, notifications, settings |

## 4.5 Key interaction patterns

- **Booking wizard**: four steps with a progress indicator: 1 select pet, 2 select date (no past dates), 3 select time slot (taken slots disabled), 4 review notes and confirm.
- **Provider bookings**: tabs Pending, Confirmed, Completed, Cancelled; action buttons per tab; native confirm and prompt dialogs for status changes and cancel reasons; toast on a new live booking.
- **Search**: filter controls write to the URL; results as cards with rating, price and hours.
- **Gated actions**: visitors see `AuthPromptButton` and `SignupNudge` instead of actions that need an account.
- **Empty states**: `EmptyState` with icon, title, text and a call to action.
- **Unbuilt features**: `ComingSoonCard` and `/coming-soon` (blood donation).

## 4.6 Design gaps

- Home page shows "10,000+ dog owners" and "500+ verified vets", but no provider verification exists; confirm these figures before marketing.
- Native `window.confirm` and `window.prompt` dialogs in provider bookings do not match the visual style.
- Tailwind config and CSS variables duplicate the same tokens; one source would avoid drift.
- The root page title and description are generic on every page ("PawConnect" / "Pet community platform").
