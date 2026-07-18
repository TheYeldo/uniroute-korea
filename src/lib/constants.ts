import type { DocumentStatus, TaskStatus } from "@/types/domain";

export const APP_NAME = "UniRoute Korea";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const LOCALES = ["ru", "en"] as const;
export const DEFAULT_LOCALE = "ru" as const;

export const TASK_STATUSES: TaskStatus[] = [
  "not-started",
  "needs-attention",
  "in-progress",
  "ready",
  "verify",
];

export const DOCUMENT_STATUSES: DocumentStatus[] = [
  "not-started",
  "requested",
  "received",
  "translation-needed",
  "verification-needed",
  "ready",
  "submitted",
  "rejected",
  "expired",
];
