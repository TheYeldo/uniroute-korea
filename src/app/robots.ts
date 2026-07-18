import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/ru", "/en"],
        disallow: [
          "/ru/dashboard",
          "/en/dashboard",
          "/ru/onboarding",
          "/en/onboarding",
          "/ru/roadmap",
          "/en/roadmap",
          "/ru/documents",
          "/en/documents",
          "/ru/calendar",
          "/en/calendar",
          "/ru/saved",
          "/en/saved",
          "/ru/readiness",
          "/en/readiness",
          "/ru/notes",
          "/en/notes",
          "/ru/settings",
          "/en/settings",
          "/ru/auth/",
          "/en/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
