"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Errors");
  const common = useTranslations("Common");
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <Card className="max-w-lg">
        <CardContent className="py-10 text-center">
          <AlertTriangle className="mx-auto size-10 text-destructive" />
          <h1 className="mt-5 text-2xl font-semibold">{t("title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("description")}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={reset}>
              <RotateCcw />
              {common("retry")}
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">{t("home")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
