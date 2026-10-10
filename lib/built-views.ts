import type { Block } from "@/lib/work-types";

export type BuiltView = "all" | "design" | "engineering";

const designTitles = new Set([
  "design",
  "foundations",
  "components",
  "figma prototype",
  "references",
  "photos",
  "prototype",
]);

const engineeringTitles = new Set(["code", "working console", "hardware and tracking", "v1"]);

/** How a "How I built it" row should behave when the view toggle is on. */
export function itemView(title?: string): BuiltView | "shared" {
  if (!title) return "shared";
  const key = title.trim().toLowerCase();
  if (designTitles.has(key)) return "design";
  if (engineeringTitles.has(key)) return "engineering";
  return "shared";
}

export function sectionSplitsViews(blocks: Block[]): boolean {
  let design = false;
  let engineering = false;
  for (const block of blocks) {
    if (block.type !== "list") continue;
    for (const item of block.items) {
      const view = itemView(item.title);
      if (view === "design") design = true;
      if (view === "engineering") engineering = true;
    }
  }
  return design && engineering;
}
