import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { programs } from "@/data/programs";
import { universitiesById } from "@/data/universities";
import { Link } from "@/i18n/navigation";
import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function ProgramsPage() {
  const nav = await getTranslations("Navigation");
  const t = await getTranslations("University");
  const u = await getTranslations("Universities");
  const common = await getTranslations("Common");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">{nav("programs")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("programLanguageWarning")}</p>
      </div>
      <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => {
          const university = universitiesById.get(program.universityId);
          return (
            <Card key={program.id} className="flex flex-col">
              <CardHeader>
                <div className="flex flex-wrap gap-2">
                  <Badge>{program.field}</Badge>
                  <Badge variant="outline">{u(program.instructionLanguage)}</Badge>
                </div>
                <CardTitle className="mt-3">{program.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {university?.name} · {program.department}
                </p>
              </CardHeader>
              <CardContent className="mt-auto flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href={`/universities/${university?.slug ?? ""}`}>{common("view")}</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href={program.url} target="_blank" rel="noreferrer">
                    {common("source")}
                    <ExternalLink />
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
