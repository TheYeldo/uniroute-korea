import { UniversityCatalog } from "@/components/universities/university-catalog";
import type { LocaleCode } from "@/types/domain";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Universities");
  return { title: t("title"), description: t("subtitle") };
}

export default async function UniversitiesPage({
  params,
}: {
  params: Promise<{ locale: LocaleCode }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Universities");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-9 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>
      <UniversityCatalog locale={locale} />
    </div>
  );
}
