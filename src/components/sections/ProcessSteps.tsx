const steps = [
  { n: "01", title: "Contacto inicial", desc: "Fale connosco por telefone, email ou formulário." },
  { n: "02", title: "Visita técnica", desc: "Avaliamos o local sem compromisso." },
  { n: "03", title: "Orçamento detalhado", desc: "Proposta clara, sem custos ocultos." },
  { n: "04", title: "Execução", desc: "Obra acompanhada até à entrega final." },
];

export function ProcessSteps() {
  return (
    <section className="py-20 md:py-28 bg-surface">
      <div className="mx-auto max-w-7xl container-px">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Como trabalhamos</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Um processo simples, do primeiro contacto à entrega.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Transparência em cada etapa. Sem surpresas, sem custos escondidos.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative">
          {steps.map((s, i) => (
            <div key={s.n} className="relative rounded-xl bg-card border border-border p-7">
              <div className="font-display text-5xl font-bold text-brand/30">{s.n}</div>
              <h3 className="mt-4 font-display font-semibold text-lg text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-3 h-px w-6 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
