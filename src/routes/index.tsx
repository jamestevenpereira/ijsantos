import { createFileRoute, Link } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { ServiceCard } from "@/components/service/ServiceCard";
import { WhyUs } from "@/components/sections/WhyUs";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABand } from "@/components/sections/CTABand";
import { services } from "@/data/services";
import { company } from "@/data/company";
import { ArrowRight, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IJ Santos · Construção e Limpezas Exteriores em Lisboa" },
      { name: "description", content: "Empresa local de construção civil, remodelações, pinturas e limpeza de fachadas, telhados e pavimentos. Orçamento gratuito em 24 horas." },
      { property: "og:title", content: "IJ Santos · Construção e Limpezas Exteriores" },
      { property: "og:description", content: "Construção, remodelações e limpezas exteriores na região de Viseu." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Sobre a IJ Santos</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Uma empresa local com obra feita e nome a defender.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              Somos uma equipa portuguesa especializada em construção civil e limpezas
              exteriores. Trabalhamos com clientes particulares, empresas e condomínios em
              toda a região de Viseu, com um compromisso simples: entregar trabalho bem
              feito, no tempo combinado e sem surpresas.
            </p>
            <Link
              to="/sobre"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all"
            >
              Conheça a empresa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1503594384566-461fe158e797?auto=format&fit=crop&w=900&q=80" alt="Limpeza de fachada" className="rounded-xl aspect-[3/4] object-cover" loading="lazy" />
            <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80" alt="Construção" className="rounded-xl aspect-[3/4] object-cover mt-8" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-center md:text-left">
            <div className="max-w-2xl mx-auto md:mx-0">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Os nossos serviços</span>
              <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
                Tudo o que precisa para construir e cuidar do seu imóvel.
              </h2>
            </div>
            <Link to="/servicos" className="inline-flex items-center gap-2 text-sm font-semibold text-brand justify-center md:justify-start">
              Ver todos os serviços <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      <WhyUs />
      <ProcessSteps />
      <BeforeAfter />
      <Testimonials />

      {/* Service area */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3] bg-surface relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,oklch(0.92_0_0/0.6),transparent_60%),radial-gradient(circle_at_70%_60%,oklch(0.55_0.22_27/0.12),transparent_60%)]" />
            <div className="absolute inset-0 grain opacity-40" />
            <div className="absolute inset-0 grid place-items-center text-foreground">
              <div className="text-center">
                <MapPin className="h-10 w-10 mx-auto text-brand" />
                <div className="mt-3 font-display text-xl font-bold">Região Centro</div>
                <div className="text-sm text-muted-foreground">Sede em Nelas — atendemos toda a região centro</div>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Área de atuação</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Local, próximo e disponível.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              Servimos clientes em toda a região centro. Resposta rápida, deslocações sem
              custo adicional dentro da nossa área de atuação.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
              {company.areas.map((a) => (
                <li key={a} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
