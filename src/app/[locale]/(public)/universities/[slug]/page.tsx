import { SourceBadge } from "@/components/data/source-badge";
import { ComparisonToggle } from "@/components/universities/comparison-toggle";
import { SaveUniversityButton } from "@/components/universities/save-university-button";
import { SourcedMoney } from "@/components/universities/sourced-money";
import { UniversityTools } from "@/components/universities/university-tools";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { deadlines } from "@/data/deadlines";
import { programs } from "@/data/programs";
import { scholarships } from "@/data/scholarships";
import { sourcesById } from "@/data/sources";
import { universities, universitiesBySlug } from "@/data/universities";
import { Link } from "@/i18n/navigation";
import { localizedAlternates } from "@/lib/seo";
import type { LocaleCode } from "@/types/domain";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Info,
  Languages,
  MapPin,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return universities.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const item = universitiesBySlug.get(slug);
  if (!item) return {};
  return {
    title: item.name,
    description: item.overview[locale as LocaleCode],
    alternates: localizedAlternates(locale as LocaleCode, `universities/${slug}`),
  };
}

export default async function UniversityPage({
  params,
}: {
  params: Promise<{ locale: LocaleCode; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const university = universitiesBySlug.get(slug);
  if (!university) notFound();
  const t = await getTranslations("University");
  const u = await getTranslations("Universities");
  const common = await getTranslations("Common");
  const relatedPrograms = programs.filter((item) => item.universityId === university.id);
  const relatedScholarships = scholarships.filter((item) =>
    item.universityIds.includes(university.id),
  );
  const relatedDeadlines = deadlines.filter(
    (item) => item.universityId === university.id && new Date(item.endsAt) >= new Date(),
  );
  const relatedSources = university.sourceIds
    .map((id) => sourcesById.get(id))
    .filter((item) => item !== undefined);
  const typeKey =
    university.type === "national"
      ? "national"
      : university.type === "private"
        ? "private"
        : "science";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: university.name,
    alternateName: university.koreanName,
    url: university.officialWebsite,
    address: {
      "@type": "PostalAddress",
      addressLocality: university.city,
      addressCountry: "KR",
    },
    sameAs: [university.officialWebsite, university.admissionWebsite],
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "UniRoute Korea", item: `/${locale}` },
      { "@type": "ListItem", position: 2, name: u("title"), item: `/${locale}/universities` },
      { "@type": "ListItem", position: 3, name: university.name },
    ],
  };
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <Button asChild variant="ghost" className="mb-5 -ms-3">
        <Link href="/universities">
          <ArrowLeft />
          {u("title")}
        </Link>
      </Button>
      <div className="grid gap-8 lg:grid-cols-[1fr_310px]">
        <div className="min-w-0 space-y-8">
          <section>
            <div className="flex flex-wrap gap-2">
              <Badge>{u(typeKey)}</Badge>
              <Badge variant="outline">
                {university.dataCompleteness === "verified-core" ? u("verifiedCore") : u("partial")}
              </Badge>
            </div>
            <div className="mt-5 flex items-start gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
                {university.shortName.slice(0, 3)}
              </span>
              <div>
                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  {university.name}
                </h1>
                <p className="mt-1 text-lg text-muted-foreground">{university.koreanName}</p>
              </div>
            </div>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
              {university.overview[locale]}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <SaveUniversityButton universityId={university.id} />
              <ComparisonToggle universityId={university.id} />
              <Button asChild size="sm" variant="outline">
                <a href={university.admissionWebsite} target="_blank" rel="noreferrer">
                  {common("source")}
                  <ExternalLink />
                </a>
              </Button>
            </div>
          </section>
          <Separator />
          <section aria-labelledby="overview">
            <h2 id="overview" className="text-2xl font-semibold tracking-tight">
              {t("overview")}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="grid gap-4 pt-6 text-sm">
                  <span className="flex gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    {university.city}
                  </span>
                  <span className="flex gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    {university.campus}
                  </span>
                  <span className="flex gap-2">
                    <GraduationCap className="size-4 text-muted-foreground" />
                    {university.degreeLevels.map((level) => u(level)).join(", ")}
                  </span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="grid gap-4 pt-6 text-sm">
                  <span className="flex gap-2">
                    <Languages className="size-4 text-muted-foreground" />
                    {university.instructionLanguages.map((language) => u(language)).join(", ")}
                  </span>
                  <span className="flex gap-2">
                    <CheckCircle2 className="size-4 text-muted-foreground" />
                    {t("internationalOffice")}:{" "}
                    {university.internationalSupport.value === true
                      ? common("yes")
                      : common("notConfirmed")}
                  </span>
                  <span className="flex gap-2">
                    <CheckCircle2 className="size-4 text-muted-foreground" />
                    {t("dormitory")}:{" "}
                    {university.dormitory.value === true ? common("yes") : common("notConfirmed")}
                  </span>
                </CardContent>
              </Card>
            </div>
          </section>
          <section aria-labelledby="programs">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="programs" className="text-2xl font-semibold tracking-tight">
                  {t("programs")}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{t("programLanguageWarning")}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4">
              {relatedPrograms.length ? (
                relatedPrograms.map((program) => (
                  <Card key={program.id}>
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <CardTitle>{program.title}</CardTitle>
                          <p className="mt-1 text-sm text-muted-foreground">{program.department}</p>
                        </div>
                        <Badge variant="outline">{u(program.instructionLanguage)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{u(program.degreeLevel)}</Badge>
                        {program.intakes.map((intake) => (
                          <Badge key={intake} variant="outline">
                            {u(intake)}
                          </Badge>
                        ))}
                        <Button asChild variant="link" size="sm">
                          <a href={program.url} target="_blank" rel="noreferrer">
                            {common("source")}
                            <ExternalLink />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    {common("noData")}
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
          <section aria-labelledby="requirements">
            <h2 id="requirements" className="text-2xl font-semibold tracking-tight">
              {t("requirements")}
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("schoolCompletion")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {t("schoolCompletionText")}
                  </p>
                  <div className="mt-4">
                    <SourceBadge sourceId={university.sourceIds[0]} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("requiredDocuments")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{t("documentsText")}</p>
                  <div className="mt-4">
                    <SourceBadge sourceId={university.sourceIds[0]} />
                  </div>
                </CardContent>
              </Card>
            </div>
            {university.languageRequirements.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">{t("languageRequirements")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {university.languageRequirements.map((requirement) => (
                    <div
                      key={requirement.test}
                      className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 last:border-0"
                    >
                      <span>{requirement.test}</span>
                      <span className="text-sm text-muted-foreground">
                        {requirement.minimum ? requirement.minimum : common("varies")}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </section>
          <section aria-labelledby="costs">
            <h2 id="costs" className="text-2xl font-semibold tracking-tight">
              {t("costs")}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{u("tuition")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SourcedMoney value={university.tuition} locale={locale} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("applicationFee")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SourcedMoney value={university.applicationFee} locale={locale} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t("livingCost")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SourcedMoney value={university.livingCost} locale={locale} />
                </CardContent>
              </Card>
            </div>
          </section>
          <section aria-labelledby="scholarships">
            <h2 id="scholarships" className="text-2xl font-semibold tracking-tight">
              {t("scholarships")}
            </h2>
            <div className="mt-5 grid gap-4">
              {relatedScholarships.length ? (
                relatedScholarships.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {item.coverage[locale]}
                      </p>
                      <div className="mt-4">
                        <SourceBadge sourceId={item.sourceIds[0]} />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Alert>
                  <Info className="size-4" />
                  <AlertTitle>{common("notConfirmed")}</AlertTitle>
                  <AlertDescription>{common("noData")}</AlertDescription>
                </Alert>
              )}
            </div>
          </section>
          <section aria-labelledby="deadlines">
            <h2 id="deadlines" className="text-2xl font-semibold tracking-tight">
              {t("deadlines")}
            </h2>
            <Alert className="mt-4">
              <Info className="size-4" />
              <AlertTitle>{t("deadlineTimezone")}</AlertTitle>
            </Alert>
            <div className="mt-4 grid gap-3">
              {relatedDeadlines.length ? (
                relatedDeadlines.map((deadline) => (
                  <Card key={deadline.id}>
                    <CardContent className="flex flex-col justify-between gap-4 pt-6 sm:flex-row sm:items-center">
                      <div>
                        <p className="font-medium">{deadline.title[locale]}</p>
                        <p className="mt-1 font-mono text-sm text-muted-foreground">
                          {new Intl.DateTimeFormat(locale, {
                            dateStyle: "long",
                            timeStyle: "short",
                            timeZone: deadline.timezone,
                          }).format(new Date(deadline.endsAt))}
                        </p>
                      </div>
                      <SourceBadge sourceId={deadline.sourceId} />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    {t("noCurrentDeadlines")}
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
          <section aria-labelledby="sources">
            <h2 id="sources" className="text-2xl font-semibold tracking-tight">
              {common("sources")}
            </h2>
            <div className="mt-5 space-y-3">
              {relatedSources.map((source) => (
                <Card key={source.id}>
                  <CardContent className="flex flex-col justify-between gap-3 pt-6 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-medium">{source.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {source.organization} · {common("checked", { date: source.checkedAt })}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {common("source")}
                        <ExternalLink />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {common("items", { count: relatedPrograms.length })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UniversityTools universityId={university.id} universityName={university.name} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs leading-5 text-muted-foreground">
                {university.overview[locale]}{" "}
                {common("checked", { date: university.lastVerifiedAt })}
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
