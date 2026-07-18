"use client";

import { UniversityCard } from "@/components/universities/university-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { universities } from "@/data/universities";
import { filterUniversities } from "@/lib/universities/filter";
import type { InstructionLanguage, LocaleCode, University } from "@/types/domain";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type Sort = "relevance" | "name" | "tuition";
export function UniversityCatalog({ locale }: { locale: LocaleCode }) {
  const t = useTranslations("Universities");
  const common = useTranslations("Common");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");
  const [subject, setSubject] = useState("all");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState<Sort>("relevance");
  const cities = [...new Set(universities.map((item) => item.city))].sort();
  const subjects = [...new Set(universities.flatMap((item) => item.subjectAreas))].sort();
  const results = useMemo(() => {
    const filtered = filterUniversities(universities, {
      query,
      city: city === "all" ? undefined : city,
      type: type === "all" ? undefined : (type as University["type"]),
      subject: subject === "all" ? undefined : subject,
      language: language === "all" ? undefined : (language as InstructionLanguage),
    });
    if (sort === "name") return filtered.toSorted((a, b) => a.name.localeCompare(b.name));
    if (sort === "tuition")
      return filtered.toSorted(
        (a, b) =>
          (a.tuition.value?.max ?? Number.MAX_SAFE_INTEGER) -
          (b.tuition.value?.max ?? Number.MAX_SAFE_INTEGER),
      );
    return filtered;
  }, [query, city, type, subject, language, sort]);
  const reset = () => {
    setQuery("");
    setCity("all");
    setType("all");
    setSubject("all");
    setLanguage("all");
    setSort("relevance");
  };
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Card className="h-fit lg:sticky lg:top-24">
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center gap-2 font-medium">
            <SlidersHorizontal className="size-4" />
            {common("filter")}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="ps-9"
            />
          </div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger aria-label={t("city")}>
              <SelectValue placeholder={t("city")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {common("all")} · {t("city")}
              </SelectItem>
              {cities.map((item) => (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger aria-label={t("type")}>
              <SelectValue placeholder={t("type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {common("all")} · {t("type")}
              </SelectItem>
              <SelectItem value="national">{t("national")}</SelectItem>
              <SelectItem value="private">{t("private")}</SelectItem>
              <SelectItem value="science-and-technology">{t("science")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger aria-label={t("subject")}>
              <SelectValue placeholder={t("subject")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {common("all")} · {t("subject")}
              </SelectItem>
              {subjects.map((item) => (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger aria-label={t("language")}>
              <SelectValue placeholder={t("language")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {common("all")} · {t("language")}
              </SelectItem>
              {(["english", "korean", "mixed", "varies"] as const).map((item) => (
                <SelectItem value={item} key={item}>
                  {t(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" className="w-full" onClick={reset}>
            <X />
            {common("clear")}
          </Button>
        </CardContent>
      </Card>
      <div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{t("results", { count: results.length })}</p>
          <Select value={sort} onValueChange={(value) => setSort(value as Sort)}>
            <SelectTrigger className="w-44" aria-label={t("sort")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">{t("relevance")}</SelectItem>
              <SelectItem value="name">{t("name")}</SelectItem>
              <SelectItem value="tuition">{t("tuition")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {results.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((university) => (
              <UniversityCard key={university.id} university={university} locale={locale} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              {t("empty")}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
