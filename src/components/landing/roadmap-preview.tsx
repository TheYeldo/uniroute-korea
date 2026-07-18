"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Circle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function RoadmapPreview() {
  const t = useTranslations("Landing");
  const [complete, setComplete] = useState(1);
  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-[0_24px_60px_-36px_rgba(17,41,75,.4)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{t("previewTitle")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("previewSubtitle")}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
          {complete}/4
        </span>
      </div>
      <Progress value={complete * 25} className="mt-6 h-1.5" aria-label={`${complete}/4`} />
      <ol className="mt-5 space-y-2">
        {steps.map((step, index) => {
          const done = index < complete;
          return (
            <li key={step}>
              <Button
                variant="ghost"
                className="h-auto w-full justify-start gap-3 py-3 text-start"
                onClick={() => setComplete(done ? Math.max(0, index) : index + 1)}
              >
                <span
                  className={
                    done
                      ? "grid size-6 place-items-center rounded-full bg-primary text-primary-foreground"
                      : "grid size-6 place-items-center rounded-full border text-muted-foreground"
                  }
                >
                  {done ? <Check className="size-3.5" /> : <Circle className="size-3" />}
                </span>
                <span
                  className={
                    done
                      ? "text-muted-foreground line-through decoration-border"
                      : "text-foreground"
                  }
                >
                  {step}
                </span>
              </Button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
