import type { LocaleCode } from "@/types/domain";
import type { Metadata } from "next";

export function localizedAlternates(locale: LocaleCode, pathname = ""): Metadata["alternates"] {
  const normalizedPath = pathname && pathname !== "/" ? `/${pathname.replace(/^\/+/, "")}` : "";

  return {
    canonical: `/${locale}${normalizedPath}`,
    languages: {
      ru: `/ru${normalizedPath}`,
      en: `/en${normalizedPath}`,
      "x-default": `/ru${normalizedPath}`,
    },
  };
}
