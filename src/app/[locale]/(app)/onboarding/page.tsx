import { GuestBanner } from "@/components/layout/guest-banner";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { getTranslations } from "next-intl/server";

export default async function OnboardingPage() {
  const t = await getTranslations("Onboarding");
  return (
    <div className="space-y-6">
      <GuestBanner />
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      </div>
      <OnboardingForm />
    </div>
  );
}
