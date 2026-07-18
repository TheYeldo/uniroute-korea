"use client";

import { SourceBadge } from "@/components/data/source-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { scholarships } from "@/data/scholarships";
import type { LocaleCode } from "@/types/domain";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function ScholarshipCatalog({ locale }: { locale: LocaleCode }) {
  const t = useTranslations("Scholarships");
  const common = useTranslations("Common");
  const universities = useTranslations("Universities");
  const [funding, setFunding] = useState("all");
  const [degree, setDegree] = useState("all");
  const results = scholarships.filter(
    (item) =>
      (funding === "all" || item.funding === funding) &&
      (degree === "all" ||
        item.degreeLevels.includes(degree as "bachelor" | "master" | "doctoral")),
  );
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3">
        <Select value={funding} onValueChange={setFunding}>
          <SelectTrigger className="w-52" aria-label={t("funding")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {common("all")} · {t("funding")}
            </SelectItem>
            <SelectItem value="full">{t("full")}</SelectItem>
            <SelectItem value="partial">{t("partial")}</SelectItem>
            <SelectItem value="varies">{t("varies")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={degree} onValueChange={setDegree}>
          <SelectTrigger className="w-52" aria-label={t("degree")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {common("all")} · {t("degree")}
            </SelectItem>
            <SelectItem value="bachelor">{universities("bachelor")}</SelectItem>
            <SelectItem value="master">{universities("master")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {results.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {results.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  <Badge>{t("potential")}</Badge>
                  <Badge variant="outline">{t(item.funding)}</Badge>
                </div>
                <CardTitle className="pt-2">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.provider}</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="text-sm font-medium">{t("coverage")}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.coverage[locale]}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t("eligibility")}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.eligibility[locale]}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">{t("period")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.applicationPeriod[locale]}
                  </p>
                </div>
                <SourceBadge sourceId={item.sourceIds[0]} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            {t("empty")}
          </CardContent>
        </Card>
      )}
    </>
  );
}
