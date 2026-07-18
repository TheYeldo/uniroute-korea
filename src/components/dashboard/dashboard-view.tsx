"use client";

import { GuestBanner } from "@/components/layout/guest-banner";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { StatusBadge } from "@/components/data/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { deadlines } from "@/data/deadlines";
import { scholarships } from "@/data/scholarships";
import { universitiesById } from "@/data/universities";
import { Link } from "@/i18n/navigation";
import { daysUntil } from "@/lib/formatting/dates";
import {
  ArrowRight,
  CalendarClock,
  FileCheck2,
  GraduationCap,
  ListChecks,
  NotebookPen,
  Sparkles,
  Star,
} from "lucide-react";
import { useTranslations } from "next-intl";

export function DashboardView() {
  const t = useTranslations("Dashboard");
  const common = useTranslations("Common");
  const u = useTranslations("Universities");
  const { profile, roadmapTasks, documents, notes, savedUniversities, comparisons } =
    usePersonalData();
  const upcoming = deadlines
    .filter((item) => new Date(item.endsAt) >= new Date())
    .sort((a, b) => a.endsAt.localeCompare(b.endsAt))[0];
  const readyDocs = documents.filter((item) => ["ready", "submitted"].includes(item.status)).length;
  const completedTasks = roadmapTasks.filter((item) => item.status === "ready").length;
  const taskProgress = roadmapTasks.length
    ? Math.round((completedTasks / roadmapTasks.length) * 100)
    : 0;
  const scholarshipMatches = scholarships.filter(
    (item) => !profile.scholarshipRequired || item.funding !== "partial",
  ).length;
  const priorities = [
    profile.ieltsScore === null ? t("improveEnglish") : null,
    documents.length === 0 ? t("prepareDocuments") : null,
    savedUniversities.length < 3 ? t("buildShortlist") : null,
  ].filter((item): item is string => Boolean(item));
  return (
    <div className="space-y-6">
      <GuestBanner />
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("welcome")}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/readiness">
            {t("openReadiness")}
            <ArrowRight />
          </Link>
        </Button>
      </div>
      {!profile.onboardingComplete ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-start justify-between gap-5 pt-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold">{t("goal")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("notSet")}</p>
            </div>
            <Button asChild>
              <Link href="/onboarding">{t("startOnboarding")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="h-1 bg-primary" />
          <CardContent className="grid gap-6 pt-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-medium text-primary">{t("goal")}</p>
              <h2 className="mt-2 text-2xl font-semibold">
                {t("target", { degree: u(profile.degreeLevel), major: profile.preferredMajor })}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">{common("southKorea")}</Badge>
                <Badge variant="secondary">
                  {t("intake", { intake: u(profile.targetIntake), year: profile.admissionYear })}
                </Badge>
                {profile.scholarshipRequired && <Badge>{t("scholarshipRequired")}</Badge>}
              </div>
            </div>
            {upcoming && (
              <div className="rounded-xl bg-muted p-4 md:min-w-52">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClock className="size-4" />
                  {t("nearest")}
                </div>
                <p className="mt-2 text-2xl font-semibold">
                  {t("days", { count: Math.max(0, daysUntil(upcoming.endsAt)) })}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {upcoming.title[profile.interfaceLanguage]}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      <section>
        <h2 className="mb-4 text-xl font-semibold">{t("progress")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <ListChecks className="size-4 text-primary" />
                {t("tasks")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {completedTasks}/{roadmapTasks.length}
              </p>
              <Progress value={taskProgress} className="mt-3 h-1.5" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileCheck2 className="size-4 text-primary" />
                {t("documents")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {readyDocs}/{documents.length}
              </p>
              <StatusBadge
                status={
                  documents.length && readyDocs === documents.length
                    ? "ready"
                    : documents.length
                      ? "in-progress"
                      : "not-started"
                }
                className="mt-3"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Star className="size-4 text-primary" />
                {t("shortlist")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{savedUniversities.length}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {savedUniversities[0]
                  ? universitiesById.get(savedUniversities[0].universityId)?.name
                  : common("noData")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="size-4 text-primary" />
                {t("matches")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{scholarshipMatches}</p>
              <p className="mt-3 text-xs text-muted-foreground">{t("disclaimer")}</p>
            </CardContent>
          </Card>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="size-5 text-primary" />
              {t("priorities")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {priorities.length ? (
              priorities.map((item, index) => (
                <div className="flex gap-3 rounded-lg border p-3" key={item}>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6">{item}</p>
                </div>
              ))
            ) : (
              <StatusBadge status="ready" />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <NotebookPen className="size-5 text-primary" />
              {t("notes")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.length ? (
              notes.slice(0, 3).map((note) => (
                <div className="border-b pb-3 last:border-0" key={note.id}>
                  <p className="text-sm font-medium">{note.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{note.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t("noNotes")}</p>
            )}
            <Button asChild variant="ghost" size="sm">
              <Link href="/notes">
                {common("view")}
                <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("comparisons")}</p>
            <p className="mt-2 text-2xl font-semibold">{comparisons.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("english")}</p>
            <p className="mt-2 text-lg font-semibold">
              {profile.ieltsScore
                ? `IELTS ${profile.ieltsScore}`
                : profile.englishLevel || common("notConfirmed")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("korean")}</p>
            <p className="mt-2 text-lg font-semibold">
              {profile.topikScore
                ? `TOPIK ${profile.topikScore}`
                : profile.koreanLevel || common("notConfirmed")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
