"use client";

import Cal from "@calcom/embed-react";

/**
 * Cal.com mounts a cross-origin iframe. Keys pressed inside it, including
 * Escape and T, never reach this page. The panel header keeps a Close
 * button pinned so the panel can still be dismissed.
 */
export function CalEmbed({ calLink }: { calLink: string }) {
  return (
    <Cal
      calLink={calLink}
      style={{ width: "100%", height: "420px", overflow: "auto" }}
      config={{ layout: "month_view", theme: "light" }}
    />
  );
}
