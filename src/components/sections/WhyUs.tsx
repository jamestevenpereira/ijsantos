import { Award, Clock, ShieldCheck, Users } from "lucide-react";

const items = [
  { icon: Award, title: "Experiência sólida", desc: "Mais de 15 anos a entregar obras com qualidade reconhecida." },
  { icon: ShieldCheck, title: "Trabalho garantido", desc: "Garantia escrita em todos os serviços executados." },
  { icon: Clock, title: "Pontualidade", desc: "Cumprimos prazos e calendarização acordada." },
  { icon: Users, title: "Acompanhamento próximo", desc: "Um responsável dedicado a cada obra." },
];

export function WhyUs() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl container-px">
        <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Porquê escolher-nos</span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Profissionalismo que sente em cada detalhe.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="group rounded-xl border border-border bg-card p-6 text-center md:text-left hover:border-brand/40 hover:shadow-md transition-all"
            >
              <div className="h-11 w-11 rounded-lg bg-brand/10 text-brand grid place-items-center mx-auto md:mx-0 group-hover:bg-brand group-hover:text-brand-foreground transition-colors">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display font-semibold text-lg text-foreground">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
