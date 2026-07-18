"use client";

import { StatusBadge } from "@/components/data/status-badge";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deadlines } from "@/data/deadlines";
import { programs } from "@/data/programs";
import { universities, universitiesById } from "@/data/universities";
import { evaluateReadiness } from "@/lib/readiness/evaluate";
import { Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export function ReadinessWorkspace() {
  const t = useTranslations("Readiness");
  const locale = useLocale() as "ru" | "en";
  const { profile, documents, savedUniversities } = usePersonalData();
  const [universityId, setUniversityId] = useState(
    savedUniversities[0]?.universityId ?? universities[0].id,
  );
  const university = universitiesById.get(universityId) ?? universities[0];
  const program =
    programs.find(
      (item) =>
        item.universityId === university.id &&
        item.field.toLocaleLowerCase().includes(profile.preferredMajor.toLocaleLowerCase()),
    ) ?? programs.find((item) => item.universityId === university.id);
  const results = useMemo(
    () => evaluateReadiness({ profile, university, program, documents, deadlines }),
    [profile, university, program, documents],
  );
  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Label className="mb-2" htmlFor="readiness-university">
            {t("select")}
          </Label>
          <Select value={university.id} onValueChange={setUniversityId}>
            <SelectTrigger id="readiness-university" className="max-w-md" aria-label={t("select")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {universities.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {results.map((result) => (
          <Card key={result.category}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <CardTitle className="text-lg">{t(result.category)}</CardTitle>
                <StatusBadge status={result.status} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{t("why")}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {result.reason[locale]}
              </p>
              {result.action && (
                <div className="mt-4 rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t("action")}
                  </p>
                  <p className="mt-1 text-sm leading-6">{result.action[locale]}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <Alert>
        <Info className="size-4" />
        <AlertTitle>{t("officialCheck")}</AlertTitle>
        <AlertDescription>{t("subtitle")}</AlertDescription>
      </Alert>
    </div>
  );
}
