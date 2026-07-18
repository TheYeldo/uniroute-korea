import { ScholarshipCatalog } from "@/components/scholarships/scholarship-catalog";
import { localizedAlternates } from "@/lib/seo";
import type { LocaleCode } from "@/types/domain";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: LocaleCode }> }) {
  const { locale } = await params;
  const t = await getTranslations("Scholarships");
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: localizedAlternates(locale, "scholarships"),
  };
}
export default async function ScholarshipPage({
  params,
}: {
  params: Promise<{ locale: LocaleCode }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Scholarships");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-9 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>
      <ScholarshipCatalog locale={locale} />
    </div>
  );
}
