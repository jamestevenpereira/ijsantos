import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { testimonials } from "@/data/testimonials";
import { useInView, fadeUp } from "@/hooks/useInView";

export function Testimonials() {
  const { t } = useTranslation();
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView();

  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        <div ref={headingRef} className={`max-w-2xl mx-auto md:mx-0 text-center md:text-left ${fadeUp(headingInView)}`}>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{t("testimonials.label")}</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            {t("testimonials.title")}
          </h2>
        </div>

        <div ref={gridRef} className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((te, i) => (
            <figure
              key={te.name}
              className={`rounded-2xl bg-card border border-border p-7 flex flex-col text-center md:text-left ${fadeUp(gridInView)}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex gap-0.5 text-brand mb-4 justify-center md:justify-start">
                {Array.from({ length: te.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-foreground leading-relaxed flex-1">
                "{te.quote}"
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border">
                <div className="font-semibold text-foreground">{te.name}</div>
                <div className="text-sm text-muted-foreground">{te.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
