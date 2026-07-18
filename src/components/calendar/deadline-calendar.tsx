"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deadlines } from "@/data/deadlines";
import { universities, universitiesById } from "@/data/universities";
import { toIcsDate } from "@/lib/formatting/dates";
import { CalendarDays, Download, List, Plus, Timeline } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface CalendarItem {
  id: string;
  title: string;
  date: string;
  category: string;
  universityId?: string;
  official: boolean;
  timezone: string;
}

const categoryTranslationKeys = {
  discovery: "categoryDiscovery",
  language: "categoryLanguage",
  documents: "categoryDocuments",
  application: "categoryApplication",
  scholarship: "categoryScholarship",
  interview: "categoryInterview",
  departure: "categoryDeparture",
  deadline: "categoryDeadline",
  personal: "categoryPersonal",
} as const;

export function DeadlineCalendar() {
  const t = useTranslations("Calendar");
  const roadmapT = useTranslations("Roadmap");
  const common = useTranslations("Common");
  const locale = useLocale() as "ru" | "en";
  const { roadmapTasks, upsertRoadmapTask } = usePersonalData();
  const [university, setUniversity] = useState("all");
  const [category, setCategory] = useState("all");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const categoryLabel = (value: string) => {
    const key = categoryTranslationKeys[value as keyof typeof categoryTranslationKeys];
    return key ? roadmapT(key) : value;
  };
  const items = useMemo<CalendarItem[]>(
    () =>
      [
        ...deadlines
          .filter((item) => new Date(item.endsAt) >= new Date())
          .map((item) => ({
            id: item.id,
            title: item.title[locale],
            date: item.endsAt,
            category: item.category,
            universityId: item.universityId,
            official: true,
            timezone: item.timezone,
          })),
        ...roadmapTasks
          .filter((item) => item.deadline)
          .map((item) => ({
            id: item.id,
            title: item.title,
            date: `${item.deadline}T12:00:00`,
            category: item.category,
            universityId: item.universityId,
            official: false,
            timezone: "local",
          })),
      ]
        .filter(
          (item) =>
            (university === "all" || item.universityId === university) &&
            (category === "all" || item.category === category),
        )
        .toSorted((a, b) => a.date.localeCompare(b.date)),
    [roadmapTasks, locale, university, category],
  );
  const categories = [...new Set(items.map((item) => item.category))];
  const exportIcs = () => {
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//UniRoute Korea//Deadline Calendar//EN",
      "CALSCALE:GREGORIAN",
      ...items.flatMap((item) => [
        "BEGIN:VEVENT",
        `UID:${item.id}@uniroute-korea`,
        `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
        `DTSTART:${toIcsDate(item.date)}`,
        `SUMMARY:${item.title.replace(/[;,]/g, " ")}`,
        `DESCRIPTION:${item.official ? t("icsOfficial") : t("icsPersonal")}`,
        "END:VEVENT",
      ]),
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "uniroute-korea-deadlines.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const add = () => {
    if (!title || !date) return;
    upsertRoadmapTask({
      id: crypto.randomUUID(),
      title,
      description: "",
      category: "personal",
      deadline: date,
      status: "not-started",
      priority: "medium",
      notes: "",
      dependencies: [],
      suggested: false,
    });
    setTitle("");
    setDate("");
    setOpen(false);
  };
  const card = (item: CalendarItem) => (
    <Card key={item.id}>
      <CardContent className="flex flex-col justify-between gap-4 pt-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={item.official ? "default" : "outline"}>
              {item.official ? roadmapT("official") : roadmapT("suggested")}
            </Badge>
            <Badge variant="secondary">{categoryLabel(item.category)}</Badge>
          </div>
          <h3 className="mt-3 font-medium">{item.title}</h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {new Intl.DateTimeFormat(locale, {
              dateStyle: "long",
              timeStyle: item.official ? "short" : undefined,
              timeZone: item.official ? "Asia/Seoul" : undefined,
            }).format(new Date(item.date))}
          </p>
        </div>
        {item.universityId && (
          <span className="text-sm text-muted-foreground">
            {universitiesById.get(item.universityId)?.shortName}
          </span>
        )}
      </CardContent>
    </Card>
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportIcs}>
            <Download />
            {t("export")}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus />
                {t("add")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("add")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calendar-task-title">{roadmapT("taskTitle")}</Label>
                  <Input
                    id="calendar-task-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calendar-task-date">{roadmapT("deadline")}</Label>
                  <Input
                    id="calendar-task-date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {common("cancel")}
                </Button>
                <Button onClick={add}>{common("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardContent className="flex flex-wrap gap-3 pt-6">
          <Select value={university} onValueChange={setUniversity}>
            <SelectTrigger className="w-56" aria-label={t("university")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {common("all")} · {t("university")}
              </SelectItem>
              {universities.map((item) => (
                <SelectItem value={item.id} key={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-52" aria-label={t("category")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {common("all")} · {t("category")}
              </SelectItem>
              {categories.map((item) => (
                <SelectItem value={item} key={item}>
                  {categoryLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">{t("kst")}</p>
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="month">
            <CalendarDays />
            {t("month")}
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Timeline />
            {t("timeline")}
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <List />
            {t("upcoming")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-5 space-y-3">
          {items.length ? (
            items.map(card)
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                {t("empty")}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="timeline" className="mt-5">
          <div className="space-y-4">{items.map(card)}</div>
        </TabsContent>
        <TabsContent value="month" className="mt-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(
              items.reduce<Record<string, CalendarItem[]>>((groups, item) => {
                const key = item.date.slice(0, 7);
                groups[key] = [...(groups[key] ?? []), item];
                return groups;
              }, {}),
            ).map(([month, monthItems]) => (
              <Card key={month}>
                <CardHeader>
                  <CardTitle className="text-base">{month}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {monthItems.map((item) => (
                    <div key={item.id} className="border-b pb-3 text-sm last:border-0">
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.date.slice(8, 10)}
                      </span>
                      <p className="mt-1">{item.title}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
