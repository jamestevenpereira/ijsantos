import { createFileRoute } from "@tanstack/react-router";
import { CTABand } from "@/components/sections/CTABand";
import { company } from "@/data/company";
import { Award, Heart, ShieldCheck, Sparkles, Target, Users } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre · IJ Santos" },
      { name: "description", content: "Conheça a IJ Santos: empresa local com mais de 15 anos de experiência em construção civil e limpezas exteriores na região de Viseu." },
      { property: "og:title", content: "Sobre a IJ Santos" },
      { property: "og:description", content: "Empresa local, próxima e profissional. Conheça quem somos." },
    ],
  }),
  component: SobrePage,
});

const values = [
  { icon: ShieldCheck, title: "Confiança", desc: "Cumprimos o que prometemos. Sem letras pequenas." },
  { icon: Award, title: "Qualidade", desc: "Materiais certificados e mão de obra experiente." },
  { icon: Heart, title: "Proximidade", desc: "Tratamos cada cliente como se fosse o único." },
];

export default function SobrePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=80" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40" />
        </div>
        <div className="mx-auto max-w-7xl container-px py-20 md:py-28 text-primary-foreground text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Sobre nós</span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto md:mx-0 text-balance">
            Construir bem é uma questão de princípio.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto md:mx-0">
            Somos uma empresa familiar portuguesa que cresceu obra a obra, cliente a cliente.
            Mais de 15 anos depois, continuamos a fazer o que fazemos melhor: trabalho honesto.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80" alt="" className="rounded-xl aspect-[4/5] object-cover" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1503594384566-461fe158e797?auto=format&fit=crop&w=900&q=80" alt="" className="rounded-xl aspect-[4/5] object-cover mt-10" loading="lazy" />
          </div>
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">A nossa história</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Mais de uma década de obra feita.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              A IJ Santos nasceu da paixão pela construção e pelo trabalho bem feito. Começámos
              com pequenas obras de remodelação e fomos crescendo de forma natural — sempre
              pelo passa-palavra de clientes satisfeitos.
            </p>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Hoje, somos uma equipa multidisciplinar que combina construção civil com serviços
              de limpeza exterior, oferecendo uma resposta completa a particulares, empresas e
              condomínios em toda a região centro.
            </p>
          </div>
        </div>
      </section>

      {/* Mission/Vision/Values */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card icon={Target} title="Missão" text="Entregar obras e serviços com qualidade comprovada, respeitando prazos, orçamentos e a confiança que os clientes depositam em nós." />
            <Card icon={Sparkles} title="Visão" text="Ser a referência local em construção e limpezas exteriores, reconhecida pela seriedade, competência e proximidade." />
            <Card icon={Users} title="Valores" text="Honestidade, rigor técnico, respeito pelo cliente e orgulho no trabalho que assinamos." />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-border py-12">
            {company.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-foreground">{s.value}</div>
                <div className="mt-2 text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why trust */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Os nossos valores</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Porque é que os clientes confiam em nós.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl bg-card border border-border p-7 text-center md:text-left">
                <div className="h-11 w-11 rounded-lg bg-brand/10 text-brand grid place-items-center mx-auto md:mx-0">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display font-semibold text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}

function Card({ icon: Icon, title, text }: { icon: typeof Target; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-8 text-center md:text-left">
      <div className="h-12 w-12 rounded-xl bg-brand text-brand-foreground grid place-items-center mx-auto md:mx-0">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 font-display font-bold text-2xl">{title}</h3>
      <p className="mt-3 text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}
