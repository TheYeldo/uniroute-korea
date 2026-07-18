"use client";

import { StatusBadge } from "@/components/data/status-badge";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createSuggestedRoadmap } from "@/data/defaults";
import { TASK_STATUSES } from "@/lib/constants";
import type { RoadmapTask, TaskStatus } from "@/types/domain";
import { CalendarDays, Check, List, Plus, Sparkles, Timeline, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

const blankTask = (): RoadmapTask => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  category: "personal",
  deadline: new Date().toISOString().slice(0, 10),
  status: "not-started",
  priority: "medium",
  notes: "",
  dependencies: [],
  suggested: false,
});

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

export function RoadmapWorkspace() {
  const t = useTranslations("Roadmap");
  const statusT = useTranslations("Status");
  const common = useTranslations("Common");
  const locale = useLocale();
  const { profile, roadmapTasks, setRoadmapTasks, upsertRoadmapTask, removeRoadmapTask } =
    usePersonalData();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<RoadmapTask>(blankTask());
  const categoryLabel = (value: string) => {
    const key = categoryTranslationKeys[value as keyof typeof categoryTranslationKeys];
    return key ? t(key) : value;
  };
  const sorted = roadmapTasks.toSorted((a, b) => a.deadline.localeCompare(b.deadline));
  const tasksByMonth = sorted.reduce<Record<string, typeof sorted>>((groups, item) => {
    const month = item.deadline.slice(0, 7) || "unscheduled";
    groups[month] = [...(groups[month] ?? []), item];
    return groups;
  }, {});
  const done = sorted.filter((item) => item.status === "ready").length;
  const progress = sorted.length ? (done / sorted.length) * 100 : 0;
  const save = () => {
    if (!draft.title.trim()) return;
    upsertRoadmapTask(draft);
    setDraft(blankTask());
    setOpen(false);
  };
  const renderTask = (item: RoadmapTask) => (
    <Card key={item.id}>
      <CardContent className="flex flex-col gap-4 pt-6 md:flex-row md:items-start">
        <Button
          size="icon-sm"
          variant={item.status === "ready" ? "default" : "outline"}
          aria-label={t("complete")}
          onClick={() =>
            upsertRoadmapTask({
              ...item,
              status: item.status === "ready" ? "in-progress" : "ready",
            })
          }
        >
          <Check />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">{item.title}</h3>
            <Badge variant={item.suggested ? "secondary" : "outline"}>
              {item.suggested ? t("suggested") : categoryLabel(item.category)}
            </Badge>
            <StatusBadge status={item.status} />
          </div>
          {item.description && (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Input
              type="date"
              value={item.deadline}
              className="h-8 w-auto"
              aria-label={t("reschedule")}
              onChange={(event) => upsertRoadmapTask({ ...item, deadline: event.target.value })}
            />
            <Select
              value={item.status}
              onValueChange={(value) => upsertRoadmapTask({ ...item, status: value as TaskStatus })}
            >
              <SelectTrigger className="h-8 w-44" aria-label={t("status")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((status) => (
                  <SelectItem value={status} key={status}>
                    {statusT(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => removeRoadmapTask(item.id)}
          aria-label={common("delete")}
        >
          <Trash2 />
        </Button>
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setRoadmapTasks(createSuggestedRoadmap(profile))}
          >
            <Sparkles />
            {t("generate")}
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
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roadmap-task-title">{t("taskTitle")}</Label>
                  <Input
                    id="roadmap-task-title"
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roadmap-task-description">{t("description")}</Label>
                  <Textarea
                    id="roadmap-task-description"
                    value={draft.description}
                    onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="roadmap-task-deadline">{t("deadline")}</Label>
                    <Input
                      id="roadmap-task-deadline"
                      type="date"
                      value={draft.deadline}
                      onChange={(event) => setDraft({ ...draft, deadline: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roadmap-task-priority">{t("priority")}</Label>
                    <Select
                      value={draft.priority}
                      onValueChange={(value) =>
                        setDraft({ ...draft, priority: value as RoadmapTask["priority"] })
                      }
                    >
                      <SelectTrigger id="roadmap-task-priority" aria-label={t("priority")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["low", "medium", "high"] as const).map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {t(priority)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  {common("cancel")}
                </Button>
                <Button onClick={save}>{common("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <span>
              {done}/{sorted.length}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mt-3 h-2" />
        </CardContent>
      </Card>
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">
            <List />
            {t("list")}
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Timeline />
            {t("timeline")}
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays />
            {t("calendar")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-5 space-y-3">
          {sorted.length ? (
            sorted.map(renderTask)
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                {t("empty")}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="timeline" className="mt-5">
          <div className="relative space-y-5 before:absolute before:inset-y-0 before:start-[7px] before:w-px before:bg-border">
            {sorted.map((item) => (
              <div className="relative ps-8" key={item.id}>
                <span className="absolute start-0 top-1.5 size-3.5 rounded-full border-2 border-background bg-primary" />
                <p className="font-mono text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                    new Date(`${item.deadline}T12:00:00`),
                  )}
                </p>
                <h3 className="mt-1 font-medium">{item.title}</h3>
                <div className="mt-2">
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="calendar" className="mt-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(tasksByMonth).map(([month, items]) => (
              <Card key={month}>
                <CardHeader>
                  <CardTitle className="text-base">{month}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div className="border-b pb-3 text-sm last:border-0" key={item.id}>
                      <span className="font-mono text-xs text-muted-foreground">
                        {item.deadline.slice(8, 10)}
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
