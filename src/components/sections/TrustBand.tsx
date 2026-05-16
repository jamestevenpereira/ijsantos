import { ShieldCheck, FileCheck2, Clock4, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useInView, fadeUp } from "@/hooks/useInView";

const icons = [ShieldCheck, FileCheck2, Clock4, Award];
const keys = ["item1", "item2", "item3", "item4"] as const;

export function TrustBand() {
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className={`bg-primary text-primary-foreground py-10 md:py-12 ${fadeUp(inView)}`}
      aria-label="Garantias e confiança"
    >
      <div className="mx-auto max-w-7xl container-px">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {keys.map((k, i) => {
            const Icon = icons[i];
            return (
              <div key={k} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-brand shrink-0" />
                <span className="text-sm font-semibold">{t(`trustband.${k}_title`)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
