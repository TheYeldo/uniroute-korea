"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Button } from "@/components/ui/button";
import { deadlines } from "@/data/deadlines";
import { Link } from "@/i18n/navigation";
import { CalendarPlus, ClipboardPlus, NotebookPen } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

export function UniversityTools({
  universityId,
  universityName,
}: {
  universityId: string;
  universityName: string;
}) {
  const t = useTranslations("University");
  const common = useTranslations("Common");
  const locale = useLocale() as "ru" | "en";
  const { upsertRoadmapTask } = usePersonalData();
  const add = (officialOnly: boolean) => {
    const deadline = deadlines.find(
      (item) => item.universityId === universityId && new Date(item.endsAt) > new Date(),
    );
    upsertRoadmapTask({
      id: crypto.randomUUID(),
      title: deadline
        ? `${universityName}: ${deadline.title[locale]}`
        : `${universityName}: ${t("verifyCycle")}`,
      description: deadline ? t("officialImported") : t("monitorOfficial"),
      category: officialOnly ? "deadline" : "discovery",
      deadline: deadline?.endsAt.slice(0, 10) ?? "",
      status: "not-started",
      priority: "high",
      universityId,
      sourceId: deadline?.sourceId,
      notes: "",
      dependencies: [],
      suggested: !deadline,
    });
    toast.success(common("saved"));
  };
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => add(false)}>
        <ClipboardPlus />
        {t("addRoadmap")}
      </Button>
      <Button variant="outline" size="sm" onClick={() => add(true)}>
        <CalendarPlus />
        {t("addCalendar")}
      </Button>
      <Button asChild variant="outline" size="sm">
        <Link href={`/notes?entity=university&id=${universityId}`}>
          <NotebookPen />
          {t("note")}
        </Link>
      </Button>
    </div>
  );
}
