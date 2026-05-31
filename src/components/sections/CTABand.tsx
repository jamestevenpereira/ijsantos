import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { company } from "@/data/company";
import { trackGaEvent } from "@/lib/analytics";
import { useInView, fadeUp } from "@/hooks/useInView";

export function CTABand({
  title,
  subtitle,
  serviceSlug,
}: {
  title?: string;
  subtitle?: string;
  serviceSlug?: string;
}) {
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className={`bg-primary relative overflow-hidden ${fadeUp(inView)}`}
      aria-labelledby="ctaband-heading"
    >
      {/* Red gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand to-transparent" />

      {/* Ghost "24h" decoration */}
      <div
        className="absolute right-6 bottom-0 leading-none font-black select-none pointer-events-none"
        style={{
          fontSize: "clamp(5rem, 14vw, 10rem)",
          color: "rgba(255,255,255,0.018)",
          fontFamily: "Georgia, serif",
        }}
        aria-hidden="true"
      >
        24h
      </div>

      <div className="mx-auto max-w-7xl container-px py-16 md:py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-lg mx-auto md:mx-0">
            <h2
              id="ctaband-heading"
              className="text-3xl md:text-4xl font-bold leading-tight text-primary-foreground text-balance"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {title ?? t("cta.title")}
            </h2>
            <p className="mt-3 text-primary-foreground/60 text-base leading-relaxed">
              {subtitle ?? t("cta.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              to="/contacto"
              {...(serviceSlug ? { search: { servico: serviceSlug } } : {})}
              onClick={() =>
                trackGaEvent("cta_click", {
                  location: "cta_band",
                  target: "contact",
                  service: serviceSlug ?? "general",
                })
              }
              className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition min-h-[44px]"
            >
              {t("cta.btn_quote")} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={company.phoneHref}
              onClick={() => trackGaEvent("lead_intent", { method: "phone", location: "cta_band" })}
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition min-h-[44px]"
            >
              <Phone className="h-4 w-4" /> {company.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
