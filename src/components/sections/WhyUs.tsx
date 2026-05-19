import { Award, Clock, ShieldCheck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useInView, fadeUp } from "@/hooks/useInView";

const icons = [Award, ShieldCheck, Clock, Users];
const keys = ["item1", "item2", "item3", "item4"] as const;

export function WhyUs() {
  const { t } = useTranslation();
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView();

  return (
    <section className="bg-primary py-20 md:py-28">
      <div className="mx-auto max-w-7xl container-px">
        <div
          ref={headingRef}
          className={`max-w-2xl mx-auto md:mx-0 text-center md:text-left ${fadeUp(headingInView)}`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("whyus.label")}
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-white text-balance">
            {t("whyus.title")}
          </h2>
        </div>

        <div ref={gridRef} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((k, i) => {
            const Icon = icons[i];
            return (
              <article
                key={k}
                className={`rounded-xl border border-white/[0.07] bg-white/[0.04] p-6 md:p-7 flex flex-col items-center justify-center text-center ${fadeUp(gridInView)}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="h-11 w-11 rounded-lg bg-brand/20 text-brand border border-brand/30 grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display font-semibold text-base text-white">
                  {t(`whyus.${k}_title`)}
                </h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  {t(`whyus.${k}_desc`)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
