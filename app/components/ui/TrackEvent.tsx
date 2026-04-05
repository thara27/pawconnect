"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type Props = {
  event: string;
  properties?: Record<string, string | number | boolean | null>;
};

/**
 * Fires a single analytics event on mount. Renders nothing.
 * Use in server components to bridge server-detected state into analytics.
 *
 * Example: <TrackEvent event="pet_added" />
 */
export default function TrackEvent({ event, properties }: Props) {
  useEffect(() => {
    track(event, properties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
