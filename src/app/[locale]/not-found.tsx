import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Map } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("Errors");
  return (
    <main className="grid min-h-[70dvh] place-items-center px-4 text-center">
      <div>
        <Map className="mx-auto size-10 text-primary" />
        <h1 className="mt-5 text-3xl font-semibold">{t("notFound")}</h1>
        <p className="mt-3 text-muted-foreground">{t("notFoundText")}</p>
        <Button asChild className="mt-6">
          <Link href="/">{t("home")}</Link>
        </Button>
      </div>
    </main>
  );
}
