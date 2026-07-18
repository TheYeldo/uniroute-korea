"use client";

import { Badge } from "@/components/ui/badge";
import { sourcesById } from "@/data/sources";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

export function SourceBadge({ sourceId }: { sourceId?: string }) {
  const t = useTranslations("Common");
  const source = sourceId ? sourcesById.get(sourceId) : undefined;
  if (!source) return <Badge variant="outline">{t("notConfirmed")}</Badge>;
  return (
    <Badge asChild variant="outline" className="max-w-full gap-1.5 font-normal">
      <a href={source.url} target="_blank" rel="noreferrer">
        <span className="truncate">{source.organization}</span>
        <ExternalLink className="size-3" />
      </a>
    </Badge>
  );
}
