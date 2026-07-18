import { SourceBadge } from "@/components/data/source-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { guides, guidesBySlug } from "@/data/guides";
import { sourcesById } from "@/data/sources";
import { localizedAlternates } from "@/lib/seo";
import type { LocaleCode } from "@/types/domain";
import { Info } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: LocaleCode; slug: string }>;
}) {
  const { locale, slug } = await params;
  const guide = guidesBySlug.get(slug);
  return guide
    ? {
        title: guide.title[locale],
        description: guide.summary[locale],
        alternates: localizedAlternates(locale, `guides/${slug}`),
      }
    : {};
}
export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: LocaleCode; slug: string }>;
}) {
  const { locale, slug } = await params;
  const guide = guidesBySlug.get(slug);
  if (!guide) notFound();
  const t = await getTranslations("Guides");
  const common = await getTranslations("Common");
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
      <p className="text-sm text-muted-foreground">
        {t("generalAdvice")} · {common("updated", { date: guide.updatedAt })}
      </p>
      <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        {guide.title[locale]}
      </h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">{guide.summary[locale]}</p>
      <Alert className="mt-8">
        <Info className="size-4" />
        <AlertTitle>{t("generalAdvice")}</AlertTitle>
        <AlertDescription>{t("officialWarning")}</AlertDescription>
      </Alert>
      <div className="mt-10 space-y-8">
        {guide.sections.map((section) => (
          <section key={section.heading.en}>
            <h2 className="text-2xl font-semibold tracking-tight">{section.heading[locale]}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{section.body[locale]}</p>
          </section>
        ))}
      </div>
      <Card className="mt-12">
        <CardContent className="space-y-3 pt-6">
          <h2 className="font-semibold">{common("sources")}</h2>
          {guide.sourceIds.map((id) => {
            const source = sourcesById.get(id);
            return (
              <div
                key={id}
                className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{source?.title}</p>
                  <p className="text-xs text-muted-foreground">{source?.organization}</p>
                </div>
                <SourceBadge sourceId={id} />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </article>
  );
}
