"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { PersonalDataProvider } from "./personal-data-provider";
import { QueryProvider } from "./query-provider";
import { NetworkStatus } from "@/components/layout/network-status";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <PersonalDataProvider>
          <TooltipProvider>
            <NetworkStatus />
            {children}
          </TooltipProvider>
        </PersonalDataProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
