import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { formatMoneyRange } from "@/lib/formatting/money";
import type { LocaleCode, University } from "@/types/domain";
import { ArrowRight, Building2, GraduationCap, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { ComparisonToggle } from "./comparison-toggle";
import { SaveUniversityButton } from "./save-university-button";

export function UniversityCard({
  university,
  locale,
}: {
  university: University;
  locale: LocaleCode;
}) {
  const t = useTranslations("Universities");
  const common = useTranslations("Common");
  const tuition = formatMoneyRange(university.tuition.value, locale);
  const typeKey =
    university.type === "national"
      ? "national"
      : university.type === "private"
        ? "private"
        : "science";
  return (
    <Card className="group flex h-full flex-col transition-colors hover:border-primary/30">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/8 font-mono text-sm font-semibold text-primary">
            {university.shortName.slice(0, 3)}
          </span>
          <Badge
            variant={university.dataCompleteness === "verified-core" ? "secondary" : "outline"}
          >
            {t(university.dataCompleteness === "verified-core" ? "verifiedCore" : "partial")}
          </Badge>
        </div>
        <div>
          <Link
            href={`/universities/${university.slug}`}
            className="focus-ring rounded-sm text-xl font-semibold tracking-tight hover:text-primary"
          >
            {university.name}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{university.koreanName}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {university.overview[locale]}
        </p>
        <div className="grid gap-2 text-sm">
          <span className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            {university.city}
          </span>
          <span className="flex items-center gap-2">
            <Building2 className="size-4 text-muted-foreground" />
            {t(typeKey)}
          </span>
          <span className="flex items-center gap-2">
            <GraduationCap className="size-4 text-muted-foreground" />
            {tuition ?? common("notConfirmed")}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {university.subjectAreas.slice(0, 3).map((area) => (
            <Badge key={area} variant="outline" className="font-normal">
              {area}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t pt-5">
        <SaveUniversityButton universityId={university.id} />
        <ComparisonToggle universityId={university.id} />
        <Button asChild size="sm" variant="ghost" className="ms-auto">
          <Link href={`/universities/${university.slug}`}>
            {common("view")}
            <ArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
