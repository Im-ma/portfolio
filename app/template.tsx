"use client";

import { ViewTransition } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={{ default: "page-fade" }} exit={{ default: "page-fade" }} default="none">
      {children}
    </ViewTransition>
  );
}
