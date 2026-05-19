import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CTABand } from "@/components/sections/CTABand";
import { TrustBand } from "@/components/sections/TrustBand";
import { ServiceCard } from "@/components/service/ServiceCard";
import { services } from "@/data/services";
import { getLocalArea, localAreas } from "@/data/local-areas";
import { company } from "@/data/company";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import servicesHero from "@/assets/services-hero.jpg";

const SITE_URL = company.siteUrl;

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    const area = getLocalArea(params.slug);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [] };
    const { area } = loaderData;
    const title = `Construção Civil e Limpezas Exteriores em ${area.name} · IJ Santos`;
    const desc = `${area.intro} Pedido de orçamento gratuito em 24 horas.`;
    const url = `${SITE_URL}/areas/${params.slug}`;
    const ogImage = `${SITE_URL}/og-default.jpg`;

    const localBusinessLd = {
      "@context": "https://schema.org",
      "@type": "GeneralContractor",
      name: `${company.name} — ${area.name}`,
      description: desc,
      url,
      telephone: company.phone,
      image: `${SITE_URL}/logo.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Rua da Shell, nº 13",
        postalCode: "3520-074",
        addressLocality: "Nelas",
        addressRegion: "Viseu",
        addressCountry: "PT",
      },
      areaServed: {
        "@type": "City",
        name: area.name,
        containedInPlace: { "@type": "AdministrativeArea", name: area.district },
      },
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
    };

    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: area.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: area.name, item: url },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:image", content: ogImage },
        { property: "og:url", content: url },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: ogImage },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(localBusinessLd) },
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
      ],
    };
  },
  component: AreaPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl container-px py-32 text-center">
      <h1 className="font-display text-3xl font-bold">Área não encontrada</h1>
      <p className="mt-4 text-muted-foreground">A localidade que procura não está listada.</p>
      <Link to="/" className="mt-8 inline-flex items-center gap-2 text-brand font-semibold">
        Voltar à página inicial <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl container-px py-32 text-center">
      <h1 className="font-display text-2xl font-bold">Erro ao carregar a página</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
});

function AreaPage() {
  const { area } = Route.useLoaderData();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={servicesHero} alt={area.heroAlt} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/40" />
        </div>
        <div className="mx-auto max-w-7xl container-px py-20 md:py-28 text-primary-foreground">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/5 px-3 py-1 text-xs uppercase tracking-[0.18em] backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-brand" />
            {area.district}
          </span>
          <h1 className="mt-6 font-display text-4xl md:text-6xl font-bold tracking-tight max-w-3xl text-balance">
            Construção e limpezas exteriores em <span className="text-brand">{area.name}</span>.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl">
            {area.intro}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold shadow-lg hover:brightness-95 transition"
            >
              Pedir orçamento em {area.name} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition backdrop-blur"
            >
              <Phone className="h-4 w-4" /> {company.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              IJ Santos em {area.name}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Uma empresa local, ao seu lado.
            </h2>
            {area.body.map((p) => (
              <p key={p} className="text-muted-foreground text-lg leading-relaxed">
                {p}
              </p>
            ))}
            <p className="text-sm text-muted-foreground italic">{area.distanceNote}</p>
          </div>
          <aside className="rounded-2xl border border-border bg-card p-7 h-fit">
            <h3 className="font-display text-xl font-bold">Porquê a IJ Santos em {area.name}?</h3>
            <ul className="mt-6 space-y-5">
              {area.highlights.map((h) => (
                <li key={h.title}>
                  <p className="font-semibold text-foreground">{h.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{h.desc}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <TrustBand />

      {/* All services in this area */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Serviços</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              O que fazemos em {area.name}.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Da obra nova à manutenção exterior — tudo executado por equipa local.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl container-px">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Perguntas frequentes em {area.name}
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              Dúvidas mais comuns.
            </h2>
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {area.faq.map((f, i) => {
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

      {/* Other areas */}
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-7xl container-px text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Trabalhamos também em
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {localAreas
              .filter((a) => a.slug !== area.slug)
              .map((a) => (
                <Link
                  key={a.slug}
                  to="/areas/$slug"
                  params={{ slug: a.slug }}
                  className="rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold hover:border-brand transition"
                >
                  {a.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
