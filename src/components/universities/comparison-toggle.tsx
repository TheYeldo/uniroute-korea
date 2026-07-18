"use client";

import { Button } from "@/components/ui/button";
import { GitCompareArrows, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const KEY = "uniroute-korea:comparison-selection";

export function getComparisonSelection() {
  if (typeof window === "undefined") return [] as string[];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function ComparisonToggle({ universityId }: { universityId: string }) {
  const t = useTranslations("Universities");
  const limit = useTranslations("Compare");
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    const sync = () => setSelected(getComparisonSelection().includes(universityId));
    queueMicrotask(sync);
    window.addEventListener("comparison-updated", sync);
    return () => window.removeEventListener("comparison-updated", sync);
  }, [universityId]);
  const toggle = () => {
    const current = getComparisonSelection();
    if (!selected && current.length >= 4) {
      toast.error(limit("limit"));
      return;
    }
    const next = selected
      ? current.filter((id) => id !== universityId)
      : [...current, universityId];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("comparison-updated"));
    setSelected(!selected);
  };
  return (
    <Button variant="outline" size="sm" onClick={toggle}>
      {selected ? <X /> : <GitCompareArrows />}
      {selected ? t("compareRemove") : t("compareAdd")}
    </Button>
  );
}
