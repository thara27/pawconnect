"use client";

/**
 * Lightweight client-side analytics.
 * Events are stored in the `analytics_events` table (see migration below).
 * All calls are fire-and-forget — they never throw or block the UI.
 *
 * Required Supabase migration (run once):
 *
 *   create table if not exists public.analytics_events (
 *     id         uuid        primary key default gen_random_uuid(),
 *     event      text        not null,
 *     properties jsonb,
 *     user_id    uuid        references auth.users(id) on delete set null,
 *     created_at timestamptz not null default now()
 *   );
 *   alter table public.analytics_events enable row level security;
 *   -- Allow authenticated users to insert their own events
 *   create policy "Users can insert own analytics events"
 *     on public.analytics_events for insert
 *     to authenticated
 *     with check (auth.uid() = user_id or user_id is null);
 */

import { createClient } from "@/lib/supabase/client";

type Properties = Record<string, string | number | boolean | null>;

export function track(event: string, properties?: Properties): void {
  void (async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("analytics_events").insert({
        event,
        properties: properties ?? null,
        user_id: user?.id ?? null,
      });
    } catch {
      // Never surface analytics errors to the user
    }
  })();
}

// ── Named event helpers ────────────────────────────────────────────────────

export const Analytics = {
  pageView: (page: string) => track("page_view", { page }),
  bookingCreated: (providerId: string, serviceType: string) =>
    track("booking_created", { provider_id: providerId, service_type: serviceType }),
  petAdded: () => track("pet_added"),
  searchPerformed: (query: string) => track("search_performed", { query }),
  providerViewed: (providerId: string) => track("provider_viewed", { provider_id: providerId }),
  reviewSubmitted: (providerId: string, rating: number) =>
    track("review_submitted", { provider_id: providerId, rating }),
  shareClicked: (channel: "whatsapp" | "copy_link", context: string) =>
    track("share_clicked", { channel, context }),
  referralLinkCopied: () => track("referral_link_copied"),
};
