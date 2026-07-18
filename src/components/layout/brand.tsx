import { Link } from "@/i18n/navigation";
import { Route } from "lucide-react";
import { useTranslations } from "next-intl";

export function Brand({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("Common");
  return (
    <Link
      href="/"
      className="focus-ring inline-flex items-center gap-2 rounded-md font-semibold tracking-tight"
      aria-label={t("brand")}
    >
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Route className="size-4" aria-hidden="true" />
      </span>
      {!compact && <span>{t("brand")}</span>}
    </Link>
  );
}
