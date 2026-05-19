import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Hero } from "@/components/sections/Hero";
import { WhyUs } from "@/components/sections/WhyUs";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { VideosSection } from "@/components/sections/VideosSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { CTABand } from "@/components/sections/CTABand";
import { CompanyMap } from "@/components/sections/CompanyMap";
import { TrustBand } from "@/components/sections/TrustBand";
import { services } from "@/data/services";
import { company } from "@/data/company";
import aboutTeam from "@/assets/about-team.jpg";
import servicesHero from "@/assets/services-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => {
    const title = "IJ Santos · Construção Civil e Limpezas Exteriores em Nelas e Viseu";
    const description =
      "Empresa de Nelas especializada em construção civil, remodelações, pinturas e limpeza de fachadas, telhados e pavimentos. Servimos Viseu, Mangualde e região centro. Orçamento gratuito em 24 horas.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `${company.siteUrl}/` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description,
            url: "https://ijsantos.pt/",
            isPartOf: { "@id": "https://ijsantos.pt/#website" },
            about: { "@id": "https://ijsantos.pt/#organization" },
          }),
        },
      ],
    };
  },
  component: Index,
});

function Index() {
  const { t } = useTranslation();

  return (
    <>
      <Hero />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("index.about_label")}
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("index.about_title")}
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              {t("index.about_body")}
            </p>
            <Link
              to="/sobre"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all"
            >
              {t("index.about_link")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src={aboutTeam}
              alt="Limpeza de fachada"
              width={480}
              height={640}
              className="rounded-xl aspect-[3/4] object-cover"
              loading="lazy"
            />
            <img
              src={servicesHero}
              alt="Construção"
              width={480}
              height={640}
              className="rounded-xl aspect-[3/4] object-cover mt-8"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section id="servicos" className="py-20 md:py-28 bg-surface">
        <div className="mx-auto max-w-7xl container-px">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 text-center md:text-left">
            <div className="max-w-2xl mx-auto md:mx-0">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                {t("index.services_label")}
              </span>
              <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
                {t("index.services_title")}
              </h2>
            </div>
            <Link
              to="/servicos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand justify-center md:justify-start"
            >
              {t("index.services_link")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Bento grid — 5 services, feature card spans 2 rows */}
          <div
            className="mt-14 grid gap-2 grid-cols-1 sm:grid-cols-2 lg:[grid-template-columns:2fr_1fr_1fr] lg:[grid-template-rows:280px_200px]"
          >
            {services.slice(0, 5).map((s, i) => (
              <Link
                key={s.slug}
                to="/servicos/$slug"
                params={{ slug: s.slug }}
                aria-label={t(s.title)}
                className={[
                  "group relative rounded-xl overflow-hidden",
                  "h-48 sm:h-auto sm:min-h-[280px] lg:min-h-0",
                  i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : "",
                ].join(" ")}
              >
                {/* Photo */}
                <img
                  src={s.hero}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />

                {/* Colour overlay */}
                {i === 2 ? (
                  <div className="absolute inset-0 bg-brand/90" />
                ) : i === 3 ? (
                  <div className="absolute inset-0 bg-surface/[0.88]" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                )}

                {/* Arrow circle */}
                <div
                  className={[
                    "absolute top-3 right-3 h-7 w-7 rounded-full flex items-center justify-center",
                    "transition-colors",
                    i === 3 ? "bg-black/[0.07] dark:bg-white/10 text-foreground dark:text-white" : "bg-white/10 text-white",
                  ].join(" ")}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3
                    className={[
                      "font-display font-bold leading-tight",
                      i === 0 ? "text-xl md:text-[1.4rem]" : "text-base",
                      i === 3 ? "text-foreground" : "text-white",
                    ].join(" ")}
                  >
                    {t(s.title)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <WhyUs />
      <ProcessSteps />
      <VideosSection />
      <BeforeAfter />
      <TrustBand />
      <Testimonials />
      <BlogPreview />

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <CompanyMap className="rounded-2xl aspect-[4/3]" />

          <div className="text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {t("index.area_label")}
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t("index.area_title")}
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              {t("index.area_body")}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
              {company.areas.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground"
                >
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
