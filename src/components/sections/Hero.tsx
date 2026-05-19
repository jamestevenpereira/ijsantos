import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { company } from "@/data/company";
import { useInView } from "@/hooks/useInView";
import heroImage from "@/assets/hero-construction.jpg";

function CountUp({ raw, inView }: { raw: string; inView: boolean }) {
  const { prefix, end, suffix, decimal } = useMemo(() => {
    const m = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
    if (!m) return { prefix: "", end: 0, suffix: raw, decimal: false };
    return { prefix: m[1], end: parseFloat(m[2]), suffix: m[3], decimal: m[2].includes(".") };
  }, [raw]);

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(end);
      return;
    }
    const duration = 1800;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setCount(end * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setCount(end);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);

  const display = decimal ? count.toFixed(1) : Math.floor(count).toString();
  return <>{prefix}{display}{suffix}</>;
}

export function Hero() {
  const { t } = useTranslation();
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden flex flex-col justify-end"
      style={{ minHeight: "clamp(460px, 60vh, 560px)" }}
    >
      {/* Full-bleed photo */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroImage}
          alt="Equipa IJ Santos em obra de construção civil"
          width={1920}
          height={1280}
          fetchPriority="high"
          className="h-full w-full object-cover"
        />
        {/* Subtle scan-line texture */}
        <div className="absolute inset-0 [background:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.012)_3px,rgba(0,0,0,0.012)_4px)]" />
      </div>

      {/* Badge — top left */}
      <div className="absolute top-6 left-5 md:left-10 flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/65">
          {t("hero.badge")}
        </span>
      </div>

      {/* Stats column — desktop right */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3">
        {company.stats.map((s) => (
          <dl key={s.label} className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-3 text-right backdrop-blur-sm">
            <dd className="text-2xl font-black text-white leading-none tracking-tight">
              <CountUp raw={s.value} inView={inView} />
            </dd>
            <dt className="mt-1 text-[9px] text-white/35 uppercase tracking-[0.1em]">
              {t(s.label)}
            </dt>
          </dl>
        ))}
      </div>

      {/* Solid text block — bottom left */}
      <div className="relative w-full md:w-[52%] bg-primary border-t-[3px] border-brand px-5 py-7 md:px-10 md:py-9">
        {/* Overline */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-px bg-brand shrink-0" />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-brand">
            {t("hero.badge")}
          </span>
        </div>

        <h1
          className="text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] font-black text-white leading-[1.05] tracking-tight text-balance"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {t("hero.title")}
          <em className="text-brand not-italic">{t("hero.title_highlight")}</em>
        </h1>

        <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-md">
          {t("hero.body")}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-5 py-3 text-sm font-semibold hover:brightness-95 transition min-h-[44px]"
          >
            {t("hero.cta_quote")}
          </Link>
          <a
            href={company.phoneHref}
            className="inline-flex items-center gap-2 rounded-md border border-white/[0.2] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white hover:bg-white/[0.08] transition backdrop-blur-sm min-h-[44px]"
          >
            <Phone className="h-4 w-4" />
            <span className="whitespace-nowrap">{company.phone}</span>
          </a>
        </div>

        {/* Stats — mobile only */}
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-white/[0.1] pt-5 md:hidden">
          {company.stats.map((s) => (
            <div key={s.label}>
              <dd className="text-xl font-black text-white leading-none">
                <CountUp raw={s.value} inView={inView} />
              </dd>
              <dt className="mt-0.5 text-[9px] text-white/40 uppercase tracking-[0.1em]">
                {t(s.label)}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
