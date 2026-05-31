import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { services } from "@/data/services";
import { company } from "@/data/company";
import { ServiceCard } from "@/components/service/ServiceCard";
import { CTABand } from "@/components/sections/CTABand";
import servicesHero from "@/assets/services-hero.jpg";

export const Route = createFileRoute("/servicos")({
  head: () => {
    const title = "Serviços de Construção e Limpezas Exteriores · IJ Santos (Nelas e Viseu)";
    const description =
      "Construção civil, remodelações, pinturas e limpeza de fachadas, telhados e pavimentos exteriores. Equipa local de Nelas com obra em Viseu, Mangualde e região centro.";
    const itemListLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: services.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${company.siteUrl}/servicos/${s.slug}`,
        name: s.slug,
      })),
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${company.siteUrl}/servicos` },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(itemListLd) }],
    };
  },
  component: ServicosPage,
});

function ServicosPage() {
  const { t } = useTranslation();
  const construcao = services.filter((s) => s.group === "construcao");
  const limpeza = services.filter((s) => s.group === "limpeza");

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={servicesHero}
            alt=""
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/50" />
        </div>
        <div className="mx-auto max-w-7xl container-px py-20 md:py-28 text-primary-foreground text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {t("servicos.label")}
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold tracking-tight text-balance max-w-3xl mx-auto md:mx-0">
            {t("servicos.title")}
          </h1>
          <p className="mt-6 text-lg text-primary-foreground/80 max-w-2xl mx-auto md:mx-0">
            {t("servicos.body")}
          </p>
        </div>
      </section>

      <Group
        title={t("servicos.construcao_title")}
        subtitle={t("servicos.construcao_subtitle")}
        items={construcao}
      />
      <CTABand />
      <Group
        title={t("servicos.limpeza_title")}
        subtitle={t("servicos.limpeza_subtitle")}
        items={limpeza}
        alt
      />
      <CTABand title={t("servicos.not_found_title")} subtitle={t("servicos.not_found_subtitle")} />
    </>
  );
}

function Group({
  title,
  subtitle,
  items,
  alt,
}: {
  title: string;
  subtitle: string;
  items: typeof services;
  alt?: boolean;
}) {
  return (
    <section className={`py-20 md:py-28 ${alt ? "bg-surface" : ""}`}>
      <div className="mx-auto max-w-7xl container-px">
        <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            {subtitle}
          </span>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
            {title}
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
