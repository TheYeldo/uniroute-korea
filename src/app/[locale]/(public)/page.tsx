import { RoadmapPreview } from "@/components/landing/roadmap-preview";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { localizedAlternates } from "@/lib/seo";
import type { LocaleCode } from "@/types/domain";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarRange,
  CheckCircle2,
  Database,
  GraduationCap,
  ListChecks,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: LocaleCode }> }) {
  const { locale } = await params;
  return { alternates: localizedAlternates(locale) };
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Landing");
  const tools = [
    { icon: Search, title: t("toolDiscovery"), text: t("toolDiscoveryText") },
    { icon: CalendarRange, title: t("toolPlanning"), text: t("toolPlanningText") },
    { icon: BookOpenCheck, title: t("toolReadiness"), text: t("toolReadinessText") },
  ];
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_50%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_45%,transparent)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.08fr_.92fr] lg:px-8 lg:py-28">
          <FadeIn>
            <Badge variant="secondary" className="gap-1.5 py-1">
              <Sparkles className="size-3.5" />
              {t("eyebrow")}
            </Badge>
            <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
              {t("subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/onboarding">
                  {t("buildPlan")}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/universities">{t("explore")}</Link>
              </Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <Link href="/scholarships" className="hover:text-foreground">
                {t("findScholarships")}
              </Link>
              <Link href="/compare" className="hover:text-foreground">
                {t("compare")}
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.12}>
            <RoadmapPreview />
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <ShieldCheck className="mx-auto size-8 text-primary" />
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("trustTitle")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{t("trustText")}</p>
        </FadeIn>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {tools.map((tool, index) => (
            <FadeIn key={tool.title} delay={index * 0.07}>
              <Card className="h-full border-border/80 shadow-sm">
                <CardHeader>
                  <span className="mb-3 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <tool.icon className="size-5" />
                  </span>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription className="leading-6">{tool.text}</CardDescription>
                </CardHeader>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-y bg-card/50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-20">
          <FadeIn>
            <GraduationCap className="size-8 text-primary" />
            <h2 className="mt-5 text-3xl font-semibold tracking-tight">{t("forTitle")}</h2>
            <p className="mt-4 leading-7 text-muted-foreground">{t("forText")}</p>
          </FadeIn>
          <FadeIn delay={0.08} className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardContent className="flex gap-3 pt-6">
                <Database className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-6">{t("trustText")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex gap-3 pt-6">
                <ListChecks className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-6">{t("toolPlanningText")}</p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <CheckCircle2 className="mx-auto size-8 text-primary" />
        <h2 className="mt-5 text-3xl font-semibold tracking-tight">{t("toolsTitle")}</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/onboarding">{t("buildPlan")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/universities">{t("explore")}</Link>
          </Button>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-sm leading-6 text-muted-foreground">
          {t("disclaimer")}
        </p>
      </section>
    </>
  );
}
