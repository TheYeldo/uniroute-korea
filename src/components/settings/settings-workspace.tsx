"use client";

import { usePersonalData, type UserSettings } from "@/components/providers/personal-data-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Link, useRouter } from "@/i18n/navigation";
import { Download, RotateCcw, ShieldAlert, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function SettingsWorkspace() {
  const t = useTranslations("Settings");
  const common = useTranslations("Common");
  const u = useTranslations("Universities");
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { settings, setSettings, profile, clearGuestData, exportData, user } = usePersonalData();
  const patch = (values: Partial<UserSettings>) => {
    setSettings({ ...settings, ...values });
    toast.success(t("saved"));
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "uniroute-korea-personal-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const removeAccount = async () => {
    const response = await fetch("/api/account", { method: "DELETE" });
    if (response.ok) {
      clearGuestData();
      router.push("/");
    } else toast.error(common("retry"));
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("appearance")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{common("theme")}</Label>
              <Select value={theme ?? "system"} onValueChange={setTheme}>
                <SelectTrigger aria-label={common("theme")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t("light")}</SelectItem>
                  <SelectItem value="dark">{t("dark")}</SelectItem>
                  <SelectItem value="system">{t("system")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("timezone")}</Label>
              <Select value={settings.timezone} onValueChange={(timezone) => patch({ timezone })}>
                <SelectTrigger aria-label={t("timezone")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Asia/Almaty", "Asia/Seoul", "Europe/Moscow", "UTC"].map((zone) => (
                    <SelectItem value={zone} key={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("currency")}</Label>
              <Select
                value={settings.currency}
                onValueChange={(currency) =>
                  patch({ currency: currency as UserSettings["currency"] })
                }
              >
                <SelectTrigger aria-label={t("currency")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KRW">KRW</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("dateFormat")}</Label>
              <Select
                value={settings.dateFormat}
                onValueChange={(dateFormat) =>
                  patch({ dateFormat: dateFormat as UserSettings["dateFormat"] })
                }
              >
                <SelectTrigger aria-label={t("dateFormat")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["dd.MM.yyyy", "MM/dd/yyyy", "yyyy-MM-dd"].map((format) => (
                    <SelectItem value={format} key={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("defaultIntake")}</Label>
              <Select
                value={settings.defaultIntake}
                onValueChange={(defaultIntake) =>
                  patch({ defaultIntake: defaultIntake as UserSettings["defaultIntake"] })
                }
              >
                <SelectTrigger aria-label={t("defaultIntake")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spring">{u("spring")}</SelectItem>
                  <SelectItem value="fall">{u("fall")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("notifications")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <span>{t("inApp")}</span>
              <Switch
                checked={settings.inAppNotifications}
                onCheckedChange={(inAppNotifications) => patch({ inAppNotifications })}
              />
            </Label>
            <Label className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <span>{t("email")}</span>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(emailNotifications) => patch({ emailNotifications })}
              />
            </Label>
            <p className="text-sm text-muted-foreground">{t("consent")}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("privacy")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={download}>
            <Download />
            {t("export")}
          </Button>
          <Button asChild variant="outline">
            <Link href="/onboarding">
              <RotateCcw />
              {t("resetOnboarding")}
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash2 />
                {t("clearGuest")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("clearGuest")}</AlertDialogTitle>
                <AlertDialogDescription>{t("deleteWarning")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{common("cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={clearGuestData}>{common("delete")}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {user && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <ShieldAlert />
                  {t("deleteAccount")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("deleteAccount")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("deleteWarning")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{common("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={removeAccount}>{common("delete")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardContent>
      </Card>
      <Alert>
        <ShieldAlert className="size-4" />
        <AlertTitle>{common("guest")}</AlertTitle>
        <AlertDescription>
          {profile.onboardingComplete ? common("guestNotice") : t("subtitle")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
