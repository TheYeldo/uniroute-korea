"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PersonalNote } from "@/types/domain";
import { Pin, Plus, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const types: PersonalNote["entityType"][] = [
  "general",
  "university",
  "program",
  "scholarship",
  "document",
  "task",
];
const blank = (
  entityType: PersonalNote["entityType"] = "general",
  entityId?: string,
): PersonalNote => ({
  id: crypto.randomUUID(),
  title: "",
  content: "",
  entityType,
  entityId,
  pinned: false,
  updatedAt: new Date().toISOString(),
});

export function NotesWorkspace() {
  const t = useTranslations("Notes");
  const common = useTranslations("Common");
  const params = useSearchParams();
  const requestedType = params.get("entity") as PersonalNote["entityType"];
  const initialType = types.includes(requestedType) ? requestedType : "general";
  const { notes, upsertNote, removeNote } = usePersonalData();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(Boolean(params.get("id")));
  const [draft, setDraft] = useState<PersonalNote>(() =>
    blank(initialType, params.get("id") ?? undefined),
  );
  const results = useMemo(
    () =>
      notes
        .filter((note) =>
          `${note.title} ${note.content}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
        )
        .toSorted(
          (a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt),
        ),
    [notes, query],
  );
  const save = () => {
    if (!draft.title.trim()) return;
    upsertNote({ ...draft, updatedAt: new Date().toISOString() });
    setDraft(blank());
    setOpen(false);
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              {t("add")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("add")}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="note-title">{t("noteTitle")}</Label>
                <Input
                  id="note-title"
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-content">{t("content")}</Label>
                <Textarea
                  id="note-content"
                  className="min-h-56 font-mono text-sm"
                  value={draft.content}
                  onChange={(event) => setDraft({ ...draft, content: event.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="note-link-type">{t("linkType")}</Label>
                  <Select
                    value={draft.entityType}
                    onValueChange={(value) =>
                      setDraft({ ...draft, entityType: value as PersonalNote["entityType"] })
                    }
                  >
                    <SelectTrigger id="note-link-type" aria-label={t("linkType")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Label className="mt-7 flex items-center gap-3">
                  <Checkbox
                    checked={draft.pinned}
                    onCheckedChange={(checked) => setDraft({ ...draft, pinned: Boolean(checked) })}
                  />
                  {t("pin")}
                </Label>
              </div>
              {draft.content && (
                <Card>
                  <CardContent className="pt-6 text-sm leading-6">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.content}</ReactMarkdown>
                  </CardContent>
                </Card>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                {common("cancel")}
              </Button>
              <Button onClick={save}>{common("save")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label={t("search")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search")}
          className="ps-9"
        />
      </div>
      {results.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {note.pinned && <Pin className="size-4 text-primary" />}
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="mt-2">
                      {t(note.entityType)}
                    </Badge>
                  </div>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => removeNote(note.id)}
                    aria-label={common("delete")}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="line-clamp-6 text-sm leading-6">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  {common("updated", {
                    date: new Intl.DateTimeFormat().format(new Date(note.updatedAt)),
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            {t("empty")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
