import { useTranslation } from "react-i18next";
import { useInView, fadeUp } from "@/hooks/useInView";

const stepKeys = ["step1", "step2", "step3", "step4"] as const;

export function ProcessSteps() {
  const { t } = useTranslation();
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: stepsRef, inView: stepsInView } = useInView();

  const steps = stepKeys.map((k) => ({
    title: t(`process.${k}_title`),
    desc: t(`process.${k}_desc`),
  }));

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        {/* Header */}
        <div
          ref={headingRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-center md:text-left ${fadeUp(headingInView)}`}
        >
          <div className="max-w-2xl mx-auto md:mx-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("process.label")}
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("process.title")}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto md:mx-0">
            {t("process.subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="mt-14 relative">
          {/* Connector line — desktop only */}
          <div
            className="absolute hidden md:block h-px bg-border top-5 z-0"
            style={{ left: "calc(12.5% + 20px)", right: "calc(12.5% + 20px)" }}
          />

          <div className="grid gap-10 md:gap-0 md:grid-cols-4 relative z-10">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`flex flex-col items-center text-center md:items-start md:text-left md:px-6 first:md:pl-0 last:md:pr-0 ${fadeUp(stepsInView)}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Node circle */}
                <div
                  className="h-10 w-10 rounded-full bg-brand text-brand-foreground grid place-items-center font-bold text-sm shrink-0"
                  style={{
                    boxShadow: "0 0 0 4px var(--color-surface), 0 0 0 5px var(--color-border)",
                  }}
                >
                  {i + 1}
                </div>
                <h3 className="mt-5 font-display font-semibold text-base text-foreground leading-snug">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
