"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getBrowserSupabase, isSupabaseConfigured } from "@/lib/supabase/browser";
import { Link, useRouter } from "@/i18n/navigation";
import { Loader2, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

type Mode = "login" | "register" | "forgot" | "reset";
export function AuthForm({ mode }: { mode: Mode }) {
  const t = useTranslations("Auth");
  const common = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const configured = isSupabaseConfigured();
  const title =
    mode === "login" ? t("loginTitle") : mode === "register" ? t("registerTitle") : t("resetTitle");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!configured) return;
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    setPending(true);
    setMessage(null);
    try {
      if (mode === "register") {
        if (password !== confirm) {
          setMessage(t("error"));
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/${locale}/auth/callback?next=/${locale}/onboarding`,
          },
        });
        if (error) throw error;
        setMessage(t("verifyEmail"));
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/${locale}/auth/reset`,
        });
        if (error) throw error;
        setMessage(t("verifyEmail"));
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch {
      setMessage(t("error"));
    } finally {
      setPending(false);
    }
  };
  const magic = async () => {
    const supabase = getBrowserSupabase();
    if (!supabase || !email) return;
    setPending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/${locale}/auth/callback?next=/${locale}/dashboard`,
      },
    });
    setMessage(error ? t("error") : t("verifyEmail"));
    setPending(false);
  };
  const google = async () => {
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/${locale}/auth/callback?next=/${locale}/dashboard`,
      },
    });
  };
  return (
    <Card className="w-full max-w-md shadow-xl shadow-primary/5">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{t("migration")}</CardDescription>
      </CardHeader>
      <CardContent>
        {!configured && (
          <Alert className="mb-5">
            <AlertDescription>{t("notConfigured")}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert className="mb-5">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={submit} className="space-y-4">
          {mode !== "reset" && (
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          )}{" "}
          {(mode === "login" || mode === "register" || mode === "reset") && (
            <div className="space-y-2">
              <Label htmlFor="password">
                {mode === "reset" ? t("newPassword") : t("password")}
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          )}
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirm">{t("confirmPassword")}</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
            </div>
          )}
          <Button className="w-full" disabled={!configured || pending}>
            {pending && <Loader2 className="animate-spin" />}
            {mode === "login"
              ? t("login")
              : mode === "register"
                ? t("register")
                : mode === "forgot"
                  ? t("reset")
                  : t("updatePassword")}
          </Button>
        </form>
        {mode === "login" && (
          <>
            <div className="my-5 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">{t("or")}</span>
              <Separator className="flex-1" />
            </div>
            <div className="grid gap-2">
              <Button variant="outline" onClick={magic} disabled={!configured || pending}>
                <Mail />
                {t("magicLink")}
              </Button>
              {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
                <Button variant="outline" onClick={google}>
                  {t("google")}
                </Button>
              )}
              <Button asChild variant="link">
                <Link href="/auth/forgot">{t("forgot")}</Link>
              </Button>
            </div>
          </>
        )}
        <Separator className="my-5" />
        <div className="grid gap-2">
          <Button asChild variant="secondary">
            <Link href="/dashboard">{t("guestContinue")}</Link>
          </Button>
          {mode === "login" ? (
            <Button asChild variant="link">
              <Link href="/auth/register">{common("createAccount")}</Link>
            </Button>
          ) : mode === "register" ? (
            <Button asChild variant="link">
              <Link href="/auth/login">{common("signIn")}</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
