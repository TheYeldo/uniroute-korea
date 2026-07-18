"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Common");
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const nextLocale = locale === "ru" ? "en" : "ru";
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      aria-label={`${t("language")}: ${nextLocale.toUpperCase()}`}
      onClick={() => startTransition(() => router.replace(pathname, { locale: nextLocale }))}
    >
      <Languages className="size-4" aria-hidden="true" />
      {nextLocale.toUpperCase()}
    </Button>
  );
}
