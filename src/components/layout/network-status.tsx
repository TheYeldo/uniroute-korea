"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function NetworkStatus() {
  const t = useTranslations("Errors");
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (online) return null;
  return (
    <Alert className="fixed inset-x-4 top-20 z-[70] mx-auto max-w-xl border-amber-500/30 bg-background shadow-lg">
      <WifiOff className="size-4" />
      <AlertDescription>{t("offline")}</AlertDescription>
    </Alert>
  );
}
