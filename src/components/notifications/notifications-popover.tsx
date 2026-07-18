"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@/i18n/navigation";
import { Bell, FileWarning, ListTodo } from "lucide-react";
import { useTranslations } from "next-intl";

const UPCOMING_CUTOFF = Date.now() + 1000 * 60 * 60 * 24 * 30;

export function NotificationsPopover() {
  const t = useTranslations("Notifications");
  const { roadmapTasks, documents, settings } = usePersonalData();
  const upcoming = roadmapTasks.filter(
    (item) =>
      item.status !== "ready" &&
      item.deadline &&
      new Date(item.deadline) <= new Date(UPCOMING_CUTOFF),
  ).length;
  const incomplete = documents.filter(
    (item) => !["ready", "submitted"].includes(item.status),
  ).length;
  const count = settings.inAppNotifications ? Number(upcoming > 0) + Number(incomplete > 0) : 0;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="relative" aria-label={t("open")}>
          <Bell className="size-4" />
          {count > 0 && (
            <span className="absolute end-0 top-0 size-2 rounded-full bg-destructive" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t("title")}</h2>
          <Badge variant="secondary">{count}</Badge>
        </div>
        <div className="mt-4 space-y-2">
          {upcoming > 0 && (
            <Button asChild variant="ghost" className="h-auto w-full justify-start gap-3 py-3">
              <Link href="/roadmap">
                <ListTodo className="size-4 text-primary" />
                <span className="text-start">
                  <span className="block text-sm font-medium">{t("upcomingTask")}</span>
                  <span className="text-xs text-muted-foreground">{upcoming}</span>
                </span>
              </Link>
            </Button>
          )}
          {incomplete > 0 && (
            <Button asChild variant="ghost" className="h-auto w-full justify-start gap-3 py-3">
              <Link href="/documents">
                <FileWarning className="size-4 text-amber-600" />
                <span className="text-start">
                  <span className="block text-sm font-medium">{t("incompleteDocuments")}</span>
                  <span className="text-xs text-muted-foreground">{incomplete}</span>
                </span>
              </Link>
            </Button>
          )}
          {count === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("empty")}</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
