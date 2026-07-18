"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DocumentStatus, ReadinessStatus, TaskStatus } from "@/types/domain";
import { useTranslations } from "next-intl";

const style: Record<string, string> = {
  ready: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  meets: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  likely: "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "in-progress": "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  "needs-attention": "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  "needs-improvement": "border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  verify: "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "verification-needed":
    "border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  rejected: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
  expired: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
  passed: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function StatusBadge({
  status,
  className,
}: {
  status: TaskStatus | DocumentStatus | ReadinessStatus;
  className?: string;
}) {
  const t = useTranslations("Status");
  return (
    <Badge variant="outline" className={cn("font-medium", style[status], className)}>
      {t(status)}
    </Badge>
  );
}
