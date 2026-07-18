"use client";

import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createDefaultDocuments, createSuggestedRoadmap } from "@/data/defaults";
import { useRouter } from "@/i18n/navigation";
import { profileSchema } from "@/lib/validation/schemas";
import type { UserProfile } from "@/types/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cloneElement, isValidElement, useId } from "react";
import { Controller, useForm } from "react-hook-form";

const tabs = ["personal", "academic", "language", "study", "finance", "priorities"] as const;
const priorities = [
  "reputation",
  "scholarshipAvailability",
  "tuition",
  "cityPriority",
  "englishPrograms",
  "dormitory",
  "technology",
  "internationalSupport",
  "career",
] as const;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const control = isValidElement<{
    id?: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  }>(children)
    ? cloneElement(children, {
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? errorId : undefined,
      })
    : children;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {control}
      {error && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function OnboardingForm() {
  const t = useTranslations("Onboarding");
  const u = useTranslations("Universities");
  const common = useTranslations("Common");
  const locale = useLocale() as "ru" | "en";
  const router = useRouter();
  const { profile, setProfile, roadmapTasks, setRoadmapTasks, documents, setDocuments } =
    usePersonalData();
  const form = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: { ...profile, interfaceLanguage: locale },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;
  const optionalNumber = {
    setValueAs: (value: string) =>
      value === "" || Number.isNaN(Number(value)) ? null : Number(value),
  };
  const submit = handleSubmit((values) => {
    const complete = { ...values, onboardingComplete: true, interfaceLanguage: locale };
    setProfile(complete);
    if (!roadmapTasks.length) setRoadmapTasks(createSuggestedRoadmap(complete));
    if (!documents.length) setDocuments(createDefaultDocuments());
    router.push("/dashboard");
  });
  return (
    <form onSubmit={submit}>
      <Tabs defaultValue="personal">
        <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-1 bg-muted p-1 sm:grid-cols-3 lg:grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger value={tab} key={tab} className="py-2">
              {t(tab)}
            </TabsTrigger>
          ))}
        </TabsList>
        <Card>
          <CardContent className="pt-6">
            <TabsContent value="personal" className="mt-0 grid gap-5 md:grid-cols-2">
              <Field label={t("country")} error={errors.country?.message}>
                <Input {...register("country")} />
              </Field>
              <Field label={t("city")} error={errors.city?.message}>
                <Input {...register("city")} />
              </Field>
              <Field label={t("grade")} error={errors.grade?.message}>
                <Input {...register("grade")} />
              </Field>
              <Field label={t("graduationYear")}>
                <Input
                  type="number"
                  inputMode="numeric"
                  {...register("graduationYear", optionalNumber)}
                />
              </Field>
              <Field label={t("ageRange")}>
                <Input {...register("ageRange")} />
              </Field>
            </TabsContent>
            <TabsContent value="academic" className="mt-0 grid gap-5 md:grid-cols-2">
              <Field label={t("gradingSystem")}>
                <Input {...register("gradingSystem")} />
              </Field>
              <Field label={t("average")}>
                <Input
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  {...register("averageGrade", optionalNumber)}
                />
              </Field>
              <Controller
                name="strongSubjects"
                control={control}
                render={({ field }) => (
                  <Field label={t("strong")}>
                    <Input
                      value={field.value.join(", ")}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </Field>
                )}
              />
              <Controller
                name="weakSubjects"
                control={control}
                render={({ field }) => (
                  <Field label={t("weak")}>
                    <Input
                      value={field.value.join(", ")}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </Field>
                )}
              />
              <Field label={t("achievements")}>
                <Textarea className="min-h-28" {...register("achievements")} />
              </Field>
              <Field label={t("activities")}>
                <Textarea className="min-h-28" {...register("extracurriculars")} />
              </Field>
            </TabsContent>
            <TabsContent value="language" className="mt-0 grid gap-5 md:grid-cols-2">
              <Field label={t("englishLevel")}>
                <Input {...register("englishLevel")} />
              </Field>
              <Field label={t("ielts")}>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  max="9"
                  inputMode="decimal"
                  {...register("ieltsScore", optionalNumber)}
                />
              </Field>
              <Field label={t("toefl")}>
                <Input
                  type="number"
                  min="0"
                  max="120"
                  inputMode="numeric"
                  {...register("toeflScore", optionalNumber)}
                />
              </Field>
              <Field label={t("koreanLevel")}>
                <Input {...register("koreanLevel")} />
              </Field>
              <Field label={t("topik")}>
                <Input
                  type="number"
                  min="0"
                  max="6"
                  inputMode="numeric"
                  {...register("topikScore", optionalNumber)}
                />
              </Field>
              <Controller
                name="studyLanguage"
                control={control}
                render={({ field }) => (
                  <Field label={t("studyLanguage")}>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label={t("studyLanguage")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["english", "korean", "mixed", "varies"] as const).map((item) => (
                          <SelectItem value={item} key={item}>
                            {u(item)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </TabsContent>
            <TabsContent value="study" className="mt-0 grid gap-5 md:grid-cols-2">
              <Controller
                name="degreeLevel"
                control={control}
                render={({ field }) => (
                  <Field label={t("degree")}>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label={t("degree")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(["bachelor", "master", "doctoral"] as const).map((item) => (
                          <SelectItem value={item} key={item}>
                            {u(item)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Field label={t("major")} error={errors.preferredMajor?.message}>
                <Input {...register("preferredMajor")} />
              </Field>
              <Controller
                name="preferredCities"
                control={control}
                render={({ field }) => (
                  <Field label={t("cities")}>
                    <Input
                      value={field.value.join(", ")}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value
                            .split(",")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </Field>
                )}
              />
              <Controller
                name="universityType"
                control={control}
                render={({ field }) => (
                  <Field label={t("universityType")}>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label={t("universityType")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">{common("all")}</SelectItem>
                        <SelectItem value="national">{u("national")}</SelectItem>
                        <SelectItem value="private">{u("private")}</SelectItem>
                        <SelectItem value="science-and-technology">{u("science")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Field label={t("admissionYear")}>
                <Input
                  type="number"
                  min="2026"
                  max="2040"
                  {...register("admissionYear", { valueAsNumber: true })}
                />
              </Field>
              <Controller
                name="targetIntake"
                control={control}
                render={({ field }) => (
                  <Field label={t("intake")}>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label={t("intake")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">{u("spring")}</SelectItem>
                        <SelectItem value="fall">{u("fall")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Controller
                name="languageProgramFirst"
                control={control}
                render={({ field }) => (
                  <Label className="flex items-center gap-3 rounded-lg border p-4 md:col-span-2">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    {t("languageProgram")}
                  </Label>
                )}
              />
            </TabsContent>
            <TabsContent value="finance" className="mt-0 grid gap-5 md:grid-cols-2">
              <Field label={t("tuitionBudget")}>
                <Input
                  type="number"
                  min="0"
                  step="100000"
                  {...register("annualTuitionBudget", optionalNumber)}
                />
              </Field>
              <Field label={t("livingBudget")}>
                <Input
                  type="number"
                  min="0"
                  step="50000"
                  {...register("monthlyLivingBudget", optionalNumber)}
                />
              </Field>
              {(
                ["scholarshipRequired", "partialFundingAccepted", "familyFundingAvailable"] as const
              ).map((name) => (
                <Controller
                  key={name}
                  name={name}
                  control={control}
                  render={({ field }) => (
                    <Label className="flex items-center gap-3 rounded-lg border p-4">
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      {t(
                        name === "partialFundingAccepted"
                          ? "partialFunding"
                          : name === "familyFundingAvailable"
                            ? "familyFunding"
                            : name,
                      )}
                    </Label>
                  )}
                />
              ))}
            </TabsContent>
            <TabsContent value="priorities" className="mt-0">
              <p className="mb-5 text-sm text-muted-foreground">{t("rank")}</p>
              <Controller
                name="priorities"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-3 md:grid-cols-2">
                    {priorities.map((item) => (
                      <Label key={item} className="flex items-center gap-3 rounded-lg border p-4">
                        <Checkbox
                          checked={field.value.includes(item)}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked
                                ? [...field.value, item]
                                : field.value.filter((value) => value !== item),
                            )
                          }
                        />
                        {t(item)}
                      </Label>
                    ))}
                  </div>
                )}
              />
            </TabsContent>
          </CardContent>
        </Card>
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mt-5">
            <AlertDescription>{t("validation")}</AlertDescription>
          </Alert>
        )}
        <div className="mt-6 flex justify-end">
          <Button type="submit" size="lg">
            <CheckCircle2 />
            {t("complete")}
            <ArrowRight />
          </Button>
        </div>
      </Tabs>
    </form>
  );
}
