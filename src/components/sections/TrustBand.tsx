import { ShieldCheck, FileCheck2, Clock4, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useInView, fadeUp } from "@/hooks/useInView";

const icons = [ShieldCheck, FileCheck2, Clock4, Award];
const keys = ["item1", "item2", "item3", "item4"] as const;

export function TrustBand() {
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="py-16 md:py-20" aria-label="Garantias e confiança">
      <div className="mx-auto max-w-7xl container-px">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((k, i) => {
            const Icon = icons[i];
            return (
              <div
                key={k}
                className={`rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center gap-3 ${fadeUp(inView)}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="inline-grid place-items-center h-10 w-10 rounded-lg bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold text-foreground">{t(`trustband.${k}_title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`trustband.${k}_desc`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
