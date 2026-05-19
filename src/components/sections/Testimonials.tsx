import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { testimonials } from "@/data/testimonials";
import { useInView, fadeUp } from "@/hooks/useInView";

export function Testimonials() {
  const { t } = useTranslation();
  const { ref: headingRef, inView: headingInView } = useInView();
  const { ref: bodyRef, inView: bodyInView } = useInView();

  const featured = testimonials[0];
  const supporting = testimonials.slice(1, 3);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl container-px">
        {/* Header */}
        <div
          ref={headingRef}
          className={`max-w-2xl mx-auto md:mx-0 text-center md:text-left ${fadeUp(headingInView)}`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("testimonials.label")}
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            {t("testimonials.title")}
          </h2>
        </div>

        <div ref={bodyRef} className="mt-12 space-y-4">
          {/* Featured testimonial */}
          <figure className={`relative rounded-2xl bg-primary p-8 md:p-10 overflow-hidden ${fadeUp(bodyInView)}`}>
            {/* Decorative quote mark */}
            <div
              className="absolute top-0 left-6 leading-none font-black select-none pointer-events-none"
              style={{
                fontSize: "clamp(5rem, 12vw, 8rem)",
                color: "rgba(197, 48, 48, 0.12)",
                fontFamily: "Georgia, serif",
              }}
              aria-hidden="true"
            >
              &ldquo;
            </div>

            <div className="relative z-10">
              <div className="flex gap-0.5 text-brand mb-5" aria-label={`${featured.rating} estrelas`}>
                {Array.from({ length: featured.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <blockquote
                className="text-lg md:text-xl font-bold text-primary-foreground leading-relaxed max-w-2xl"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {featured.highlight ? (
                  <>
                    &ldquo;
                    {featured.quote.split(featured.highlight).map((part, idx, arr) => (
                      idx < arr.length - 1 ? (
                        <span key={idx}>{part}<span className="text-brand">{featured.highlight}</span></span>
                      ) : part
                    ))}
                    &rdquo;
                  </>
                ) : (
                  <>&ldquo;{featured.quote}&rdquo;</>
                )}
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand grid place-items-center text-xs font-bold text-brand-foreground shrink-0">
                  {featured.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary-foreground">{featured.name}</div>
                  <div className="text-xs text-primary-foreground/60">{featured.role}</div>
                </div>
              </figcaption>
            </div>
          </figure>

          {/* Supporting testimonials */}
          <div className="grid gap-4 md:grid-cols-2">
            {supporting.map((te, i) => (
              <figure
                key={te.name}
                className={`rounded-2xl bg-card border border-border p-6 md:p-7 flex flex-col ${fadeUp(bodyInView)}`}
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="flex gap-0.5 text-brand mb-3" aria-label={`${te.rating} estrelas`}>
                  {Array.from({ length: te.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-foreground leading-relaxed italic flex-1">
                  &ldquo;{te.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 pt-4 border-t border-border">
                  <div className="text-sm font-semibold text-foreground">{te.name}</div>
                  <div className="text-xs text-muted-foreground">{te.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
