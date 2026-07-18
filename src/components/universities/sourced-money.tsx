import { SourceBadge } from "@/components/data/source-badge";
import { formatMoneyRange } from "@/lib/formatting/money";
import type { LocaleCode, SourcedValue, MoneyRange } from "@/types/domain";
import { useTranslations } from "next-intl";

export function SourcedMoney({
  value,
  locale,
}: {
  value: SourcedValue<MoneyRange>;
  locale: LocaleCode;
}) {
  const t = useTranslations("Common");
  return (
    <div>
      <p className="font-medium">{formatMoneyRange(value.value, locale) ?? t("notConfirmed")}</p>
      <div className="mt-2">
        <SourceBadge sourceId={value.sourceId} />
      </div>
      {value.note && (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{value.note[locale]}</p>
      )}
    </div>
  );
}
