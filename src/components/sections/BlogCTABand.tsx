import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { company } from "@/data/company";

export function BlogCTABand({ serviceSlug }: { serviceSlug?: string }) {
  const { t } = useTranslation();
  const search = serviceSlug ? { servico: serviceSlug } : {};
  return (
    <section className="mt-16 bg-primary text-primary-foreground rounded-2xl">
      <div className="px-8 py-12 flex flex-col md:flex-row items-center md:items-center justify-between gap-8 text-center md:text-left">
        <div className="max-w-xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-balance">
            {t("blog.band_title")}
          </h2>
          <p className="mt-3 text-primary-foreground/75">
            {t("blog.band_body")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Link
            to="/contacto"
            search={search}
            className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold hover:brightness-95 transition"
          >
            {t("blog.band_btn")} <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={company.phoneHref}
            className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold hover:bg-primary-foreground/10 transition"
          >
            <Phone className="h-4 w-4" /> {company.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
