"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Brand } from "./brand";

export function MobilePublicNav() {
  const nav = useTranslations("Navigation");
  const common = useTranslations("Common");
  const items = ["universities", "scholarships", "compare", "guides", "dashboard"] as const;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label={common("openMenu")}
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <Brand />
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-8 grid gap-2">
          {items.map((item) => (
            <Button asChild variant="ghost" className="justify-start" key={item}>
              <Link href={`/${item}`}>{nav(item)}</Link>
            </Button>
          ))}
          <Button asChild className="mt-4">
            <Link href="/auth/register">{common("createAccount")}</Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
