"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { programs } from "@/data/programs";
import { universitiesById } from "@/data/universities";
import { Link } from "@/i18n/navigation";
import type { ApplicationStatus, SavedUniversity } from "@/types/domain";
import { ExternalLink, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

const statuses: ApplicationStatus[] = [
  "exploring",
  "shortlisted",
  "preparing",
  "ready-to-apply",
  "submitted",
  "interview",
  "accepted",
  "waitlisted",
  "rejected",
  "declined",
];
export function ShortlistWorkspace() {
  const t = useTranslations("Saved");
  const roadmapT = useTranslations("Roadmap");
  const common = useTranslations("Common");
  const { savedUniversities, updateSavedUniversity, removeUniversity } = usePersonalData();
  const patch = (item: SavedUniversity, values: Partial<SavedUniversity>) =>
    updateSavedUniversity({ ...item, ...values });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>
      {savedUniversities.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {savedUniversities.map((item) => {
            const university = universitiesById.get(item.universityId);
            if (!university) return null;
            const available = programs.filter(
              (program) => program.universityId === item.universityId,
            );
            const fieldId = (field: string) => `${item.universityId}-${field}`;
            return (
              <Card key={item.universityId}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{university.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">{university.city}</p>
                    </div>
                    <Badge>{t(item.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={fieldId("priority")}>{t("priority")}</Label>
                    <Select
                      value={item.priority}
                      onValueChange={(value) =>
                        patch(item, { priority: value as SavedUniversity["priority"] })
                      }
                    >
                      <SelectTrigger
                        id={fieldId("priority")}
                        aria-label={`${university.name}: ${t("priority")}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["low", "medium", "high"] as const).map((value) => (
                          <SelectItem value={value} key={value}>
                            {roadmapT(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={fieldId("status")}>{t("status")}</Label>
                    <Select
                      value={item.status}
                      onValueChange={(value) => patch(item, { status: value as ApplicationStatus })}
                    >
                      <SelectTrigger
                        id={fieldId("status")}
                        aria-label={`${university.name}: ${t("status")}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((value) => (
                          <SelectItem value={value} key={value}>
                            {t(value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor={fieldId("program")}>{t("program")}</Label>
                    <Select
                      value={item.selectedProgramId ?? "none"}
                      onValueChange={(value) =>
                        patch(item, { selectedProgramId: value === "none" ? undefined : value })
                      }
                    >
                      <SelectTrigger
                        id={fieldId("program")}
                        aria-label={`${university.name}: ${t("program")}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{common("notConfirmed")}</SelectItem>
                        {available.map((program) => (
                          <SelectItem value={program.id} key={program.id}>
                            {program.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={fieldId("advantages")}>{t("advantages")}</Label>
                    <Textarea
                      id={fieldId("advantages")}
                      value={item.advantages}
                      onChange={(event) => patch(item, { advantages: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={fieldId("concerns")}>{t("concerns")}</Label>
                    <Textarea
                      id={fieldId("concerns")}
                      value={item.concerns}
                      onChange={(event) => patch(item, { concerns: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={fieldId("target")}>{t("target")}</Label>
                    <Input
                      id={fieldId("target")}
                      value={item.targetIntake}
                      onChange={(event) => patch(item, { targetIntake: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={fieldId("plan")}>{t("plan")}</Label>
                    <Input
                      id={fieldId("plan")}
                      value={item.scholarshipPlan}
                      onChange={(event) => patch(item, { scholarshipPlan: event.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor={fieldId("notes")}>{t("notes")}</Label>
                    <Textarea
                      id={fieldId("notes")}
                      value={item.notes}
                      onChange={(event) => patch(item, { notes: event.target.value })}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 sm:col-span-2">
                    <Button asChild variant="outline">
                      <Link href={`/universities/${university.slug}`}>
                        {common("view")}
                        <ExternalLink />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeUniversity(item.universityId)}
                    >
                      <Trash2 />
                      {common("delete")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            {t("empty")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
