import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getService, services, type Service } from "@/data/services";
import { CTABand } from "@/components/sections/CTABand";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/servicos/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.service;
    if (!s) return { meta: [{ title: "Serviço · IJ Santos" }] };
    return {
      meta: [
        { title: `${s.title} · IJ Santos` },
        { name: "description", content: s.short },
        { property: "og:title", content: `${s.title} · IJ Santos` },
        { property: "og:description", content: s.short },
        { property: "og:image", content: s.hero },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <h1 className="font-display text-3xl font-bold">Serviço não encontrado</h1>
      <Link to="/servicos" className="mt-6 inline-block text-brand font-semibold">Ver todos os serviços</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="py-32 text-center">
      <h1 className="font-display text-2xl font-bold">Ocorreu um erro</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData() as { service: Service };
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={service.hero} alt={service.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/30" />
        </div>
        <div className="mx-auto max-w-7xl container-px py-20 md:py-28 text-primary-foreground text-center md:text-left">
          <nav className="flex items-center gap-1 text-sm text-primary-foreground/70 justify-center md:justify-start">
            <Link to="/" className="hover:text-primary-foreground">Início</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/servicos" className="hover:text-primary-foreground">Serviços</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary-foreground">{service.title}</span>
          </nav>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto md:mx-0 text-balance">
            {service.title}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto md:mx-0">
            {service.short}
          </p>
          <div className="mt-8">
            <Link to="/contacto" className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold">
              Pedir Orçamento <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Visão geral</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Um serviço pensado ao detalhe.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">{service.description}</p>
            <ul className="mt-8 space-y-3">
              {service.useCases.map((u) => (
                <li key={u} className="flex items-start gap-3 text-foreground justify-center md:justify-start text-left">
                  <Check className="h-5 w-5 text-brand mt-0.5 shrink-0" />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
          <img src={service.gallery[0]} alt="" className="rounded-2xl aspect-[4/3] object-cover" loading="lazy" />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Benefícios</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              O que ganha ao trabalhar connosco.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.benefits.map((b) => (
              <div key={b.title} className="rounded-xl bg-card border border-border p-6">
                <div className="h-9 w-9 rounded-md bg-brand/10 text-brand grid place-items-center">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-lg">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">O nosso processo</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Do primeiro contacto à entrega final.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((p, i) => (
              <div key={p.title} className="rounded-xl border border-border bg-card p-6">
                <div className="font-display text-4xl font-bold text-brand/30">0{i + 1}</div>
                <h3 className="mt-3 font-display font-semibold text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Galeria</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Trabalhos realizados.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.gallery.map((g, i) => (
              <div key={i} className={`overflow-hidden rounded-xl ${i === 0 ? "lg:col-span-2 lg:row-span-2 aspect-square" : "aspect-square"}`}>
                <img src={g} alt="" loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl container-px">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Perguntas frequentes</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Esclarecemos as suas dúvidas.
            </h2>
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {service.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-display font-semibold text-foreground text-lg">{f.q}</span>
                    <span className={`text-brand text-2xl transition-transform ${open ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {open && <p className="pb-5 text-muted-foreground leading-relaxed">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABand title={`Interessado em ${service.title}?`} subtitle="Peça o seu orçamento — sem compromisso." />

      {/* Other services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl container-px">
          <h2 className="font-display text-2xl font-bold mb-8">Outros serviços</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.filter((s) => s.slug !== service.slug).slice(0, 3).map((s) => (
              <Link key={s.slug} to="/servicos/$slug" params={{ slug: s.slug }} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-brand/40 transition">
                <img src={s.hero} alt="" className="h-16 w-20 rounded-md object-cover" loading="lazy" />
                <div className="flex-1">
                  <div className="font-display font-semibold">{s.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">{s.short}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-brand group-hover:translate-x-1 transition" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
