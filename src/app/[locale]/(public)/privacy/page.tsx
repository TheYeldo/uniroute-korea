import { Card, CardContent } from "@/components/ui/card";
import { localizedAlternates } from "@/lib/seo";
import type { LocaleCode } from "@/types/domain";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: LocaleCode }> }) {
  const { locale } = await params;
  const t = await getTranslations("Privacy");
  return {
    title: t("title"),
    description: t("intro"),
    alternates: localizedAlternates(locale, "privacy"),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy");
  const sections = ["collect", "guest", "account", "files", "rights", "service"] as const;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-5 text-lg leading-8 text-muted-foreground">{t("intro")}</p>
      <Card className="mt-10">
        <CardContent className="space-y-8 pt-6">
          {sections.map((section) => (
            <section key={section}>
              <h2 className="text-xl font-semibold">{t(`${section}Title`)}</h2>
              <p className="mt-2 leading-7 text-muted-foreground">{t(section)}</p>
            </section>
          ))}
        </CardContent>
      </Card>
    </article>
  );
}
