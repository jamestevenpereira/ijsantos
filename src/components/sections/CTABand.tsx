import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { company } from "@/data/company";
import { useInView, fadeIn } from "@/hooks/useInView";

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
    <section ref={ref} className={`bg-primary text-primary-foreground ${fadeIn(inView)}`}>
      <div className="mx-auto max-w-7xl container-px py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight text-balance">
              {title ?? t("cta.title")}
            </h2>
            <p className="mt-3 text-primary-foreground/75 text-lg">
              {subtitle ?? t("cta.subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <Link
              to="/contacto"
              {...(serviceSlug ? { search: { servico: serviceSlug } } : {})}
              className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition"
            >
              {t("cta.btn_quote")} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold hover:bg-primary-foreground/10 transition"
            >
              <Phone className="h-4 w-4" /> {company.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
