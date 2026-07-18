"use client";

import { StatusBadge } from "@/components/data/status-badge";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createDefaultDocuments } from "@/data/defaults";
import { DOCUMENT_STATUSES } from "@/lib/constants";
import type { DocumentStatus, TrackedDocument } from "@/types/domain";
import { FileLock2, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const blank = (): TrackedDocument => ({
  id: crypto.randomUUID(),
  name: "",
  status: "not-started",
  dueDate: "",
  notes: "",
  universityIds: [],
  translationRequired: false,
  notarizationRequired: false,
  apostilleRequired: false,
  expirationDate: null,
  fileUploadStatus: "metadata-only",
});

export function DocumentWorkspace() {
  const t = useTranslations("Documents");
  const statusT = useTranslations("Status");
  const common = useTranslations("Common");
  const { documents, setDocuments, upsertDocument, removeDocument } = usePersonalData();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(blank());
  const ready = documents.filter((item) => ["ready", "submitted"].includes(item.status)).length;
  const save = () => {
    if (!draft.name.trim()) return;
    upsertDocument(draft);
    setDraft(blank());
    setOpen(false);
  };
  const statusSelect = (item: TrackedDocument) => (
    <Select
      value={item.status}
      onValueChange={(value) => upsertDocument({ ...item, status: value as DocumentStatus })}
    >
      <SelectTrigger className="h-8 w-48" aria-label={`${item.name}: ${t("status")}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {DOCUMENT_STATUSES.map((status) => (
          <SelectItem value={status} key={status}>
            {statusT(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
          <p className="mt-2 text-sm font-medium">
            {t("readyCount", { ready, total: documents.length })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setDocuments(createDefaultDocuments())}>
            {t("createDefault")}
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus />
                {t("add")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("add")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-document-name">{t("document")}</Label>
                  <Input
                    id="new-document-name"
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-document-due">{t("due")}</Label>
                  <Input
                    id="new-document-due"
                    type="date"
                    value={draft.dueDate}
                    onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
                  />
                </div>
                {(
                  ["translationRequired", "notarizationRequired", "apostilleRequired"] as const
                ).map((key) => (
                  <Label className="flex items-center gap-3 rounded-lg border p-3" key={key}>
                    <Checkbox
                      checked={draft[key]}
                      onCheckedChange={(checked) => setDraft({ ...draft, [key]: Boolean(checked) })}
                    />
                    {t(
                      key === "translationRequired"
                        ? "translation"
                        : key === "notarizationRequired"
                          ? "notarization"
                          : "apostille",
                    )}
                  </Label>
                ))}
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
      </div>
      <Alert>
        <FileLock2 className="size-4" />
        <AlertTitle>{t("metadataOnly")}</AlertTitle>
        <AlertDescription>{t("subtitle")}</AlertDescription>
      </Alert>
      {documents.length ? (
        <>
          <div className="hidden overflow-hidden rounded-xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("document")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("due")}</TableHead>
                  <TableHead>{t("translation")}</TableHead>
                  <TableHead>{t("notarization")}</TableHead>
                  <TableHead>{t("apostille")}</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium">{item.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{t("metadataOnly")}</p>
                    </TableCell>
                    <TableCell>{statusSelect(item)}</TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        aria-label={`${item.name}: ${t("due")}`}
                        value={item.dueDate}
                        className="h-8 w-40"
                        onChange={(event) =>
                          upsertDocument({ ...item, dueDate: event.target.value })
                        }
                      />
                    </TableCell>
                    {(
                      ["translationRequired", "notarizationRequired", "apostilleRequired"] as const
                    ).map((key) => (
                      <TableCell key={key}>
                        <Checkbox
                          aria-label={`${item.name}: ${t(
                            key === "translationRequired"
                              ? "translation"
                              : key === "notarizationRequired"
                                ? "notarization"
                                : "apostille",
                          )}`}
                          checked={item[key]}
                          onCheckedChange={(checked) =>
                            upsertDocument({ ...item, [key]: Boolean(checked) })
                          }
                        />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeDocument(item.id)}
                        aria-label={common("delete")}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-4 lg:hidden">
            {documents.map((item) => (
              <Card key={item.id}>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="mt-2">
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeDocument(item.id)}
                      aria-label={common("delete")}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  {statusSelect(item)}
                  <Input
                    type="date"
                    aria-label={`${item.name}: ${t("due")}`}
                    value={item.dueDate}
                    onChange={(event) => upsertDocument({ ...item, dueDate: event.target.value })}
                  />
                  <div className="flex flex-wrap gap-4">
                    {(
                      ["translationRequired", "notarizationRequired", "apostilleRequired"] as const
                    ).map((key) => (
                      <Label className="gap-2" key={key}>
                        <Checkbox
                          checked={item[key]}
                          onCheckedChange={(checked) =>
                            upsertDocument({ ...item, [key]: Boolean(checked) })
                          }
                        />
                        {t(
                          key === "translationRequired"
                            ? "translation"
                            : key === "notarizationRequired"
                              ? "notarization"
                              : "apostille",
                        )}
                      </Label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
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
