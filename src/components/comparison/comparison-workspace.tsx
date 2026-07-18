"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deadlines } from "@/data/deadlines";
import { programs } from "@/data/programs";
import { universities } from "@/data/universities";
import { formatMoneyRange } from "@/lib/formatting/money";
import type { LocaleCode, University } from "@/types/domain";
import { Check, Copy, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getComparisonSelection } from "@/components/universities/comparison-toggle";

type Criterion =
  | "location"
  | "type"
  | "tuition"
  | "fee"
  | "scholarships"
  | "english"
  | "korean"
  | "dormitory"
  | "deadlines"
  | "programs"
  | "living"
  | "support";
const criterionList: Criterion[] = [
  "location",
  "type",
  "tuition",
  "fee",
  "scholarships",
  "english",
  "korean",
  "dormitory",
  "deadlines",
  "programs",
  "living",
  "support",
];

export function ComparisonWorkspace({ locale }: { locale: LocaleCode }) {
  const t = useTranslations("Compare");
  const common = useTranslations("Common");
  const u = useTranslations("Universities");
  const search = useSearchParams();
  const { saveComparison } = usePersonalData();
  const sharedIds = (search.get("ids") ?? "")
    .split(",")
    .filter((id) => universities.some((item) => item.id === id))
    .slice(0, 4);
  const [ids, setIds] = useState<string[]>(sharedIds);
  const [criteria, setCriteria] = useState<Criterion[]>(criterionList);
  useEffect(() => {
    if (!sharedIds.length) queueMicrotask(() => setIds(getComparisonSelection().slice(0, 4)));
  }, [sharedIds.length]);
  useEffect(() => {
    const sync = () => setIds(getComparisonSelection().slice(0, 4));
    window.addEventListener("comparison-updated", sync);
    return () => window.removeEventListener("comparison-updated", sync);
  }, []);
  const selected = useMemo(
    () =>
      ids
        .map((id) => universities.find((item) => item.id === id))
        .filter((item): item is University => Boolean(item)),
    [ids],
  );
  const toggleUniversity = (id: string) =>
    setIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 4
          ? [...current, id]
          : (toast.error(t("limit")), current),
    );
  const toggleCriterion = (key: Criterion) =>
    setCriteria((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  const yesNo = (value: boolean | null) =>
    value === null ? common("notConfirmed") : value ? common("yes") : common("no");
  const value = (university: University, key: Criterion): React.ReactNode => {
    const nextDeadline = deadlines.find(
      (item) => item.universityId === university.id && new Date(item.endsAt) >= new Date(),
    );
    const language = (test: "IELTS" | "TOPIK") => {
      const req = university.languageRequirements.find((item) => item.test === test);
      return !req ? common("notConfirmed") : (req.minimum ?? common("varies"));
    };
    switch (key) {
      case "location":
        return university.city;
      case "type":
        return u(
          university.type === "national"
            ? "national"
            : university.type === "private"
              ? "private"
              : "science",
        );
      case "tuition":
        return formatMoneyRange(university.tuition.value, locale) ?? common("notConfirmed");
      case "fee":
        return formatMoneyRange(university.applicationFee.value, locale) ?? common("notConfirmed");
      case "scholarships":
        return yesNo(university.scholarshipAvailability.value);
      case "english":
        return language("IELTS");
      case "korean":
        return language("TOPIK");
      case "dormitory":
        return yesNo(university.dormitory.value);
      case "deadlines":
        return nextDeadline
          ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "Asia/Seoul" }).format(
              new Date(nextDeadline.endsAt),
            )
          : common("notConfirmed");
      case "programs":
        return (
          programs
            .filter((item) => item.universityId === university.id)
            .map((item) => item.title)
            .join(", ") || common("notConfirmed")
        );
      case "living":
        return formatMoneyRange(university.livingCost.value, locale) ?? common("notConfirmed");
      case "support":
        return yesNo(university.internationalSupport.value);
    }
  };
  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("ids", ids.join(","));
    await navigator.clipboard.writeText(url.toString());
    toast.success(t("copied"));
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("select")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {universities.map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={ids.includes(item.id) ? "default" : "outline"}
              onClick={() => toggleUniversity(item.id)}
            >
              {ids.includes(item.id) ? <Check /> : null}
              {item.shortName}
            </Button>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("criteria")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {criterionList.map((key) => (
            <Label key={key} className="gap-2">
              <Checkbox
                checked={criteria.includes(key)}
                onCheckedChange={() => toggleCriterion(key)}
              />
              {t(key)}
            </Label>
          ))}
        </CardContent>
      </Card>
      {selected.length < 2 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            {t("empty")}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <Button onClick={share}>
              <Copy />
              {t("share")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                saveComparison(ids);
                toast.success(common("saved"));
              }}
            >
              <Save />
              {t("save")}
            </Button>
          </div>
          <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-52">{t("criteria")}</TableHead>
                  {selected.map((item) => (
                    <TableHead key={item.id} className="min-w-48">
                      <div className="flex items-center justify-between gap-2">
                        <span>{item.name}</span>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label={common("delete")}
                          onClick={() => toggleUniversity(item.id)}
                        >
                          <X />
                        </Button>
                      </div>
                      <p className="mt-1 font-normal text-muted-foreground">
                        {common("updated", { date: item.lastVerifiedAt })}
                      </p>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteria.map((key) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{t(key)}</TableCell>
                    {selected.map((item) => (
                      <TableCell key={item.id} className="align-top text-sm">
                        {value(item, key)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-4 md:hidden">
            {selected.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{item.name}</CardTitle>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => toggleUniversity(item.id)}
                      aria-label={common("delete")}
                    >
                      <X />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {criteria.map((key) => (
                    <div
                      key={key}
                      className="grid grid-cols-[120px_1fr] gap-3 border-b pb-3 text-sm last:border-0"
                    >
                      <span className="text-muted-foreground">{t(key)}</span>
                      <span>{value(item, key)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
