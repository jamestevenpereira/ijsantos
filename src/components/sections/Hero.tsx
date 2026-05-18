import { Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { company } from "@/data/company";
import heroImage from "@/assets/hero-construction.jpg";

export function Hero() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const anim = `motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ${
    mounted ? "opacity-100 translate-y-0" : "motion-safe:opacity-0 motion-safe:translate-y-4"
  }`;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          srcSet={`${heroImage}?width=640&format=webp 640w, ${heroImage}?width=1280&format=webp 1280w, ${heroImage} 1920w`}
          sizes="100vw"
          alt="Equipa IJ Santos em obra de construção civil"
          width={1920}
          height={1280}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      <div className="mx-auto max-w-7xl container-px pt-24 pb-28 md:pt-36 md:pb-40 text-primary-foreground">
        <div className="max-w-3xl text-center md:text-left">
          <span
            className={`inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/5 px-3 py-1 text-xs uppercase tracking-[0.18em] backdrop-blur ${anim}`}
            style={{ transitionDelay: "0ms" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            {t("hero.badge")}
          </span>
          <h1
            className={`mt-6 text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] md:leading-[1.05] text-balance ${anim}`}
            style={{ transitionDelay: "100ms" }}
          >
            {t("hero.title")}
            <span className="text-brand">{t("hero.title_highlight")}</span>
          </h1>
          <p
            className={`mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto md:mx-0 leading-relaxed ${anim}`}
            style={{ transitionDelay: "200ms" }}
          >
            {t("hero.body")}
          </p>

          <div
            className={`mt-10 flex flex-wrap gap-3 justify-center md:justify-start ${anim}`}
            style={{ transitionDelay: "300ms" }}
          >
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-6 py-3.5 text-sm font-semibold shadow-lg hover:brightness-95 transition min-h-[44px]"
            >
              {t("hero.cta_quote")} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={company.phoneHref}
              className="inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition backdrop-blur min-h-[44px]"
            >
              <Phone className="h-4 w-4" /> {company.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
