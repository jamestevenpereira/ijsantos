import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { getService, services, type Service } from "@/data/services";
import { localAreas } from "@/data/local-areas";
import { company } from "@/data/company";
import { CTABand } from "@/components/sections/CTABand";
import { PageHero } from "@/components/layout/PageHero";
import { ArrowRight, Check, ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";

const SITE_URL = company.siteUrl;

export const Route = createFileRoute("/servicos/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData, params }) => {
    const s = loaderData?.service;
    if (!s) return { meta: [{ title: "Serviço · IJ Santos" }] };
    const serviceTitle = i18n.t(s.title);
    const serviceShort = i18n.t(s.short);
    const serviceDescription = i18n.t(s.description);
    const title = `${serviceTitle} em Nelas, Viseu e Região Centro · IJ Santos`;
    const description = `${serviceShort} Serviço executado em Nelas, Viseu, Mangualde, Tondela e toda a região centro. Orçamento gratuito.`;
    const url = `${SITE_URL}/servicos/${params.slug}`;
    const ogImage = typeof s.hero === "string" && s.hero.startsWith("http") ? s.hero : `${SITE_URL}/og-default.jpg`;

    const serviceLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: serviceTitle,
      description: serviceDescription,
      url,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: company.areas.map((name) => ({ "@type": "City", name })),
      serviceType: serviceTitle,
      makesOffer: {
        "@type": "Offer",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        areaServed: company.areas.map((name) => ({ "@type": "City", name })),
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: serviceTitle,
        itemListElement: s.useCases.map((u) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: i18n.t(u) },
        })),
      },
    };

    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: s.faq.map((f) => ({
        "@type": "Question",
        name: i18n.t(f.q),
        acceptedAnswer: { "@type": "Answer", text: i18n.t(f.a) },
      })),
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: i18n.t("service_detail.breadcrumb_home"), item: SITE_URL },
        { "@type": "ListItem", position: 2, name: i18n.t("service_detail.breadcrumb_services"), item: `${SITE_URL}/servicos` },
        { "@type": "ListItem", position: 3, name: serviceTitle, item: url },
      ],
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:image", content: ogImage },
        { property: "og:url", content: url },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(serviceLd) },
        { type: "application/ld+json", children: JSON.stringify(faqLd) },
        { type: "application/ld+json", children: JSON.stringify(breadcrumbLd) },
      ],
    };
  },
  notFoundComponent: () => {
    const { t } = useTranslation();
    return (
      <div className="py-32 text-center">
        <h1 className="font-display text-3xl font-bold">{t("service_detail.not_found_title")}</h1>
        <Link to="/servicos" className="mt-6 inline-block text-brand font-semibold">{t("service_detail.not_found_link")}</Link>
      </div>
    );
  },
  errorComponent: ({ error }) => {
    const { t } = useTranslation();
    console.error("Service detail route error:", error);
    return (
      <div className="py-32 text-center">
        <h1 className="font-display text-2xl font-bold">{t("service_detail.error_title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("service_detail.error_body")}</p>
      </div>
    );
  },
  component: ServiceDetail,
});

function ServiceDetail() {
  const { t } = useTranslation();
  const { service } = Route.useLoaderData() as { service: Service };
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      <PageHero
        image={service.hero}
        label={t("servicos.label")}
        title={t(service.title)}
        subtitle={t(service.short)}
      />

      {/* Overview */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{t("service_detail.overview_label")}</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tight text-balance">
              {t("service_detail.overview_title")}
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">{t(service.description)}</p>
            <ul className="mt-8 space-y-3">
              {service.useCases.map((u) => (
                <li key={u} className="flex items-start gap-3 text-foreground justify-center md:justify-start">
                  <Check className="h-5 w-5 text-brand mt-0.5 shrink-0" />
                  <span>{t(u)}</span>
                </li>
              ))}
            </ul>
          </div>
          <img src={service.gallery[0]} alt={t(service.title)} className="rounded-2xl aspect-[4/3] object-cover" loading="lazy" />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{t("service_detail.benefits_label")}</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("service_detail.benefits_title")}
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.benefits.map((b) => (
              <div key={b.title} className="rounded-xl bg-card border border-border p-6 text-center md:text-left">
                <div className="h-9 w-9 rounded-md bg-brand/10 text-brand grid place-items-center mx-auto md:mx-0">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-lg">{t(b.title)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(b.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px">
          <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{t("service_detail.process_label")}</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("service_detail.process_title")}
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((p, i) => (
              <div key={p.title} className="rounded-xl border border-border bg-card p-6 text-center md:text-left">
                <div className="font-display text-4xl font-bold text-brand/30">0{i + 1}</div>
                <h3 className="mt-3 font-display font-semibold text-lg">{t(p.title)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(p.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{t("service_detail.gallery_label")}</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("service_detail.gallery_title")}
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {service.gallery.map((g, i) => (
              <div key={i} className={`overflow-hidden rounded-xl ${i === 0 ? "lg:col-span-2 lg:row-span-2 aspect-square" : "aspect-square"}`}>
                <img src={g} alt={t(service.title)} loading="lazy" className="h-full w-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl container-px">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{t("service_detail.faq_label")}</span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("service_detail.faq_title")}
            </h2>
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {service.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5"
                  >
                    <span className="font-display font-semibold text-foreground text-lg">{t(f.q)}</span>
                    <span className={`text-brand text-2xl transition-transform ${open ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {open && <p className="pb-5 text-muted-foreground leading-relaxed">{t(f.a)}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local areas */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl container-px text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("service_detail.areas_label")}
          </span>
          <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold">
            {t(service.title)} {t("service_detail.areas_suffix")}
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {localAreas.map((a) => (
              <Link
                key={a.slug}
                to="/areas/$slug"
                params={{ slug: a.slug }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-brand transition"
              >
                <MapPin className="h-3.5 w-3.5 text-brand" /> {a.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABand
        title={t("service_detail.cta_interest", { title: t(service.title) })}
        subtitle={t("service_detail.cta_subtitle")}
        serviceSlug={service.slug}
      />

      {/* Other services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl container-px">
          <h2 className="font-display text-2xl font-bold mb-8">{t("service_detail.other_services")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.filter((s) => s.slug !== service.slug).slice(0, 3).map((s) => (
              <Link key={s.slug} to="/servicos/$slug" params={{ slug: s.slug }} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-brand/40 transition">
                <img src={s.hero} alt={t(s.title)} className="h-16 w-20 rounded-md object-cover" loading="lazy" />
                <div className="flex-1">
                  <div className="font-display font-semibold">{t(s.title)}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">{t(s.short)}</div>
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
