"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function SaveUniversityButton({ universityId }: { universityId: string }) {
  const { savedUniversities, saveUniversity, removeUniversity } = usePersonalData();
  const t = useTranslations("Universities");
  const saved = savedUniversities.some((item) => item.universityId === universityId);
  return (
    <Button
      variant={saved ? "secondary" : "default"}
      size="sm"
      onClick={() => {
        if (saved) removeUniversity(universityId);
        else {
          saveUniversity(universityId);
          toast.success(t("saved"));
        }
      }}
    >
      {saved ? <BookmarkCheck /> : <Bookmark />}
      {saved ? t("saved") : t("save")}
    </Button>
  );
}
