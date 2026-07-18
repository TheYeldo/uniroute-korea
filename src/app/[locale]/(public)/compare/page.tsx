import { ComparisonWorkspace } from "@/components/comparison/comparison-workspace";
import type { LocaleCode } from "@/types/domain";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata() {
  const t = await getTranslations("Compare");
  return { title: t("title"), description: t("subtitle") };
}
export default async function ComparePage({ params }: { params: Promise<{ locale: LocaleCode }> }) {
  const { locale } = await params;
  const t = await getTranslations("Compare");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-9 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>
      <Suspense>
        <ComparisonWorkspace locale={locale} />
      </Suspense>
    </div>
  );
}
