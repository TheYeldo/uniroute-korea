import type { MetadataRoute } from "next";
import { guides } from "@/data/guides";
import { universities } from "@/data/universities";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/universities",
    "/programs",
    "/scholarships",
    "/compare",
    "/guides",
    "/privacy",
  ];
  return (["ru", "en"] as const).flatMap((locale) => [
    ...staticPages.map((path) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: new Date("2026-07-19"),
      changeFrequency: path === "/universities" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
    })),
    ...universities.map((item) => ({
      url: `${SITE_URL}/${locale}/universities/${item.slug}`,
      lastModified: new Date(item.lastVerifiedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...guides.map((item) => ({
      url: `${SITE_URL}/${locale}/guides/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);
}
