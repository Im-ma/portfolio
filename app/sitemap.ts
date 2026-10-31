import { works } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const routes = [
    "",
    "/about",
    "/gatherings",
    // "/lab", // hidden for now
    ...works.map((work) => `/work/${work.slug}`),
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
