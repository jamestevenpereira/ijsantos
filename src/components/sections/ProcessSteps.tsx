import { useTranslation } from "react-i18next";
import { useInView, fadeUp } from "@/hooks/useInView";

const stepKeys = ["step1", "step2", "step3", "step4"] as const;

export function ProcessSteps() {
  const { t } = useTranslation();
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView();

  const steps = stepKeys.map((k) => ({
    title: t(`process.${k}_title`),
    desc: t(`process.${k}_desc`),
  }));

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        <div
          ref={headingRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-center md:text-left ${fadeUp(headingInView)}`}
        >
          <div className="max-w-2xl mx-auto md:mx-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{t("process.label")}</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("process.title")}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto md:mx-0">
            {t("process.subtitle")}
          </p>
        </div>

        <div ref={gridRef} className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`relative rounded-xl bg-card border border-border p-7 text-center md:text-left ${fadeUp(gridInView)}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="font-display text-5xl font-bold text-brand/30">0{i + 1}</div>
              <h3 className="mt-4 font-display font-semibold text-lg text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
