import { SourceBadge } from "@/components/data/source-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { guides } from "@/data/guides";
import { Link } from "@/i18n/navigation";
import type { LocaleCode } from "@/types/domain";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function GuidesPage({ params }: { params: Promise<{ locale: LocaleCode }> }) {
  const { locale } = await params;
  const t = await getTranslations("Guides");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-9 max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {guides.map((guide) => (
          <Card key={guide.slug} className="flex flex-col">
            <CardHeader>
              <CardTitle>{guide.title[locale]}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="text-sm leading-6 text-muted-foreground">{guide.summary[locale]}</p>
              <div className="mt-4">
                <SourceBadge sourceId={guide.sourceIds[0]} />
              </div>
              <Button asChild variant="ghost" className="mt-6 justify-between">
                <Link href={`/guides/${guide.slug}`}>
                  {t("read")}
                  <ArrowRight />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
