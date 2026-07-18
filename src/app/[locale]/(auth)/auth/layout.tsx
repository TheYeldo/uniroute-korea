import { Brand } from "@/components/layout/brand";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata = { robots: { index: false, follow: false } };
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="flex h-16 items-center border-b px-4 sm:px-6">
        <Brand />
        <div className="ms-auto flex">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </header>
      <main
        id="main-content"
        className="grid min-h-[calc(100dvh-4rem)] place-items-center px-4 py-10"
      >
        {children}
      </main>
    </div>
  );
}
