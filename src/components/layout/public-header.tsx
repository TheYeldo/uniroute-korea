import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Brand } from "./brand";
import { LocaleSwitcher } from "./locale-switcher";
import { MobilePublicNav } from "./public-mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { useTranslations } from "next-intl";

export function PublicHeader() {
  const nav = useTranslations("Navigation");
  const common = useTranslations("Common");
  return (
    <header className="sticky top-0 z-50 border-b bg-background/92 backdrop-blur supports-[backdrop-filter]:bg-background/78">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-1 md:flex" aria-label={common("openMenu")}>
          <Button asChild variant="ghost" size="sm">
            <Link href="/universities">{nav("universities")}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/scholarships">{nav("scholarships")}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/compare">{nav("compare")}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/guides">{nav("guides")}</Link>
          </Button>
        </nav>
        <div className="ms-auto flex items-center gap-1">
          <ThemeToggle />
          <LocaleSwitcher />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/auth/login">{common("signIn")}</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/dashboard">{nav("dashboard")}</Link>
          </Button>
          <MobilePublicNav />
        </div>
      </div>
    </header>
  );
}
