import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Brand } from "./brand";

export function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Navigation");
  return (
    <footer className="border-t bg-card/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-xl">
          <Brand />
          <p className="mt-4 text-sm text-muted-foreground">{t("description")}</p>
          <p className="mt-3 text-xs text-muted-foreground">{t("notice")}</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <Link href="/universities" className="hover:text-foreground">
            {nav("universities")}
          </Link>
          <Link href="/scholarships" className="hover:text-foreground">
            {nav("scholarships")}
          </Link>
          <Link href="/guides" className="hover:text-foreground">
            {nav("guides")}
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            {t("privacy")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
