import { useTranslation } from "react-i18next";
import { useInView, fadeUp } from "@/hooks/useInView";

const keys = ["item1", "item2", "item3", "item4"] as const;

export function WhyUs() {
  const { t } = useTranslation();
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView();

  return (
    <section className="bg-primary py-20 md:py-28 relative overflow-hidden">
      {/* Decorative dash */}
      <div
        className="absolute right-8 top-6 select-none pointer-events-none font-display font-black text-white/[0.022] leading-none"
        style={{ fontSize: "clamp(4rem, 10vw, 7rem)" }}
        aria-hidden="true"
      >
        —
      </div>

      <div className="mx-auto max-w-7xl container-px">
        {/* Header */}
        <div
          ref={headingRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-center md:text-left ${fadeUp(headingInView)}`}
        >
          <div className="max-w-xl mx-auto md:mx-0">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("whyus.label")}
            </span>
            <h2
              className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-white text-balance"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {t("whyus.title")}
            </h2>
          </div>
        </div>

        {/* 4-column numbered list */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {keys.map((k, i) => (
            <article
              key={k}
              className={[
                "py-8 lg:py-0",
                "border-b border-white/[0.07] last:border-b-0 sm:[&:nth-child(n+3)]:border-b-0 lg:border-b-0",
                "lg:border-r lg:last:border-r-0",
                i > 0 ? "lg:pl-7" : "lg:pl-0",
                i < 3 ? "lg:pr-7" : "lg:pr-0",
                fadeUp(gridInView),
              ].join(" ")}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="font-mono text-xs font-bold text-brand tracking-[0.15em] mb-4">
                {String(i + 1).padStart(2, "0")} —
              </div>
              <h3
                className="font-bold text-base text-white leading-snug mb-3"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {t(`whyus.${k}_title`)}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">
                {t(`whyus.${k}_desc`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
