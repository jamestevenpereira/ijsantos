import { Star } from "lucide-react";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Testemunhos</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Quem nos contrata, recomenda.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl bg-card border border-border p-7 flex flex-col"
            >
              <div className="flex gap-0.5 text-brand mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-foreground leading-relaxed flex-1">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-border">
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
