import { company } from "@/data/company";

export function Stats() {
  return (
    <section className="border-y border-border bg-surface" aria-label="Estatísticas da empresa">
      <div className="mx-auto max-w-7xl container-px py-12 md:py-14">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
          {company.stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-4xl md:text-5xl font-bold text-brand tracking-tight">
                {s.value}
              </dd>
              <p className="mt-2 text-sm md:text-base text-muted-foreground font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
