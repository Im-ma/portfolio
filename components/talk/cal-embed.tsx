"use client";

import Cal from "@calcom/embed-react";

export function CalEmbed({ calLink }: { calLink: string }) {
  return (
    <Cal
      calLink={calLink}
      style={{ width: "100%", height: "420px", overflow: "auto" }}
      config={{ layout: "month_view", theme: "light" }}
    />
  );
}
