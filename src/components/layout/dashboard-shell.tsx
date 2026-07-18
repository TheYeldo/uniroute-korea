"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  Settings,
  Star,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Brand } from "./brand";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { NotificationsPopover } from "@/components/notifications/notifications-popover";

const navItems = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "roadmap", href: "/roadmap", icon: ClipboardCheck },
  { key: "documents", href: "/documents", icon: FileText },
  { key: "calendar", href: "/calendar", icon: CalendarDays },
  { key: "saved", href: "/saved", icon: Star },
  { key: "notes", href: "/notes", icon: NotebookPen },
  { key: "settings", href: "/settings", icon: Settings },
] as const;

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const nav = useTranslations("Navigation");
  const common = useTranslations("Common");
  const pathname = usePathname();
  const router = useRouter();
  const { user } = usePersonalData();
  const logout = async () => {
    await getBrowserSupabase()?.auth.signOut();
    router.push("/");
  };
  return (
    <div className="min-h-dvh bg-muted/20">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 border-e bg-sidebar lg:flex lg:flex-col">
        <div className="flex h-16 items-center px-5">
          <Brand />
        </div>
        <Separator />
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Button
                key={item.key}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  active && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  {nav(item.key)}
                </Link>
              </Button>
            );
          })}
        </nav>
        <div className="space-y-2 border-t p-3">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/universities">
              <GraduationCap className="size-4" />
              {nav("universities")}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/guides">
              <BookOpen className="size-4" />
              {nav("guides")}
            </Link>
          </Button>
          {user && (
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
              <LogOut className="size-4" />
              {common("logout")}
            </Button>
          )}
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/90 px-4 backdrop-blur lg:ms-64 lg:px-8">
        <div className="lg:hidden">
          <Brand compact />
        </div>
        <div className="ms-auto flex items-center gap-1">
          <NotificationsPopover />
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </header>
      <main id="main-content" className="px-4 pb-24 pt-6 sm:px-6 lg:ms-64 lg:px-8 lg:pb-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-background/95 px-1 pb-[max(.35rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              href={item.href}
              key={item.key}
              className={cn(
                "focus-ring flex min-w-0 flex-col items-center gap-1 rounded-md px-1 py-2 text-[10px] text-muted-foreground",
                active && "bg-accent text-accent-foreground",
              )}
            >
              <item.icon className="size-4" />
              <span className="max-w-full truncate">{nav(item.key)}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
