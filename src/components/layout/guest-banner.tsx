"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { HardDrive } from "lucide-react";
import { useTranslations } from "next-intl";

export function GuestBanner() {
  const { user, hydrated } = usePersonalData();
  const t = useTranslations("Common");
  if (!hydrated || user) return null;
  return (
    <Alert className="border-blue-500/20 bg-blue-500/5">
      <HardDrive className="size-4" />
      <AlertTitle>{t("guest")}</AlertTitle>
      <AlertDescription className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <span>{t("guestNotice")}</span>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href="/auth/register">{t("createAccount")}</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
